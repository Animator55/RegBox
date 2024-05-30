import { Item, TableType } from '../vite-env'
import "../assets/tableCount.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckToSlot, faClockRotateLeft, faMinus, faPen, faPlus, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { colorSelector } from '../logic/colorSelector'

type Props = {
    currentTable: TableType | undefined
}

export default function TableCount({currentTable}: Props) {
    const Top = ()=>{
        return <header className='table-head'>
            {currentTable && <> 
                <div className='after' style={{backgroundColor: colorSelector[currentTable.state]}}></div>
                <h2>Mesa {currentTable.number}</h2>
                <p>{"("+ currentTable.tag +")"}</p>
            </>}
        </header>
    }
    const List = ()=>{
        const products: Item[] | undefined = currentTable?.products

        const columns = ["", "Nombre","Cantidad","Precio", ""]

        return <section className='content'>
            <header className='table-columns'>
                {columns.map(str=>{
                    return <div key={Math.random()}>{str}</div>
                })}
            </header>
            <ul className='table-list'>
                {products && products.length !== 0 && products.map(item=>{
                    return <li key={Math.random()}>
                        <button className='edit-button'><FontAwesomeIcon icon={faPen}/></button>
                        <div>{item.name}</div>
                        <div>{item.amount}</div>
                        <div>{item.price}</div>
                        <div className='amount-buttons'>
                            <button><FontAwesomeIcon icon={faPlus}/></button>
                            <button><FontAwesomeIcon icon={faMinus}/></button>
                        </div>
                    </li>
                })}
            </ul>
        </section>
    }

    const TableCommands =()=>{
        return <section className='table-commands'>
            <div>
                <p>{currentTable && `Caja abierta a las ${currentTable.opened}`}</p>
                <button><FontAwesomeIcon icon={faClockRotateLeft}/>Historial</button>
            </div>
            <div>
                <button><FontAwesomeIcon icon={faReceipt}/>Imprimir</button>
                <button><FontAwesomeIcon icon={faCheckToSlot}/>Cerrar</button>
            </div>
        </section>
    }

    return <section className='table-count'>
        <Top/>
        <List/>
        <TableCommands/>
    </section>
}