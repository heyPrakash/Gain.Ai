
import type { SVGProps } from 'react';

export function GainAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      {...props}
    >
      {/* This SVG path was originally for Carbo, resembling a C, now used for Gain */}
      <path d="M15.93,4.24C14.91,3.47 13.5,3 12,3C7.03,3 3,7.03 3,12C3,16.97 7.03,21 12,21C13.5,21 14.91,20.53 15.93,19.76L14.83,18.12C14.08,18.63 13.08,19 12,19C8.14,19 5,15.86 5,12C5,8.14 8.14,5 12,5C13.08,5 14.08,5.37 14.83,5.88L15.93,4.24Z" />
    </svg>
  );
}
