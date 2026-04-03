"use client"

import Image from "next/image"
import { CompressText } from "./CompressText"

type LineName = "琴平・長尾線" | "琴平線" | "長尾線" | "志度線"

type Props = {
    leftMin: number | string
    arriveTime: string
    stationNumber: string
    destination: string
    lineName: LineName
    backgroundImageSrc?: string
}

export default function TrainHeader({
    leftMin,
    arriveTime,
    stationNumber,
    destination,
    lineName,
    backgroundImageSrc,
}: Props) {
    const accentColorMap: Record<LineName, string> = {
        "琴平・長尾線": "rgb(1,153,239)",
        "琴平線": "rgb(255,200,1)",
        "長尾線": "rgb(0,153,102)",
        "志度線": "rgb(233,83,131)",
    }

    const accentColor = accentColorMap[lineName] ?? "rgb(255,200,1)"
    const isSoon = leftMin === "まもなく"

    return (
        <div className="relative flex h-[100px] w-[1200px] items-center justify-between overflow-hidden rounded-[6px]">

            {/* 背景画像 */}
            {backgroundImageSrc && (
                <div className="absolute inset-0">
                    <Image
                        src={backgroundImageSrc}
                        alt="background"
                        fill
                        priority
                        className="object-cover object-center opacity-40"
                    />
                </div>
            )}

            {/* オーバーレイ */}
            <div className="absolute inset-0 bg-black/40" />

            {/* 左 */}
            <div className="relative z-10 grid h-full w-[600px] grid-cols-[300px_170px] items-center pl-[122px]">

                <div className="h-[90px] w-[260px]">
                    {isSoon ? (
                        <div className="flex h-full items-center">
                            <span
                                className="whitespace-nowrap font-bold text-[64px] leading-none"
                                style={{ color: accentColor }}
                            >
                                まもなく
                            </span>
                        </div>
                    ) : (
                        <div className="grid h-full grid-cols-[120px_auto] items-center gap-[8px]">
                            <span
                                className="flex h-full items-center justify-center whitespace-nowrap font-bold tabular-nums text-[90px] leading-none"
                                style={{ color: accentColor }}
                            >
                                {typeof leftMin === "number"
                                    ? String(leftMin).padStart(2, "\u00A0")
                                    : leftMin}
                            </span>

                            <span
                                className="whitespace-nowrap font-bold text-[48px] leading-[58px]"
                                style={{ color: accentColor }}
                            >
                                分後
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex h-full items-center">
                    <p className="whitespace-nowrap font-bold tabular-nums text-[70px] leading-[85px] text-white">
                        {arriveTime}
                    </p>
                </div>
            </div>

            {/* 右 */}
            <div className="relative z-10 flex h-full w-[600px] items-center justify-center gap-[24px]">

                <div
                    className="flex h-[55px] w-[95px] shrink-0 items-center justify-center rounded-[5px] border-[8px] bg-white"
                    style={{ borderColor: accentColor }}
                >
                    <CompressText
                        text={stationNumber}
                        className="w-full text-center font-bold text-[35px] leading-[54px] text-black"
                        minScale={0.9}
                    />
                </div>

                <div className="w-[380px] shrink-0">
                    <CompressText
                        text={destination}
                        className="font-bold text-[64px] leading-[72px] text-white"
                        minScale={0.6}
                    />
                </div>
            </div>
        </div>
    )
}