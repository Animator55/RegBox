import React from 'react'
import TopBar from '../components/TopBar'
import TableCount from '../components/TableCount'
import ProdAndMap from '../components/ProdAndMap'
import { TablePlaceType, TableType, configType } from '../vite-env'
import { TablePlacesDefault } from '../defaults/tableplaces'
import getTableData from '../logic/getTableData'

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


let defProds = [
    {
        _id: "fasfgfdasga",
        name: "product1",
        price: 2000,
        type: "food",
        amount: 1
    },
    {
        _id: "fasfasfasgf",
        name: "product1",
        price: 2540,
        type: "food",
        amount: 1
    },
    {
        _id: "fasfgfgfdsgdsdasga",
        name: "product1",
        price: 7960,
        type: "food",
        amount: 1
    },
    {
        _id: "dfsgds",
        name: "product5",
        price: 300,
        type: "food",
        amount: 1
    },
    {
        _id: "gdsg",
        name: "product6",
        price: 400,
        type: "food",
        amount: 1
    },
    {
        _id: "gdsg",
        name: "product2",
        price: 2240,
        type: "food",
        amount: 3
    },
    {
        _id: "gsdg",
        name: "product5",
        price: 4000,
        type: "food",
        amount: 2
    },
]

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

    const [tables, setTables] = React.useState<TableType[]>([
        {
            _id: "gdsghdsh",
            number: 1,
            tag: "",
            products: [...defProds],
            opened: `${new Date().getHours() + ":" + new Date().getMinutes()}`,
            state: "open",
        },
        {
            _id: "ggdagagasghdash",
            number: 2,
            tag: "Unknown name",
            products: [...defProds, ...defProds, ...defProds],
            opened: `${new Date().getHours() + ":" + new Date().getMinutes()}`,
            state: "paying",
        },
    ])
    const [current, setCurrent] = React.useState<string>()

    const setCurrentHandler = (id: string) => {
        let index = -1
        for (let i = 0; i < tables.length; i++) {
            if (tables[i]._id === id) { index = i; break }
        }
        if (index !== -1) setCurrent(id)
        else {
            let data = getTableData(id ,tablesPlacesPH) 
            if(!data) return
            let newTable: TableType = {
                _id: data._id,
                number: data.number,
                tag: "",
                products: [],
                opened: `${new Date().getHours() + ":" + new Date().getMinutes()}`,
                state: "open",
            }
            setTables([...tables, newTable])
        }
    }

    let currentTableData
    for (let i = 0; i < tables.length; i++) {
        if (tables[i]._id === current) { currentTableData = tables[i]; break }
    }

    let tablesMin = tables.map(tbl => {
        return { _id: tbl._id, state: tbl.state }
    })

    return <>
        <TablesPlaces.Provider value={{ tables: tablesPlacesPH, set: setTablesPlaces }}>
            <Configuration.Provider value={{ config: config, setConfig: setConfigHandle }}>
                <TopBar />
                <section className='d-flex'>
                    <TableCount currentTable={currentTableData} />
                    <ProdAndMap tablesMin={tablesMin} current={currentTableData} setCurrentID={setCurrentHandler} />
                </section>
            </Configuration.Provider>
        </TablesPlaces.Provider>
    </>
}