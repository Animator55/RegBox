import { HistorialTableType, Item, sessionType, SingleEvent, userType } from "../vite-env";

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

    session.domain = domain
    session.url = domains[domainIndex].url

    let userIndex = selectUser(domainIndex, user)
    if(userIndex === -1 || domains[domainIndex].users[userIndex].password !== password) return {type: "error", data: "El usuario y la contraseña no coinciden"}

    session.name = user
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

export const getHistorialGeneral = (filter?: string, filterValue?: string)=>{
    let array: SingleEvent[]= []

    array = [...defaultNotifications]
    return array
}
