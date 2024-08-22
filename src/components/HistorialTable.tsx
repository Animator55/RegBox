import { HistorialTableType, TableEvents, TableType } from '../vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCircle, faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'
import "../assets/historial.css"
import { colorSelector } from '../logic/colorSelector'
import React from 'react'

type Props = {
    table?: TableType
    close: Function
}

export default function HistorialTableComp({ table, close }: Props) {  
    const [selectedTable, setSelected ] = React.useState<TableType | TableEvents|undefined>(table)
    // const tbl = React.useContext(TablesPlaces)

    const ViewTable = () => {
        if(!selectedTable || !selectedTable._id) return
        const stateTraductions = {
            "unnactive": "Concluida", "closed": "Cerrada", "open": "Abierta", "paying": "Pagando"
        }
        let get = window.localStorage.getItem("RegBoxID:"+selectedTable._id)
        let entries: string[][] | undefined
        let stor: HistorialTableType | undefined
        if (get !== null) {
            stor = JSON.parse(get)
            entries = []
            if (stor && stor.historial) for (let i = stor.historial.length - 1; i >= 0; i--) {
                entries?.push(stor.historial[i].opened)
            }
        }

        const jump = (index: number) => {
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


        return <>
            <nav className='historial-nav'>
                {entries && entries.map((el, i) => {
                    return <button key={Math.random()} onClick={() => { jump(i) }}>
                        <FontAwesomeIcon icon={faCircle} />
                        <p>{el[0]}</p>
                    </button>
                })}
            </nav>
            <div className='product-editor-content'>
                <div>
                    {selectedTable && <h3>Mesa {selectedTable.number}</h3>}
                </div>
                <hr></hr>
                <ul className='historial-list'>
                    <Historial />
                </ul>
            </div>
        </>
    }

    const TableSelector = ()=>{
        let array: TableEvents[] = []

        for(const key in window.localStorage) {
            if(key.startsWith("RegBoxID:")) {
                let stor : HistorialTableType = JSON.parse(window.localStorage[key])
                
                array.push(...stor.historial.map(el=>{
                    return {...el, number: stor.number, _id: stor._id}
                }))
            }
        }
        array.sort((a, b) => {
            const timeA = a.opened[0].split(":").map(Number); 
            const timeB = b.opened[0].split(":").map(Number);
          
            return timeB[0] - timeA[0] || timeB[1] - timeA[1];
        });

        return array && array.length !== 0 ? <section className='table-selector'>
            {array.map(el=>{
                return <button
                    style={{background: colorSelector[el.state]}}
                    key={Math.random()}
                    onClick={()=>{setSelected(el)}}
                >{el.opened[0] +": "+el.number +" " + el.state}</button>
            })}
        </section>: <section className='alert'>
            <FontAwesomeIcon icon={faWarning}/>
            <h2>No hay historial previo.</h2>
            <button className='default-button' onClick={()=>{close()}}>
                Cerrar
            </button>
        </section>
    }
    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop'>
            <header>
                <div className='pop-top'>
                    {selectedTable && <button onClick={()=>{setSelected(undefined)}}>
                        <FontAwesomeIcon icon={faArrowLeft}/>
                    </button>}
                    <h2>Historial</h2>
                    <button onClick={() => { close() }}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
            </header>

            <section className='pop-content'>
                {selectedTable ? 
                    <ViewTable/>
                    : <TableSelector/>
                }
            </section>

        </section>
    </section>
}