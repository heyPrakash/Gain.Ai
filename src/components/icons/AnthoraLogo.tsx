
import type { SVGProps } from 'react';

export function AnthoraLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="none"
      {...props}
    >
      <circle cx="6.5" cy="17.5" r="3.5" />
      <path d="M12 4 L18 4 L14 20 L8 20 Z" />
    </svg>
  );
}
