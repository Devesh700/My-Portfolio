import { useEffect, useState } from 'react'

export function useScrollEffect() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down'>('down')
  const [scrollSpeed, setScrollSpeed] = useState(0)

  useEffect(() => {
    let lastScrollY = window.scrollY
    let lastTime = Date.now()

    const handleScroll = () => {
      const currentScrollY = window.scrollY
      const currentTime = Date.now()
      
      // Calculate scroll speed
      const speed = Math.abs(currentScrollY - lastScrollY) / (currentTime - lastTime)
      setScrollSpeed(speed)
      
      // Determine scroll direction
      setScrollDirection(currentScrollY > lastScrollY ? 'down' : 'up')
      
      setScrollY(currentScrollY)
      
      lastScrollY = currentScrollY
      lastTime = currentTime
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return { scrollY, scrollDirection, scrollSpeed }
}
