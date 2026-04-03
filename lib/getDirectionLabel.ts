import type { Timetable, Direction } from "@/lib/timetableTypes"

type LineName = "琴平線" | "長尾線" | "志度線"

const terminalMap: Record<LineName, Record<Direction, string>> = {
    "琴平線": {
        "上り": "高松築港",
        "下り": "琴電琴平",
    },
    "長尾線": {
        "上り": "高松築港",
        "下り": "長尾",
    },
    "志度線": {
        "上り": "瓦町",
        "下り": "琴電志度",
    },
}

const majorStationsMap: Record<LineName, string[]> = {
    "琴平線": ["琴電琴平", "滝宮", "綾川", "仏生山", "瓦町", "片原町", "高松築港"],
    "長尾線": ["長尾", "学園通り", "瓦町", "片原町", "高松築港"],
    "志度線": ["琴電志度", "八栗", "琴電屋島", "瓦町"],
}

function displayStationName(name: string) {
    if (name === "琴電琴平") return "琴平"
    if (name === "琴電志度") return "志度"
    return name
}

export function getDirectionLabel(
    timetable: Timetable,
    line: LineName,
    direction: Direction,
    currentStation: string
) {
    const section = timetable.sections.find(
        (s) => s.line === line && s.direction === direction
    )

    if (!section) {
        return direction === "上り" ? "上り方面" : "下り方面"
    }

    const terminal = terminalMap[line][direction]
    const currentIndex = section.stations.indexOf(currentStation)
    const terminalIndex = section.stations.indexOf(terminal)

    if (currentIndex === -1 || terminalIndex === -1) {
        return `${displayStationName(terminal)}方面`
    }

    const start = Math.min(currentIndex, terminalIndex)
    const end = Math.max(currentIndex, terminalIndex)
    const stationsInRange = section.stations.slice(start, end + 1)

    const picked = stationsInRange
        .filter((station) => majorStationsMap[line].includes(station))
        .filter((station) => station !== currentStation)

    const terminalDisplayed = displayStationName(terminal)

    // 終着駅以外の主要駅を最大2つ取る
    const middleStations = picked
        .filter((station) => station !== terminal)
        .slice(0, 2)
        .map(displayStationName)

    // 終着駅は必ず最後に入れる
    const result = [...middleStations, terminalDisplayed]

    // 重複除去
    const uniqueResult = [...new Set(result)]

    return `${uniqueResult.join("・")}方面`
}