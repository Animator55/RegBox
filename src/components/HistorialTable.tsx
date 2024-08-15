import { HistorialTable, TableType } from '../vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle, faXmark } from '@fortawesome/free-solid-svg-icons'
import "../assets/historial.css"
import { colorSelector } from '../logic/colorSelector'

type Props = {
    table: TableType
    close: Function
}

export default function HistorialTableComp({ table, close }: Props) {
    const stateTraductions = {
        "unnactive": "Concluida", "closed": "Cerrada", "open": "Abierta", "paying": "Pagando"
    }
    let get = window.localStorage.getItem(table._id)
    let entries: string[][] | undefined
    let stor: HistorialTable | undefined
    if (get !== null) {
        stor = JSON.parse(get)
        entries= []
        if(stor && stor.historial) for(let i = stor.historial.length - 1; i >= 0; i--) {
            entries?.push(stor.historial[i].opened)
        }
    }

    const jump = (index: number)=>{
        let ul = document.querySelector(".historial-list")
        ul?.children[index].scrollIntoView({ block: "start", behavior: "smooth" })
    }

    const Historial = () => {
        if (!stor) return
        let list = []
        for (let i = stor.historial.length - 1; i >= 0; i--) {
            let el = stor.historial[i]
            let array = el.events
            list.push(<div key={Math.random()}>
                <header className='span-header' style={{ background: colorSelector[el.state] }}>
                    <p className='time'>{el.opened[0]}</p>
                    <p>{stateTraductions[el.state]}</p>
                    {el.total !== "$0" ? el.discount !== 0 ? 
                        <div>
                            <del style={{ opacity: 0.5 }}>{el.total}</del>
                            {" $" + Math.floor((parseInt(el.total.slice(1))) * (1 - (el.discount / 100)))}
                        </div> 
                        :
                        <div>{el.total}</div> 
                    : null}
                </header>
                <div className='event-list'>
                    {array && array.length !== 0 && array.map((li) => {
                        return <div className={li.important ? "event important" : 'event'} key={Math.random()}>
                            <p>{li.timestamp}</p>
                            <p>{li.comment}</p>
                        </div>
                    })}
                </div>
            </div>)

        }
        return list
    }

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop'>
            <header>
                <div className='pop-top'>
                    <h2>Historial</h2>
                    <button onClick={() => { close() }}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
            </header>

            <section className='pop-content'>
                <nav className='historial-nav'>
                    {entries && entries.map((el, i) => {
                        return <button key={Math.random()} onClick={()=>{jump(i)}}>
                            <FontAwesomeIcon icon={faCircle} />
                            <p>{el[0]}</p>
                        </button>
                    })}
                </nav>
                <div className='product-editor-content'>
                    <div>
                        <h3>Mesa {table.number} {table.tag !== "" && ("(" + table.tag + ")")}</h3>
                    </div>
                    <hr></hr>
                    <ul className='historial-list'>
                    <Historial/>
                    </ul>
                </div>
            </section>

        </section>
    </section>
}