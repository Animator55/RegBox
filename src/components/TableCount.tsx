import { Item, PayMethod, TableType } from '../vite-env'
import "../assets/tableCount.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightArrowLeft, faBars, faCaretDown, faCaretUp, faCheckToSlot, faClockRotateLeft, faDollarSign, faList, faMinus, faPen, faPercentage, faPlus, faReceipt, faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'
import { colorSelector } from '../logic/colorSelector'
import React from 'react'
import { Configuration, Products } from '../roleMains/Main'
import orderByTypes from '../logic/orderByTypes'
import ConfirmPop from './ConfirmPop'
import PayMethodsPop from './PayMethodsPop'
import SwitchTable from './pops/SwitchTable'
import Discount from './pops/Discount'
import { calculateTotal, calculateTotalAsNumber } from '../logic/calculateTotal'
import { html_command, html_reciept } from '../defaults/reciept'
import { stateTraductions } from '../defaults/stateTraductions'
import CommentTable from './pops/CommentTable'
import PrintCommand from './pops/PrintCommand'

type Props = {
    currentTable: TableType | undefined
    selectedPhase: number
    setSelectedPhase: Function
    EditTable: Function
    addItem: Function
    managePhase: Function
    tablesMin: { _id: string, name: string, state: "open" | "paying" | "closed" | "unnactive" }[]
}
let scrollHeight = 0

export default function TableCount({ currentTable, EditTable, addItem, managePhase, tablesMin, selectedPhase, setSelectedPhase }: Props) {
    const [endPop, endTablePop] = React.useState(false)
    const [pop, setPop] = React.useState("")
    const [selected, setSelected] = React.useState<{ item: Item, phase: number } | undefined>(undefined)

    const c = React.useContext(Configuration)
    const p = Object.keys(React.useContext(Products).list)

    const print_func = (defaultValue?: Item[][] ) => {
        if (currentTable?.state !== "closed" && currentTable?.state !== "open") return
        //make print the command type structure
        let html =defaultValue !== undefined ? html_command({...currentTable, products: defaultValue}) : html_reciept(currentTable, p)
        if (!html) return
        var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (!WinPrint) return
        WinPrint.document.write(html);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }

    const openPop = () => {
        let button = document.querySelector(".historial-general-pop-button") as HTMLButtonElement
        button.dataset.page = "true"
        button.click()
    }

    const goTo = (page: string) => {
        let nav = document.getElementById("main-router")
        if (!nav) return
        let element

        if (page === "products") element = nav.children[0] as HTMLButtonElement
        else element = nav.children[1] as HTMLButtonElement

        element.click()
    }
    //// dom animation
    const switchPhasesAnimation = (index: number, toIndex: number) => {
        let target = document.getElementById("phase_" + index) as HTMLButtonElement
        let target2 = document.getElementById("phase_" + toIndex) as HTMLButtonElement
        if (!target || !target2) return
        let toRight = index < toIndex
        target.classList.remove("selected")
        target.classList.add(toRight ? "slide-to-down" : "slide-to-up")
        target2.classList.add(!toRight ? "slide-to-down" : "slide-to-up")
    }

    const movePhase = (index: number, toIndex: number) => {
        if (index === undefined || toIndex === undefined || !currentTable) return
        let value: Item[] | undefined = undefined
        let newResult = currentTable.products.map((el, i) => {
            if (i === index) {
                value = el
                return "PH"
            }
            else return el
        })
        if (value === undefined) return
        let checkedToIndex = toIndex < index ? toIndex : toIndex + 1
        newResult.splice(checkedToIndex, 0, value)
        let preFilter = newResult
        let settedValue = []
        for (let i = 0; i < preFilter.length; i++) {
            if (typeof preFilter[i] !== "string") settedValue.push(preFilter[i])
        }
        switchPhasesAnimation(index, toIndex)
        setTimeout(() => {
            if (selectedPhase === index) setSelectedPhase(toIndex)
            else if (selectedPhase === toIndex) setSelectedPhase(index)
            EditTable(currentTable._id, "products", settedValue as Item[][],
                ("Cambiada de lugar la fase " + index + " a " + toIndex)
            )
        }, 500)
    }

    const Top = () => {
        return <header className='table-head'>
            {currentTable ? <>
                <h2>Mesa {currentTable.name}</h2>
                <p style={{ color: colorSelector[currentTable.state] }}>{stateTraductions[currentTable.state]}</p>
                <div className='after' style={{ backgroundColor: colorSelector[currentTable.state] }}></div>
            </>
                :
                <h2 style={{ opacity: 0 }}>Empty</h2>
            }
        </header>
    }

    /**** LIST ****/

    const List = () => {
        let products: Item[][] | undefined = currentTable?.products

        const columns = ["", "Nombre", "Precio", "Total", "Cantidad",]

        let isProds = products && products.length !== 0
        let titles = c.config.orderedLists
        let totalList = 0
        let reOrdered = products

        return <section className={currentTable?.state !== "closed" ? 'content' : "content disabled-c"}>
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
                {isProds ? reOrdered && reOrdered.map((pha, i) => {
                    let orderedPha = titles ? orderByTypes(pha, p, true) : pha
                    return <section
                        className={selectedPhase === i ? "active" : ""}
                        key={Math.random()}
                        onClick={() => { setSelectedPhase(i) }}
                    >
                        <div className='label' id={'phase_' + i}>
                            <p>Fase {i + 1}</p>
                            {pha.length > 0 && selectedPhase === i && <>
                                {i > 0 && <button onClick={() => { if (i > 0) movePhase(i, (i - 1)) }}>
                                    <FontAwesomeIcon icon={faCaretUp} />
                                </button>}
                                {(currentTable && i !== currentTable.products.length - 1) && <button
                                    onClick={() => { if (i !== currentTable.products.length - 1) movePhase(i, (i + 1)) }}>
                                    <FontAwesomeIcon icon={faCaretDown} />
                                </button>}
                            </>}
                            {pha.length === 0 && selectedPhase === i &&
                                <button onClick={() => {
                                    managePhase(i, false)
                                }}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>}
                        </div>
                        {orderedPha && orderedPha.length > 0 && orderedPha.map(item => {
                            let header = false
                            if (titles && item.header) header = true
                            else totalList += item.amount! * item.price
                            return header ? <div className='title' key={Math.random()}>{item.type}</div>
                                : <li title={item.name} id={item._id + "phase:" + i} key={Math.random()}>
                                    <div><button
                                        className={item.comment && item.comment !== "" ? 'comment-item active' : 'comment-item'}
                                        onClick={() => { setPop("comment"); setSelected({ item: item, phase: i }) }}
                                    >
                                        <FontAwesomeIcon icon={faPen} />
                                    </button></div>
                                    <div>{item.name}</div>
                                    <div>${item.price}</div>
                                    <div>${item.price * item.amount!}</div>
                                    <div>{item.amount}</div>
                                    <div className='amount-buttons'>
                                        <button onClick={() => { addItem(item, 1, i) }}><FontAwesomeIcon icon={faPlus} /></button>
                                        <button onClick={() => { addItem(item, -1, i) }}><FontAwesomeIcon icon={faMinus} /></button>
                                    </div>
                                </li>
                        })}
                    </section>
                })
                    :
                    <section className='alert'>
                        <FontAwesomeIcon icon={faWarning} />
                        <h2>{!currentTable ? "No hay mesa seleccionada."
                            : "No hay productos añadidos a esta mesa."
                        }</h2>
                        <button className='default-button' onClick={() => { goTo(!currentTable ? "map" : "products") }}>
                            {!currentTable ? "Ir al mapa" : "Ir a la lista"}
                        </button>
                    </section>
                }
            </ul>
            {isProds && <>
                <hr></hr>
                <div className="total">
                    <div>Total</div>
                    {currentTable && currentTable?.discount !== 0 ? <div>
                        <del style={{ opacity: 0.5 }}>{totalList}</del>
                        {currentTable.discountType === "percent" ?
                            Math.floor(totalList * (1 - (currentTable?.discount / 100))) : totalList - currentTable.discount
                        }
                    </div> :
                        <div>{totalList}</div>}
                </div>
            </>}
        </section>
    }

    const TableCommands = () => {
        let openHour = currentTable ? `Caja abierta a las ${currentTable.opened[0]} ${currentTable.opened[1]}` : ""
        return <section className='table-commands'>
            <div>
                <p title={openHour}>{currentTable ? openHour : ""}</p>
                <button className={currentTable ? "" : 'disabled'} onClick={() => { openPop() }}>
                    <FontAwesomeIcon icon={faClockRotateLeft} />Historial
                </button>
            </div>
            <div className={currentTable?.state !== "closed" && currentTable ? "" : 'disabled'}>
                <button onClick={() => { managePhase(0, true) }}>
                    <FontAwesomeIcon icon={faPlus} />
                    Añadir Fase
                </button>
            </div>
            <div className={currentTable?.state !== "closed" && currentTable ? "" : 'disabled'}>
                <button onClick={() => { if (currentTable?.state === "open") setPop("switch") }}>
                    <FontAwesomeIcon icon={faArrowRightArrowLeft} />Cambiar
                </button>
                <button style={currentTable?.discount ? { background: "var(--cwhite)" } : {}} onClick={() => { if (currentTable?.state === "open") setPop("discount") }}>
                    <div>
                        {currentTable?.discountType === "amount" && <FontAwesomeIcon icon={faDollarSign} />}
                        {currentTable?.discount}
                    </div>
                    {currentTable?.discountType === "percent" && <FontAwesomeIcon icon={faPercentage} />}
                    Descuento
                </button>
            </div>
            <div className={currentTable ? "" : 'disabled'}>
                <button className={!currentTable || currentTable 
                && (currentTable?.state === "closed" || currentTable?.state === "open") ? "" : 'disabled'}
                    onClick={() => {
                        if(!currentTable) return
                        if (currentTable?.state === "open") setPop("print")
                        else if (currentTable?.state === "closed") print_func()
                    }}><FontAwesomeIcon icon={faReceipt} />Imprimir</button>
                <button className={currentTable?.state !== "closed" ? "" : "confirm"} onClick={() => {
                    if (currentTable?.state !== "unnactive") endTablePop(true)
                }}><FontAwesomeIcon icon={faCheckToSlot} />
                    {currentTable?.state !== "closed" ? "Cerrar" : "Cobrar"}
                </button>
            </div>
        </section>
    }

    const changeTableState = (state: "open" | "paying" | "closed" | "unnactive") => {
        let comment = state === "closed" ? "Cierre de mesa: " : "Cobro de mesa: "
        if (currentTable) EditTable(currentTable._id, "state", state, comment + calculateTotal(currentTable.products.flat(), currentTable.discount, currentTable.discountType),)
    }

    /****/

    const switchTable = (new_id: string, new_number: string) => {
        EditTable(currentTable?._id, "switch", new_id + "/" + new_number, "Cambiada la mesa con la " + new_number)
    }
    const addComment = (comment: string) => {
        if (!currentTable || !selected) return
        let item = selected
        let name = ""
        let result = []

        for(let i=0; i<currentTable.products.length;i++){
            if(i !== item.phase) result.push(currentTable.products[i])
            else {
                let newPhase = []
                for(let j=0; j<currentTable.products[i].length; j++){
                    let el = currentTable.products[i][j]
                    if (el._id !== item.item._id) newPhase.push(el)
                    else { name = el.name; newPhase.push({ ...el, comment: comment }) }
                }
                result.push(newPhase)
            }
        }
        EditTable(currentTable?._id, "products", result, "Cambiado el comentario de " + name)
        setSelected(undefined)
    }

    React.useEffect(() => {
        if (scrollHeight !== null && scrollHeight !== 0) {
            let ul = document.querySelector(".table-list")
            ul?.scrollTo({ top: scrollHeight })
            scrollHeight = 0
        }
    })

    React.useEffect(() => {
        if (currentTable && currentTable.state === "closed" && currentTable.payMethod !== undefined) {
            changeTableState("unnactive");
            endTablePop(false)
        }
    }, [currentTable])

    return <section className='table-count'>
        {endPop && currentTable?.state !== "closed" && <ConfirmPop
            title={"¿Cerrar mesa?"}
            subTitle='No se podrá editar, unicamente imprimir.'
            confirm={() => {
                changeTableState("closed");
                endTablePop(false)
            }}
            close={() => { endTablePop(false) }}
        />}
        {endPop && currentTable?.state === "closed" && <PayMethodsPop
            products={currentTable.products.flat()}
            discount={currentTable.discount}
            discountType={currentTable.discountType}
            confirm={(val: PayMethod[]) => {
                EditTable(currentTable?._id, "payMethod", val, "Metodo de pago: " + val.map(el => { return el.type + ": " + el.amount }).join(", "))
            }}
            close={() => { endTablePop(false) }}
        />}
        {pop === "comment" && currentTable && selected &&
            <CommentTable
                selected={selected.item}
                close={() => { setPop("") }}
                confirm={addComment}
            />
        }
        {pop === "switch" && currentTable &&
            <SwitchTable
                actual={{ _id: currentTable?._id, name: currentTable.name }}
                tablesMin={tablesMin.map(el => { return el._id })}
                close={() => { setPop("") }}
                confirm={(id: string, num: string) => { switchTable(id, num); setPop("") }}
            />
        }
        {pop === "print" && currentTable &&
            <PrintCommand
                current={currentTable}
                close={() => { setPop("") }}
                confirm={(result: Item[][]) => { print_func(result) }}
            />
        }
        {pop === "discount" && currentTable &&
            <Discount
                total={calculateTotalAsNumber(currentTable.products.flat(), 0, currentTable.discountType)}
                actualVal={currentTable?.discount}
                actualType={currentTable?.discountType}
                close={() => { setPop("") }}
                confirm={(type: string, val: string) => {
                    let comment = type === "percent" ? ("Aplicado descuento del " + val + "%") : ("Aplicado descuento de $" + val)
                    EditTable(currentTable._id, "discount", val, comment, type);
                    setPop("")
                }
                }
            />
        }
        <Top />
        <List />
        <TableCommands />
    </section>
}


