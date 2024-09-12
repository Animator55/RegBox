import { faPrint, faRightFromBracket, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HistorialTableType, Item, router, TableEvents } from '../vite-env'
import { Products } from '../roleMains/Main'
import React from 'react'
import orderByTypes from '../logic/orderByTypes'
import { payTypes } from '../defaults/payTypes'
import { html_result } from '../defaults/reciept'
import ConfirmPop from './ConfirmPop'

type Props = {
    close: Function
    logout: Function
}

export default function CloseSession({ close, logout }: Props) {
    /// creating Tables historial, each entry as (open > prods > close)

    const [pop, setPop] =React.useState(false)
    const p = React.useContext(Products)
    let array: TableEvents[] = []

    for (const key in window.localStorage) {
        if (key.startsWith("RegBoxID:")) {
            let stor: HistorialTableType = JSON.parse(window.localStorage[key])

            array.push(...stor.historial.map(el => {
                return { ...el, number: stor.number, _id: stor._id }
            }))
        }
    }
    /// payMethods

    let payMethodsObj: router = {}
    for (let i = 0; i < payTypes.length; i++) {
        payMethodsObj[payTypes[i]] = 0
    }
    /// prods

    let compiledProdList: Item[][] = []

    for(let j=0; j<array.length;j++) {
        let el = array[j]
        if (el.state === "unnactive") {
            if(el.payMethod && el.payMethod?.length !== 0) for (let i = 0; i < el.payMethod?.length; i++) {
                payMethodsObj[el.payMethod[i].type] += parseFloat(el.payMethod[i].amount)
            }
            compiledProdList.push(el.products)
        }
    }
    let combinedArray = compiledProdList.flat().reduce((acc: Item[], curr) => {
        const found = acc.find((item: Item) => { if (item._id === curr._id && item.price === curr.price) return item })
        if (found) {
            let item = found as Item
            item.amount! += curr.amount!;
        } else {
            acc.push({ ...curr });
        }
        return acc;
    }, []);

    let headers = orderByTypes(combinedArray, Object.keys(p.list), true)

    let total = 0
    let payNumbersArray = []

    for (const key in payMethodsObj) {
        total += key === "Descontado" ? 0:payMethodsObj[key]
        payNumbersArray.push(<div key={Math.random()}>{key} : {" $" + payMethodsObj[key]}</div>)
    }
    const getAngle = (percent: number) => {
        let angle = (percent * 360) / 100
        return `${angle}deg`
    }

    const getPercent = (amount: number) => {
        let percent = (amount * 100) / total
        return percent
    }

    const print = () => {
        if (headers === undefined) return
        let html = html_result(headers, payMethodsObj)
        if (!html) return
        var WinPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
        if (!WinPrint) return
        WinPrint.document.write(html);
        WinPrint.document.close();
        WinPrint.focus();
        WinPrint.print();
        WinPrint.close();
    }

    const payColorSelector: router = {
        "Debito": "#65ffd8",
        "Credito": "#ff6d6d",
        "Efectivo": "#46c446",
        "Transferencia": "#fdff6c",
        "Descontado": "#ffffff"
    }

    const CakeChart = () => {
        let entries = Object.keys(payMethodsObj)
        let stacked = 0

        return <section className='pie-container'>
            {entries.map((key, i) => {
                if(key === "Descontado")return null
                let val = i === 0 ? entries[0] : entries[i - 1]
                let value = getPercent(payMethodsObj[val])
                stacked += value
                return <div
                    key={Math.random()}
                    title={key}
                    data-entry={key}
                    className="pie animate no-round"
                    style={{ rotate: getAngle(stacked) }}
                ></div>
            })}
        </section>
    }

    const PayNumbers = () => {
        return <section className='pay-numbers'>
            {Object.keys(payMethodsObj).map(key => {
                return <React.Fragment key={Math.random()}>
                    <div style={{ background: payColorSelector[key] }} className="dot"></div>
                    <div>{key}</div>
                    <div style={key === "Descontado" ? {opacity: 0.7}:{}} className='number'>{"$" + payMethodsObj[key]}</div>
                </React.Fragment>
            })}
            <><div className='dot'></div><div><b>Total</b></div><div className='number'><b>${total}</b></div></>
        </section>
    }

    React.useEffect(() => {
        let pieContainer = document.querySelector(".pie-container")

        if (!pieContainer) return
        for (let i = 0; i < pieContainer?.children.length; i++) {
            let div = pieContainer.children[i] as HTMLDivElement
            let entry = div.dataset.entry

            div.style.setProperty("--p", `${getPercent(payMethodsObj[entry as string])}`)
            div.style.setProperty("--c", payColorSelector[entry as string])
        }
    })


    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        {pop && <ConfirmPop
            title={"¿Cerrar Sesión?"}
            subTitle={"El historial se borrará y se cerrará la sesión, reinciando la página. Deseas proseguir?"}
            confirm={()=>{setPop(false); logout()}}
            close={()=>{setPop(false)}}
        />}
        <section className='pop'>
            <header>
                <div className='pop-top'>
                    <h2>Cierre de Sesión</h2>
                    <button onClick={() => { close() }}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
            </header>
            <section className='pop-content' style={{padding: "1rem 1.5rem"}}>
                <div className='prod-container'>
                    <div className='top-result-prod'>
                        <div>Nombre</div>
                        <div>Precio</div>
                        <div>Cantidad</div>
                    </div>
                    <ul className='result-prod-list'>
                        {headers && headers.map(el => {
                            return el.header ? <label key={Math.random()}>{el.type}</label> :
                                <li key={Math.random()}>
                                    <div>{el.name}</div>
                                    <div>${el.price}</div>
                                    <div>{el.amount}</div>
                                </li>
                        })}
                    </ul>
                </div>
                <section className='result-side'>
                    <div className='result-container'>
                        <CakeChart />
                        <PayNumbers />
                    </div>
                    <button className='default-button' onClick={() => { print() }}>
                        <FontAwesomeIcon icon={faPrint} />
                        Imprimir
                    </button>
                    <button className='default-button' onClick={() => { setPop(true) }}>
                        <FontAwesomeIcon icon={faRightFromBracket} />
                        Cerrar Sesión
                    </button>
                </section>
            </section>
        </section>
    </section>
}