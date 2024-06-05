import { Item, TableType } from '../vite-env'
import "../assets/tableCount.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft, faCaretDown, faCheckToSlot, faClockRotateLeft, faMinus, faPen, faPercentage, faPlus, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { colorSelector } from '../logic/colorSelector'
import React from 'react'

type Props = {
    currentTable: TableType | undefined
    EditTable: Function
}

export default function TableCount({ currentTable, EditTable }: Props) {
    const expandList = ()=>{

    }

    const Top = () => {
        return <header className='table-head'>
            {currentTable && <>
                <div className='after' style={{ backgroundColor: colorSelector[currentTable.state] }}></div>
                <button className='expand-button' onClick={expandList}><FontAwesomeIcon icon={faCaretDown}/></button>
                <h2>Mesa {currentTable.number}</h2>
                <p>{currentTable.tag !== "" && "(" + currentTable.tag + ")"}</p>
            </>}
            <h2 style={{opacity: 0}}>Empty</h2>
        </header>
    }

    /**** LIST ****/

    const addAmount = (value: 1 | -1, item_id: string) =>{
        let list = currentTable?.products
        if(!list || list.length === 0) return

        let item
        let index = -1
        for(let i = 0; i<list.length; i++) {
            if(item_id === list[i]._id) {
                item = list[i]; index = i; break                
            }
        }
        if(!item || !item.amount) return

        let newItem = {...item, amount: item.amount + value}

        if(newItem.amount === 0 
        && index !== -1) EditTable(currentTable?._id, "products", list.filter(el=>{if(el._id !== item._id) return el}))
        else EditTable(currentTable?._id, "products", list.map(el=>{
            if(el._id === item._id) return newItem
            else return el
        }))
    }

    const List = () => {
        let products: Item[] | undefined = currentTable?.products

        const columns = ["", "Nombre", "Cantidad", "Precio", ""]

        let isProds = products && products.length !== 0

        return <section className='content'>
            <header className='table-columns'>
                {isProds && columns.map(str => {
                    return <div key={Math.random()}>{str}</div>
                })}
            </header>
            <ul className='table-list'>
                {isProds && products && products.map(item => {
                    return <li key={Math.random()}>
                        <button className='edit-button'><FontAwesomeIcon icon={faPen} /></button>
                        <div>{item.name}</div>
                        <div>{item.amount}</div>
                        <div>{item.price}</div>
                        <div className='amount-buttons'>
                            <button onClick={()=>{addAmount(1, item._id)}}><FontAwesomeIcon icon={faPlus} /></button>
                            <button onClick={()=>{addAmount(-1, item._id)}}><FontAwesomeIcon icon={faMinus} /></button>
                        </div>
                    </li>
                })}
            </ul>
        </section>
    }

    const TableCommands = () => {
        return <section className='table-commands'>
            <div>
                <p>{currentTable && `Caja abierta a las ${currentTable.opened}`}</p>
                <button className={currentTable ? "" : 'disabled'}>
                    <FontAwesomeIcon icon={faClockRotateLeft} />Historial
                </button>
            </div>
            <div className={currentTable ? "" : 'disabled'}>
                <button>
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />Cambiar
                </button>
                <button>
                    <FontAwesomeIcon icon={faPercentage} />Descuento
                </button>
            </div>
            <div className={currentTable ? "" : 'disabled'}>
                <button onClick={() => {
                    let prtContent = document.querySelector(".reciept");
                    if (!prtContent) return
                    var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
                    if (!WinPrint) return
                    WinPrint.document.write(prtContent.innerHTML);
                    WinPrint.document.close();
                    WinPrint.focus();
                    WinPrint.print();
                    WinPrint.close();
                }}><FontAwesomeIcon icon={faReceipt} />Imprimir</button>
                <button><FontAwesomeIcon icon={faCheckToSlot} />Cerrar</button>
            </div>
        </section>
    }

    /*** */

    const Reciept = () => {
        if(!currentTable)return
        let date = new Date()

        return <div className='reciept'>
            <style>{"*{font-family:'Kanit', sans-serif;} p{margin: 5px 0}"}</style>
            <h1 style={{textAlign: "center"}}>Club Vermut</h1>
            <p style={{textAlign: "right"}}>Recibo no valido como factura</p>
            <hr></hr>
            <div style={{ display: "flex", gap: "1rem" }}>
                <p>Mesa {currentTable?.number}</p>
                <p>{currentTable.tag !== "" && currentTable.tag}</p>
            </div>
            <p>Mesa abierta a las {date.getHours() + ":" + date.getMinutes()}</p>
            <p>Mesa cerrada a las {date.getHours() + ":" + date.getMinutes()}</p>
            <p style={{marginTop: 3}}>Fecha: {date.getDate() + "/" + (date.getMonth()+1) + "/" + date.getFullYear()}</p>
            <hr></hr>
            <div style={{ display: "flex" }}>
                <p>Articulo</p>
                <p style={{ marginLeft: "auto" }}>Precio</p>
            </div>
            <hr></hr>
            <div style={{display: "grid", gridTemplateColumns: "70% 30%"}}>
                {currentTable && currentTable?.products && currentTable?.products.map(el => {
                    total += el.price * el.amount!

                    let prefix = el.amount === 1 ? "" : `${el.amount + "*$" + el.price + " "}`

                    return <React.Fragment key={Math.random()}>
                        <p>{el.name}</p>
                        <p style={{ textAlign: "right" }}>{prefix + "$" + el.price * el.amount!}</p>
                    </React.Fragment>
                })}
            </div>
            <hr />
            <div style={{ display: "flex" }}>
                <p>Total</p>
                <p style={{ marginLeft: "auto" }}>${total}</p>
            </div>
        </div>
    }

    let total = 0

    return <section className='table-count'>
        <Reciept/>
        <Top />
        <List />
        <TableCommands />
    </section>
}


