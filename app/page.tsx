import { Hero } from '@/components/sections/Hero'
import { CustomCursor } from '@/components/animations/CustomCursor'

export default function Home() {
  return (
    <>
      <CustomCursor />
      <main>
        <Hero />
      </main>
    </>
  )
}