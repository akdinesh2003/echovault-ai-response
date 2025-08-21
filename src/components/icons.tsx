import type { SVGProps } from 'react';

export function EchoVaultLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
        <path d="M12 22V18" />
        <path d="M12 6V2" />
        <path d="M18 12H22" />
        <path d="M2 12H6" />
        <path d="M19.07 4.93L16.24 7.76" />
        <path d="M4.93 19.07L7.76 16.24" />
        <path d="M19.07 19.07L16.24 16.24" />
        <path d="M4.93 4.93L7.76 7.76" />
        <circle cx="12" cy="12" r="2" />
        <path d="M13.41 10.59a6 6 0 0 0-8.42 8.42" />
        <path d="M10.59 13.41a6 6 0 0 1 8.42-8.42" />
    </svg>
  );
}
