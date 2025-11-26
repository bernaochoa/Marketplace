/**
 * Hook personalizado para controlar el tiempo de visualización del skeleton loading
 * 
 * Este hook:
 * 1. Muestra el skeleton durante 800ms
 * 2. Se reinicia cuando cambian las dependencias (deps)
 * 3. Limpia el timer si el componente se desmonta antes de tiempo
 * 
 * Útil para mejorar la UX mostrando un estado de carga consistente,
 * incluso si los datos se cargan muy rápido.
 * 
 * @param deps - Array de dependencias. Cuando cambian, se reinicia el skeleton
 * @returns boolean - true si debe mostrarse el skeleton, false si no
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const isLoading = useSkeletonDelay([data])
 *   if (isLoading) return <Skeleton />
 *   return <DataDisplay data={data} />
 * }
 * ```
 */
import { useEffect, useState } from 'react'

export const useSkeletonDelay = (deps: unknown[] = []) => {
  // Estado inicial: siempre mostrar skeleton al inicio
  const [isLoading, setIsLoading] = useState(true)

  /**
   * useEffect: MOUNT/UPDATE - Controlar el tiempo del skeleton
   * Se ejecuta:
   * - Al montar el componente (mostrar skeleton)
   * - Cuando cambian las dependencias (reiniciar skeleton)
   * 
   * CLEANUP: Cancela el timer si el componente se desmonta antes de 800ms
   */
  useEffect(() => {
    // Siempre mostrar skeleton al inicio y luego mostrar los datos
    setIsLoading(true)
    // Timer de 800ms antes de ocultar el skeleton
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    // CLEANUP: Si el componente se desmonta antes de 800ms, cancelar el timer
    return () => clearTimeout(timer)
  }, deps) // Se reinicia cuando cambian las dependencias

  return isLoading
}
