import React from 'react'
import { TableType } from '../vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faMinus, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Configuration, TablesPlaces } from '../roleMains/Main'

import "../assets/map.css"
import { colorSelector } from '../logic/colorSelector'

type Props = {
  setCurrentID: Function
  current: TableType | undefined
  tablesOpenMin: {_id: string, number: number, state: "open" | "paying" | "closed" | "unnactive"}[]
}

export default function Map({ current, setCurrentID, tablesOpenMin }: Props) {
  const c = React.useContext(Configuration)
  const tdf = React.useContext(TablesPlaces)

  const checkTable = (tableID: string)=>{
    let state: "open" | "paying" | "closed" | "unnactive" = "unnactive"
    let result = false
    for(let i=0; i<tablesOpenMin.length; i++) {
      if(tablesOpenMin[i]._id === tableID) {
        result = true
        state = tablesOpenMin[i].state
        break
      }
    }
    return {result, state}
  }

  const toggleExpand = () => {

  }

  const Top = () => {
    return <header className='map-header'>
      <select>
        <option>Mapa 1</option>
      </select>
      <section className='edit-container'>
        {/* <div className='edit-buttons'>
          <button><FontAwesomeIcon icon={faPlus} /></button>
        </div> */}
        <button className='activate-edit-button' onClick={toggleExpand}>
          <FontAwesomeIcon icon={faGear} />
          {/* <FontAwesomeIcon icon={faXmark} /> */}
        </button>
      </section>
    </header>
  }

  const MapDisplay = () => {
    const Buttons = () => {
      return <>
        <button className='trash'>
          <FontAwesomeIcon icon={faTrash} />
        </button>
        <div className='zoom-container'>
          <button onClick={()=>{changeZoom(false)}}>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <p className='zoom-number'>{Math.round(c.config.map.zoom*100)}%</p>
          <button onClick={()=>{changeZoom(true)}}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </>
    }

    const drag = ()=>{
      let target = document.querySelector(".draggable") as HTMLDivElement
      if(target.className !== "draggable") return
      const move = (e2: MouseEvent)=>{
        let left = parseInt(target.style.left)
        let top = parseInt(target.style.top) 

        target.style.left = left + e2.movementX + "px"
        target.style.top = top + e2.movementY + "px"
      }
      const drop = ()=>{
        let target = document.querySelector(".draggable") as HTMLDivElement

        let x = parseInt(target.style.left)
        let y = parseInt(target.style.top)

        if(x !== c.config.map.x || y !== c.config.map.y) c.setConfig(
          {...c.config, map: {...c.config.map, x: x, y: y}})

        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", drop)
        document.removeEventListener("mouseleave", drop)
      }

      document.addEventListener("mousemove", move)
      document.addEventListener("mouseup", drop)
      document.addEventListener("mouseleave", drop)
    }

    const changeZoom = (zoomin: boolean)=>{
      let zone = document.querySelector(".draggable") as HTMLDivElement
      let scale = parseFloat(zone.style.scale) 
      let newScale = !zoomin ? scale -0.05 : scale +0.05
      c.setConfig({...c.config, map: {...c.config.map, zoom: newScale}})
    }

    return <section className='map-display'>
      <Buttons/>
      <section className='background' onMouseDown={drag} onWheel={(e)=>{changeZoom(e.deltaY < 0)}}>
        <div className='draggable' style={{top: c.config.map.y, left: c.config.map.x, scale: `${c.config.map.zoom}`}} >
          {tdf.tables.map(tbl=>{
            let color = "var(--clightgray)"
            let selected = false
            let check = checkTable(tbl._id)
            if(tbl._id === current?._id) {color = colorSelector[current.state]; selected = true}
            else if(check.result) color = colorSelector[check.state]

            return <div
              key={Math.random()}
              onClick={()=>{setCurrentID(tbl._id)}}
              className={selected ? "selected table" : "table"}
              style={{
                width: tbl.size.x,
                height: tbl.size.y,
                top: tbl.coords.y,
                left: tbl.coords.x,
                backgroundColor: color
              }}
            >
              {tbl.number}
            </div>
          })}
        </div>
      </section>
    </section>
  }

  return <section className='map'>
    <Top />
    <MapDisplay />
  </section>

}