"use client"

import { useEffect, useRef, useState } from "react"

type CompressTextProps = {
    text: string
    className?: string
    minScale?: number
}

export function CompressText({
    text,
    className = "",
    minScale = 0.7,
}: CompressTextProps) {
    const outerRef = useRef<HTMLDivElement>(null)
    const innerRef = useRef<HTMLSpanElement>(null)
    const [scale, setScale] = useState(1)

    useEffect(() => {
        const updateScale = () => {
            const outer = outerRef.current
            const inner = innerRef.current
            if (!outer || !inner) return

            const outerWidth = outer.clientWidth
            const innerWidth = inner.scrollWidth

            if (innerWidth <= outerWidth) {
                setScale(1)
            } else {
                setScale(Math.max(outerWidth / innerWidth, minScale))
            }
        }

        updateScale()
        window.addEventListener("resize", updateScale)
        return () => window.removeEventListener("resize", updateScale)
    }, [text, minScale])

    return (
        <div ref={outerRef} className={`overflow-hidden ${className}`}>
            <span
                ref={innerRef}
                className="inline-block origin-center whitespace-nowrap"
                style={{ transform: `scaleX(${scale})` }}
            >
                {text}
            </span>
        </div>
    )
}