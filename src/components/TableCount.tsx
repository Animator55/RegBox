import React from 'react'
import { Item, TableType } from '../vite-env'
import "../assets/tableCount.css"

type Props = {
    currentTable: TableType | undefined
}

export default function TableCount({currentTable}: Props) {
    const Top = ()=>{
        const colorSelector = {
            "open": "green", "paying": "blue", "closed": "red"
        }
        return <header className='table-head'>
            {currentTable && <> 
                <div style={{backgroundColor: colorSelector[currentTable.state]}}>{currentTable.state}</div>
                <h2>Mesa {currentTable.number}</h2>
                <p>{"("+ currentTable.tag +")"}</p>
            </>}
        </header>
    }
    const List = ()=>{
        const products: Item[] | undefined = currentTable?.products

        const columns = ["name","amount","price"]

        return <section>
            <header className='table-columns'>
                {columns.map(str=>{
                    return <div key={Math.random()}>{str}</div>
                })}
            </header>
            <ul className='table-list'>
                {products && products.length !== 0 && products.map(item=>{
                    return <li key={Math.random()}>
                        <div>{item.name}</div>
                        <div>{item.amount}</div>
                        <div>{item.price}</div>
                    </li>
                })}
            </ul>
        </section>
    }

    const TableCommands =()=>{
        return <section className='table-commands'>
            {currentTable && <>
                <p>{currentTable.opened}</p>
                <button>Cobrar</button>
                <button>Historial</button>
                <button>Cerrar</button>
            </>}
        </section>
    }

    return <section className='table-count'>
        <Top/>
        <List/>
        <TableCommands/>
    </section>
}