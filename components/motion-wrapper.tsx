"use client"

import { motion } from "framer-motion"
import { ReactNode } from "react"

interface MotionWrapperProps {
  children: ReactNode
  className?: string
  type?: "scale" | "lift" | "glow" | "tilt"
  disabled?: boolean
}

export function MotionWrapper({ 
  children, 
  className = "", 
  type = "scale",
  disabled = false 
}: MotionWrapperProps) {
  if (disabled) {
    return <div className={className}>{children}</div>
  }

  const variants = {
    scale: {
      whileHover: { scale: 1.05 },
      whileTap: { scale: 0.95 },
      transition: { type: "spring", stiffness: 400, damping: 17 }
    },
    lift: {
      whileHover: { y: -5, scale: 1.02 },
      transition: { type: "spring", stiffness: 300 }
    },
    glow: {
      whileHover: { 
        scale: 1.03,
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)"
      },
      transition: { duration: 0.3 }
    },
    tilt: {
      whileHover: { 
        scale: 1.05,
        rotateZ: 1
      },
      transition: { type: "spring", stiffness: 300 }
    }
  }

  const selectedVariant = variants[type]

  return (
    <motion.div
      className={className}
      whileHover={selectedVariant.whileHover}
      whileTap={selectedVariant.whileTap}
      transition={selectedVariant.transition}
    >
      {children}
    </motion.div>
  )
}

// 이미지 전용 호버 컴포넌트
export function ImageHover({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <motion.div
      className={`overflow-hidden ${className}`}
      whileHover="hover"
    >
      <motion.div
        variants={{
          hover: { scale: 1.1 }
        }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </motion.div>
  )
}