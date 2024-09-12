import {  HistorialTableType, Item, sessionType, SingleEvent, TableEvents, TableType, userType } from "../vite-env";
import { calculateTotal } from "./calculateTotal";
import fixNum from "./fixDateNumber";

type domainType = {
    _id: string
    name: string
    url: string
    users: userType[]
    roles: string[]
    products: Item[]
    map: any
}

let domains: domainType[] = [
    {
        _id: "gadeyhdfshj",
        name: "domain-1",
        url: "",
        users: [
            {_id: "gnidkasgm", name: "Caja", role: "main", password: "1234"},
            {_id: "fastgdaghds", name: "Peon-1", role: "pawn", password: "123"}
        ],
        roles: ["main", "pawn", "kitchen"],
        products: [],
        map: ""
    },
    {
        _id: "gadeyhdfshj",
        name: "domain-2",
        url: "",
        users: [],
        roles: ["main", "pawn", "kitchen"],
        products: [],
        map: ""
    },
]

const selectDomain = (dom: string)=> {
    let index = -1
    for(let i=0; i<domains.length; i++) {
        if(domains[i].name === dom) {index = i; break}
    }

    return index
}

const selectUser = (domIndex: number, username: string)=>{
    let index = -1
    let users = domains[domIndex].users

    for(let i=0; i<users.length; i++) {
        if(users[i].name === username) {index = i; break}
    }

    return index
}

export function checkUser (user: string, password: string, domain: string): {type: string, data: any} {
    let session: sessionType = {_id: "", name: "", role: "", opened: "", domain: "", url: ""}

    let domainIndex = selectDomain(domain)
    if(domainIndex === -1) return {type: "error", data: "Dominio no encontrado"}

    session.domain = domains[domainIndex]._id
    session.url = domains[domainIndex].url

    let userIndex = selectUser(domainIndex, user)
    if(userIndex === -1 || domains[domainIndex].users[userIndex].password !== password) return {type: "error", data: "El usuario y la contraseña no coinciden"}

    let date = new Date()
    session.name = user
    let hour = fixNum(date.getHours()) + ":" + fixNum(date.getMinutes())
    let day = fixNum(date.getDate()) + "/" + fixNum(date.getMonth() + 1) + "/" + date.getFullYear()
    session.opened = `${hour} - ${day}`
    session.role = domains[domainIndex].users[userIndex].role
    session._id = domains[domainIndex].users[userIndex]._id

    return {type: "success", data: session} 
}

const defaultNotifications: SingleEvent[] = [
    {   
        accepted: undefined,
        important: false,
        type: "products",
        comment: `Añadido: 2 Ojo Relleno, 2 Bao Bun, 2 Ojo Relleno, 2 Bao Bun`,
        products: [
            {
              "_id": "p.000",
              "name": "Ojo de Bife",
              "price": 9800,
              "type": "Principal",
              "amount": 2
            },
            {
              "_id": "e.007",
              "name": "Bao Bun",
              "price": 4300,
              "type": "Entrada",
              "amount": 2
            }
        ],
        timestamp: "19:50",
        _id: "yrfyhh",
        number: "3",
        owner: "pawn",
        owner_name: "Tepo"
    },
    {
        accepted: undefined,
        important: false,
        type: "products",
        comment: `Añadido: 1 Tortilla de Papas, 2 Empanadas de Osobuco X2`,
        products: [
            {
              "_id": "e.000",
              "name": "Tortilla de Papa",
              "price": 4750,
              "type": "Entrada",
              "amount": 1
            },
            {
              "_id": "e.005",
              "name": "Empanadas de Osobuco X2",
              "price": 1400,
              "type": "Entrada",
              "amount": 2
            }
        ],
        timestamp: "18:35",
        _id: "yrfyhh",
        number: "3",
        owner: "pawn",
        owner_name: "Pepito"
    },
]

export const getNotificationsGeneral = ()=>{
    let array: SingleEvent[]= []

    array = [...defaultNotifications]
    return array
}

export const back_addEventToHistorial = (prevData: HistorialTableType,entry: string, comment: string, importancy: boolean, value?: any, table?: TableType, discount?: number)=>{
    let prev = prevData
    let current = prev.historial[prev.historial.length - 1]
    let date = new Date()
    let newEvent: SingleEvent = {
        type: entry,
        important: importancy,
        comment: comment,
        timestamp: fixNum(date.getHours()) + ":" + fixNum(date.getMinutes()) + ":" + fixNum(date.getSeconds()),
        owner: "main"
    }
    let resultChange = { ...current, events: [...current.events, newEvent] }
    if(entry === "products" && table) {
        resultChange.products = [...table.products]
    }
    else if(entry === "discount")resultChange.discount = discount!
    else if (entry === "state" && value) {
        resultChange.state = value
        if (value === "unnactive" && table) {
            let total = calculateTotal(table.products, 0)
            resultChange.total = total
            resultChange.payMethod = table.payMethod
            resultChange.products = [...table.products]
            resultChange.discount = discount!
        }
    }

    prev.historial = [...prev.historial.map((el, i) => {
        if (i !== prev.historial.length - 1) return el
        else return resultChange
    }) as TableEvents[]]

    return prev
}

export const back_addTableOrSwitch_Historial = (prevData:HistorialTableType,newTable: TableType, isSwitch: boolean, prevId?: string)=>{
    let date = new Date()
    let storage = window.localStorage
    let prev = prevData
    
    let initialEvents: SingleEvent[] = [{
        important: true,
        type: "state",
        comment: isSwitch ? ("Se cambió la mesa a " + newTable.number) : ("Se crea la mesa " + newTable.number),
        timestamp: newTable.opened[0] + ":" + fixNum(date.getSeconds()),
        owner: "main"
    }]
    let sJSONStr = undefined
    if (isSwitch && prevId) {
        let prevTable: HistorialTableType = JSON.parse(storage.getItem("RegBoxID:"+prevId) as string) 
        initialEvents = [
            ...prevTable.historial[prevTable.historial.length-1].events, {
                important: true,
                type: "state",
                comment: isSwitch ? ("Se cambió la mesa a " + newTable.number) : ("Se crea la mesa " + newTable.number),
                timestamp: newTable.opened[0] + ":" + fixNum(date.getSeconds()),
                owner: "main"
            }
        ]
        let splicedHistorial = prevTable.historial.filter((el,i)=>{
            if(i !== prevTable.historial.length-1)return el
        })
        prevTable.historial = splicedHistorial
        sJSONStr = JSON.stringify(prevTable)
    }
    let newEntrie: TableEvents = {
        opened: newTable.opened,
        state: "open",
        total: "$0",
        payMethod: undefined,
        products: newTable.products,
        discount: 0,
        events: initialEvents
    }
    prev.historial =[...prev.historial, newEntrie]
    let JSONStr = JSON.stringify(prev)
    let result = {
        JSONStr,
        sJSONStr
    }
    return result
}

export const setTableHistorial = (table_id:string, historialJSONString: string)=>{
    table_id
    historialJSONString

    return null
    // let alert: alertType = {
    //     _id: "gkimnasgkia",
    //     title: "Error de conexión",
    //     content: "La conexión con base de datos falló y los datos solo se cargaron en el navegador local.",
    //     icon: "xmark"
    // }
    // return alert
}
