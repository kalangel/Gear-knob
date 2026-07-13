/**
 * Procedural gear outline generator — pure math, no React, no assets.
 *
 * Tooth profile: simplified involute (trapezoid with rounded tips).
 * Pitch diameter = module * teeth; addendum = module; dedendum = 1.25 * module.
 * A ~5% backlash is baked into the tooth thickness so meshing gears
 * clear each other at the exact theoretical center distance.
 */

export interface GearParams {
  /** number of teeth */
  teeth: number;
  /** gear module (tooth size in user units) */
  module: number;
  /** pressure angle in degrees, default 20° */
  pressureAngle?: number;
  /** radius of the central bore (0 = no bore) */
  hubRadius?: number;
  /** number of spokes (0 = solid disc) */
  spokes?: number;
}

export interface GearShape {
  /** SVG path `d` (fill-rule="evenodd" compatible; meant to be stroked) */
  d: string;
  pitchRadius: number;
  tipRadius: number;
  rootRadius: number;
}

/** Fraction of tooth thickness sacrificed as backlash so teeth never bind. */
const BACKLASH = 0.05;

const f = (n: number) => Number(n.toFixed(2));

function pt(r: number, a: number): string {
  return `${f(r * Math.cos(a))} ${f(r * Math.sin(a))}`;
}

export function generateGearPath(p: GearParams): GearShape {
  const { teeth, module: m } = p;
  const alpha = ((p.pressureAngle ?? 20) * Math.PI) / 180;
  const hub = p.hubRadius ?? 0;
  const spokes = p.spokes ?? 0;

  const rp = (m * teeth) / 2; // pitch radius
  const ra = rp + m; // tip (addendum) radius
  const rd = rp - 1.25 * m; // root (dedendum) radius

  const pitch = (2 * Math.PI) / teeth; // angular pitch
  // half tooth width (angular) at the pitch circle, minus backlash
  const hwPitch = (pitch / 4) * (1 - BACKLASH);
  // flanks lean inward by the pressure angle → narrower at tip, wider at root
  const spread = Math.tan(alpha);
  const hwTip = Math.max(hwPitch - (spread * (ra - rp)) / rp, hwPitch * 0.28);
  const hwRoot = hwPitch + (spread * (rp - rd)) / rd;

  // tip corner rounding
  const rf = 0.3 * m; // radial inset of the rounding
  const aIn = Math.min(rf / ra, hwTip * 0.6); // angular inset on the tip circle
  // flank half-width at radius (ra - rf), linear interpolation root→tip
  const hwFlank = hwTip + ((hwRoot - hwTip) * rf) / (ra - rd);

  const seg: string[] = [];
  // start at tooth 0's left root point
  seg.push(`M ${pt(rd, -hwRoot)}`);

  for (let i = 0; i < teeth; i++) {
    const c = i * pitch; // tooth center angle
    // left flank up (root → just below tip)
    seg.push(`L ${pt(ra - rf, c - hwFlank)}`);
    // rounded left tip corner (control point = the sharp corner)
    seg.push(`Q ${pt(ra, c - hwTip)} ${pt(ra, c - hwTip + aIn)}`);
    // across the tip along the addendum circle
    seg.push(`A ${f(ra)} ${f(ra)} 0 0 1 ${pt(ra, c + hwTip - aIn)}`);
    // rounded right tip corner
    seg.push(`Q ${pt(ra, c + hwTip)} ${pt(ra - rf, c + hwFlank)}`);
    // right flank down to root
    seg.push(`L ${pt(rd, c + hwRoot)}`);
    // root arc over the gap to the next tooth's left root point
    seg.push(`A ${f(rd)} ${f(rd)} 0 0 1 ${pt(rd, c + pitch - hwRoot)}`);
  }
  seg.push("Z");

  // central bore
  if (hub > 0) {
    seg.push(
      `M ${pt(hub, 0)}`,
      `A ${f(hub)} ${f(hub)} 0 0 1 ${pt(hub, Math.PI)}`,
      `A ${f(hub)} ${f(hub)} 0 0 1 ${pt(hub, 2 * Math.PI - 0.0001)}`,
      "Z"
    );
  }

  // spoke cutouts: annular sectors between hub collar and rim
  if (spokes >= 2 && hub > 0) {
    const r1 = hub + 1.1 * m; // inner edge (hub collar)
    const r2 = rd - 1.7 * m; // outer edge (rim)
    if (r2 - r1 > m) {
      const sector = (2 * Math.PI) / spokes;
      const spokeHalf = sector * 0.11; // angular half-width of a spoke
      for (let k = 0; k < spokes; k++) {
        const a0 = k * sector + spokeHalf;
        const a1 = (k + 1) * sector - spokeHalf;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        seg.push(
          `M ${pt(r2, a0)}`,
          `A ${f(r2)} ${f(r2)} 0 ${large} 1 ${pt(r2, a1)}`,
          `L ${pt(r1, a1)}`,
          `A ${f(r1)} ${f(r1)} 0 ${large} 0 ${pt(r1, a0)}`,
          "Z"
        );
      }
    }
  }

  return { d: seg.join(" "), pitchRadius: rp, tipRadius: ra, rootRadius: rd };
}
