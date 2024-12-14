import { faCheckSquare, faSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Configuration, Products } from '../../roleMains/Main'
import { TableType } from '../../vite-env'

type Props = {
    current: TableType
    close: Function
    confirm: Function
}

export default function PrintCommand({ current, close, confirm }: Props) {
    const c = React.useContext(Configuration)

    let types: string[] = []

    for (let i = 0; i < current.products.length; i++) {
        let phase = current.products[i]
        for (let j = 0; j < phase.length; j++) {
            if (!types.includes(phase[j].type)) types.push(phase[j].type)
        }
    }

    const [selectedTypes, setSelectedTypes] = React.useState<string[]>(types)
    const handleCheck = (val: string) => {
        if (selectedTypes.includes(val)) setSelectedTypes(selectedTypes.filter((el) => {
            if (el !== val) return el
        }))
        else setSelectedTypes([...selectedTypes, val])
    }

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop print-pop'>
            <header>
                <h2>Imprimir Comanda</h2>
                <button onClick={() => { close() }}><FontAwesomeIcon icon={faXmark} /></button> 
            </header>
            <section className='print-command-divisor'>
                <nav>
                    {types && types.length !== 0 && types.map(el => {
                        return <div className="checkbox" onClick={() => { handleCheck(el) }}>
                            <p>{el}</p>
                            <button style={{ color: selectedTypes.includes(el) ? "var(--corange)" : "var(--cblack)" }}>
                                <FontAwesomeIcon icon={selectedTypes.includes(el) ? faCheckSquare : faSquare} />
                            </button>
                        </div>
                    })}
                </nav>
                <section className='command-preview'>
                    {current.products.map((pha, i) => {
                        if (pha.length === 0) return null
                        return <div key={Math.random()}>
                            <label>Tiempo {i}</label>
                            <div>
                                {pha.map(el => {
                                    return selectedTypes.includes(el.type) &&
                                        <li key={Math.random()}>
                                            {el.amount!} X {el.name}
                                        </li>
                                })}
                            </div>
                        </div>
                    })}
                </section>
            </section>
        </section>
    </section>
}