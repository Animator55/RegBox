import React from 'react'

type Props = {
    close: Function
    confirm: Function
    actual: number
}

export default function Discount({actual, close, confirm}: Props) {
    const [value, setValue]= React.useState(actual)

    const checkValue = (number:number)=>{
        if(number > 100) return 100
        else if(number < 0) return 0
        else return number
    }

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop discount-pop'>
            <h2>Establecer descuento</h2>
            <div>
                <input defaultValue={value}
                    key={Math.random()}
                    className='discount-input'
                    type="number" 
                    onBlur={(e)=>{setValue(checkValue(parseFloat(e.currentTarget.value === "" ? "0" : e.currentTarget.value)))}}
                />
            </div>
            <div className='buttons-confirm'>
                <button className='secondary-button' onClick={() => { close() }}>Cancelar</button>
                <button 
                    className={value === actual ? "default-button-2 disabled" : "default-button-2"} 
                    onClick={() => { if(value !== actual) confirm(value ) }}
                >Confirmar</button>
            </div>
        </section>
    </section>
}