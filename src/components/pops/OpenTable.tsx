import React from 'react'

type Props = {
    close: Function
    confirm: Function
}

export default function OpenTable({confirm, close }: Props) {
    const [selected, setSelected] = React.useState("")
    const confirmHandler = () => {
        if (selected === "" || selected === undefined) return
        confirm(selected)
    }

    React.useEffect(()=>{
        let input = document.querySelector(".discount-input") as HTMLInputElement
        if(!input) return
        input.focus()
    })


    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop confirm-pop'>
            <h2>Abrir Mesa</h2>
            <input 
                className='discount-input' 
                defaultValue={selected} 
                onBlur={(e)=>{setSelected(e.currentTarget.value)}}
                onKeyDown={(e)=>{if(e.key === "Enter") confirm(e.currentTarget.value)}}
            />
            <div className='buttons-confirm'>
                <button className='secondary-button' onClick={() => { close() }}>Cancelar</button>
                <button 
                    className={selected === "" ? "default-button-2 disabled" : "default-button-2"} 
                    onClick={() => { confirmHandler() }}
                >Confirmar</button>
            </div>
        </section>
    </section>
}