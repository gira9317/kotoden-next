"use client"

import { useEffect, useMemo, useRef, useState } from "react"

type Props = {
    text: string
    height?: number
    textSize?: number
    color?: string
    speed?: number
    show?: boolean
}

export default function ScrollMessage({
    text,
    height = 100,
    textSize = 64,
    color = "#FFE100",
    speed = 120,
    show = true,
}: Props) {
    const containerRef = useRef<HTMLDivElement | null>(null)
    const textRef = useRef<HTMLParagraphElement | null>(null)

    const [containerWidth, setContainerWidth] = useState(1200)
    const [textWidth, setTextWidth] = useState(0)

    useEffect(() => {
        const updateSize = () => {
            if (containerRef.current) {
                setContainerWidth(containerRef.current.offsetWidth)
            }
            if (textRef.current) {
                setTextWidth(textRef.current.offsetWidth)
            }
        }

        updateSize()

        const resizeObserver = new ResizeObserver(() => {
            updateSize()
        })

        if (containerRef.current) resizeObserver.observe(containerRef.current)
        if (textRef.current) resizeObserver.observe(textRef.current)

        window.addEventListener("resize", updateSize)

        return () => {
            resizeObserver.disconnect()
            window.removeEventListener("resize", updateSize)
        }
    }, [text, textSize, show])

    const duration = useMemo(() => {
        const distance = containerWidth + textWidth
        return distance / speed
    }, [containerWidth, textWidth, speed])

    return (
        <div
            ref={containerRef}
            className="relative w-[1200px] overflow-hidden bg-black"
            style={{ height }}
        >
            {show && (
                <p
                    ref={textRef}
                    className="absolute whitespace-nowrap font-bold leading-none m-0"
                    style={{
                        top: "50%",
                        left: 0,
                        color,
                        fontSize: `${textSize}px`,
                        animationName: "scroll-message-fixed-speed",
                        animationDuration: `${duration}s`,
                        animationTimingFunction: "linear",
                        animationIterationCount: "infinite",
                        animationFillMode: "none",
                        willChange: "transform",
                        ["--scroll-start" as string]: `${containerWidth}px`,
                        ["--scroll-end" as string]: `-${textWidth}px`,
                    }}
                >
                    {text}
                </p>
            )}
        </div>
    )
}