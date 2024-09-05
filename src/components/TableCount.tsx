import { Item, PayMethod, TableType } from '../vite-env'
import "../assets/tableCount.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft, faCheckToSlot, faClockRotateLeft, faMinus, faPercentage, faPlus, faReceipt, faWarning } from '@fortawesome/free-solid-svg-icons'
import { colorSelector } from '../logic/colorSelector'
import React from 'react'
import { Configuration, Products } from '../roleMains/Main'
import orderByTypes from '../logic/orderByTypes'
import ConfirmPop from './ConfirmPop'
import PayMethodsPop from './PayMethodsPop'
import SwitchTable from './SwitchTable'
import Discount from './Discount'
import { calculateTotal } from '../logic/calculateTotal'
import { html_reciept } from '../defaults/reciept'
import { stateTraductions } from '../defaults/stateTraductions'

type Props = {
    currentTable: TableType | undefined
    EditTable: Function
    addItem: Function
    tablesMin: {_id: string, number: string, state: "open" | "paying" | "closed" | "unnactive"}[]
}
let scrollHeight = 0

export default function TableCount({ currentTable, EditTable, addItem, tablesMin}: Props) {
    const [endPop, endTablePop] = React.useState(false)
    const [pop, setPop] = React.useState("")

    const c = React.useContext(Configuration)
    const p = Object.keys(React.useContext(Products).list)

    const print = () => {
        if(currentTable?.state !== "closed") return
        let html = html_reciept(currentTable, p)
        if (!html) return
        var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (!WinPrint) return
        WinPrint.document.write(html);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }

    const openPop = ()=>{
        let button = document.querySelector(".historial-general-pop-button") as HTMLButtonElement
        button.dataset.page = "true"
        button.click()
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
                <h2>Mesa {currentTable.number}</h2>
                <p style={{color:  colorSelector[currentTable.state]}}>{stateTraductions[currentTable.state]}</p>
                <div className='after' style={{ backgroundColor: colorSelector[currentTable.state] }}></div>
            </> 
            :
            <h2 style={{ opacity: 0 }}>Empty</h2>
            }
        </header>
    }

    /**** LIST ****/

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
                    {/* <button className='default-button' onClick={() => { c.setConfig({ ...c.config, orderedLists: !titles }) }}>
                        <FontAwesomeIcon icon={titles ? faList : faBars} />
                    </button> */}
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
                                <button onClick={() => { addItem(item, 1) }}><FontAwesomeIcon icon={faPlus} /></button>
                                <button onClick={() => { addItem(item, -1) }}><FontAwesomeIcon icon={faMinus} /></button>
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
                <p>{currentTable && `Caja abierta a las ${currentTable.opened[0]} ${currentTable.opened[1]}`}</p>
                <button className={currentTable ? "" : 'disabled'} onClick={()=>{openPop()}}>
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
                <button className={!currentTable || currentTable && currentTable?.state === "closed" ? "" : 'disabled'}
                 onClick={print}><FontAwesomeIcon icon={faReceipt} />Imprimir</button>
                <button className={currentTable?.state !== "closed" ? "": "confirm"} onClick={()=>{
                    if(currentTable?.state !== "unnactive") endTablePop(true)
                }}><FontAwesomeIcon icon={faCheckToSlot } />
                    {currentTable?.state !== "closed" ? "Cerrar" : "Cobrar"}
                </button>
            </div>
        </section>
    }

    const changeTableState = (state: "open" | "paying" | "closed" | "unnactive")=>{
        let comment = state === "closed" ? "Cierre de mesa: ": "Cobro de mesa: "
        if(currentTable) EditTable(currentTable._id, "state", state, comment + calculateTotal(currentTable.products, currentTable.discount),)
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

    React.useEffect(()=>{
        if(currentTable && currentTable.state === "closed" && currentTable.payMethod !== undefined) {
            changeTableState("unnactive"); 
            endTablePop(false)
        }
    }, [currentTable])

    return <section className='table-count'>
        {endPop && currentTable?.state !== "closed" && <ConfirmPop 
            title={"¿Cerrar mesa?"} 
            subTitle='No se podrá editar, unicamente imprimir.'
            confirm={()=>{
                changeTableState("closed"); 
                endTablePop(false)
            }}
            close={()=>{endTablePop(false)}}
        />}
        {endPop && currentTable?.state === "closed" && <PayMethodsPop 
            products={currentTable.products}
            discount={currentTable.discount}
            confirm={(val:PayMethod[])=>{
                EditTable(currentTable?._id, "payMethod", val, "Metodo de pago: " +val.map(el=>{return el.type +": "+el.amount}).join(", "))
            }}
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
        <Top />
        <List />
        <TableCommands />
    </section>
}


