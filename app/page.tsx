"use client"

import { useEffect, useState } from "react"
import timetable from "@/data/kotoden_timetable.json"
import stationNumbers from "@/data/kotoden_station_number.json"
import Image from "next/image"

import LineHeader from "../components/LineHeader"
import TrainHeader from "../components/TrainHeader"
import SuspendedBoard from "@/components/SuspendedBoard"
import TrainApproach from "@/components/TrainApproaching"
import WarningNotice from "@/components/WarningNotice"
import ScrollMessage from "@/components/ScrollMessage"

import { getDirectionLabel } from "@/lib/getDirectionLabel"
import {
    getTrainLookupResult,
    type NextTrain,
} from "@/lib/getNextTrains"
import type { Timetable, Direction } from "@/lib/timetableTypes"

type LineName = "琴平線" | "長尾線" | "志度線"
type BoardMode = "normal" | "approach" | "warning" | "scroll"

type StationNumberMap = {
    [station: string]: Partial<Record<LineName, string>>
}

const stationNumberMap = stationNumbers as StationNumberMap
const typedTimetable = timetable as unknown as Timetable

const approachImages = [
    "/images/kotoden/approaching/ouchi_kotoden.png",
    "/images/kotoden/approaching/pc_kotochan.png",
    "/images/kotoden/approaching/udon_kotochan.png",
]

function getStationNumber(station: string, line: LineName) {
    return stationNumberMap[station]?.[line] ?? "--"
}

function getNowTimeString() {
    const now = new Date()
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    return `${hours}:${minutes}`
}

function normalizeLeftMin(diffMin: number) {
    if (diffMin <= 1) {
        return "まもなく"
    }

    return Math.max(1, diffMin)
}

export default function Page() {
    const [stationInput, setStationInput] = useState("仏生山")
    const [timeInput, setTimeInput] = useState("06:05")
    const [lineInput, setLineInput] = useState<LineName>("琴平線")
    const [directionInput, setDirectionInput] = useState<Direction>("上り")
    const [cancelInput, setCancelInput] = useState(false)
    const [cancelReasonInput, setCancelReasonInput] = useState("車両点検のため")
    const [noticeText, setNoticeText] = useState("ご注意ください　通過列車がまいります")
    const [showApproach, setShowApproach] = useState(false)
    const [approachImage, setApproachImage] = useState(approachImages[0])

    const [isRealtime, setIsRealtime] = useState(false)

    const [boardLine, setBoardLine] = useState<LineName>("琴平線")
    const [boardDirection, setBoardDirection] = useState<Direction>("上り")
    const [boardStation, setBoardStation] = useState("仏生山")
    const [boardTime, setBoardTime] = useState("06:05")
    const [boardCancelled, setBoardCancelled] = useState(false)
    const [boardCancelReason, setBoardCancelReason] = useState("車両点検のため")
    const [boardMode, setBoardMode] = useState<BoardMode>("normal")

    const initialResult = getTrainLookupResult(
        typedTimetable,
        "仏生山",
        "06:05",
        "琴平線",
        "上り",
        2
    )

    const [boardTrains, setBoardTrains] = useState<NextTrain[]>(initialResult.nextTrains)

    const handleRun = () => {
        const result = getTrainLookupResult(
            typedTimetable,
            stationInput,
            timeInput,
            lineInput,
            directionInput,
            2
        )

        setIsRealtime(false)
        setBoardLine(lineInput)
        setBoardDirection(directionInput)
        setBoardStation(stationInput)
        setBoardTime(timeInput)
        setBoardTrains(result.nextTrains)
        setBoardCancelled(cancelInput)
        setBoardCancelReason(cancelReasonInput.trim() || "運転取りやめ")
        setBoardMode("normal")
        setShowApproach(false)
    }

    const handleRealtime = () => {
        const nowTime = getNowTimeString()

        const result = getTrainLookupResult(
            typedTimetable,
            stationInput,
            nowTime,
            lineInput,
            directionInput,
            2
        )

        setIsRealtime(true)
        setTimeInput(nowTime)
        setBoardLine(lineInput)
        setBoardDirection(directionInput)
        setBoardStation(stationInput)
        setBoardTime(nowTime)
        setBoardTrains(result.nextTrains)
        setBoardCancelled(cancelInput)
        setBoardCancelReason(cancelReasonInput.trim() || "運転取りやめ")
        setBoardMode("normal")
        setShowApproach(false)
    }

    useEffect(() => {
        if (!isRealtime) return

        const updateRealtimeBoard = () => {
            const nowTime = getNowTimeString()

            const result = getTrainLookupResult(
                typedTimetable,
                stationInput,
                nowTime,
                lineInput,
                directionInput,
                2
            )

            setTimeInput(nowTime)
            setBoardLine(lineInput)
            setBoardDirection(directionInput)
            setBoardStation(stationInput)
            setBoardTime(nowTime)
            setBoardTrains(result.nextTrains)
            setBoardCancelled(cancelInput)
            setBoardCancelReason(cancelReasonInput.trim() || "運転取りやめ")
        }

        updateRealtimeBoard()

        const intervalId = window.setInterval(() => {
            updateRealtimeBoard()
        }, 1000)

        return () => {
            window.clearInterval(intervalId)
        }
    }, [
        isRealtime,
        stationInput,
        lineInput,
        directionInput,
        cancelInput,
        cancelReasonInput,
    ])

    const handleApproach = () => {
        let randomImage = approachImage

        while (randomImage === approachImage && approachImages.length > 1) {
            const randomIndex = Math.floor(Math.random() * approachImages.length)
            randomImage = approachImages[randomIndex]
        }

        setApproachImage(randomImage)
        setBoardMode("approach")
        setShowApproach(false)

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setShowApproach(true)
            })
        })
    }

    const handleWarning = () => {
        setBoardMode("warning")
        setShowApproach(false)
    }

    const handleScroll = () => {
        setBoardMode("scroll")
        setShowApproach(false)
    }

    const directionLabel = getDirectionLabel(
        typedTimetable,
        boardLine,
        boardDirection,
        boardStation
    )

    const result = getTrainLookupResult(
        typedTimetable,
        boardStation,
        boardTime,
        boardLine,
        boardDirection,
        2
    )

    const displayTrains = result.nextTrains.length > 0 ? result.nextTrains : boardTrains
    const isLastTrain = result.isLastTrain
    const lastTrainMinutes = result.lastTrainMinutes

    return (
        <main className="min-h-screen bg-black p-[16px]">
            <div className="flex flex-col gap-[16px]">
                <div className="w-[1200px] rounded-[8px] border border-white/20 bg-[#111] p-[20px]">
                    <div className="grid grid-cols-4 gap-[16px]">
                        <input
                            value={stationInput}
                            onChange={(e) => setStationInput(e.target.value)}
                            className="h-[44px] rounded-[6px] border border-white/20 bg-black px-[12px] text-white"
                            placeholder="駅名"
                        />

                        <input
                            type="time"
                            value={timeInput}
                            onChange={(e) => {
                                setTimeInput(e.target.value)
                                setIsRealtime(false)
                            }}
                            className="h-[44px] rounded-[6px] border border-white/20 bg-black px-[12px] text-white"
                        />

                        <select
                            value={lineInput}
                            onChange={(e) => setLineInput(e.target.value as LineName)}
                            className="h-[44px] rounded-[6px] border border-white/20 bg-black px-[12px] text-white"
                        >
                            <option value="琴平線">琴平線</option>
                            <option value="長尾線">長尾線</option>
                            <option value="志度線">志度線</option>
                        </select>

                        <select
                            value={directionInput}
                            onChange={(e) => setDirectionInput(e.target.value as Direction)}
                            className="h-[44px] rounded-[6px] border border-white/20 bg-black px-[12px] text-white"
                        >
                            <option value="上り">上り</option>
                            <option value="下り">下り</option>
                        </select>
                    </div>

                    <div className="mt-[16px] flex items-center gap-[12px]">
                        <button
                            type="button"
                            onClick={() => {
                                const next = !cancelInput
                                setCancelInput(next)
                                setBoardCancelled(next)
                                setBoardCancelReason(cancelReasonInput.trim() || "運転取りやめ")
                            }}
                            className={`h-[44px] rounded-[6px] border px-[20px] font-bold ${
                                cancelInput
                                    ? "border-red-500 bg-red-500 text-white"
                                    : "border-white/30 bg-black text-white"
                            }`}
                        >
                            {cancelInput ? "運転取りやめ中" : "運転取りやめ"}
                        </button>

                        <input
                            value={cancelReasonInput}
                            onChange={(e) => {
                                setCancelReasonInput(e.target.value)
                                if (cancelInput) {
                                    setBoardCancelReason(
                                        e.target.value.trim() || "運転取りやめ"
                                    )
                                }
                            }}
                            disabled={!cancelInput}
                            className={`h-[44px] flex-1 rounded-[6px] border px-[12px] text-white ${
                                cancelInput
                                    ? "border-white/20 bg-black"
                                    : "border-white/10 bg-[#1a1a1a] text-white/40"
                            }`}
                            placeholder="取りやめ理由を入力"
                        />
                    </div>

                    <div className="mt-[16px] flex items-center gap-[12px]">
                        <input
                            value={noticeText}
                            onChange={(e) => setNoticeText(e.target.value)}
                            className="h-[44px] flex-1 rounded-[6px] border border-white/20 bg-black px-[12px] text-white"
                            placeholder="警告文・流す文字を入力"
                        />

                        <button
                            onClick={handleWarning}
                            className="h-[44px] rounded-[6px] border border-yellow-500 bg-yellow-500 px-[20px] font-bold text-black"
                        >
                            全画面警告
                        </button>

                        <button
                            onClick={handleScroll}
                            className="h-[44px] rounded-[6px] border border-sky-400 bg-sky-400 px-[20px] font-bold text-black"
                        >
                            流れる文字
                        </button>
                    </div>

                    <div className="mt-[16px] flex items-center gap-[16px]">
                        <button
                            onClick={handleRun}
                            className="h-[44px] rounded-[6px] border border-white bg-white px-[20px] font-bold text-black"
                        >
                            表示更新
                        </button>

                        <button
                            onClick={handleRealtime}
                            className={`h-[44px] rounded-[6px] border px-[20px] font-bold ${
                                isRealtime
                                    ? "border-emerald-400 bg-emerald-400 text-black"
                                    : "border-emerald-400 bg-black text-emerald-400"
                            }`}
                        >
                            リアルタイム
                        </button>

                        <button
                            onClick={handleApproach}
                            className="h-[44px] rounded-[6px] border border-yellow-400 bg-yellow-400 px-[20px] font-bold text-black"
                        >
                            接近表示
                        </button>

                        <p className="text-[14px] text-white/70">
                            表示中：{boardLine} / {boardDirection} / {boardStation} / {boardTime}
                            {isRealtime ? " / リアルタイム中" : ""}
                            {boardCancelled ? ` / 運転取りやめ: ${boardCancelReason}` : ""}
                            {boardMode === "approach" ? " / 接近表示中" : ""}
                            {boardMode === "warning" ? " / 全画面警告表示中" : ""}
                            {boardMode === "scroll" ? " / 流れる文字表示中" : ""}
                            {isLastTrain ? " / 終電表示中" : ""}
                        </p>
                    </div>
                </div>

                <div className="relative h-[300px] w-[1200px] overflow-hidden rounded-[8px] bg-black outline outline-[6px] outline-white">
                  {isLastTrain && (
                      <Image
                          src="/images/kotoden/last_train1.png"
                          alt="last train background"
                          fill
                          className="object-cover object-[20%_25%] opacity-30 blur-[2px] pointer-events-none"
                          priority
                      />
                      
                  )}
                    {boardCancelled ? (
                        <SuspendedBoard reason={boardCancelReason} />
                    ) : boardMode === "warning" ? (
                        <WarningNotice
                            show={true}
                            text={noticeText}
                        />
                    ) : displayTrains.length > 0 ? (
                        <>
                            <LineHeader
                                lineText={boardLine}
                                destination={directionLabel}
                            />

                            <TrainHeader
                                leftMin={normalizeLeftMin(displayTrains[0].diffMin)}
                                arriveTime={displayTrains[0].departure}
                                stationNumber={getStationNumber(displayTrains[0].destination, boardLine)}
                                destination={displayTrains[0].destination}
                                lineName={boardLine}
                            />

                            {boardMode === "approach" ? (
                              <TrainApproach
                                  show={showApproach}
                                  imageSrc={approachImage}
                                  text="電車が参ります"
                              />
                          ) : boardMode === "scroll" ? (
                              <ScrollMessage
                                  text={noticeText}
                                  height={100}
                                  textSize={64}
                                  color="#FFE100"
                                  speed={120}
                                  show={true}
                              />
                          ) : isLastTrain ? (
                              <div className="relative flex h-[100px] w-[1200px] items-center justify-center overflow-hidden rounded-[6px]">
                                <div className="absolute inset-0 bg-black/40" />
                                  <p className="relative z-10 font-bold text-[56px] leading-none text-[#FF0000]">
                                      {directionLabel}の終電です。
                                  </p>
                              </div>
                          ) : displayTrains[1] ? (
                              <TrainHeader
                                  leftMin={normalizeLeftMin(displayTrains[1].diffMin)}
                                  arriveTime={displayTrains[1].departure}
                                  stationNumber={getStationNumber(
                                      displayTrains[1].destination,
                                      boardLine
                                  )}
                                  destination={displayTrains[1].destination}
                                  lineName={boardLine}
                              />
                          ) : null}
                        </>
                    ) : (
                        <SuspendedBoard reason="該当列車がありません" />
                    )}
                </div>
            </div>
        </main>
    )
}