import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
// We use the custom cart store to track items that need to "fly" to the cart
import { useCartStore, type FlyingItem } from '../stores/useCartStore'

// Interface for the "Gold Dust" particles that burst when an item arrives
interface Sparkle {
  id: string
  x: number
  y: number
  dx: number
  dy: number
  size: number
  duration: number
  delay: number
}

interface CartPulse {
  id: string
  x: number
  y: number
}

export default function CartAnimationOverlay() {
  // Extract state and the cleanup function from our global cart store
  const { flyingItems, removeAnimation } = useCartStore()
  // We need to track the live position of the cart icon to know where to fly to
  const [cartPos, setCartPos] = useState({ x: 0, y: 0 })
  // Local state for active sparkles to ensure high-performance rendering
  const [sparkles, setSparkles] = useState<Sparkle[]>([])
  const [pulses, setPulses] = useState<CartPulse[]>([])

  // This effect tracks the cart icon's position on screen
  useEffect(() => {
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
    // Initial calculation
    updateCartPos()
    // Update on window resize to keep coordinates accurate
    window.addEventListener('resize', updateCartPos)
    window.addEventListener('scroll', updateCartPos, { passive: true })
    // Small timeout to ensure the DOM has settled after page transitions
    const timer = setTimeout(updateCartPos, 500)
    return () => {
      window.removeEventListener('resize', updateCartPos)
      window.removeEventListener('scroll', updateCartPos)
      clearTimeout(timer)
    }
  }, [flyingItems.length]) // Re-run when a new item starts flying

  // Function to create a "Gold Dust" burst at a specific coordinate
  const triggerSparkles = useCallback((x: number, y: number) => {
    const total = 14
    const newSparkles = Array.from({ length: total }).map((_, i) => {
      const angle = (Math.PI * 2 * i) / total + Math.random() * 0.35
      const distance = 22 + Math.random() * 26
      return {
        id: `${Date.now()}-${i}-${Math.random().toString(36).slice(2, 8)}`,
        x,
        y,
        dx: Math.cos(angle) * distance,
        dy: Math.sin(angle) * distance - 4,
        size: 1.5 + Math.random() * 2.2,
        duration: 0.5 + Math.random() * 0.28,
        delay: Math.random() * 0.06,
      }
    })

    setSparkles((prev) => [...prev, ...newSparkles])

    setTimeout(() => {
      const ids = new Set(newSparkles.map((sparkle) => sparkle.id))
      setSparkles((prev) => prev.filter((sparkle) => !ids.has(sparkle.id)))
    }, 900)
  }, [])

  const triggerCartPulse = useCallback((x: number, y: number) => {
    const pulseId = `pulse-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    setPulses((prev) => [...prev, { id: pulseId, x, y }])
    setTimeout(() => {
      setPulses((prev) => prev.filter((pulse) => pulse.id !== pulseId))
    }, 520)
  }, [])

  const getMidX = (item: FlyingItem) => item.startX + (cartPos.x - item.startX) * 0.35
  const getLateX = (item: FlyingItem) => item.startX + (cartPos.x - item.startX) * 0.72
  const getArcY = (item: FlyingItem) => Math.min(item.startY, cartPos.y) - Math.max(130, Math.abs(cartPos.x - item.startX) * 0.13)
  const getNearCartY = () => cartPos.y - 18

  const shimmerDuration = 0.68

  return (
    // The overlay is fixed and covers the whole screen but doesn't block clicks
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      <AnimatePresence>
        {/* Render each item currently in the flying queue */}
        {flyingItems.map((item: FlyingItem) => (
          <motion.div
            key={item.id}
            initial={{
              x: item.startX - item.width / 2,
              y: item.startY - item.width / 2,
              scale: 0.72,
              opacity: 0,
              rotate: -8,
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
              scale: [0.72, 0.88, 0.66, 0.2],
              opacity: [0, 1, 1, 0],
              rotate: [0, 8, -4, 0],
            }}
            transition={{
              duration: 1.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            onAnimationComplete={() => {
              triggerSparkles(cartPos.x, cartPos.y)
              triggerCartPulse(cartPos.x, cartPos.y)
              removeAnimation(item.id)
            }}
            className="absolute left-0 top-0 pointer-events-none z-[101]"
          >
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    '0 0 16px rgba(212,175,55,0.35)',
                    '0 0 44px rgba(212,175,55,0.65)',
                    '0 0 16px rgba(212,175,55,0.35)',
                  ],
                  opacity: [0.3, 0.85, 0.3],
                }}
                transition={{ duration: shimmerDuration, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute inset-0 rounded-full bg-accent/20 blur-xl"
              />
              <img
                src={item.imageUrl}
                style={{
                  width: item.width,
                  height: item.width,
                  objectFit: 'cover',
                  filter: 'drop-shadow(0 8px 16px rgba(22,22,22,0.24)) drop-shadow(0 0 10px rgba(212,175,55,0.72))',
                }}
                className="relative z-10 rounded-full border border-accent/40 bg-white"
              />
            </div>
          </motion.div>
        ))}

        {sparkles.map((sparkle) => (
          <motion.div
            key={sparkle.id}
            initial={{ x: sparkle.x, y: sparkle.y, scale: 0, opacity: 0.95 }}
            animate={{
              x: sparkle.x + sparkle.dx,
              y: sparkle.y + sparkle.dy,
              scale: [0, 1, 0],
              opacity: [0.95, 0.72, 0],
            }}
            transition={{ duration: sparkle.duration, delay: sparkle.delay, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              width: sparkle.size,
              height: sparkle.size,
              borderRadius: '50%',
              backgroundColor: '#D4AF37',
              boxShadow: '0 0 10px rgba(212,175,55,0.7)',
              zIndex: 20,
            }}
          />
        ))}

        {pulses.map((pulse) => (
          <motion.div
            key={pulse.id}
            initial={{ x: pulse.x - 10, y: pulse.y - 10, scale: 0.2, opacity: 0.9 }}
            animate={{ scale: [0.2, 1.8], opacity: [0.9, 0] }}
            transition={{ duration: 0.48, ease: 'easeOut' }}
            className="absolute h-5 w-5 rounded-full border border-accent/60"
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
