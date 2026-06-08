"use client"

import * as React from "react"
import { motion, useScroll, useTransform } from "motion/react"
import type { HTMLMotionProps } from "motion/react"

import { cn } from "@/lib/utils"

interface CardStickyProps extends HTMLMotionProps<"div"> {
  index: number
  incrementY?: number
  incrementZ?: number
  onActive?: (index: number) => void
}

const ContainerScroll = React.forwardRef<
  HTMLDivElement,
  React.HTMLProps<HTMLDivElement>
>(({ children, className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn("relative w-full", className)}
      style={{ perspective: "1200px", ...props.style }}
      {...props}
    >
      {children}
    </div>
  )
})
ContainerScroll.displayName = "ContainerScroll"

const CardSticky = React.forwardRef<HTMLDivElement, CardStickyProps>(
  (
    {
      index,
      incrementY = 12,
      incrementZ = 10,
      onActive,
      children,
      className,
      style,
      ...props
    },
    ref
  ) => {
    const containerRef = React.useRef<HTMLDivElement>(null)

    // Setup scroll tracking
    const { scrollYProgress } = useScroll({
      target: containerRef,
      offset: ["start 140px", "end 140px"]
    })

    // Determine target index-based transforms
    // Each card scales down slightly and pushes upwards when scrolled past
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.94 - index * 0.005])
    const opacity = useTransform(scrollYProgress, [0, 1], [1, 0.65])
    const y = useTransform(scrollYProgress, [0, 1], [0, -35])
    const rotateX = useTransform(scrollYProgress, [0, 1], [0, -3])

    // Standard sticky position offset based on card index
    const stickyTop = 140 + index * 24

    return (
      <div
        ref={containerRef}
        className="relative w-full min-h-fit md:min-h-[65vh] flex flex-col justify-start"
      >
        <motion.div
          ref={ref}
          style={{
            scale,
            opacity,
            y,
            rotateX,
            top: `${stickyTop}px`,
            zIndex: index,
            transformOrigin: "top center",
            backfaceVisibility: "hidden",
            ...style,
          }}
          onViewportEnter={() => {
            if (onActive) onActive(index)
          }}
          viewport={{ margin: "-25% 0px -55% 0px" }}
          className={cn("md:sticky rounded-2xl w-full", className)}
          {...props}
        >
          {children}
        </motion.div>
      </div>
    )
  }
)

CardSticky.displayName = "CardSticky"

export { ContainerScroll, CardSticky }

