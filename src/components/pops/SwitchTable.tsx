import { faRepeat } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import { TablesPlaces } from '../../roleMains/Main'
import { TablePlaceType } from '../../vite-env'

type Props = {
    close: Function
    confirm: Function
    actual: {name: string, _id: string}
    tablesMin: string[]
}

export default function SwitchTable({actual, tablesMin, close, confirm}: Props) {
    const [selected, setSelected] = React.useState(actual._id)
    const tbl = React.useContext(TablesPlaces)

    const confirmHandler = ()=>{
        if(selected === "" && selected === actual._id) return
        let [id, name] = selected.split("/")
        confirm(id, name)
    }

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop switch-pop'>
            <h2>Cambiar mesa actual</h2>
            <h3 className='actual'>Mesa {actual.name}</h3>
            <div className='switch-icon'><FontAwesomeIcon icon={faRepeat}/></div>
            <select value={selected} onChange={(e)=>{
                let val = e.target.value
                setSelected(val)
            }}>
                <option key={Math.random()} value={""}>
                    Seleccionar
                </option>
                {tbl.tables.map((el: TablePlaceType)=>{
                    if(tablesMin.includes(el._id))return
                    return <option key={Math.random()} value={el._id+"/"+el.name}>
                        Mesa {el.name}
                    </option>
                })}
            </select>
            <div className='buttons-confirm'>
                <button className='secondary-button' onClick={() => { close() }}>Cancelar</button>
                <button 
                    className={selected === actual._id || selected === "" ? "default-button-2 disabled" : "default-button-2"} 
                    onClick={confirmHandler}
                >Confirmar</button>
            </div>
        </section>
    </section>
}