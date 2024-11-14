import { defaultConfig } from "../defaults/config";
import { products, products1, productsType } from "../defaults/products";
import {  configType, HistorialTableType, sessionType, SingleEvent, TableEvents, TablePlaceType, TableType, userType } from "../vite-env";
import { calculateTotal } from "./calculateTotal";
import fixNum from "./fixDateNumber";

export type domainType = {
    _id: string
    name: string
    url: string
    users: userType[]
    roles: string[]
    products: string[]
    map: any
}
const productsD = [
    {
        _id: "prods1",
        _domId : "asfasgadeyhdfshj",
        list : products1,
    },
    {
        _id: "prods2",
        _domId : "fsfsd",
        list : products,
    },
]
let domains: domainType[] = [
    {
        _id: "gadeyhdfshj",
        name: "CLUB VERMUT",
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
        _id: "asfasgadeyhdfshj",
        name: "TestDomain",
        url: "",
        users: [
            {_id: "trfghdg", name: "Caja", role: "main", password: "1234"}
        ],
        roles: ["main", "pawn", "kitchen"],
        products: ["prods1"],
        map: ""
    },
    {
        _id: "fsfsd",
        name: "TestDomain2",
        url: "",
        users: [
            {_id: "gnidkasgm", name: "Caja", role: "main", password: "1234"}
        ],
        roles: ["main", "pawn", "kitchen"],
        products: ["prods2"],
        map: ""
    },
]

export const getDomainData =(dom_id: string)=>{
    let prods: productsType = {}
    let config: configType = defaultConfig
    let tablePlaces: TablePlaceType[] = []
    for(let i=0; i<productsD.length; i++){
        if(productsD[i]._domId === dom_id ){
            prods = productsD[i].list
            break
        }
    }
    return {prods, config, tablePlaces}
}

export const selectDomainById = (dom_id: string, returnIndex?: boolean): domainType | number | undefined=> { // returns domain
    let index = -1
    for(let i=0; i<domains.length; i++) {
        if(domains[i]._id === dom_id) {index = i; break}
    }

    if(index === -1) return
    return returnIndex ? index : domains[index]
}
const selectDomain = (dom: string): number=> { /// returns index
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

const checkUser = (user: string, password: string | undefined, domain: string): {type: "error" | "success"| "denied", data: any}=>{
    let domainIndex = password ? selectDomain(domain) : selectDomainById(domain, true)
    if(!domainIndex || typeof domainIndex !== "number" || domainIndex === -1) return {type: "error", data: "Dominio no encontrado"}


    let userIndex = selectUser(domainIndex, user)
    if(userIndex === -1 || 
    (password && domains[domainIndex].users[userIndex].password !== password)) return {type: "error", data: "El usuario y la contraseña no coinciden"}

    return {type: "success", data: {domainIndex, userIndex}}
}

export function generateSession (user: string, password: string, domain: string): {type: string, data: any} {
    let session: sessionType = {_id: "", name: "", role: "", opened: "", domain: "", url: ""}
    let check = checkUser(user, password, domain)
    if(check.type === "error" || typeof check.data === "string") return check

    let domainIndex = check.data.domainIndex
    let userIndex = check.data.userIndex

    session.domain = domains[domainIndex]._id
    session.url = domains[domainIndex].url

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
    // {   
    //     accepted: undefined,
    //     important: false,
    //     type: "products",
    //     comment: `Añadido: 2 Ojo Relleno, 2 Bao Bun, 2 Ojo Relleno, 2 Bao Bun`,
    //     products: [
    //         {
    //           "_id": "p.000",
    //           "name": "Ojo de Bife",
    //           "price": 9800,
    //           "type": "Principal",
    //           "amount": 2
    //         },
    //         {
    //           "_id": "e.007",
    //           "name": "Bao Bun",
    //           "price": 4300,
    //           "type": "Entrada",
    //           "amount": 2
    //         }
    //     ],
    //     timestamp: "19:50",
    //     _id: "yrfyhh",
    //     number: "3",
    //     owner: "pawn",
    //     owner_name: "Tepo"
    // },
    // {
    //     accepted: undefined,
    //     important: false,
    //     type: "products",
    //     comment: `Añadido: 1 Tortilla de Papas, 2 Empanadas de Osobuco X2`,
    //     products: [
    //         {
    //           "_id": "e.000",
    //           "name": "Tortilla de Papa",
    //           "price": 4750,
    //           "type": "Entrada",
    //           "amount": 1
    //         },
    //         {
    //           "_id": "e.005",
    //           "name": "Empanadas de Osobuco X2",
    //           "price": 1400,
    //           "type": "Entrada",
    //           "amount": 2
    //         }
    //     ],
    //     timestamp: "18:35",
    //     _id: "yrfyhh",
    //     number: "3",
    //     owner: "pawn",
    //     owner_name: "Pepito"
    // },
]

export const getNotificationsGeneral = ()=>{
    let array: SingleEvent[]= []

    array = [...defaultNotifications]
    return array
}

export const back_addEventToHistorial = (
    prevData: HistorialTableType,
    entry: string, 
    comment: string, 
    importancy: boolean, 
    value?: any, 
    table?: TableType, 
    discount?: number, 
    discountType?: "percent" | "amount"
)=>{
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
    else if(entry === "discount"){resultChange.discount = discount!;resultChange.discountType = discountType!}
    else if (entry === "state" && value) {
        resultChange.state = value
        if (value === "unnactive" && table) {
            let total = calculateTotal(table.products, 0, table.discountType)
            resultChange.total = total
            resultChange.payMethod = table.payMethod
            resultChange.products = [...table.products]
            resultChange.discount = discount!
            resultChange.discountType = discountType!
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
        comment: isSwitch ? ("Se cambió la mesa a " + newTable.name) : ("Se crea la mesa " + newTable.name),
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
                comment: isSwitch ? ("Se cambió la mesa a " + newTable.name) : ("Se crea la mesa " + newTable.name),
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
        discountType: "percent",
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
    // let alert = {
    //     _id: "gkimnasgkia",
    //     title: "Error de conexión",
    //     content: "La conexión con base de datos falló y los datos solo se cargaron en el navegador local.",
    //     icon: "xmark"
    // }
    // return alert
}
export const back_setTablesPlaces = (tblPlaces: TablePlaceType[])=>{
    tblPlaces
    // return null
    const responses = {
        "success": {
            title: "Edición de Mapa Exitosa",
            content: "Las mesas fueron editadas y actualizadas en la base de datos con éxito. Se mostrará el nuevo mapa editado.",
            icon: "check",
            _id: `${Math.random()}`
        }, 
        "error": {
            title: "Edición de Mapa Fallida",
            content: "La conexión falló y el mapa no fue editado, el mismo se mostrará con su estado anterior para evitar errores de sincronización.",
            icon: "xmark",
            _id: `${Math.random()}`
        },
        "denied": {
            title: "Edición de Mapa Denegada",
            content: "No tienes permitido cambiar el mapa en esta sesión y el mismo no fue editado.",
            icon: "xmark",
            _id: `${Math.random()}`
        }
    } 
    let stor = window.localStorage.getItem("RegBoxSession")
    if (!stor || stor === "") return responses["error"]
    let session = JSON.parse(stor) as sessionType
    let result = checkUser(session.name, undefined, session.domain)
    
    let alert = responses[result.type]
    return alert
}


export const back_setProducts = (prods: productsType) =>{
    prods;
    // return null
    const responses = {
        "success": {
            title: "Productos editados Exitosamente",
            content: "Los productos fueron editados y actualizados en la base de datos con éxito. Se mostrará la nueva lista editada.",
            icon: "check",
            _id: `${Math.random()}`
        }, 
        "error": {
            title: "Edición de productos Fallida",
            content: "La conexión falló y los productos no fueron editados, la lista se mostrará con su estado anterior para evitar errores de sincronización.",
            icon: "xmark",
            _id: `${Math.random()}`
        },
        "denied": {
            title: "Edición de productos Denegada",
            content: "No tienes permitido cambiar productos en esta sesión y los productos no fueron editados.",
            icon: "xmark",
            _id: `${Math.random()}`
        }
    } 
    let stor = window.localStorage.getItem("RegBoxSession")
    if (!stor || stor === "") return responses["error"]
    let session = JSON.parse(stor) as sessionType
    let result = checkUser(session.name, undefined, session.domain)
    let alert = responses[result.type]
    return alert
}
