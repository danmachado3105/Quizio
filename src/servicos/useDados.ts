import { useSyncExternalStore } from 'react'
import { assinarDados, obterVersaoParaHook } from './armazenamento'

export function useDados() {
  return useSyncExternalStore(assinarDados, obterVersaoParaHook, obterVersaoParaHook)
}
