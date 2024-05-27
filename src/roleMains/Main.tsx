import React from 'react'
import TopBar from '../components/TopBar'
import TableCount from '../components/TableCount'
import ProdAndMap from '../components/ProdAndMap'
import { TableType } from '../vite-env'

type Props = {}


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
    const [current, setCurrent] = React.useState<TableType>({
        _id: "gdshdshds",
        number: 11,
        tag: "Unknown name",
        products: [...defProds, ...defProds, ...defProds],
        opened: `${new Date().getHours()+":"+new Date().getMinutes()}`,
        state: "open"
    })

    return <>
        <TopBar />
        <section className='d-flex'>
            <TableCount currentTable={current} />
            <ProdAndMap setCurrent={setCurrent}/>
        </section>
    </>
}