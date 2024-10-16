import { HistorialTableType, TableEvents, TableType } from '../vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCaretRight, faCircle, faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'
import "../assets/historial.css"
import { colorSelector } from '../logic/colorSelector'
import React from 'react'
import fixNum from '../logic/fixDateNumber'
import { stateTraductions } from '../defaults/stateTraductions'

type Props = {
    table?: TableType
    close: Function
}

export default function HistorialTableComp({ table, close }: Props) {
    const jump = (index: number) => {
        let ul = document.querySelector(".historial-list")
        if(ul && ul.children[index]) ul.children[index].scrollIntoView({ block: "start", behavior: "smooth" })
    }
    const [selectedTable, setSelected] = React.useState<TableType | TableEvents | undefined>(table)
    // const tbl = React.useContext(TablesPlaces)

    const ViewTable = () => {
        if (!selectedTable || !selectedTable._id) return
        let get = window.localStorage.getItem("RegBoxID:" + selectedTable._id)
        let entries: string[][] | undefined
        let stor: HistorialTableType | undefined
        if (get !== null) {
            stor = JSON.parse(get)
            entries = []
            if (stor && stor.historial) for (let i = stor.historial.length - 1; i >= 0; i--) {
                entries?.push(stor.historial[i].opened)
            }
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
                    {selectedTable && <h3>Mesa {selectedTable.name}</h3>}
                </div>
                <hr></hr>
                <ul className='historial-list'>
                    <Historial />
                </ul>
            </div>
        </>
    }

    const TableSelector = () => {
        let array: TableEvents[] = []

        for (const key in window.localStorage) {
            if (key.startsWith("RegBoxID:")) {
                let stor: HistorialTableType = JSON.parse(window.localStorage[key])

                array.push(...stor.historial.map(el => {
                    return { ...el, name: stor.name, _id: stor._id }
                }))
            }
        }
        array.sort((a, b) => {
            const timeA = a.opened[0].split(":").map(Number);
            const timeB = b.opened[0].split(":").map(Number);

            return timeB[0] - timeA[0] || timeB[1] - timeA[1];
        });

        let date = new Date()
        let firstTableHour = array.length !== 0 ? array[array.length-1].opened[0] : (fixNum(date.getHours()) +":"+fixNum(date.getMinutes()))
        let hoursEntries = []
        let hourNow = parseInt(fixNum(date.getHours())) 
        let firstTableFix = parseInt(firstTableHour.split(":")[0])
        while(hourNow > firstTableFix) {
            firstTableFix++
            hoursEntries.unshift(firstTableFix +":00")
        }
        hoursEntries.push(firstTableHour)
        hoursEntries.unshift("Ahora")


        return array && array.length !== 0 ? <>
            <nav className='historial-nav'>
                {hoursEntries.length!==0 && hoursEntries.map((el, i) => {
                    return <button key={Math.random()} onClick={() => { jump(i) }}>
                        <FontAwesomeIcon icon={faCircle} />
                        <p>{el}</p>
                    </button>
                })}
            </nav>
            <section className='table-selector'>
                <ul className='historial-list'>
                    <div></div>
                    {array.map(el => {
                        return <div key={Math.random()}>
                            <p>{el.opened[0]}</p>
                            <button
                                style={{ background: colorSelector[el.state] }}
                                onClick={() => { setSelected(el) }}
                            >
                                Mesa {el.name}
                                <p>{"(" + stateTraductions[el.state] + ")"}</p>
                                <FontAwesomeIcon icon={faCaretRight} />
                            </button>
                        </div>
                    })}
                </ul>
            </section>
        </>
            : <section className='alert'>
                <FontAwesomeIcon icon={faWarning} />
                <h2>No hay historial previo.</h2>
                <button className='default-button' onClick={() => { close() }}>
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
                    {selectedTable && <button onClick={() => { setSelected(undefined) }}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>}
                    <h2>Historial</h2>
                    <button onClick={() => { close() }}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
            </header>

            <section className='pop-content'>
                {selectedTable ?
                    <ViewTable />
                    : <TableSelector />
                }
            </section>

        </section>
    </section>
}