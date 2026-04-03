"use client"

import Image from "next/image"
import { CompressText } from "./CompressText"

type Props = {
    lineText: string
    destination: string
    logoSrc?: string
}

export default function LineHeader({
    lineText,
    destination,
    logoSrc = "/images/kotoden/kotohira_line_logo.png",
}: Props) {

    const lineColorMap: Record<string, string> = {
        "琴平・長尾線": "border-[rgb(1,153,239)]",
        "琴平線": "border-[rgb(255,200,1)]",
        "長尾線": "border-[rgb(0,153,102)]",
        "志度線": "border-[rgb(233,83,131)]",
    }

    const borderColor = lineColorMap[lineText] ?? "border-white"

    const lineLogoMap: Record<string, string> = {
        "琴平・長尾線": "/images/kotoden/tikko_line_logo.png",
        "琴平線": "/images/kotoden/kotohira_line_logo.png",
        "長尾線": "/images/kotoden/nagao_line_logo.png",
        "志度線": "/images/kotoden/shido_line_logo.png",
    }

    const currentLogo = lineLogoMap[lineText] ?? logoSrc

    return (
        <div className="
            relative
            flex items-center gap-[8px]
            px-[20px]
            w-[1200px] h-[100px]

            bg-[linear-gradient(to_bottom,#333,#1a1a1a)]
            border border-[#4a4a4a]

            shadow-[inset_0_2px_6px_rgba(0,0,0,0.5),0_2px_6px_rgba(0,0,0,0.4)]

            after:absolute after:top-0 after:left-0 after:w-full after:h-[2px]
            after:bg-gradient-to-r after:from-transparent after:via-white/30 after:to-transparent
        ">

            {/* ===== 左（ロゴ＋路線名） ===== */}
            <div className="flex items-center gap-[20px] w-[440px] shrink-0">

                {/* ロゴ */}
                <div className={`
                    flex-shrink-0
                    flex justify-center items-center
                    overflow-hidden
                    rounded-[18px]
                    border-[8px] ${borderColor}
                    bg-white
                    w-[90px] h-[90px]
                `}>
                    <Image
                        src={currentLogo}
                        width={180}
                        height={180}
                        alt="logo"
                        className="scale-125"
                    />
                </div>

                {/* 路線名 */}
                <div className="flex-1 min-w-0">
                    <CompressText
                        text={lineText}
                        className="font-bold text-[42px] leading-[50px] text-white"
                        minScale={0.7}
                    />
                </div>
            </div>

            {/* ===== 区切り線（JR感出す） ===== */}
            <div className="w-[2px] h-[60px] bg-white/20 shrink-0" />

            {/* ===== 右（行き先） ===== */}
            <div className="flex-1 min-w-0">
                <CompressText
                    text={destination}
                    className="
                        text-left
                        font-bold
                        text-[52px]
                        leading-[65px]
                        text-white
                    "
                    minScale={0.6}
                />
            </div>
        </div>
    )
}