"use client"

import { CompressText } from "./CompressText"

type Props = {
    show: boolean
    text: string
}

export default function WarningNotice({
    show,
    text,
}: Props) {
    return (
        <div className="relative flex h-[300px] w-[1200px] items-center justify-center overflow-hidden bg-black px-[40px]">
            <div className="w-full">
                <CompressText
                    text={text}
                    className={`
                        m-0
                        w-full
                        whitespace-nowrap
                        text-center
                        font-bold
                        leading-none
                        text-[64px]
                        text-red-500
                        ${show ? "animate-warning-blink" : "opacity-0"}
                    `}
                    minScale={0.2}
                />
            </div>
        </div>
    )
}