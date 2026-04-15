import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { useCartStore, type FlyingItem } from '../stores/useCartStore'

interface CartPulse {
  id: string
  x: number
  y: number
}

export default function CartAnimationOverlay() {
  const { flyingItems, removeAnimation } = useCartStore()
  const [cartPos, setCartPos] = useState({ x: 0, y: 0 })
  const [pulses, setPulses] = useState<CartPulse[]>([])
  const prefersReducedMotion = useReducedMotion()

  // This effect tracks the cart icon's position on screen
  useEffect(() => {
    let rafId = 0

    const updateCartPos = () => {
      // We look for the global cart icon ID defined in Header.tsx
      const cartIcon = document.getElementById('global-cart-icon')
      if (cartIcon) {
        const rect = cartIcon.getBoundingClientRect()
        // Calculate the center point of the icon
        setCartPos({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      }
    }

    const scheduleUpdate = () => {
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(updateCartPos)
    }

    // Initial calculation
    updateCartPos()
    // Update on window resize to keep coordinates accurate
    window.addEventListener('resize', scheduleUpdate)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    // Small timeout to ensure the DOM has settled after page transitions
    const timer = setTimeout(updateCartPos, 500)
    return () => {
      window.removeEventListener('resize', scheduleUpdate)
      window.removeEventListener('scroll', scheduleUpdate)
      clearTimeout(timer)
      cancelAnimationFrame(rafId)
    }
  }, [flyingItems.length]) // Re-run when a new item starts flying

  const triggerCartPulse = useCallback((x: number, y: number) => {
    const pulseId = `pulse-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setPulses((prev) => [...prev, { id: pulseId, x, y }])
    setTimeout(() => {
      setPulses((prev) => prev.filter((pulse) => pulse.id !== pulseId))
    }, 700)
  }, [])

  const getMidX = (item: FlyingItem) => item.startX + (cartPos.x - item.startX) * 0.35
  const getLateX = (item: FlyingItem) => item.startX + (cartPos.x - item.startX) * 0.82
  const getArcY = (item: FlyingItem) => Math.min(item.startY, cartPos.y) - Math.max(46, Math.abs(cartPos.x - item.startX) * 0.06)
  const getNearCartY = () => cartPos.y - 8

  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 767px)').matches
  const lowPerfMode = prefersReducedMotion || isMobile
  const flightDuration = lowPerfMode ? 0.72 : 0.96

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {flyingItems.map((item: FlyingItem) => (
          <motion.div
            key={item.id}
            initial={{
              x: item.startX - item.width / 2,
              y: item.startY - item.width / 2,
              scale: 0.86,
              opacity: 0.96,
              rotate: -3,
            }}
            animate={{
              x: [
                item.startX - item.width / 2,
                getMidX(item) - item.width / 2,
                getLateX(item) - item.width / 2,
                cartPos.x - item.width / 2,
              ],
              y: [
                item.startY - item.width / 2,
                getArcY(item) - item.width / 2,
                getNearCartY() - item.width / 2,
                cartPos.y - item.width / 2,
              ],
              scale: [0.86, 0.74, 0.58, 0.22],
              opacity: [0.96, 0.96, 0.84, 0],
              rotate: [-3, 1, 0, 0],
            }}
            transition={{
              duration: flightDuration,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              triggerCartPulse(cartPos.x, cartPos.y)
              removeAnimation(item.id)
            }}
            className="absolute left-0 top-0 z-[101] pointer-events-none will-change-transform"
          >
            <div className="relative rounded-lg border border-border/50 bg-white/95 p-1.5 shadow-[0_6px_16px_rgba(0,0,0,0.18)]">
              <img
                src={item.imageUrl}
                style={{
                  width: item.width,
                  height: item.width,
                  objectFit: 'contain',
                  filter: lowPerfMode
                    ? 'drop-shadow(0 3px 7px rgba(22,22,22,0.12))'
                    : 'drop-shadow(0 4px 10px rgba(22,22,22,0.16))',
                }}
                className="relative z-10 rounded-md bg-white"
              />
            </div>
          </motion.div>
        ))}

        {pulses.map((pulse) => (
          <motion.div
            key={pulse.id}
            initial={{ x: pulse.x - 8, y: pulse.y - 8, scale: 0.2, opacity: 0.75 }}
            animate={{ scale: [0.2, 1.4], opacity: [0.75, 0] }}
            transition={{ duration: lowPerfMode ? 0.45 : 0.68, ease: 'easeOut' }}
            className="absolute h-4 w-4 rounded-full border border-accent/50"
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
