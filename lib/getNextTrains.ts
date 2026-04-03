import type { Timetable } from "@/lib/timetableTypes"

export type NextTrain = {
    trainId: string
    departure: string
    destination: string
    diffMin: number
}

export type TrainLookupResult = {
    nextTrains: NextTrain[]
    isLastTrain: boolean
    lastTrainMinutes: number | null
}

const SERVICE_DAY_BORDER_MINUTES = 3 * 60

function toMinutes(time: string): number {
    if (!time) return NaN

    if (!time.includes(":") && time.length === 4) {
        const h = Number(time.slice(0, 2))
        const m = Number(time.slice(2, 4))
        return h * 60 + m
    }

    const [h, m] = time.split(":").map(Number)
    return h * 60 + m
}

function toComparableMinutes(time: string): number {
    const minutes = toMinutes(time)

    if (Number.isNaN(minutes)) return NaN

    if (minutes < SERVICE_DAY_BORDER_MINUTES) {
        return minutes + 24 * 60
    }

    return minutes
}

function getDiffMinutes(now: string, target: string): number {
    const nowMin = toComparableMinutes(now)
    const targetMin = toComparableMinutes(target)

    if (Number.isNaN(nowMin) || Number.isNaN(targetMin)) return NaN

    return targetMin - nowMin
}

export function getNextTrains(
    timetable: Timetable,
    station: string,
    now: string,
    line: string,
    direction: "上り" | "下り",
    limit: number = 2
): NextTrain[] {
    const section = timetable.sections.find(
        (s) => s.line === line && s.direction === direction
    )

    if (!section) return []

    const allTrains = section.LAST_TRAIN
        ? [...section.trains, section.LAST_TRAIN]
        : section.trains

    return allTrains
        .map((train) => {
            const departure = train.times[station]

            if (!departure) return null

            const diffMin = getDiffMinutes(now, departure)

            if (Number.isNaN(diffMin) || diffMin < 0) return null

            return {
                trainId: train.trainId,
                departure,
                destination: train.destination,
                diffMin,
            }
        })
        .filter((train): train is NextTrain => train !== null)
        .sort((a, b) => a.diffMin - b.diffMin)
        .slice(0, limit)
}

export function getTrainLookupResult(
    timetable: Timetable,
    station: string,
    now: string,
    line: string,
    direction: "上り" | "下り",
    limit: number = 2
): TrainLookupResult {
    const section = timetable.sections.find(
        (s) => s.line === line && s.direction === direction
    )

    if (!section) {
        return {
            nextTrains: [],
            isLastTrain: false,
            lastTrainMinutes: null,
        }
    }

    const nextTrains = getNextTrains(
        timetable,
        station,
        now,
        line,
        direction,
        limit
    )

    const lastTrain = section.LAST_TRAIN
    const lastTrainDeparture = lastTrain?.times?.[station]

    if (!lastTrain || !lastTrainDeparture || nextTrains.length === 0) {
        return {
            nextTrains,
            isLastTrain: false,
            lastTrainMinutes: null,
        }
    }

    const lastTrainMinutes = getDiffMinutes(now, lastTrainDeparture)
    const isLastTrain = nextTrains[0]?.trainId === "LAST_TRAIN"

    return {
        nextTrains,
        isLastTrain,
        lastTrainMinutes: lastTrainMinutes >= 0 ? lastTrainMinutes : null,
    }
}