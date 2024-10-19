/// <reference types="vite/client" />


export type TableType = {
    _id: string
    name: string
    discount: number
    discountType: "percent" | "amount"
    products: Item[]
    opened: string[]
    payMethod: PayMethod[] | undefined
    state: "open" | "paying" | "closed" | "unnactive"
}
export type TableEvents = {
    _id?: string
    name?: string
    discount: number
    discountType: "percent" | "amount"
    products: Item[],
    opened: string[]
    total: string
    events: SingleEvent[]
    payMethod: PayMethod[] | undefined
    state: "open" | "paying" | "closed" | "unnactive"
}
export type SingleEvent = {
    important: boolean
    type: string
    comment: string
    timestamp: string
    _id?: string
    name?: string
    accepted?: boolean | undefined /// only for notification events
    products?: Item[] /// only for notification events
    owner: string
    owner_name?: string /// only for notification events
}

export type HistorialTableType = {
    _id: string
    name: string
    historial: TableEvents[]
}
export type TablePlaceType = {
    _id: string
    name: string
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
    comment?:string 
    presets?: string[]
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
    animations: boolean
    mainColor: string
    topBarButtons: {
        [key: string]: boolean
    }
    prodsAsList: boolean
    orderedLists: boolean
    prodsInEditorAsList: boolean,
    map: {
        x: number
        y: number
        zoom: number
        align: boolean
    }
    miniMapOrder: "abc"|"abc-r"|"def"|"def-r"
    prodListOrder: "abc"|"abc-r"|"def"|"def-r"
    prodEditorOrder: "abc"|"abc-r"|"def"|"def-r"
}


export type PayMethod = {
    type: string
    amount: string
}


export type router = {
    [key:string] : any
}


export type alertType = {
    _id: string
    title: string
    icon: "check" | "xmark" | "warn"
    content: string
}