import React from 'react'
import TopBar from '../components/TopBar'
import TableCount from '../components/TableCount'
import ProdAndMap from '../components/ProdAndMap'
import { Item, TablePlaceType, TableType, configType } from '../vite-env'
import { TablePlacesDefault } from '../defaults/tableplaces'
import getTableData from '../logic/getTableData'
import fixNum from '../logic/fixDateNumber'

type Props = {
}


export const Configuration = React.createContext({
    config: {
        prodsAsList: true,
        map: {
            zoom: 1,
            x: 0,
            y: 0
        }
    }, setConfig: (val: configType) => { console.log(val) }
})

export const TablesPlaces = React.createContext({ tables: [] as TablePlaceType[], set: (val: TablePlaceType[]) => { console.log(val) } })

export default function Main({ }: Props) {
    const [config, setConfig] = React.useState({
        prodsAsList: true,
        map: {
            zoom: 1,
            x: 0,
            y: 0
        }
    })

    const setConfigHandle = (val: configType) => {
        setConfig(val)
    }

    const [tablesPlacesPH, setTablesPlaces] = React.useState<TablePlaceType[]>(TablePlacesDefault)

    const [tables, setTables] = React.useState<TableType[]>([])
    const [current, setCurrent] = React.useState<string>()

    const setCurrentHandler = (id: string) => {
        let index = -1
        for (let i = 0; i < tables.length; i++) {
            if (tables[i]._id === id) { index = i; break }
        }
        if (index !== -1) setCurrent(id)
        else {
            let date = new Date()
            let data = getTableData(id ,tablesPlacesPH) 
            if(!data) return
            let newTable: TableType = {
                _id: data._id,
                number: data.number,
                tag: "",
                products: [],
                opened: `${fixNum(date.getHours()) + ":" + fixNum(date.getMinutes())}`,
                state: "open",
            }
            setTables([...tables, newTable])
        }
    }

    const EditTable = (table_id: string, entry: string, value: any)=>{
        console.log(table_id, entry, value)
        let table
        for(let i=0; i<tables.length;i++) {
            if(tables[i]._id === table_id) table = tables[i]
        }
        if(!table) return
        setTables([...tables.filter(el=>{if(el._id !== table._id)return el}),
            {...table, [entry]: value}
        ])
    }

    let currentTableData: undefined | TableType
    for (let i = 0; i < tables.length; i++) {
        if (tables[i]._id === current) { currentTableData = tables[i]; break }
    }

    let tablesMin = tables.map(tbl => {
        return { _id: tbl._id, state: tbl.state }
    })
    
    const addItem = (item: Item)=>{
        if(!currentTableData) return
        let prods = currentTableData.products

        let index = -1
        for(let i=0;i<prods.length;i++) if(prods[i]._id === item._id) {index = i; break}

        if(index === -1 && !prods[index]) EditTable(currentTableData._id, "products", [...prods, {...item, amount: 1}])
        else EditTable(currentTableData?._id, "products", prods.map(el=>{
            if(el._id === item._id) return {...item, amount: prods[index].amount! + 1}
            else return el
        }))
    }

    return <>
        <TablesPlaces.Provider value={{ tables: tablesPlacesPH, set: setTablesPlaces }}>
            <Configuration.Provider value={{ config: config, setConfig: setConfigHandle }}>
                <TopBar />
                <section className='d-flex'>
                    <TableCount currentTable={currentTableData} EditTable={EditTable}/>
                    <ProdAndMap tablesMin={tablesMin} current={currentTableData} setCurrentID={setCurrentHandler} addItem={addItem}/>
                </section>
            </Configuration.Provider>
        </TablesPlaces.Provider>
    </>
}