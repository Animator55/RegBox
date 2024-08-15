/// <reference types="vite/client" />


export type TableType = {
    _id: string
    number: string
    discount: number
    tag: string
    products: Item[]
    opened: string[]
    state: "open" | "paying" | "closed" | "unnactive"
}
export type TableEvents = {
    opened: string[]
    state: "open" | "paying" | "closed" | "unnactive"
    total: string
    discount: number
    events: {
        important: boolean
        type: string
        comment: string
        timestamp: string
    }[]
}

export type HistorialTable = {
    _id: string
    number: string
    historial: TableEvents[]
}
export type TablePlaceType = {
    _id: string
    number: string
    coords: {
        x: number
        y: number
    }
    size: {
        x: number
        y: number
    }
}

export type Item = {
    _id: string
    name: string
    price: number
    type: string
    amount?: number
    header?: boolean
}

export type sessionType = {
    _id: string
    name: string
    role: string
    opened: string
    domain: string
    url: string
}
export type userType = {
    _id: string
    role: string
    name: string
    password: string
}

export type configType = {
    prodsAsList: boolean
    orderedLists: boolean
    prodsInEditorAsList: boolean,
    domain: {
        name: string,
    },
    map: {
        x: number
        y: number
        zoom: number
    }
}