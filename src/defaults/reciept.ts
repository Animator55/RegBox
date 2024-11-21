import { domainType, selectDomainById } from "../logic/API"
import fixNum from "../logic/fixDateNumber"
import { renewedOrderByTypes } from "../logic/orderByTypes"
import { router, sessionType, TableType } from "../vite-env"


export const html_reciept = (currentTable: TableType, types: string[]) => {
    if (!currentTable) return
    let total = 0
    let date = new Date()

    let result = renewedOrderByTypes(currentTable.products.flat(), types).flat()

    let prodList = []
    if (result) for (let i = 0; i < result.length; i++) {
        let el = result[i]
        total += el.price * el.amount!

        let prefix = el.amount === 1 ? "" : `(${el.amount + "*$" + el.price + " "})`

        prodList.push(`
            <p style="font-size:0.65rem;margin: 3px 0;">${el.name}</p>
            <p style="font-size:0.65rem;margin: 3px 0;text-align: right;">${prefix + "$" + el.price * el.amount!}</p>`)
    }

    let stor = window.localStorage.getItem("RegBoxSession")
    let title = "Cuenta"
    if(stor && stor !== "") {
        let dom = selectDomainById(JSON.parse(stor).domain) as domainType
        if(dom) title = dom.name
    }

    let HTML = `<div className='reciept' style="font-family:'Kanit', sans-serif;">
            <div className='content-reciept'>
                <h3 style="text-align: center;">${title}</h3>
                <h6 style="marginBottom: 2; text-align:right;">NO VALIDO COMO FACTURA</h6>
                <hr></hr>
                <div style="display: flex; gap: 1rem;">
                    <p style="font-size:0.65rem;margin: 3px 0;">Mesa ${currentTable?.name}</p>
                </div>
                <p style="font-size:0.65rem;margin: 3px 0;">
                    Abierta a las ${currentTable.opened[0]} el ${currentTable.opened[1]}
                </p>
                <p style="font-size:0.65rem;margin: 3px 0;">
                    Cerrada a las ${fixNum(date.getHours()) + ":" + fixNum(date.getMinutes())} el ${fixNum(date.getDate()) + "/" + fixNum(date.getMonth() + 1) + "/" + date.getFullYear()}
                </p>
                <hr></hr>
                <div style="display: flex;">
                    <p style="font-size:0.65rem;margin: 3px 0;">Articulo</p>
                    <p style="font-size:0.65rem;margin: 3px 0;margin-left:auto;">Precio</p>
                </div>
                <hr></hr>
                <div style="display: grid; grid-template-columns: 70% 30%;">
                    ${prodList.join("")}
                </div>
                <hr />
                <div style="display: flex;">
                    <p style="font-size: 0.9rem;margin: 3px 0;"><b>Total</b></p>
                    <p style="display:flex; align-items:center; gap: 0.7rem; margin: 3px 0;margin-left: auto; font-size: 0.9rem;">
                        ${currentTable.discount === 0 ? `<b>$${total}</b>`:
                            `<del>$${total}</del>
                            <b>$
                            ${currentTable.discountType === "percent" ? 
                                (Math.floor(total*(1-(currentTable?.discount/100)))): (total - currentTable.discount)
                            }</b>`
                        }
                    </p>
                </div>
            </div>
        </div>
    `
    return HTML
}
export const html_result = (array: any[], payMethods: router) => {
    let session = window.localStorage.getItem("RegBoxSession")
    if(!session || session === "") return ""
    let parsedSession: sessionType = JSON.parse(session)
 
    let total = 0
    let date = new Date()
    let hour = fixNum(date.getHours()) + ":" + fixNum(date.getMinutes())
    let day = fixNum(date.getDate()) + "/" + fixNum(date.getMonth() + 1) + "/" + date.getFullYear()
    let closed = `${hour} - ${day}`
    console.log(payMethods)

    let prodList = []
    if(array.length !== 0) for (let i = 0; i < array.length; i++) {
        let el = array[i]
        if(el.header) {
            prodList.push("<p style='font-size:0rem;margin: 1px 0;'>---</p><p style='font-size:0;margin: 1px 0;'></p>")
            continue
        }

        prodList.push(`
            <p style="font-size:0.6rem;margin: 1px 0;">${el.name}</p>
            <p style="font-size:0.6rem;margin: 1px 0;text-align: right;">${el.amount!}</p>`)
    }
    else prodList.push('<p style="font-size:0.65rem;margin: 3px 0;">No se vendieron productos</p>')

    let payArray = []

    for(const key in payMethods) {
        total += payMethods[key]
        payArray.push(`
            <p style="font-size:0.85rem;margin: 3px 0;">${key}</p>
            <p style="font-size:0.85rem;margin: 3px 0;text-align: right;">$${payMethods[key]}</p>`)
    }


    let HTML = `<div className='reciept' style="font-family:'Kanit', sans-serif;">
            <div className='content-reciept'>
                <h3 style="text-align: center;">Cierre de caja</h3>
                <p style="font-size:0.85rem;margin: 3px 0;">Abierta a las ${parsedSession.opened}</p>
                <p style="font-size:0.85rem;margin: 3px 0;">Cerrada a las ${closed}</p>
                <hr></hr>
                <section style="
                    border: 1px solid black;
                    border-radius: 5px;
                    padding: 10px;
                ">
                    <div style="display: grid; grid-template-columns: 50% 50%;">
                        ${payArray.join("")}
                    </div>
                    <hr/>
                    <div style="display: flex;">
                        <p style="font-size: 0.9rem;margin: 3px 0;"><b>Total</b></p>
                        <p style="margin: 3px 0;margin-left: auto; font-size: 0.9rem;"><b>$${total}</b></p>
                    </div>
                </section>
                <hr />
                <div style="
                    display: grid; 
                    grid-template-columns: 79% 20%;
                    gap: 1%;
                    border-radius: 5px;
                ">
                    ${prodList.join("")}
                </div>
            </div>
        </div>
    `
    return HTML
}