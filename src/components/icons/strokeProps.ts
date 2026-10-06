import type { SVGAttributes } from "react";

/** Figma-style stroke icons: round caps and joins */
export const figmaStroke: Pick<
  SVGAttributes<SVGSVGElement>,
  "fill" | "stroke" | "strokeWidth" | "strokeLinecap" | "strokeLinejoin"
> = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};
