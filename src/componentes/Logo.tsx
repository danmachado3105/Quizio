import type { SVGProps } from 'react'

export type OpcaoLogo = 1 | 2 | 3

function Marca({ opcao, ...props }: { opcao: OpcaoLogo } & SVGProps<SVGSVGElement>) {
  if (opcao === 2) return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="7" y="8" width="28" height="32" rx="5" fill="#FF786B" stroke="#35254F" strokeWidth="3" />
      <rect x="13" y="5" width="28" height="32" rx="5" fill="#FFD166" stroke="#35254F" strokeWidth="3" />
      <path d="M22 27c0-5 7-5 7 0s-7 5-7 0Z" stroke="#35254F" strokeWidth="3" />
    </svg>
  )
  if (opcao === 3) return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <path d="M24 3v5M24 40v5M3 24h5M40 24h5M9 9l4 4m22 22 4 4M39 9l-4 4M13 35l-4 4" stroke="#35254F" strokeWidth="3" strokeLinecap="round" />
      <circle cx="24" cy="24" r="17" fill="#7254D8" stroke="#35254F" strokeWidth="3" />
      <path d="M29 29a8 8 0 1 1 1-10" stroke="#FFF8EF" strokeWidth="4" strokeLinecap="round" />
      <path d="m29 14 2 6-6-1" fill="#FFD166" stroke="#35254F" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  )
  return (
    <svg viewBox="0 0 48 48" fill="none" {...props}>
      <rect x="5" y="5" width="38" height="38" rx="8" fill="#7254D8" stroke="#35254F" strokeWidth="3" />
      <path d="M30.5 17.5a10.5 10.5 0 1 0 1 13.5h-7" stroke="#FFF8EF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M26 27h10v9" stroke="#FFD166" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="35.5" cy="12.5" r="3.5" fill="#FF786B" stroke="#35254F" strokeWidth="2" />
    </svg>
  )
}

export function Logo({ opcao = 1, mostrarNome = true, className = '' }: { opcao?: OpcaoLogo; mostrarNome?: boolean; className?: string }) {
  return <span className={`logo ${className}`} aria-label="Quizio">
    <Marca opcao={opcao} className="logo__marca" aria-hidden="true" />
    {mostrarNome && <span>quizio</span>}
  </span>
}
