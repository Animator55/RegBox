import { Item, sessionType, userType } from "../vite-env";

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