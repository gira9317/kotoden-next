"use client"

import Image from "next/image"

type Props = {
    show: boolean
    imageSrc: string
    text?: string
}

export default function TrainApproach({
    show,
    imageSrc,
    text = "電車が参ります",
}: Props) {
    return (
        <div className="relative h-[100px] w-[1200px] overflow-hidden bg-black">
            <div className="absolute left-1/2 top-1/2 -translate-y-1/2">
                <div
                    className={show ? "animate-train-approach-in" : "translate-x-[1400px]"}
                >
                    <div
                        className={`
                            flex items-center gap-[24px]
                            ${show ? "animate-warning-blink [animation-delay:1.8s]" : ""}
                        `}
                    >
                        <div className="flex h-[80px] w-[120px] items-center justify-center translate-y-[40px]">
                            <Image
                                src={imageSrc}
                                alt="approach"
                                width={120}
                                height={84}
                                className="max-h-full max-w-full object-contain"
                                priority
                            />
                        </div>

                        <p className="whitespace-nowrap font-bold text-[64px] leading-none text-white translate-y-[50px]">
                            {text}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}