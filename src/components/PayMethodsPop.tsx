import React from 'react'
import { payTypes } from '../defaults/payTypes'

type Props = {
    total: number
    close: Function
    confirm: Function
}

type PayMethod = {
    type: string
    amount: string
}

export default function PayMethodsPop({ total, close, confirm }: Props) {
    const [methodsUsed, setMethods] = React.useState<PayMethod[]>([])

    const addNew = (e: React.FocusEvent) => {
        let div = e.currentTarget as HTMLInputElement
        if(div.value === "") return

        let select = div.previousSibling as HTMLSelectElement

        setMethods([...methodsUsed, { type: select.value, amount: div.value }])
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

        return <div key={Math.random()}>
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
        <section className='pop'>
            <div>
                <h5>Monto total de:</h5>
                <h2>{total}</h2>
            </div>
            <hr></hr>
            <section>
                {methodsUsed.length !== 0 && methodsUsed.map((el, i) => {
                    return Item(el, i)
                })}
                <div>
                    <select>{payTypes.map(type => {
                        return <option key={Math.random()} value={type}>{type}</option>
                    })}</select>
                    <input type='number' onBlur={(e) => { addNew(e) }}></input>
                </div>
            </section>
            <div>
                <button onClick={() => { confirm() }}>Confirmar</button>
            </div>
        </section>
    </section>
}