import { EMBLEMAS_CATEGORIAS } from '../dados/emblemas'

export function EmblemaCategoria({ id, tamanho = 56, className = '' }: { id: string; tamanho?: number; className?: string }) {
  const marcacao = EMBLEMAS_CATEGORIAS[id] ?? EMBLEMAS_CATEGORIAS['conhecimentos-gerais']
  return <svg className={`emblema-categoria ${className}`} viewBox="0 0 24 24" width={tamanho} height={tamanho} fill="none" aria-hidden="true" focusable="false" dangerouslySetInnerHTML={{ __html: marcacao }} />
}
