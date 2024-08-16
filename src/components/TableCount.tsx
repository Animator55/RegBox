import { Item, TableType } from '../vite-env'
import "../assets/tableCount.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft, faBars, faCaretDown, faCheckToSlot, faClockRotateLeft, faList, faMinus, faPercentage, faPlus, faReceipt, faWarning } from '@fortawesome/free-solid-svg-icons'
import { colorSelector } from '../logic/colorSelector'
import React from 'react'
import fixNum from '../logic/fixDateNumber'
import { Configuration, Products } from '../roleMains/Main'
import orderByTypes from '../logic/orderByTypes'
import ConfirmPop from './ConfirmPop'
import PayMethodsPop from './PayMethodsPop'
import SwitchTable from './SwitchTable'
import Discount from './Discount'
import { calculateTotal } from '../logic/calculateTotal'
import HistorialTableComp from './HistorialTable'

type Props = {
    currentTable: TableType | undefined
    EditTable: Function
    setCurrentTable: Function
    tablesMin: {_id: string, number: string, state: "open" | "paying" | "closed" | "unnactive"}[]
}
let scrollHeight = 0

export default function TableCount({ currentTable, EditTable, tablesMin, setCurrentTable}: Props) {
    const [endPop, endTablePop] = React.useState(false)
    const [pop, setPop] = React.useState("")

    const c = React.useContext(Configuration)
    const p = Object.keys(React.useContext(Products).list)

    let spanListlength = !currentTable ? tablesMin.length : tablesMin.length -1
    let disabled = spanListlength <= 0 ? " disabled" : ""

    const expandList = (e: React.MouseEvent) => {
        let button = e.currentTarget as HTMLButtonElement
        let list = button.nextElementSibling as HTMLSpanElement

        list.classList.toggle("expanded")
    }

    const goTo = (page: string)=>{
        let nav = document.getElementById("main-router")
        if(!nav) return
        let element

        if(page === "products") element = nav.children[0] as HTMLButtonElement
        else element = nav.children[1] as HTMLButtonElement

        element.click()
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
        
        let ul = document.querySelector(".table-list") as HTMLDivElement
        scrollHeight = ul.scrollTop

        if (newItem.amount === 0
            && index !== -1) EditTable(currentTable?._id, "products", list.filter(el => { if (el._id !== item._id) return el }), "Eliminado " + item.name+ " (" +item._id+ ")")
        else EditTable(currentTable?._id, "products", list.map(el => {
            if (el._id === item._id) return newItem
            else return el
        }), value === 1 ? "Añadido 1 de "+ item.name + " (" +item._id+ ")" : "Subtraido 1 de " + item.name + " (" +item._id+ ")")
    }

    const List = () => {
        let products: Item[] | undefined = currentTable?.products

        const columns = ["Nombre", "Precio", "Total", "Cantidad", ]

        let isProds = products && products.length !== 0

        let totalList = 0

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
                {isProds ? reOrdered && reOrdered.map(item => {
                    let header = false
                    if (titles && item.header) header = true
                    else totalList += item.amount! * item.price
                    return header ? <div className='title' key={Math.random()}>{item.type}</div>
                        :
                        <li id={item._id} key={Math.random()}>
                            <div>{item.name}</div>
                            <div>${item.price}</div>
                            <div>${item.price*item.amount}</div>
                            <div>{item.amount}</div>
                            <div className='amount-buttons'>
                                <button onClick={() => { addAmount(1, item._id) }}><FontAwesomeIcon icon={faPlus} /></button>
                                <button onClick={() => { addAmount(-1, item._id) }}><FontAwesomeIcon icon={faMinus} /></button>
                            </div>
                        </li>
                })
                : 
                <section className='alert'>
                    <FontAwesomeIcon icon={faWarning}/>
                    <h2>{!currentTable ? "No hay mesa seleccionada."
                        : "No hay productos añadidos a esta mesa."
                    }</h2>
                    <button className='default-button' onClick={()=>{goTo(!currentTable ? "map" : "products")}}>
                        {!currentTable ? "Ir al mapa":"Ir a la lista"}
                    </button>
                </section>
                }
            </ul>
            {isProds && <>
                <hr></hr>
                <div className="total">
                    <div>Total</div>
                    {currentTable&& currentTable?.discount !== 0 ? <div>
                        <del style={{opacity: 0.5}}>{totalList}</del>
                        {Math.floor(totalList*(1-(currentTable?.discount/100)))}
                    </div> : 
                    <div>{totalList}</div>}
                </div>
            </>}
        </section>
    }

    const TableCommands = () => {
        return <section className='table-commands'>
            <div>
                <p>{currentTable && `Caja abierta a las ${currentTable.opened[0]} el ${currentTable.opened[1]}`}</p>
                <button className={currentTable ? "" : 'disabled'} onClick={()=>{setPop("historial")}}>
                    <FontAwesomeIcon icon={faClockRotateLeft} />Historial
                </button>
            </div>
            <div className={currentTable?.state !== "closed" && currentTable ? "" : 'disabled'}>
                <button onClick={()=>{if(currentTable?.state === "open")setPop("switch")}}>
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />Cambiar
                </button>
                <button style={currentTable?.discount ? {background: "var(--cwhite)"}: {}} onClick={()=>{if(currentTable?.state === "open")setPop("discount")}}>
                    {currentTable?.discount}<FontAwesomeIcon icon={faPercentage} />Descuento
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
                    if(currentTable?.state !== "unnactive") endTablePop(true)
                }}><FontAwesomeIcon icon={faCheckToSlot } />
                    {currentTable?.state !== "closed" ? "Cerrar" : "Cobrar"}
                </button>
            </div>
        </section>
    }
    let total = 0

    const changeTableState = (state: "open" | "paying" | "closed" | "unnactive")=>{
        let comment = state === "closed" ? "Cierre de mesa: ": "Cobro de mesa: "
        if(currentTable) EditTable(currentTable._id, "state", state, comment + calculateTotal(currentTable.products, currentTable.discount))
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
                <h6 style={{ marginBottom: 2, textAlign: "right" }}>NO VALIDO COMO FACTURA</h6>
                <hr></hr>
                <div style={{ display: "flex", gap: "1rem" }}>
                    <p>Mesa {currentTable?.number}</p>
                </div>
                <p>Abierta a las {currentTable.opened[0]} el {currentTable.opened[1]}</p>
                <p>Cerrada a las {fixNum(date.getHours()) + ":" + fixNum(date.getMinutes())} el {fixNum(date.getDate()) + "/" + fixNum(date.getMonth() + 1) + "/" + date.getFullYear()}</p>
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

    /****/

    const switchTable = (new_id: string, new_number: string)=>{
        EditTable(currentTable?._id, "switch", new_id+"/"+new_number, "Cambiada la mesa con la " + new_number)
    }


    React.useEffect(() => {
        if (scrollHeight !== null && scrollHeight !== 0) {
            let ul = document.querySelector(".table-list")
            ul?.scrollTo({top: scrollHeight})
            scrollHeight = 0
        }
    })

    return <section className='table-count'>
        {endPop && currentTable?.state !== "closed" && <ConfirmPop 
            title={"¿Cerrar mesa?"} 
            subTitle='No se podrá editar, unicamente imprimir.'
            confirm={()=>{changeTableState("closed"); endTablePop(false)}}
            close={()=>{endTablePop(false)}}
        />}
        {endPop && currentTable?.state === "closed" && <PayMethodsPop 
            products={currentTable.products}
            confirm={()=>{changeTableState("unnactive"); endTablePop(false)}}
            close={()=>{endTablePop(false)}}
        />}
        {pop === "switch" && currentTable &&
            <SwitchTable
                actual={{_id: currentTable?._id, name: currentTable.number}} 
                tablesMin={tablesMin.map(el=>{return el._id})}
                close={()=>{setPop("")}}
                confirm={(id: string, num: string)=>{switchTable(id, num); setPop("")}}
            />
        }
        {pop === "discount" && currentTable &&
            <Discount
                actual={currentTable?.discount} 
                close={()=>{setPop("")}}
                confirm={(val: string)=>{EditTable(currentTable._id, "discount", val, "Aplicado descuento del " + val + "%"); setPop("")}}
            />
        }
        {pop === "historial" && currentTable &&
            <HistorialTableComp
                table={currentTable} 
                close={()=>{setPop("")}}
            />
        }
        <Reciept />
        <Top />
        <List />
        <TableCommands />
    </section>
}


