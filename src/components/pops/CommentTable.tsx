import React from 'react'
import { Item } from '../../vite-env'

type Props = {
    close: Function
    confirm: Function
    selected: Item
}

export default function CommentTable({ selected, close, confirm }: Props) {
    const [value, setValue] = React.useState(selected.comment ? selected.comment : "")

    const confirmHandler = () => {
        if (value === "" && (selected.comment && value === selected.comment)) return
        confirm(value)
    }

    React.useEffect(() => {
        let textarea = document.querySelector("textarea")
        if(textarea) textarea.focus()
    })

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop switch-pop'>
            <h2>Añadir comentario</h2>
            <textarea placeholder='Escribe el comentario...' value={value} onChange={(e) => { setValue(e.target.value) }}>
            </textarea>
            <div>
                {selected.presets && selected.presets.map(el => {
                    return <button
                        key={Math.random()}
                        onClick={() => { setValue(el) }}
                        className='preset-tag-adder'>
                        {el}
                    </button>
                })}
            </div>
            <div className='buttons-confirm'>
                <button className='secondary-button' onClick={() => { close() }}>Cancelar</button>
                <button
                    className={(selected.comment && selected.comment === value) || value === "" ? "default-button-2 disabled" : "default-button-2"}
                    onClick={confirmHandler}
                >Confirmar</button>
            </div>
        </section>
    </section>
}