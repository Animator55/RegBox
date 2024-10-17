import React from "react"

type Props = {
    options: string[]
    actual: string
    close:Function
    confirm:Function
}

const orderNameTranslations:{[key:string]: string}={
    abc: "Alfabético",
    "abc-r": "Alfabético Inverso",
    def: "Creación",
    "def-r": "Creación Inverso",
}

export default function OrderListPop ({options, actual, close, confirm}: Props) {
    const [selected, setSelected] = React.useState(actual)

    const confirmHandler = ()=>{
        if(selected === "" && selected === actual) return
        confirm(selected)
    }

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop switch-pop'>
            <h2>Ordenar</h2>
            <select value={selected} onChange={(e)=>{
                let val = e.target.value
                setSelected(val)
            }}>
                {options.length!==0 &&options.map((opt)=>{
                    return <option key={Math.random()} value={opt}>
                        {orderNameTranslations[opt]}
                    </option>
                })}
            </select>
            <div className='buttons-confirm'>
                <button className='secondary-button' onClick={() => { close() }}>Cancelar</button>
                <button 
                    className={selected === actual || selected === "" ? "default-button-2 disabled" : "default-button-2"} 
                    onClick={confirmHandler}
                >Confirmar</button>
            </div>
        </section>
    </section>
}