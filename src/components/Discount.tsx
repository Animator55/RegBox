import React from 'react'

type Props = {
    close: Function
    confirm: Function
    actual: number
}

export default function Discount({actual, close, confirm}: Props) {
    const [value, setValue]= React.useState(actual)

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop'>
            <input defaultValue={value}
                type="number" 
                onBlur={(e)=>{setValue(parseFloat(e.currentTarget.value === "" ? "0" : e.currentTarget.value))}}
            />
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