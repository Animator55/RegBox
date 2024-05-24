import React from 'react'
import TopBar from '../components/TopBar'
import TableCount from '../components/TableCount'
import ProdAndMap from '../components/ProdAndMap'

type Props = {}

export default function Main({ }: Props) {
    const [current, setCurrent] = React.useState(undefined)

    return <>
        <TopBar />
        <section className='d-flex'>
            <TableCount currentTable={current} />
            <ProdAndMap setCurrent={setCurrent}/>
        </section>
    </>
}