export type Direction = "上り" | "下り"

export type TrainStop = {
    station: string
    time: string
}

export type Train = {
    trainId: string
    origin: string
    destination: string
    stopList: TrainStop[]
    times: Partial<Record<string, string>>
}

export type Section = {
    line: string
    direction: Direction
    route: string
    stationCount: number
    trainCount: number
    stations: string[]
    trains: Train[]
    LAST_TRAIN?: Train
    notes?: string[]
}

export type Timetable = {
    sections: Section[]
}