/**
 * Gear-train configuration for the blueprint background.
 *
 * One connected chain (a tree rooted at the huge gear g1). Positions of
 * meshing gears are DERIVED from the parent center + placement angle so the
 * center distance `module * (zA + zB) / 2` is always exact — never hardcode
 * x/y for a meshing gear.
 *
 * Design space: 1600 × 900 user units (viewBox), y grows downward.
 */
import { generateGearPath, type GearShape } from "./gear-geometry";

/** Shared module — meshing gears must have the same one. */
export const MODULE = 16;

/** Master rotation of the root gear over the full page scroll (0→1). */
export const TOTAL_ROTATION = 6 * Math.PI;

const deg = (d: number) => (d * Math.PI) / 180;

interface GearDef {
  id: string;
  teeth: number;
  /** id of the gear this one meshes with; null = root of the chain */
  meshesWith: string | null;
  /** root gear only: explicit center */
  x?: number;
  y?: number;
  /** meshing gears: direction (deg→rad) from parent center to this center */
  placeAt?: number;
  /**
   * Extra phase (rad) on top of the computed mesh alignment.
   * The analytic phase is a first approximation — tune this by eye
   * при проверке точки контакта.
   */
  phaseTweak?: number;
  hubRadius: number;
  spokes: number;
  /** accent-colored (site blue) instead of faint white */
  accent?: boolean;
  /** keep on small screens (mobile shows only these) */
  mobile?: boolean;
}

const DEFS: GearDef[] = [
  // Огромная — уходит за нижний правый край экрана
  { id: "g1", teeth: 68, meshesWith: null, x: 1460, y: 1080, hubRadius: 74, spokes: 6, mobile: true },
  // Средняя, акцентная — вверх-влево от g1
  { id: "g2", teeth: 26, meshesWith: "g1", placeAt: deg(-105), hubRadius: 36, spokes: 5, accent: true, mobile: true },
  // Маленькая — к верхнему правому углу
  { id: "g3", teeth: 13, meshesWith: "g2", placeAt: deg(-55), hubRadius: 20, spokes: 0 },
  // Средне-крупная — за правым краем, видна полоска зубьев
  { id: "g4", teeth: 34, meshesWith: "g1", placeAt: deg(-64), hubRadius: 44, spokes: 6 },
  // Маленькая акцентная — вниз-влево от g2
  { id: "g5", teeth: 13, meshesWith: "g2", placeAt: deg(163), hubRadius: 20, spokes: 0, accent: true },
];

export interface ResolvedGear {
  id: string;
  teeth: number;
  x: number;
  y: number;
  /** dAngle/dMaster — signed gear ratio relative to the root gear */
  k: number;
  /** constant phase (rad) that seats teeth into the parent's gaps */
  phase: number;
  shape: GearShape;
  accent: boolean;
  mobile: boolean;
  hubRadius: number;
}

function resolve(defs: GearDef[]): ResolvedGear[] {
  const map = new Map<string, ResolvedGear>();
  for (const d of defs) {
    const shape = generateGearPath({
      teeth: d.teeth,
      module: MODULE,
      hubRadius: d.hubRadius,
      spokes: d.spokes,
    });
    let x: number, y: number, k: number, phase: number;
    if (!d.meshesWith) {
      x = d.x ?? 0;
      y = d.y ?? 0;
      k = 1;
      phase = 0;
    } else {
      const parent = map.get(d.meshesWith);
      if (!parent) throw new Error(`gear "${d.id}" declared before its parent "${d.meshesWith}"`);
      // exact meshing distance — must hold or teeth will not seat
      const dist = (MODULE * (parent.teeth + d.teeth)) / 2;
      const phi = d.placeAt ?? 0;
      x = parent.x + dist * Math.cos(phi);
      y = parent.y + dist * Math.sin(phi);
      const r = parent.teeth / d.teeth;
      // meshing gears counter-rotate: angle = -angleParent * (zP/zC) + phase
      k = -parent.k * r;
      // analytic mesh alignment: when a parent tooth points along the center
      // line phi, a child gap must face it from phi+π. Both outlines have a
      // tooth centered at local angle 0, hence the constant below
      // (π − π/z, NOT π/z — for odd tooth counts they differ by half a pitch).
      phase =
        -r * parent.phase +
        (1 + r) * phi +
        Math.PI -
        Math.PI / d.teeth +
        (d.phaseTweak ?? 0);
    }
    map.set(d.id, {
      id: d.id,
      teeth: d.teeth,
      x: Number(x.toFixed(2)),
      y: Number(y.toFixed(2)),
      k,
      phase,
      shape,
      accent: d.accent ?? false,
      mobile: d.mobile ?? false,
      hubRadius: d.hubRadius,
    });
  }
  return [...map.values()];
}

/** Paths are generated once at module load and cached here. */
export const GEARS: ResolvedGear[] = resolve(DEFS);
