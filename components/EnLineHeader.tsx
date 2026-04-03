"use client"

import Image from "next/image"
import { CompressText } from "./CompressText"

type Props = {
    lineText: string
    directionText: string
    logoSrc?: string
}

export default function EnLineHeader({
    lineText,
    directionText,
    logoSrc = "/images/kotoden/tikko_line_logo.png",
}: Props) {
    const lineColorMap: Record<string, string> = {
    "Kotohira·Nagao Line": "border-[rgb(1,153,239)]",
    "Kotohira Line": "border-[rgb(255,200,1)]",
    "Nagao Line": "border-[rgb(0,153,102)]",
    "Shido Line": "border-[rgb(233,83,131)]",
    }

    const borderColor =
        lineColorMap[lineText] ?? "border-white"

    return (
        <div className="
            relative
            flex justify-between items-center px-[10px] w-[1200px] h-[100px]
            bg-[linear-gradient(to_bottom,#333,#1a1a1a)]
            border border-[#4a4a4a]
            shadow-[inset_0_2px_6px_rgba(0,0,0,0.5),0_2px_6px_rgba(0,0,0,0.4)]
            after:absolute after:top-0 after:left-0 after:w-full after:h-[2px]
            after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent
            ">

            {/* 左 */}
            <div className="flex items-center gap-[24px] w-[545px] h-full">
                <div className={`flex-shrink-0 flex justify-center items-center overflow-hidden rounded-[20px] border-[9px] ${borderColor} bg-white w-[90px] h-[90px]`}>
                    <Image
                        src={logoSrc}
                        width={200}
                        height={200}
                        alt="logo"
                    />
                </div>

                <div className="flex-1 min-w-0">
                    <CompressText
                        text={lineText}
                        className="text-left font-bold text-[45px] leading-[54px] tracking-[-0.02em] text-white"
                        minScale={0.7}
                    />
                </div>
            </div>

            {/* 右 */}
            <div className="w-[638px] shrink-0">
                <CompressText
                    text={directionText}
                    className="pl-[40px] text-left font-bold text-[40px] leading-[48px] tracking-[-0.08em] text-white"
                    minScale={0.6}
                />
            </div>
        </div>
    )
}