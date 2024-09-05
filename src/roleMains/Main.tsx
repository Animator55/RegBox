import React from 'react'
import TopBar from '../components/TopBar'
import TableCount from '../components/TableCount'
import ProdAndMap from '../components/ProdAndMap'
import { HistorialTableType, Item, SingleEvent, TableEvents, TablePlaceType, TableType, configType } from '../vite-env'
import getTableData from '../logic/getTableData'
import fixNum from '../logic/fixDateNumber'
import { productsType } from '../defaults/products'
import ProductEditor from '../components/ProductEditor'
import Notifications from '../components/Notifications'
import ConfigurationComp from '../components/Configuration'
import DownloadTsObject from '../logic/download'
import { checkImportancy } from '../logic/checkChangeImportancy'
import { calculateTotal } from '../logic/calculateTotal'
import HistorialTableComp from '../components/HistorialTable'
import CloseSession from '../components/CloseSession'

type Props = {
    initialData?: {
        config: configType
        products: productsType
        tablePlaces: TablePlaceType[]
    }
    logout: Function
}


export const Configuration = React.createContext({
    config: {
        orderedLists: true,
        prodsAsList: true,
        prodsInEditorAsList: true,
        domain: {
            name: "",
        },
        map: {
            zoom: 1,
            x: 0,
            y: 0
        }
    }, setConfig: (val: configType) => { console.log(val) }
})
export const Products = React.createContext({
    list: {} as productsType, setProds: (val: productsType) => { console.log(val) }
})

export const TablesPlaces = React.createContext({
    tables: [] as TablePlaceType[],
    set: (val: TablePlaceType[]) => { console.log(val) },
    editName: (id: string, val: string) => { console.log(id, val) },
})



let lastChanged = ""
let productPickerScroll = 0
window.addEventListener('beforeunload', function (event) {
    // Establece el mensaje que se mostrará en algunos navegadores
    event.preventDefault(); // Este método es obsoleto, pero se incluye por compatibilidad
    event.returnValue = ''; // Chrome requiere esta asignación

    // El mensaje predeterminado del navegador se mostrará.
    // No es posible personalizar el texto en la mayoría de los navegadores modernos.
});

let massive: {table_id:string, value:Item[], comment:string}|undefined = undefined ///when massiveChange happens and the table is not created yet. 
export default function Main({ initialData, logout }: Props) {
    const [config, setConfig] = React.useState(initialData !== undefined ? initialData.config : {
        prodsAsList: false,
        orderedLists: true,
        prodsInEditorAsList: false,
        domain: {
            name: "",
        },
        map: {
            zoom: 1,
            x: 0,
            y: 0
        }
    })

    const setConfigHandle = (val: configType) => {
        setConfig(val)
    }

    const [ProductsState, setProdsState] = React.useState<productsType>(initialData === undefined ? {} : initialData.products)

    const [tablesPlacesPH, setTablesPlaces] = React.useState<TablePlaceType[]>(initialData === undefined ? [] : initialData.tablePlaces)

    const [tables, setTables] = React.useState<TableType[]>([])
    const [current, setCurrent] = React.useState<string>()
    const [popUp, setCurrentPop] = React.useState({ pop: "", initialPage: "" })

    const close = () => { setCurrentPop({ pop: "", initialPage: "" }) }
    const createTable = (id:string)=>{
        let date = new Date()
        let data = getTableData(id, tablesPlacesPH)
        if (!data) return false
        let hour = fixNum(date.getHours()) + ":" + fixNum(date.getMinutes())
        let day = fixNum(date.getDate()) + "/" + fixNum(date.getMonth() + 1) + "/" + date.getFullYear()

        let opened = [`${hour}`, ` ${day}`]
        let newTable: TableType = {
            _id: data._id,
            number: data.number,
            discount: 0,
            products: [],
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
            if(result) setCurrent(id)
        }
    }

    const addTableToHistorial = (newTable: TableType, isSwitch: boolean, prevId?: string) => {
        let date = new Date()
        let storage = window.localStorage
        let testVal = storage.getItem("RegBoxID:"+newTable._id)
        let prev: HistorialTableType = testVal ? JSON.parse(testVal) as HistorialTableType : { _id: newTable._id, number: newTable.number, historial: [] }

        let initialEvents: SingleEvent[] = [{
            important: true,
            type: "state",
            comment: isSwitch ? ("Se cambió la mesa a " + newTable.number) : ("Se crea la mesa " + newTable.number),
            timestamp: newTable.opened[0] + ":" + fixNum(date.getSeconds()),
            owner: "main"
        }]
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
            storage.setItem("RegBoxID:"+prevId, JSON.stringify(prevTable))
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
        storage.setItem("RegBoxID:"+newTable._id, JSON.stringify(prev))
    }

    const addEventToHistorial = (table_id: string, entry: string, comment: string, importancy: boolean, value?: any, table?: TableType, discount?: number) => {
        let storage = window.localStorage
        let testVal = storage.getItem("RegBoxID:"+table_id)
        if (!testVal) return
        let prev: HistorialTableType = JSON.parse(testVal) as HistorialTableType
        if (prev.historial.length === 0) return


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

        storage.setItem("RegBoxID:"+table_id, JSON.stringify(prev))
    }

    const EditTable = (table_id: string, entry: string, value: any, comment: string) => {
        let table
        for (let i = 0; i < tables.length; i++) {
            if (tables[i]._id === table_id) table = tables[i]
        }
        if (!table) return

        let isNotProducts = entry !== "products"
        if (entry === "switch") {/// if switch tables
            let [id, number] = value.split("/")
            let newTable = { ...table, _id: id, number: number }
            addTableToHistorial(newTable, true, table._id)
            setTables([...tables.filter(el => { if (el._id !== table._id) return el }), newTable])
            setCurrent(id)
        }
        ///if is deleting table => after closing table, it must return to "unnactive" state to repeat the process
        else if (entry === "state" && value === "unnactive") {
            addEventToHistorial(table_id, entry, comment, checkImportancy(entry), isNotProducts ? value : undefined, table, table.discount)
            setTables([...tables.filter(el => { if (el._id !== table._id) return el })])
            setCurrent(undefined)
        }
        ///if is only changing any entry
        else if (table.state !== "closed" && table.state !== "unnactive") {
            addEventToHistorial(table_id, entry, comment, checkImportancy(entry), isNotProducts ? value : undefined, entry === "products" ? {...table, products: value} : undefined)
            setTables([
                ...tables.filter(el => { if (el._id !== table._id) return el }),
                { ...table, [entry]: value }
            ])
        }
        else if(table.state === "closed" && entry === "payMethod") {
            addEventToHistorial(table_id, entry, comment, true, undefined, undefined)
            setTables([
                ...tables.filter(el => { if (el._id !== table._id) return el }),
                { ...table, [entry]: value}
            ])
        }
    }
    const EditMassiveTable = (table_id: string, value: Item[], comment: string)=>{
        let table
        for (let i = 0; i < tables.length; i++) {
            if (tables[i]._id === table_id) table = tables[i]
        }
        if (!table) return

        if (table.state !== "closed" && table.state !== "unnactive") {
            let array = [...table.products]
            for(let i=0; i<value.length; i++) {
                let newItem = value[i]

                /// search if new item already exists
                let index = -1
                for (let j = 0; j < array.length; j++) {
                    if(newItem._id === array[j]._id){
                        index = j
                        break
                    }
                }
                if(index === -1) array = [...array, newItem]
                else array = array.map((el, j)=>{
                    if(j === index) return {...el, amount: el.amount! + newItem.amount!}
                    else return el
                })
            }
            let editedTable ={ ...table, products: array }

            addEventToHistorial(table_id, "products", comment, false, undefined, editedTable)
            setTables([
                ...tables.filter(el => { if (el._id !== table._id) return el }),
                editedTable
            ])
        }
    }

    const EditMassiveTableHandle = (table_id: string, value: Item[], comment: string)=>{
        let table
        for (let i = 0; i < tables.length; i++) {
            if (tables[i]._id === table_id) table = tables[i]
        }
        if (!table) {
            let result = createTable(table_id)
            if(result) massive = {table_id, value, comment}
        }
        else EditMassiveTable(table_id, value, comment)
    }

    let currentTableData: undefined | TableType
    for (let i = 0; i < tables.length; i++) {
        if (tables[i]._id === current) { currentTableData = tables[i]; break }
    }

    
    const popUps: { [key: string]: any } = {
        "products": <ProductEditor initialPage={popUp.initialPage} close={close} />,
        "configuration": <ConfigurationComp close={close} />,
        "notifications": <Notifications close={close} EditMassiveTable={EditMassiveTableHandle} />,
        "closesession": <CloseSession close={close} logout={logout}/>,
        "historial": <HistorialTableComp
                table={popUp.initialPage === "true" ? currentTableData : undefined} 
                close={close}
            />
    }

    let tablesMin = tables.map(tbl => {
        return { _id: tbl._id, number: tbl.number, state: tbl.state }
    })

    const addItem = (item: Item, value?: 1 | -1,) => {
        if (!currentTableData) return
        let prods = currentTableData.products

        let index = -1
        for (let i = 0; i < prods.length; i++) if (prods[i]._id === item._id) { index = i; break }

        let amount = value !== undefined ? value : 1
        let word = amount === 1 ? "Añadido": "Subtraido"
        lastChanged = item._id
        productPickerScroll = value !== undefined ? 0 : document.getElementById("product-picker")?.scrollTop!

        if (item.amount && (item.amount + amount) <= 0) EditTable(currentTableData._id, "products", prods.filter(el => { if (el._id !== item._id) return el }), "Eliminado " + item.name+ " (" +item._id+ ")")
        else if (index === -1 && !prods[index]) EditTable(currentTableData._id, "products", [...prods, { ...item, amount: amount }], "Añadido 1 de " + item.name + " (" + item._id + ")")
        else EditTable(currentTableData?._id, "products", prods.map(el => {
            if (el._id === item._id) return { ...item, amount: prods[index].amount! + amount }
            else return el
        }), word + "1 de " + item.name + " (" + item._id + ")")
    }

    React.useEffect(() => {
        if (initialData !== undefined) {
            setProdsState(initialData.products)
            setTablesPlaces(initialData.tablePlaces)
            setConfig(initialData.config)
        }
    }, [initialData])
    React.useEffect(() => {
        if (lastChanged !== "") {
            let item = document.getElementById(lastChanged)
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
        if(massive !== undefined) {
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
    }

    const EditTableName = (id: string, val: string) => {
        let prev = ""
        setTablesPlaces([...tablesPlacesPH.map((el) => {
            if (el._id !== id) return el
            else {
                prev = el.number
                return {
                    ...el,
                    number: val
                } as TablePlaceType
            }
        })])

        EditTable(id, "number", val, "Cambio de nombre de mesa de " + prev + " a " + val)
    }

    return <>
        <TablesPlaces.Provider value={{ tables: tablesPlacesPH, set: setTablesPlaces, editName: EditTableName }}>
            <Configuration.Provider value={{ config: config, setConfig: setConfigHandle }}>
                <Products.Provider value={{ list: ProductsState, setProds: setProdsState }}>
                    <TopBar OpenPop={OpenPop} download={download} />
                    <section className='d-flex'>
                        <TableCount currentTable={currentTableData} EditTable={EditTable} addItem={addItem} tablesMin={tablesMin}/>
                        <ProdAndMap tablesMin={tablesMin} current={currentTableData} setCurrentID={setCurrentHandler} addItem={addItem} />
                    </section>
                    {popUp.pop !== "" && popUps[popUp.pop]}
                </Products.Provider>
            </Configuration.Provider>
        </TablesPlaces.Provider>
    </>
}