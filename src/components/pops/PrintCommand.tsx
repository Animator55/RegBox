import { faCheckSquare, faPrint, faSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { Configuration } from '../../roleMains/Main'
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

    const handleCheck = (val: string) => {
        if (c.config.printCommand.includes(val)) c.setConfig({
            ...c.config, printCommand: c.config.printCommand.filter((el) => {
                if (el !== val) return el
            })
        })
        else c.setConfig({ ...c.config, printCommand: [...c.config.printCommand, val] })
    }

    const selectAll = ()=>{
        let add: string[] = []
        for(let i=0; i<types.length;i++){
            if(c.config.printCommand.includes(types[i])) continue
            add.push(types[i])
        }
        c.setConfig({...c.config, printCommand: [...c.config.printCommand, ...add]})
    }

    let list = []

    for (let i = 0; i < current.products.length; i++) {
        let pha = current.products[i]
        let result = []
        if (pha.length === 0) continue
        for (let j = 0; j < pha.length; j++) {
            if (c.config.printCommand.includes(pha[j].type)) result.push(pha[j])
        }
        list.push(result)
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
                    <div className="checkbox" onClick={() => { selectAll() }}>
                        <p>Seleccionar todos</p>
                    </div>
                    {types && types.length !== 0 && types.map(el => {
                        return <div className="checkbox" key={Math.random()} onClick={() => { handleCheck(el) }}>
                            <p>{el}</p>
                            <button style={{ color: c.config.printCommand.includes(el) ? "var(--corange)" : "var(--cblack)" }}>
                                <FontAwesomeIcon icon={c.config.printCommand.includes(el) ? faCheckSquare : faSquare} />
                            </button>
                        </div>
                    })}
                </nav>
                <section className='command-preview'>
                    {current.products.map((pha, i) => {
                        if (pha.length === 0) return null
                        return <div key={Math.random()}>
                            <label>Tiempo {i + 1}</label>
                            <div>
                                {pha.map(el => {
                                    return c.config.printCommand.includes(el.type) &&
                                        <li key={Math.random()}>
                                            {el.amount!} X {el.name} {el.comment && "(" + el.comment + ")"}
                                        </li>
                                })}
                            </div>
                        </div>
                    })}
                </section>
            </section>
            <footer>
                <button className='default-button' onClick={() => { confirm(list) }}>
                    <FontAwesomeIcon icon={faPrint} />
                    Imprimir
                </button>
            </footer>
        </section>
    </section>
}