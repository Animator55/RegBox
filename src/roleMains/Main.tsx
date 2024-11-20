import React from 'react'
import TopBar from '../components/TopBar'
import TableCount from '../components/TableCount'
import ProdAndMap from '../components/ProdAndMap'
import { HistorialTableType, Item, TablePlaceType, TableType, configType, router } from '../vite-env'
import getTableData from '../logic/getTableData'
import fixNum from '../logic/fixDateNumber'
import { productsType } from '../defaults/products'
import ProductEditor from '../components/ProductEditor'
import Notifications from '../components/Notifications'
import ConfigurationComp from '../components/Configuration'
import DownloadTsObject from '../logic/download'
import { checkImportancy } from '../logic/checkChangeImportancy'
import HistorialTableComp from '../components/HistorialTable'
import CloseSession from '../components/pops/CloseSession'
import Toast from '../components/pops/Toast'
import { back_addEventToHistorial, back_addTableOrSwitch_Historial, back_setProducts, back_setTablesPlaces, setTableHistorial } from '../logic/API'
import AccountPop from '../components/pops/AccountPop'
import AccountInfo from '../components/pops/AccountInfo'
import { defaultConfig } from '../defaults/config'

type Props = {
    initialData?: {
        config: configType
        products: productsType
        tablePlaces: TablePlaceType[]
    }
    logout: Function
    initialHistorial: TableType[]
}


export const Configuration = React.createContext({
    config: {
        animations: true,
        blur: false,
        mainColor: "",
        topBarButtons: {
            "notifications": true,
            "products": true,
            "historial": true,
            "information": false,
            "configuration": false,
            "download": false,
            "help": false,
            "logout": true,
        },
        orderedLists: true,
        prodsAsList: true,
        prodsInEditorAsList: true,
        map: {
            zoom: 1,
            x: 0,
            y: 0,
            align: true
        },
        miniMapOrder: "def",
        prodListOrder: "def",
        prodEditorOrder: "def",
    } as configType, setConfig: (val: configType) => { console.log(val) }
})
export const Products = React.createContext({
    list: {} as productsType, setProds: (val: productsType, someEdit: boolean) => { console.log(val, someEdit) }
})
export const ToastActivation = React.createContext((val: {
    title: string
    content: string
    icon: string
    _id: string
}) => { console.log(val) })

export const TablesPlaces = React.createContext({
    tables: [] as TablePlaceType[],
    set: (val: TablePlaceType[]) => { console.log(val) },
})



let lastChanged = ""
let productPickerScroll = 0

let massive: { table_id: string, value: Item[], comment: string } | undefined = undefined ///when massiveChange happens and the table is not created yet. 
export default function Main({ initialData, initialHistorial, logout }: Props) {
    const [config, setConfig] = React.useState(initialData !== undefined ? initialData.config !== undefined ? initialData.config : defaultConfig : defaultConfig)
    const setToastAlert = (val: {
        title: string
        content: string
        icon: string
        _id: string
    }) => {
        let container = document.querySelector(".toast-container")
        if (!container) return

        const colorSelector: router = {
            "warn": "var(--corange)",
            "xmark": "var(--cred)",
            "check": "var(--cgreen)",
        }
        const iconSelector: router = {
            "warn": '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="triangle-exclamation" class="svg-inline--fa fa-triangle-exclamation " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 32c14.2 0 27.3 7.5 34.5 19.8l216 368c7.3 12.4 7.3 27.7 .2 40.1S486.3 480 472 480H40c-14.3 0-27.6-7.7-34.7-20.1s-7-27.8 .2-40.1l216-368C228.7 39.5 241.8 32 256 32zm0 128c-13.3 0-24 10.7-24 24V296c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm32 224a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"></path></svg>',
            "xmark": '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-xmark" class="svg-inline--fa fa-circle-xmark " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM175 175c9.4-9.4 24.6-9.4 33.9 0l47 47 47-47c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-47 47 47 47c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-47-47-47 47c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l47-47-47-47c-9.4-9.4-9.4-24.6 0-33.9z"></path></svg>',
            "check": '<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle-check" class="svg-inline--fa fa-circle-check " role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM369 209L241 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L335 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"></path></svg>',
        }

        let toast = document.createElement("section");
        toast.innerHTML = `<header style="color: ${colorSelector[val.icon]};">
            ${iconSelector[val.icon]}
            <h3>${val.title}</h3>
            </header>
        <p>${val.content}</p>`
        toast.className = "toast"
        container.appendChild(toast)
        setTimeout(() => {
            if (toast) toast.remove()
        }, 3300)
    }

    const setConfigHandle = (val: configType) => {
        setConfig(val)
    }

    const [ProductsState, setProdsState] = React.useState<productsType>(initialData === undefined ? {} : initialData.products)

    const [tablesPlacesPH, setTablesPlaces] = React.useState<TablePlaceType[]>(initialData !== undefined ? initialData.tablePlaces !== undefined ? initialData.tablePlaces : [] : [])

    const [tables, setTables] = React.useState<TableType[]>([])
    const [current, setCurrent] = React.useState<string>()
    const [popUp, setCurrentPop] = React.useState({ pop: "", initialPage: "" })

    const [selectedPhase,setSelectedPhase] = React.useState<number>(0)

    const close = () => { setCurrentPop({ pop: "", initialPage: "" }) }
    const createTable = (id: string) => {
        let date = new Date()
        let data = getTableData(id, tablesPlacesPH)
        if (!data) return false
        let hour = fixNum(date.getHours()) + ":" + fixNum(date.getMinutes())
        let day = fixNum(date.getDate()) + "/" + fixNum(date.getMonth() + 1) + "/" + date.getFullYear()

        let opened = [`${hour}`, ` ${day}`]
        let newTable: TableType = {
            _id: data._id,
            name: data.name,
            discount: 0,
            discountType: "percent",
            products: [[]],
            opened: opened,
            payMethod: undefined,
            state: "open",
        }
        setTables([...tables, newTable])
        addTableToHistorial(newTable, false)
        return true
    }
    const setCurrentHandler = (id: string) => {
        let index = -1
        for (let i = 0; i < tables.length; i++) {
            if (tables[i]._id === id) { index = i; break }
        }
        if (index !== -1) setCurrent(id)
            else {
        let result = createTable(id)
        if (result) setCurrent(id)
        }
        setSelectedPhase(0)
    }

    const addTableToHistorial = (newTable: TableType, isSwitch: boolean, prevId?: string) => {
        let storage = window.localStorage
        let testVal = storage.getItem("RegBoxID:" + newTable._id)
        let prevData: HistorialTableType = testVal ? JSON.parse(testVal) as HistorialTableType : { _id: newTable._id, name: newTable.name, historial: [] }

        let { JSONStr, sJSONStr } = back_addTableOrSwitch_Historial(prevData, newTable, isSwitch, prevId)
        if (sJSONStr) {
            storage.setItem("RegBoxID:" + prevId, sJSONStr)
            let result = setTableHistorial(newTable._id, sJSONStr)

            if (result) setToastAlert(result)
        }
        storage.setItem("RegBoxID:" + newTable._id, JSONStr)
        let result = setTableHistorial(newTable._id, JSONStr)

        if (result) setToastAlert(result)
    }

    const addEventToHistorial = (table_id: string, entry: string, comment: string, importancy: boolean, value?: any, table?: TableType, discount?: number, discountType?: "percent" | "amount") => {
        let storage = window.localStorage
        let testVal = storage.getItem("RegBoxID:" + table_id)
        if (!testVal) return
        let prevData: HistorialTableType = JSON.parse(testVal) as HistorialTableType
        if (prevData.historial.length === 0) return

        /// returns modified tableHistorial
        let prev = back_addEventToHistorial(prevData, entry, comment, importancy, value, table, discount, discountType)

        let JSONStr = JSON.stringify(prev)
        storage.setItem("RegBoxID:" + table_id, JSON.stringify(prev))
        let result = setTableHistorial(table_id, JSONStr)

        if (result) setToastAlert(result)
    }

    const EditTable = (table_id: string, entry: string, value: any, comment: string, discountTypeChange?: "percent" | "amount") => {
        let table
        for (let i = 0; i < tables.length; i++) {
            if (tables[i]._id === table_id) table = tables[i]
        }
        if (!table) return

        let isNotProducts = entry !== "products"
        if (entry === "switch") {/// if switch tables
            let [id, name] = value.split("/")
            let newTable = { ...table, _id: id, name: name }
            addTableToHistorial(newTable, true, table._id)
            setTables([...tables.filter(el => { if (el._id !== table._id) return el }), newTable])
            setCurrent(id)
        }
        ///if is deleting table => after closing table, it must return to "unnactive" state to repeat the process
        else if (entry === "state" && value === "unnactive") {
            addEventToHistorial(table_id, entry, comment, checkImportancy(entry), value, table, table.discount)
            setTables([...tables.filter(el => { if (el._id !== table._id) return el })])
            setCurrent(undefined)
        }
        ///if is only changing any entry
        else if (table.state !== "closed" && table.state !== "unnactive") {
            if (entry === "discount" && discountTypeChange) { // edit discount and its type
                addEventToHistorial(table_id, entry, comment, checkImportancy(entry), value, undefined, value, discountTypeChange)
                setTables([
                    ...tables.filter(el => { if (el._id !== table._id) return el }),
                    { ...table, [entry]: value, discountType: discountTypeChange }
                ])
            }
            else {
                addEventToHistorial(table_id, entry, comment, checkImportancy(entry), isNotProducts ? value : undefined, entry === "products" ? { ...table, products: value } : undefined, entry === "discount" ? value : undefined)
                setTables([
                    ...tables.filter(el => { if (el._id !== table._id) return el }),
                    { ...table, [entry]: value }
                ])
            }
        }
        else if (table.state === "closed" && entry === "payMethod") {
            addEventToHistorial(table_id, entry, comment, true, undefined, undefined)
            setTables([
                ...tables.filter(el => { if (el._id !== table._id) return el }),
                { ...table, [entry]: value }
            ])
        }
    }
    const EditMassiveTable = (table_id: string, value: Item[], comment: string) => {
        let table
        for (let i = 0; i < tables.length; i++) {
            if (tables[i]._id === table_id) table = tables[i]
        }
        if (!table || true) return /// EDIT MASIVE TO LATER

        if (table.state === "closed" || table.state === "unnactive") return

        let array = [...table.products]
        for (let i = 0; i < value.length; i++) {
            let newItem = value[i]

            /// search if new item already exists
            let index = -1
            for (let j = 0; j < array.length; j++) {
                if (newItem._id === array[j]._id) {
                    index = j
                    break
                }
            }
            if (index === -1) array = [...array, newItem]
            else array = array.map((el, j) => {
                if (j === index) return { ...el, amount: el.amount! + newItem.amount! }
                else return el
            })
        }
        let editedTable = { ...table, products: array }

        addEventToHistorial(table_id, "products", comment, false, undefined, editedTable)
        setTables([
            ...tables.filter(el => { if (el._id !== table._id) return el }),
            editedTable
        ])

    }

    const EditMassiveTableHandle = (table_id: string, value: Item[], comment: string) => {
        let table
        for (let i = 0; i < tables.length; i++) {
            if (tables[i]._id === table_id) table = tables[i]
        }
        if (!table) {
            let result = createTable(table_id)
            if (result) massive = { table_id, value, comment }
        }
        else EditMassiveTable(table_id, value, comment)
    }


    const editProdsHandle = (prods: productsType, someEdit: boolean) => {
        ///send to db and obtain results

        if (!someEdit) return
        let result = back_setProducts(prods)

        if (result) setProdsState(prods)
        setToastAlert(result)
    }

    let currentTableData: undefined | TableType
    for (let i = 0; i < tables.length; i++) {
        if (tables[i]._id === current) { currentTableData = tables[i]; break }
    }


    const logout_handler = () => {
        if (tables.length !== 0) {
            setToastAlert({
                _id: `${Math.random()}`, title: "Error al cerrar sesión",
                content: "Cierra y cobra todas las mesas para cerrar la sesión.",
                icon: "warn"
            })
        }
        else logout()
    }

    let tablesMin = tables.map(tbl => {
        return { _id: tbl._id, name: tbl.name, state: tbl.state }
    })

    const addItem = (item: Item, value?: 1 | -1, phasedef?: number) => {
        if (!currentTableData) return
        let phase = phasedef !== undefined ? phasedef : selectedPhase
        let prods = currentTableData.products[phase]

        let index = -1
        for (let i = 0; i < prods.length; i++) if (prods[i]._id === item._id) { index = i; break }

        let amount = value !== undefined ? value : 1
        let word = amount === 1 ? "Añadido" : "Subtraido"
        lastChanged = item._id
        productPickerScroll = value !== undefined ? 0 : document.getElementById("product-picker")?.scrollTop!

        if (item.amount && (item.amount + amount) <= 0) EditTable(
            currentTableData._id,
            "products",
            Object.values({
                ...currentTableData.products, [phase]: prods.filter(el => {
                    if (el._id !== item._id) return el
                })
            }),
            "Eliminado " + item.name + " (" + item._id + ")")
        else if (index === -1 && !prods[index]) EditTable(
            currentTableData._id,
            "products",
            Object.values({ ...currentTableData.products, [phase]: [...prods, { ...item, amount: amount }] })
            , "Añadido 1 de " + item.name + " (" + item._id + ")")
        else EditTable(currentTableData?._id, "products",
            Object.values({
                ...currentTableData.products, [phase]: prods.map(el => {
                    if (el._id === item._id) return { ...item, amount: prods[index].amount! + amount }
                    else return el
                })
            }), word + "1 de " + item.name + " (" + item._id + ")")
    }
    const managePhase = (index: number, create: boolean) => {
        if (!currentTableData) return
        if (create) EditTable(currentTableData._id, "products",
            [...currentTableData.products, []],
            ("Añadida la fase " + currentTableData.products.length)
        )
        else EditTable(currentTableData._id, "products",
            currentTableData.products.filter((el, i)=>{if(i!==index)return el}),
            ("Añadida la fase " + currentTableData.products.length)
        )
    }

    React.useEffect(() => {
        if (initialData !== undefined) {
            if (initialHistorial) setTables(initialHistorial)
            setProdsState(initialData.products)
            setTablesPlaces(initialData.tablePlaces)
            setConfig(initialData.config)
            setToastAlert({
                title: "Datos iniciales cargados",
                content: "Los datos vinculados con esta cuenta o datos locales fueron cargados exitosamente.",
                icon: "check",
                _id: `${Math.random()}`
            })
        }
    }, [initialData])
    React.useEffect(() => {
        if (lastChanged !== "") {
            let item = document.getElementById(lastChanged+"phase:"+selectedPhase)
            lastChanged = ""
            if (!item) return
            item.classList.add("added")
            let ul = item.parentElement
            if (!ul) return
            ul.scrollTo({ top: item.offsetTop - 211 })
        }
        if (productPickerScroll !== 0) {
            let ul = document.getElementById("product-picker")
            ul?.scrollTo({ top: productPickerScroll, })
        }
        if (massive !== undefined) {
            EditMassiveTable(massive.table_id, massive.value, massive.comment)
            massive = undefined
        }
    }, [tables])

    const OpenPop = (pop: string, initialPage?: string) => {
        let init = initialPage === undefined ? "" : initialPage
        setCurrentPop({ pop: pop, initialPage: init })
    }

    const download = () => {
        DownloadTsObject({
            config: config,
            products: ProductsState,
            tablePlaces: tablesPlacesPH
        })
        setTimeout(() => {
            setToastAlert({
                title: "Datos Locales decargados",
                content: "Los productos, configuraciones y mapa fueron descargados. Utilizalo como datos locales en caso de no tener conexión.",
                icon: "check",
                _id: `${Math.random()}`
            })
        }, 1000)
    }
    const popUps: { [key: string]: any } = {
        "products": <ProductEditor initialPage={popUp.initialPage} close={close} />,
        "configuration": <ConfigurationComp close={close} />,
        "information": <AccountInfo close={close} />,
        "notifications": <Notifications close={close} EditMassiveTable={EditMassiveTableHandle} />,
        "closesession": <CloseSession close={close} logout={logout_handler} />,
        "account": <AccountPop download={download} OpenPop={OpenPop} close={close} />,
        "historial": <HistorialTableComp
            setCurrentHandler={setCurrentHandler}
            table={popUp.initialPage === "true" ? currentTableData : undefined}
            close={close}
        />
    }

    const setTablesPlacesHandler = (val: TablePlaceType[]) => {
        let result = back_setTablesPlaces(val)
        if (result) setToastAlert(result)
        setTablesPlaces(val)
    }


    React.useEffect(() => {
        if (!config || config.mainColor === "") return
        document.body.style.setProperty("--corange", config.mainColor)
    }, [config])

    let animations = config ? config.animations : true
    let blur = config ? config.blur : false

    return <main data-animations={`${animations}`} data-config-blur={`${blur}`}>
        <TablesPlaces.Provider value={{ tables: tablesPlacesPH, set: setTablesPlacesHandler }}>
            <Configuration.Provider value={{ config: config, setConfig: setConfigHandle }}>
                <ToastActivation.Provider value={setToastAlert}>
                    <Products.Provider value={{ list: ProductsState, setProds: editProdsHandle }}>
                        <TopBar OpenPop={OpenPop} download={download} />
                        <section className='d-flex'>
                            <TableCount selectedPhase={selectedPhase} setSelectedPhase={setSelectedPhase} currentTable={currentTableData} EditTable={EditTable} addItem={addItem} managePhase={managePhase} tablesMin={tablesMin} />
                            <ProdAndMap tablesMin={tablesMin} current={currentTableData} setCurrentID={setCurrentHandler} addItem={addItem} />
                        </section>
                        {popUp.pop !== "" && popUps[popUp.pop]}
                        <Toast />
                    </Products.Provider>
                </ToastActivation.Provider>
            </Configuration.Provider>
        </TablesPlaces.Provider>
    </main>
}