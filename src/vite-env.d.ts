/// <reference types="vite/client" />


export type TableType = {
    _id: string
    number: number
    tag: string
    products: Item[]
    opened: string
    state: "open" | "paying" | "closed"
}

export type Item = {
    _id: string
    name: string
    price: number
    type: string
    amount?: number
}

export type sessionType = {
    _id: string
    role: string
    opened: string
    domain: string
}