import { cn } from '@pietersoudan/ui'
import { useEffect, useRef, type ReactNode } from 'react'

type ScrollRevealProps = {
  children: ReactNode
  className?: string
  /** Stagger delay in milliseconds */
  delay?: number
}

function isInViewport(element: Element) {
  const rect = element.getBoundingClientRect()
  const viewportHeight = window.innerHeight
  return rect.top < viewportHeight * 0.92 && rect.bottom > viewportHeight * 0.08
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    if (reducedMotion) {
      element.classList.add('is-in-view')
      return
    }

    document.documentElement.classList.add('scroll-motion-enabled')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return
        element.classList.toggle('is-in-view', entry.isIntersecting)
      },
      { threshold: [0, 0.12, 0.25], rootMargin: '-4% 0px -4% 0px' },
    )

    observer.observe(element)

    if (isInViewport(element)) {
      element.classList.add('is-in-view')
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={cn('scroll-motion', className)}
      style={delay > 0 ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
