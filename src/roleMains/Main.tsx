import React from 'react'
import TopBar from '../components/TopBar'
import TableCount from '../components/TableCount'
import ProdAndMap from '../components/ProdAndMap'
import { Item, TablePlaceType, TableType, configType } from '../vite-env'
import { TablePlacesDefault } from '../defaults/tableplaces'
import getTableData from '../logic/getTableData'
import fixNum from '../logic/fixDateNumber'
import { products, productsType } from '../defaults/products'
import ProductEditor from '../components/ProductEditor'
import Notifications from '../components/Notifications'
import ConfigurationComp from '../components/Configuration'

type Props = {
}


export const Configuration = React.createContext({
    config: {
        orderedLists: true,
        prodsAsList: true,
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

export const TablesPlaces = React.createContext({ tables: [] as TablePlaceType[], set: (val: TablePlaceType[]) => { console.log(val) } })

let lastChanged = ""
let productPickerScroll = 0

export default function Main({ }: Props) {
    const [config, setConfig] = React.useState({
        prodsAsList: true,
        orderedLists: true,
        map: {
            zoom: 1,
            x: 0,
            y: 0
        }
    })

    const setConfigHandle = (val: configType) => {
        setConfig(val)
    }

    const [ProductsState, setProdsState] = React.useState<productsType>(products)

    const [tablesPlacesPH, setTablesPlaces] = React.useState<TablePlaceType[]>(TablePlacesDefault)

    const [tables, setTables] = React.useState<TableType[]>([])
    const [current, setCurrent] = React.useState<string>()
    const [popUp, setCurrentPop] = React.useState("")

    const close = () => { setCurrentPop("") }

    const popUps: { [key: string]: any } = {
        "products": <ProductEditor close={close} />,
        "configuration": <ConfigurationComp close={close} />,
        "notifications": <Notifications close={close} />
    }

    const setCurrentHandler = (id: string) => {
        let index = -1
        for (let i = 0; i < tables.length; i++) {
            if (tables[i]._id === id) { index = i; break }
        }
        if (index !== -1) setCurrent(id)
        else {
            let date = new Date()
            let data = getTableData(id, tablesPlacesPH)
            if (!data) return
            let newTable: TableType = {
                _id: data._id,
                number: data.number,
                tag: "",
                products: [],
                opened: [`${fixNum(date.getHours()) + ":" + fixNum(date.getMinutes())}`, 
                    `${fixNum(date.getDate()) + "/" + fixNum(date.getMonth() + 1) + "/" + date.getFullYear()}`
                ],
                state: "open",
            }
            setTables([...tables, newTable])
            setCurrent(data._id)
        }
    }

    const EditTable = (table_id: string, entry: string, value: any) => {
        let table
        for (let i = 0; i < tables.length; i++) {
            if (tables[i]._id === table_id) table = tables[i]
        }
        if (!table) return

        ///if is deleting table
        if (entry === "state" && value === "unnactive") {
            setTables([...tables.filter(el => { if (el._id !== table._id) return el })])
            setCurrent(undefined)
        }
        ///if is only changing any entry
        else setTables([...tables.filter(el => { if (el._id !== table._id) return el }),
        { ...table, [entry]: value }
        ])
    }

    let currentTableData: undefined | TableType
    for (let i = 0; i < tables.length; i++) {
        if (tables[i]._id === current) { currentTableData = tables[i]; break }
    }

    let tablesMin = tables.map(tbl => {
        return { _id: tbl._id, number: tbl.number, state: tbl.state }
    })

    const addItem = (item: Item) => {
        if (!currentTableData) return
        let prods = currentTableData.products

        let index = -1
        for (let i = 0; i < prods.length; i++) if (prods[i]._id === item._id) { index = i; break }

        lastChanged = item._id
        productPickerScroll = document.getElementById("product-picker")?.scrollTop!

        if (index === -1 && !prods[index]) EditTable(currentTableData._id, "products", [...prods, { ...item, amount: 1 }])
        else EditTable(currentTableData?._id, "products", prods.map(el => {
            if (el._id === item._id) return { ...item, amount: prods[index].amount! + 1 }
            else return el
        }))
    }

    React.useEffect(() => {
        if (lastChanged !== "") {
            let item = document.getElementById(lastChanged)
            lastChanged = ""
            if (!item) return
            item.classList.add("added")
            let ul = item.parentElement
            if (!ul) return
            ul.scrollTo({top: item.offsetTop - 211 })
        }
        if(productPickerScroll !== 0) {
            let ul = document.getElementById("product-picker")
            ul?.scrollTo({top: productPickerScroll,})
        }
    }, [tables])


    return <>
        <TablesPlaces.Provider value={{ tables: tablesPlacesPH, set: setTablesPlaces }}>
            <Configuration.Provider value={{ config: config, setConfig: setConfigHandle }}>
                <Products.Provider value={{ list: ProductsState, setProds: setProdsState }}>
                    <TopBar setCurrentPop={setCurrentPop} />
                    <section className='d-flex'>
                        <TableCount currentTable={currentTableData} EditTable={EditTable} tablesMin={tablesMin} setCurrentTable={setCurrentHandler} />
                        <ProdAndMap tablesMin={tablesMin} current={currentTableData} setCurrentID={setCurrentHandler} addItem={addItem} />
                    </section>
                    {popUp !== "" && popUps[popUp]}
                </Products.Provider>
            </Configuration.Provider>
        </TablesPlaces.Provider>
    </>
}