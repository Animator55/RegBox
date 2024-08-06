import React from 'react'
import { payTypes } from '../defaults/payTypes'
import "../assets/payMethods.css"
import { Item } from '../vite-env'

type Props = {
    products: Item[]
    close: Function
    confirm: Function
}

type PayMethod = {
    type: string
    amount: string
}

export default function PayMethodsPop({ products, close, confirm }: Props) {
    const [methodsUsed, setMethods] = React.useState<PayMethod[]>([])

    let total = 0
    
    for(let i=0; i<products.length; i++) {
        total += products[i].amount! * products[i].price
    }
    let substractedTotal = total
    for(let i=0; i<methodsUsed.length; i++) {
        substractedTotal -= parseFloat(methodsUsed[i].amount)
    }


    const addNew = (e: React.FocusEvent) => {
        let div = e.currentTarget as HTMLInputElement
        if(div.value === ""|| parseFloat(div.value) < 0) return
        let value = div.value

        let select = div.previousSibling as HTMLSelectElement

        if(substractedTotal < parseFloat(value)) {
            value = `${substractedTotal}`
        }
        div.value = ""
        if(value === "0") return

        setMethods([...methodsUsed, { type: select.value, amount: `${parseFloat(value)}` }])
    }

    const Item = (el: PayMethod, index: number) => {
        const edit = (e: React.FocusEvent | React.ChangeEvent, entry: string) => {
            let div = e.currentTarget as HTMLInputElement

            let value = div.value
            if(value === "" || parseFloat(value) < 0) return setMethods([...methodsUsed.filter((item, i) => {
                if (i !== index) return item
            })])
            if(entry === "amount" && substractedTotal+parseFloat(el.amount) < parseFloat(value)) {
                value = `${substractedTotal+parseFloat(el.amount)}`
            }
            setMethods([...methodsUsed.map((item, i) => {
                if (i === index) return { ...item, [entry]: value }
                else return item
            })])
        }

        return <div key={Math.random()} className='method-item'>
            <select defaultValue={el.type} onChange={(e)=>{edit(e, "type")}}>
                {payTypes.map(type => {
                    return <option key={Math.random()} value={type}>{type}</option>
                })}</select>
            <input type='number' defaultValue={el.amount} onBlur={(e)=>{edit(e, "amount")}}
            ></input>
        </div>
    }

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop pay-meth-pop'>
            <div className='top-total'>
                <h5>Monto total de:</h5>
                <h2>{substractedTotal}</h2>
            </div>
            <hr></hr>
            <section className='methods-list'>
                {methodsUsed.length !== 0 && methodsUsed.map((el, i) => {
                    return Item(el, i)
                })}
                <div className='method-item'>
                    <select>{payTypes.map(type => {
                        return <option key={Math.random()} value={type}>{type}</option>
                    })}</select>
                    <input type='number' defaultValue={0} max={substractedTotal} onBlur={(e) => { addNew(e) }}></input>
                </div>
            </section>
            <div className='buttons-confirm'>
                <button className='secondary-button' onClick={() => { close() }}>Cancelar</button>
                <button className={substractedTotal !== 0 ? "default-button-2 disabled" : "default-button-2"} onClick={() => { if(substractedTotal === 0) confirm(methodsUsed) }}>Confirmar</button>
            </div>
        </section>
    </section>
}