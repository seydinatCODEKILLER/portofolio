'use client'

import { useEffect } from 'react'
import { useStore } from '@/store/useStore'

export const useMousePosition = () => {
  const setMousePosition = useStore((state) => state.setMousePosition)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition(e.clientX, e.clientY)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [setMousePosition])
}