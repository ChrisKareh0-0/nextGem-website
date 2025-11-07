import { useEffect, useRef, useState } from "react"

interface TextEffectProps {
  text: string
  hoverText?: string
  href?: string
  className?: string
  delay?: number
}

export function TextGlitch({ text, hoverText, href, className = "", delay = 0 }: TextEffectProps) {
  const textRef = useRef<HTMLHeadingElement>(null)
  const spanRef = useRef<HTMLSpanElement>(null)
  const [displayText, setDisplayText] = useState(text)
  const [displayHoverText, setDisplayHoverText] = useState(hoverText || text)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const hoverIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import("gsap")

      if (textRef.current) {
        gsap.set(textRef.current, {
          opacity: 0,
          y: 20,
        })

        const tl = gsap.timeline({ delay: delay })

        tl.to(textRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power2.out",
        })
      }
    }

    loadGSAP()
  }, [delay])

  const handleMouseEnter = () => {
    if (spanRef.current) {
      spanRef.current.style.clipPath = "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
    }
  }

  const handleMouseLeave = () => {
    if (spanRef.current) {
      spanRef.current.style.clipPath = "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)"
    }
  }

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (hoverIntervalRef.current) {
        clearInterval(hoverIntervalRef.current)
      }
    }
  }, [])

  const spanContent = hoverText ? (
    href ? (
      <a href={href} target="_blank" rel="noreferrer" className="no-underline text-inherit">
        {displayHoverText}
      </a>
    ) : (
      displayHoverText
    )
  ) : (
    text
  )

  return (
    <h1
      ref={textRef}
      className={`
        text-[8vw] font-bold leading-none tracking-tighter m-0
        relative
        cursor-pointer
        overflow-hidden
        ${className}
      `}
      style={{
        width: "100%",
        maxWidth: "100vw",
        whiteSpace: "nowrap",
        color: "inherit",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {displayText}
      <span
        ref={spanRef}
        className="
          absolute w-full h-full
          font-bold
          flex flex-col justify-center
          transition-all duration-300 ease-out
          pointer-events-none
          overflow-hidden
        "
        style={{
          clipPath: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
          transformOrigin: "center",
          color: "#14ee25",
          left: 0,
          top: 0,
          whiteSpace: "nowrap",
        }}
      >
        {spanContent}
      </span>
    </h1>
  )
}
