"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { GEARS, type Gear } from "@/lib/data";

/* ------------------------------------------------------------------ */
/*  Layout: H-gate on the XZ plane. x = column, z = row (‑1 top, +1 bottom) */
/* ------------------------------------------------------------------ */

const GX = 0.72; // column offset
const GZ = 0.62; // row offset

const SLOT: Record<Gear, [number, number]> = {
  "1": [-GX, -GZ],
  "2": [-GX, GZ],
  "3": [0, -GZ],
  "4": [0, GZ],
  "5": [GX, -GZ],
  R: [GX, GZ],
  N: [0, 0],
};

const LEAN_X = 0.34; // max lean around Z axis (left/right columns)
const LEAN_Z = 0.30; // max lean around X axis (fore/aft rows)

const ACCENT = "#4da2ff";
const ACCENT_RED = "#ff3441";
const SILVER = "#8b919d";

/* ------------------------------------------------------------------ */
/*  Environment: RoomEnvironment → cheap studio reflections for chrome */
/* ------------------------------------------------------------------ */

function Env() {
  const gl = useThree((s) => s.gl);
  const scene = useThree((s) => s.scene);
  useEffect(() => {
    const pmrem = new THREE.PMREMGenerator(gl);
    const rt = pmrem.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = rt.texture;
    return () => {
      scene.environment = null;
      rt.dispose();
      pmrem.dispose();
    };
  }, [gl, scene]);
  return null;
}

/* ------------------------------------------------------------------ */
/*  Canvas-texture helpers (labels + knob engraving)                    */
/* ------------------------------------------------------------------ */

function makeLabelTexture(char: string, color: string, glow: boolean) {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  ctx.font = "bold 78px 'JetBrains Mono', Consolas, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 22;
  }
  ctx.fillStyle = color;
  ctx.fillText(char, 64, 68);
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

function makeKnobTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const ctx = c.getContext("2d")!;
  ctx.strokeStyle = "rgba(20,22,26,0.85)";
  ctx.fillStyle = "rgba(20,22,26,0.85)";
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  // engraved mini H-pattern
  const cols = [78, 128, 178];
  for (const x of cols) {
    ctx.beginPath();
    ctx.moveTo(x, 78);
    ctx.lineTo(x, 178);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(78, 128);
  ctx.lineTo(178, 128);
  ctx.stroke();
  const tex = new THREE.CanvasTexture(c);
  tex.anisotropy = 4;
  return tex;
}

/* ------------------------------------------------------------------ */
/*  Gate label (flat on the plate near the slot end)                    */
/* ------------------------------------------------------------------ */

function GateLabel({
  char,
  x,
  z,
  active,
}: {
  char: string;
  x: number;
  z: number;
  active: boolean;
}) {
  const tex = useMemo(() => {
    const color = active ? (char === "R" ? ACCENT_RED : ACCENT) : "#c8cedb";
    return makeLabelTexture(char, color, active);
  }, [char, active]);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[x, 0.287, z]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.44, 0.44]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} />
    </mesh>
  );
}

/* ------------------------------------------------------------------ */
/*  Higgsfield-generated shifter (tripo_3d → meshopt-compressed GLB)    */
/* ------------------------------------------------------------------ */

function StickModel() {
  const gltf = useLoader(GLTFLoader, "/models/shifter.glb", (loader) => {
    (loader as GLTFLoader).setMeshoptDecoder(MeshoptDecoder);
  });

  const scene = useMemo(() => {
    const s = gltf.scene;
    // Auto-normalize: высота ~2.05, основание на уровне пластины.
    // useLoader кэширует scene, а useMemo в dev вызывается дважды —
    // поэтому сначала сбрасываем трансформы (иначе повторный прогон
    // мерил бы уже отмасштабированный бокс и «топил» модель под плату).
    s.scale.set(1, 1, 1);
    s.position.set(0, 0, 0);
    s.updateMatrixWorld(true);
    const box = new THREE.Box3().setFromObject(s);
    const size = box.getSize(new THREE.Vector3());
    s.scale.setScalar(2.05 / Math.max(size.y, 1e-4));
    const box2 = new THREE.Box3().setFromObject(s);
    const c = box2.getCenter(new THREE.Vector3());
    s.position.set(-c.x, -(box2.min.y - 0.12), -c.z);
    s.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.isMesh) {
        const m = mesh.material as THREE.MeshStandardMaterial;
        if (m && "envMapIntensity" in m) m.envMapIntensity = 1.1;
        mesh.frustumCulled = false; // рычаг наклоняется — не даём культить у краёв
      }
    });
    return s;
  }, [gltf]);

  return <primitive object={scene} />;
}

/* ------------------------------------------------------------------ */
/*  The actual gearbox                                                  */
/* ------------------------------------------------------------------ */

function Gearbox({ active, onShift }: { active: Gear; onShift: (g: Gear) => void }) {
  const stick = useRef<THREE.Group>(null!);
  const rig = useRef<THREE.Group>(null!);

  // Virtual knob position on the gate + spring velocity
  const pos = useRef(new THREE.Vector2(...SLOT[active]));
  const vel = useRef(new THREE.Vector2(0, 0));
  const route = useRef<THREE.Vector2[]>([]);
  const prevGear = useRef<Gear>(active);

  // Manual drag: while the hand is on the knob, the pointer wins over scroll
  const dragging = useRef(false);
  const dragPt = useRef(new THREE.Vector2(...SLOT[active]));

  // Re-route through the neutral rail whenever the gear changes
  useEffect(() => {
    if (prevGear.current === active) return;
    prevGear.current = active;
    const [tx, tz] = SLOT[active];
    const waypoints: THREE.Vector2[] = [];
    if (Math.abs(pos.current.y) > 0.05) waypoints.push(new THREE.Vector2(pos.current.x, 0));
    if (Math.abs(pos.current.x - tx) > 0.05) waypoints.push(new THREE.Vector2(tx, 0));
    waypoints.push(new THREE.Vector2(tx, tz));
    route.current = waypoints;
  }, [active]);

  useFrame((state, dt) => {
    const d = Math.min(dt, 1 / 30);
    const t = state.clock.elapsedTime;

    // Waypoint spring (slightly underdamped → mechanical "snick");
    // during a drag the knob chases the pointer with a stiffer spring
    const target = dragging.current
      ? dragPt.current
      : route.current[0] ?? new THREE.Vector2(...SLOT[active]);
    const k = dragging.current ? 260 : route.current.length > 1 ? 140 : 90;
    vel.current.x += (target.x - pos.current.x) * k * d;
    vel.current.y += (target.y - pos.current.y) * k * d;
    const damp = Math.exp(-13 * d);
    vel.current.multiplyScalar(damp);
    pos.current.x += vel.current.x * d;
    pos.current.y += vel.current.y * d;
    if (
      !dragging.current &&
      route.current.length > 1 &&
      Math.abs(target.x - pos.current.x) < 0.06 &&
      Math.abs(target.y - pos.current.y) < 0.06
    ) {
      route.current.shift();
    }

    // Lean the stick toward the virtual position + idle engine vibration
    const shake = 0.004 * Math.sin(t * 23) + 0.002 * Math.sin(t * 41);
    const rx = (pos.current.y / GZ) * LEAN_Z + shake;
    const rz = -(pos.current.x / GX) * LEAN_X + 0.003 * Math.cos(t * 17);
    stick.current.rotation.x = rx;
    stick.current.rotation.z = rz;

    // Pointer parallax on the whole rig
    const px = state.pointer.x;
    const py = state.pointer.y;
    rig.current.rotation.y += (px * 0.22 - rig.current.rotation.y) * Math.min(1, 4 * d);
    rig.current.rotation.x += (-py * 0.08 - rig.current.rotation.x) * Math.min(1, 4 * d);
  });

  /* ---------------- shared materials & geometries ---------------- */

  const chrome = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#e8eaee",
        metalness: 1,
        roughness: 0.12,
        envMapIntensity: 1.25,
      }),
    []
  );
  const steel = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#9aa0aa",
        metalness: 1,
        roughness: 0.32,
        envMapIntensity: 0.9,
      }),
    []
  );
  const darkMetal = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#15171c",
        metalness: 0.85,
        roughness: 0.5,
        envMapIntensity: 0.5,
      }),
    []
  );
  const rubber = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#0a0b0d",
        metalness: 0.1,
        roughness: 0.92,
      }),
    []
  );
  const slotMat = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#040507",
        metalness: 0.3,
        roughness: 0.7,
      }),
    []
  );

  // Base plate: rounded-rect extrusion
  const plateGeo = useMemo(() => {
    const w = 2.5;
    const h = 2.0;
    const r = 0.3;
    const s = new THREE.Shape();
    s.moveTo(-w / 2 + r, -h / 2);
    s.lineTo(w / 2 - r, -h / 2);
    s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
    s.lineTo(w / 2, h / 2 - r);
    s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
    s.lineTo(-w / 2 + r, h / 2);
    s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
    s.lineTo(-w / 2, -h / 2 + r);
    s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
    const g = new THREE.ExtrudeGeometry(s, {
      depth: 0.14,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
      curveSegments: 12,
    });
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0.1, 0);
    return g;
  }, []);

  // Chrome trim ring around the gate (frame with a hole)
  const trimGeo = useMemo(() => {
    const mk = (w: number, h: number, r: number) => {
      const s = new THREE.Shape();
      s.moveTo(-w / 2 + r, -h / 2);
      s.lineTo(w / 2 - r, -h / 2);
      s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
      s.lineTo(w / 2, h / 2 - r);
      s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
      s.lineTo(-w / 2 + r, h / 2);
      s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
      s.lineTo(-w / 2, -h / 2 + r);
      s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
      return s;
    };
    const outer = mk(2.15, 1.75, 0.22);
    const inner = mk(1.99, 1.59, 0.18);
    outer.holes.push(inner as unknown as THREE.Path);
    const g = new THREE.ExtrudeGeometry(outer, {
      depth: 0.03,
      bevelEnabled: false,
      curveSegments: 10,
    });
    g.rotateX(-Math.PI / 2);
    g.translate(0, 0.281, 0); // сидит на верхней грани платы (y≈0.28)
    return g;
  }, []);

  // Rubber boot: bellows lathe
  const bootGeo = useMemo(() => {
    const pts: THREE.Vector2[] = [];
    const H = 0.52;
    const steps = 26;
    for (let i = 0; i <= steps; i++) {
      const f = i / steps;
      const base = 0.46 - 0.34 * f; // taper
      const ripple = 0.05 * Math.sin(f * Math.PI * 5) * (1 - f * 0.55);
      pts.push(new THREE.Vector2(Math.max(0.09, base + ripple), f * H));
    }
    return new THREE.LatheGeometry(pts, 28);
  }, []);

  const knobTex = useMemo(() => makeKnobTexture(), []);
  useEffect(() => () => knobTex.dispose(), [knobTex]);

  /* --------------------------- manual drag --------------------------- */

  // The knob may slide freely along the neutral rail; off the rail it is
  // constrained to the nearest vertical slot column — like a real H-gate.
  const clampToGate = (px: number, pz: number): [number, number] => {
    const x = THREE.MathUtils.clamp(px, -GX, GX);
    const z = THREE.MathUtils.clamp(pz, -GZ, GZ);
    if (Math.abs(z) < 0.14) return [x, z];
    const col = [-GX, 0, GX].reduce((a, b) => (Math.abs(b - x) < Math.abs(a - x) ? b : a));
    return [col, z];
  };

  const startDrag = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    (e.target as Element)?.setPointerCapture?.(e.pointerId);
    dragging.current = true;
    route.current = [];
    const [x, z] = clampToGate(e.point.x, e.point.z);
    dragPt.current.set(x, z);
    document.body.style.cursor = "grabbing";
  };

  const moveDrag = (e: ThreeEvent<PointerEvent>) => {
    if (!dragging.current) return;
    const [x, z] = clampToGate(e.point.x, e.point.z);
    dragPt.current.set(x, z);
  };

  const endDrag = () => {
    if (!dragging.current) return;
    dragging.current = false;
    document.body.style.cursor = "";
    // Snap into the nearest slot and report it up; the knob stays there
    // until the scroll-driven gear actually changes again.
    let best: Gear = prevGear.current;
    let bestD = Infinity;
    for (const g of Object.keys(SLOT) as Gear[]) {
      const [sx, sz] = SLOT[g];
      const dd = (sx - dragPt.current.x) ** 2 + (sz - dragPt.current.y) ** 2;
      if (dd < bestD) {
        bestD = dd;
        best = g;
      }
    }
    route.current = [new THREE.Vector2(...SLOT[best])];
    prevGear.current = best;
    onShift(best);
  };

  /* ------------------------------ scene ------------------------------ */

  return (
    <group ref={rig} position={[0, -0.35, 0]}>
      {/* pedestal */}
      <mesh position={[0, -0.16, 0]} material={rubber}>
        <boxGeometry args={[2.7, 0.62, 2.2]} />
      </mesh>

      {/* base plate + chrome trim */}
      <mesh geometry={plateGeo} material={darkMetal} />
      <mesh geometry={trimGeo} material={steel} />

      {/* H-gate slots (flat, slightly above the plate) */}
      {[-GX, 0, GX].map((x) => (
        <mesh key={x} position={[x, 0.285, 0]} rotation={[-Math.PI / 2, 0, 0]} material={slotMat}>
          <planeGeometry args={[0.17, 2 * GZ + 0.17]} />
        </mesh>
      ))}
      <mesh position={[0, 0.284, 0]} rotation={[-Math.PI / 2, 0, 0]} material={slotMat}>
        <planeGeometry args={[2 * GX + 0.17, 0.17]} />
      </mesh>

      {/* gear labels */}
      {GEARS.map(({ gear }) => {
        const [x, z] = SLOT[gear];
        return (
          <GateLabel
            key={gear}
            char={gear}
            x={x * 1.32}
            z={z + (z < 0 ? -0.28 : 0.28)}
            active={active === gear}
          />
        );
      })}

      {/* drag surface — grab the knob and slide it through the gate;
          a plain click degenerates into a zero-length drag and still shifts */}
      <mesh
        position={[0, 0.32, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        visible={false}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
        onPointerOver={() => {
          if (!dragging.current) document.body.style.cursor = "grab";
        }}
        onPointerOut={() => {
          if (!dragging.current) document.body.style.cursor = "";
        }}
      >
        <planeGeometry args={[4.6, 3.6]} />
      </mesh>

      {/* the stick itself — pivots below the plate.
          GLB из Higgsfield (tripo_3d), пока грузится — процедурный фолбэк */}
      <group ref={stick} position={[0, -0.05, 0]}>
        <Suspense
          fallback={
            <>
              <group position={[0, 0.15, 0]}>
                <mesh geometry={bootGeo} material={rubber} />
              </group>
              <mesh position={[0, 0.8, 0]} material={chrome}>
                <cylinderGeometry args={[0.05, 0.075, 1.6, 20]} />
              </mesh>
              <mesh position={[0, 1.52, 0]} material={steel}>
                <cylinderGeometry args={[0.09, 0.06, 0.1, 20]} />
              </mesh>
              <mesh position={[0, 1.78, 0]} scale={[1, 1.08, 1]} material={chrome}>
                <sphereGeometry args={[0.27, 40, 28]} />
              </mesh>
              <mesh position={[0, 2.075, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[0.15, 24]} />
                <meshStandardMaterial
                  map={knobTex}
                  transparent
                  color="#dfe3e9"
                  metalness={0.9}
                  roughness={0.25}
                  polygonOffset
                  polygonOffsetFactor={-1}
                />
              </mesh>
            </>
          }
        >
          <StickModel />
        </Suspense>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                    */
/* ------------------------------------------------------------------ */

export interface Shifter3DProps {
  active: Gear;
  onShift: (g: Gear) => void;
  className?: string;
}

export function Shifter3D({ active, onShift, className }: Shifter3DProps) {
  const wrap = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  // Stop the render loop entirely when scrolled out of sight
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: "80px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className={className} style={{ aspectRatio: "15 / 16" }}>
      <Canvas
        frameloop={inView ? "always" : "never"}
        style={{ touchAction: "none" }}
        dpr={[1, 1.75]}
        camera={{ position: [0, 3.1, 6.6], fov: 30 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ camera }) => camera.lookAt(0, 0.3, 0)}
      >
        <Env />
        <ambientLight intensity={0.22} />
        <directionalLight position={[3, 6, 4]} intensity={1.1} />
        <pointLight position={[-3.5, 2.5, -2]} intensity={14} color={ACCENT} />
        <pointLight position={[3.5, 1.2, -3]} intensity={9} color={ACCENT_RED} />
        <Gearbox active={active} onShift={onShift} />
      </Canvas>
    </div>
  );
}
