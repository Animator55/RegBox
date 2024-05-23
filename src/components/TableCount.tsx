import React from 'react'
import { Item, TableType } from '../vite-env'

type Props = {
    currentTable: TableType
}

export default function TableCount({currentTable}: Props) {
    const Top = ()=>{
        const colorSelector = {
            "open": "green", "paying": "blue", "closed": "red"
        }
        return <header>
            <div style={{backgroundColor: colorSelector[currentTable.state]}}>{currentTable.state}</div>
            <h2>Mesa {currentTable.number}</h2>
            <p>{"("+ currentTable.tag +")"}</p>
        </header>
    }
    const List = ()=>{
        const products: Item[] = currentTable.products

        const columns = ["name","amount","price"]

        return <section>
            <header>
                {columns.map(str=>{
                    return <div key={Math.random()}>{str}</div>
                })}
            </header>
            <ul>
                {products.length !== 0 && products.map(item=>{
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
        return <section>
            <p>{currentTable.opened}</p>
            <button>Cobrar</button>
            <button>Historial</button>
            <button>Cerrar</button>
        </section>
    }

    return <section>
        <Top/>
        <List/>
        <TableCommands/>
    </section>
}