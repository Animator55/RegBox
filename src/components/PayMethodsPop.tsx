import React from 'react'
import { payTypes } from '../defaults/payTypes'
import "../assets/payMethods.css"
import { Item, PayMethod } from '../vite-env'

type Props = {
    products: Item[]
    close: Function
    confirm: Function
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
        let index = -1 

        for(let i=0;i<methodsUsed.length;i++) {
            if(select.value === methodsUsed[i].type) {index = i; break}
        }

        if(index === -1) setMethods([...methodsUsed, { type: select.value, amount: `${parseFloat(value)}` }])
        else setMethods(methodsUsed.map((el, i)=>{
            if(i === index) return {...el, amount : `${parseFloat(el.amount) + parseFloat(value)}`}
            else return el
        }))
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

            
            let iqualType = -1 
            for(let i=0;i<methodsUsed.length;i++) {
                if(value === methodsUsed[i].type) {iqualType = i; break}
            }

            let amountValue = parseFloat(el.amount)
            if(iqualType === -1) setMethods(methodsUsed.map((item, i) => {
                if (i === index) return { ...item, [entry]: value }
                else return item
            }))
            else {
                let array: PayMethod[] = methodsUsed
                let result = []
                
                for(let i=0; i<array.length; i++) {
                    let item = array[i]
                    if(i === iqualType && i !== index) result.push({type: value, amount : `${parseFloat(item.amount) + amountValue}`})
                    else if(i !== index) result.push(item)
                }
                setMethods(result)
            }
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