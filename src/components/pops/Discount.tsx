import React from 'react'

type Props = {
    close: Function
    confirm: Function
    actualVal: number
    actualType: "percent"| "amount"
    total: number 
}

export default function Discount({ actualVal,actualType, total, close, confirm }: Props) {
    const [type, setType] = React.useState<"percent" | "amount">(actualType)
    const [value, setValue] = React.useState(actualVal)
    let localTotal = total

    
    React.useEffect(()=>{
        let input = document.querySelector(".discount-input") as HTMLInputElement
        if(!input) return
        input.focus()
    })

    const checkValue = (number: number, limit: number) => {
        if (number > limit) return limit
        else if (number < 0) return 0
        else return number
    }

    const Pagging = () => {
        let isPer = type === "percent"
        return <div className='pagging'>
            <button className={isPer ? "active" : ""} onClick={() => { setType("percent") }}>Porcentaje</button>
            <button className={!isPer ? "active" : ""} onClick={() => { setType("amount") }}>Monto</button>
        </div>
    }

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop discount-pop'>
            <h2>Establecer descuento</h2>
            <Pagging />
            <div>
                <input defaultValue={value}
                    key={Math.random()}
                    className={type === "percent" ? 'discount-input' : 'discount-input amount'}
                    type="number"
                    onBlur={(e) => { setValue(checkValue(parseFloat(e.currentTarget.value === "" ? "0" : e.currentTarget.value), type === "percent" ? 100 : localTotal)) }}
                    onKeyDown={(e) => {
                        if (e.key !== "Enter") return
                        e.preventDefault()
                        let val = checkValue(parseFloat(e.currentTarget.value === "" ? "0" : e.currentTarget.value), type === "percent" ? 100 : localTotal)
                        if (val !== actualVal|| type !== actualType) confirm(type, val)
                    }}
                />
            </div>
            <div className='buttons-confirm'>
                <button className='secondary-button' onClick={() => { close() }}>Cancelar</button>
                <button
                    className={value === actualVal&& type === actualType ? "default-button-2 disabled" : "default-button-2"}
                    onClick={() => { if (value !== actualVal || type !== actualType) confirm(type, checkValue(value, type === "percent" ? 100 : localTotal)) }}
                >Confirmar</button>
            </div>
        </section>
    </section>
}