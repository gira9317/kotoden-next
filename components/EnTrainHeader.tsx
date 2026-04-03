"use client"

import { CompressText } from "./CompressText"

type Props = {
    leftMin: number
    arriveTime: string
    stationNumber: string
    destination: string
}

export default function EnTrainHeader({
    leftMin,
    arriveTime,
    stationNumber,
    destination,
}: Props) {
    
    return (
        <div className="flex h-[100px] w-[1200px] items-center justify-between rounded-[6px]">
            <div className="flex h-full w-[600px] items-center justify-between pl-[114px]">
                <div className="grid h-[90px] grid-cols-[120px_auto] items-center gap-[8px]">
                    <span className="flex h-full items-center justify-center whitespace-nowrap font-bold tabular-nums text-[90px] leading-none text-[#FFE100]">
                        {String(leftMin).padStart(2, "\u00A0")}
                    </span>

                    <span className="whitespace-nowrap font-bold text-[48px] leading-[58px] text-[#FFE100]">
                        min.
                    </span>
                </div>

                <div className="flex h-full items-center">
                    <p className="whitespace-nowrap font-bold text-[70px] leading-[85px] text-white">
                        {arriveTime}
                    </p>
                </div>
            </div>

            <div className="flex h-full w-[600px] items-center justify-center gap-[24px]">
                <div className="flex h-[55px] w-[95px] shrink-0 items-center justify-center rounded-[5px] border-[8px] border-[#FFC801] bg-white">
                    <CompressText
                        text={stationNumber}
                        className="w-full text-center font-bold text-[35px] leading-[54px] text-black"
                        minScale={0.9}
                    />
                </div>

                <div className="w-[380px] shrink-0">
                    <CompressText
                        text={destination}
                        className="font-bold text-[40px] leading-[48px] text-white"
                        minScale={0.55}
                    />
                </div>
            </div>
        </div>
    )
}