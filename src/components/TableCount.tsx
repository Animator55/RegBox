import { Item, TableType } from '../vite-env'
import "../assets/tableCount.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft, faBars, faCaretDown, faCheckToSlot, faClockRotateLeft, faList, faMinus, faPercentage, faPlus, faReceipt } from '@fortawesome/free-solid-svg-icons'
import { colorSelector } from '../logic/colorSelector'
import React from 'react'
import fixNum from '../logic/fixDateNumber'
import { Configuration, Products } from '../roleMains/Main'
import orderByTypes from '../logic/orderByTypes'
import ConfirmPop from './ConfirmPop'
import PayMethodsPop from './PayMethodsPop'

type Props = {
    currentTable: TableType | undefined
    EditTable: Function
    setCurrentTable: Function
    tablesMin: {_id: string, number: number, state: "open" | "paying" | "closed" | "unnactive"}[]
}

export default function TableCount({ currentTable, EditTable, tablesMin, setCurrentTable }: Props) {
    const [endPop, endTablePop] = React.useState(false)

    const c = React.useContext(Configuration)
    const p = Object.keys(React.useContext(Products).list)

    let spanListlength = !currentTable ? tablesMin.length : tablesMin.length -1
    let disabled = spanListlength <= 0 ? " disabled" : ""

    const changeTableState = (state: "open" | "paying" | "closed" | "unnactive")=>{
        if(currentTable) EditTable(currentTable._id, "state", state)
    }

    const expandList = (e: React.MouseEvent) => {
        let button = e.currentTarget as HTMLButtonElement
        let list = button.nextElementSibling as HTMLSpanElement

        list.classList.toggle("expanded")
    }

    const Top = () => {
        return <header className='table-head'>
            {currentTable ? <>
                <button className={'expand-button' + disabled} onClick={expandList}><FontAwesomeIcon icon={faCaretDown} /></button>
                <span className="expand-list">
                    {tablesMin.map(el=>{
                        return el._id !== currentTable._id && <button
                        key={Math.random()}
                        onClick={()=>{setCurrentTable(el._id)}}
                        >
                            Mesa {el.number}
                            <div className='after' style={{ backgroundColor: colorSelector[el.state] }}></div>
                        </button>
                    })}
                </span>
                <h2>Mesa {currentTable.number}</h2>
                <p>{currentTable.tag !== "" && "(" + currentTable.tag + ")"}</p>
                <div className='after' style={{ backgroundColor: colorSelector[currentTable.state] }}></div>
            </> 
            :
            <h2 style={{ opacity: 0 }}>Empty</h2>
            }
        </header>
    }

    /**** LIST ****/

    const addAmount = (value: 1 | -1, item_id: string) => {
        let list = currentTable?.products
        if (!list || list.length === 0) return

        let item
        let index = -1
        for (let i = 0; i < list.length; i++) {
            if (item_id === list[i]._id) {
                item = list[i]; index = i; break
            }
        }
        if (!item || !item.amount) return

        let newItem = { ...item, amount: item.amount + value }

        if (newItem.amount === 0
            && index !== -1) EditTable(currentTable?._id, "products", list.filter(el => { if (el._id !== item._id) return el }))
        else EditTable(currentTable?._id, "products", list.map(el => {
            if (el._id === item._id) return newItem
            else return el
        }))
    }

    const List = () => {
        let products: Item[] | undefined = currentTable?.products

        const columns = ["Nombre", "Cantidad", "Precio"]

        let isProds = products && products.length !== 0

        let total = 0

        let titles = c.config.orderedLists
        let reOrdered = titles ? orderByTypes(products, p, true) : products

        return <section className={currentTable?.state !== "closed" ? 'content':"content disabled-c"}>
            <header className='table-columns'>
                {isProds && <>
                    {columns.map(str => {
                        return <div key={Math.random()}>{str}</div>
                    })}
                    <button className='default-button' onClick={() => { c.setConfig({ ...c.config, orderedLists: !titles }) }}>
                        <FontAwesomeIcon icon={titles ? faList : faBars} />
                    </button>
                </>}
            </header>
            <ul className='table-list'>
                {isProds && reOrdered && reOrdered.map(item => {
                    let header = false
                    if (titles && item.header) header = true
                    else total += item.amount! * item.price
                    return header ? <div className='title' key={Math.random()}>{item.type}</div>
                        :
                        <li id={item._id} key={Math.random()}>
                            <div>{item.name}</div>
                            <div>{item.amount}</div>
                            <div>{item.price}</div>
                            <div className='amount-buttons'>
                                <button onClick={() => { addAmount(1, item._id) }}><FontAwesomeIcon icon={faPlus} /></button>
                                <button onClick={() => { addAmount(-1, item._id) }}><FontAwesomeIcon icon={faMinus} /></button>
                            </div>
                        </li>
                })}
            </ul>
            {isProds && <>
                <hr></hr>
                <div className="total">
                    <div>Total</div>
                    <div>{total}</div>
                </div>
            </>}
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
            <div className={currentTable?.state !== "closed" && currentTable ? "" : 'disabled'}>
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
                <button className={currentTable?.state !== "closed" ? "": "confirm"} onClick={()=>{
                    endTablePop(true)
                }}><FontAwesomeIcon icon={faCheckToSlot } />
                    {currentTable?.state !== "closed" ? "Cerrar" : "Cobrar"}
                </button>
            </div>
        </section>
    }

    /*** */

    const Reciept = () => {
        if (!currentTable) return
        let date = new Date()

        let result = orderByTypes(currentTable.products, p, false)

        return <div className='reciept'>
            <style>{"*{font-family:'Kanit', sans-serif;} .content-reciept p{font-size:0.65rem;margin: 3px 0}"}</style>
            <div className='content-reciept'>
                <h3 style={{ textAlign: "center" }}>CLUB VERMUT</h3>
                <h6 style={{ marginBottom: 2, textAlign: "right" }}>RECIBO NO VALIDO COMO FACTURA</h6>
                <hr></hr>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <p>Mesa {currentTable?.number}</p>
                    <p>{currentTable.tag !== "" && currentTable.tag}</p>
                </div>
                <p>Abierta a las {currentTable.opened}</p>
                <p>Cerrada a las {fixNum(date.getHours()) + ":" + fixNum(date.getMinutes())}</p>
                <p style={{ marginTop: 3 }}>Fecha: {
                    fixNum(date.getDate()) + "/" + fixNum(date.getMonth() + 1) + "/" + date.getFullYear()}</p>
                <hr></hr>
                <div style={{ display: "flex" }}>
                    <p>Articulo</p>
                    <p style={{ marginLeft: "auto" }}>Precio</p>
                </div>
                <hr></hr>
                <div style={{ display: "grid", gridTemplateColumns: "70% 30%" }}>
                    {result && result.map(el => {
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
                    <p style={{ fontSize: "0.9rem" }}><b>Total</b></p>
                    <p style={{ marginLeft: "auto", fontSize: "0.9rem" }}><b>${total}</b></p>
                </div>
            </div>
        </div>
    }

    let total = 0

    return <section className='table-count'>
        {endPop && currentTable?.state !== "closed" && <ConfirmPop 
            title={"¿Cerrar mesa?"} 
            confirm={()=>{changeTableState("closed"); endTablePop(false)}}
            close={()=>{endTablePop(false)}}
        />}
        {endPop && currentTable?.state === "closed" && <PayMethodsPop 
            total={total}
            confirm={()=>{changeTableState("unnactive"); endTablePop(false)}}
            close={()=>{endTablePop(false)}}
        />}
        <Reciept />
        <Top />
        <List />
        <TableCommands />
    </section>
}


