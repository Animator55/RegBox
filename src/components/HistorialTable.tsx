import { TableType } from '../vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

type Props = {
    table: TableType
    close: Function
}

export default function HistorialTable({ table, close }: Props) {

    let stor = window.localStorage.getItem(table._id)
    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop'>
            <header>
                <div className='pop-top'>
                    <h2>Historial</h2>
                    <button onClick={()=>{close()}}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
                <p>Mesa {table.number}</p>
            </header>
            
        <section className='pop-content'>
            <ul>
                {stor && stor.split("/*/").map(el=>{
                    return <><div key={Math.random()}>{el}</div><hr/></>
                })}
            </ul>
        </section>

        </section>
    </section>
}