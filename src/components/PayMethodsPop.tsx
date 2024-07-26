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

    const addNew = (e: React.FocusEvent) => {
        let div = e.currentTarget as HTMLInputElement
        if(div.value === "") return

        let select = div.previousSibling as HTMLSelectElement

        setMethods([...methodsUsed, { type: select.value, amount: `${parseFloat(div.value)}` }])
        div.value = ""
    }

    const Item = (el: PayMethod, index: number) => {
        const edit = (e: React.FocusEvent | React.ChangeEvent, entry: string) => {
            let div = e.currentTarget as HTMLInputElement
            setMethods([...methodsUsed.filter((item, i) => {
                if (i === index) return { ...item, [entry]: div.value }
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
                <h2>{total}</h2>
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
                    <input type='number' defaultValue={"0"} onBlur={(e) => { addNew(e) }}></input>
                </div>
            </section>
            <div className='buttons-confirm'>
                <button className='secondary-button' onClick={() => { close() }}>Cancelar</button>
                <button className="default-button-2" onClick={() => { confirm() }}>Confirmar</button>
            </div>
        </section>
    </section>
}