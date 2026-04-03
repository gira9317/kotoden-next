"use client"

import Image from "next/image"

type Props = {
    reason: string
}

export default function SuspendedBoard({ reason }: Props) {
    return (
        <div className="w-[1200px] h-[300px] border-[6px] border-white rounded-[8px] bg-black flex flex-col justify-center items-center relative">

            {/* イルカ画像 */}
            

            {/* 上：状態 */}
            <div className="flex justify-center items-center h-[160px]">
                <p className="font-bold text-[90px] leading-none text-[#E60012] tracking-[0.05em]">
                    運転休止中
                </p>
            </div>

            {/* 下：原因 */}
            <div className="flex justify-center items-center h-[100px]">
                <p className="font-bold text-[55px] leading-[67px] text-white text-center">
                    {`要因：${reason}`}
                </p>
            </div>

        </div>
    )
}