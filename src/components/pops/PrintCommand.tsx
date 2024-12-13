import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Configuration, Products } from '../../roleMains/Main'

type Props = {
    close: Function
    confirm: Function
}

export default function PrintCommand({ close, confirm }: Props) {
    const c = React.useContext(Configuration)
    const [selectedTypes, setSelectedTypes] = React.useState<string[]>([])
    const p = React.useContext(Products)


    let types = Object.keys(p)

    const handleCheck = (val: string)=>{
        if(selectedTypes.includes(val)) setSelectedTypes(selectedTypes.filter((el)=>{
            if(el !== val) return el
        }))
        else setSelectedTypes([...selectedTypes, val])
    }

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop switch-pop'>
            <h2>Imprimir comanda</h2>
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
            </section>
        </section>
    </section>
}