
import type { SVGProps } from 'react';

export function CortexAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24" // Standard 24x24 viewbox
      fill="currentColor"
      stroke="none" // The provided logo appears to be solid fill
      {...props}
    >
      <defs>
        <path
          id="cortex-petal"
          // This path defines one "petal" of the logo.
          // It starts at the center (0,0 for the <g> transform group),
          // extends upwards (negative Y), forms the lobes and the "dot" bulge.
          // M0,0 : Start at the center point of the logo (will be translated to 12,12 later)
          // L0,-2.5 : Draw a short "stem" upwards
          // C -1.7,-2.5 -2.7,-3.2 -2.7,-4.7 : Curve left for the lower part of the "dot" area / start of left lobe
          // C -2.7,-7 -1.2,-9.5 0,-9.5 : Curve left and up to form the top-left of the lobe, meeting at top center
          // C 1.2,-9.5 2.7,-7 2.7,-4.7 : Curve right and down for the top-right of the lobe
          // C 2.7,-3.2 1.7,-2.5 0,-2.5 : Curve right for the lower part of the "dot" area / start of right lobe
          // L0,0 : Connect back to the "stem" start (not strictly needed due to Z)
          // Z : Close the path to make it fillable
          d="M0,0 L0,-2.5 C -1.7,-2.5 -2.7,-3.2 -2.7,-4.7 C -2.7,-7 -1.2,-9.5 0,-9.5 C 1.2,-9.5 2.7,-7 2.7,-4.7 C 2.7,-3.2 1.7,-2.5 0,-2.5 L0,0 Z"
        />
      </defs>
      {/* Group to center transformations at (12,12) of the 24x24 viewBox */}
      <g transform="translate(12, 12)">
        {/* Top Petal */}
        <use href="#cortex-petal" />
        {/* Right Petal (rotated 90 degrees) */}
        <use href="#cortex-petal" transform="rotate(90)" />
        {/* Bottom Petal (rotated 180 degrees) */}
        <use href="#cortex-petal" transform="rotate(180)" />
        {/* Left Petal (rotated 270 degrees) */}
        <use href="#cortex-petal" transform="rotate(270)" />
      </g>
    </svg>
  );
}
