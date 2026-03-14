import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

interface StoreState {
  cursorType: 'default' | 'hover' | 'hidden'
  mousePosition: { x: number; y: number }
  
  setCursorType: (type: 'default' | 'hover' | 'hidden') => void
  setMousePosition: (x: number, y: number) => void
}

export const useStore = create<StoreState>()(
  immer((set) => ({
    cursorType: 'default',
    mousePosition: { x: 0, y: 0 },
    
    setCursorType: (type) => set((state) => {
      state.cursorType = type
    }),
    
    setMousePosition: (x, y) => set((state) => {
      state.mousePosition = { x, y }
    }),
  }))
)