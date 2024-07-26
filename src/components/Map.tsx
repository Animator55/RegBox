import React from 'react'
import { TablePlaceType, TableType } from '../vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGear, faMinus, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Configuration, TablesPlaces } from '../roleMains/Main'

import "../assets/map.css"
import { colorSelector } from '../logic/colorSelector'

type Props = {
  setCurrentID: Function
  current: TableType | undefined
  tablesOpenMin: { _id: string, number: number, state: "open" | "paying" | "closed" | "unnactive" }[]
}

let deleteItem = false

export default function Map({ current, setCurrentID, tablesOpenMin }: Props) {
  const c = React.useContext(Configuration)
  const tdf = React.useContext(TablesPlaces)

  const [editMode, setEditMode] = React.useState(false)

  const checkTable = (tableID: string) => {
    let state: "open" | "paying" | "closed" | "unnactive" = "unnactive"
    let result = false
    for (let i = 0; i < tablesOpenMin.length; i++) {
      if (tablesOpenMin[i]._id === tableID) {
        result = true
        state = tablesOpenMin[i].state
        break
      }
    }
    return { result, state }
  }

  const addTable = () => {
    let map = document.querySelector(".draggable") as HTMLDivElement

    let x = map.parentElement!.clientWidth/2 - parseInt(map.style.left)
    let y = map.parentElement!.clientHeight/2 - parseInt(map.style.top)
    
    let table: TablePlaceType = {
      _id: `${Math.round((Math.random()*Math.random())*100000)}`,
      number: Math.round(Math.random()*100),
      coords: {
        x: x,
        y: y,
      },
      size: {
        x: 70,
        y: 70,
      }
    }

    tdf.set([...tdf.tables, table])
  }

  const Top = () => {
    return <header className='map-header'>
      <select>
        <option>Mapa 1</option>
      </select>
      <section className='edit-container'>
        {editMode && <button
          onClick={addTable}
          className='default-button'
        ><FontAwesomeIcon icon={faPlus} /></button>}
        <button className='activate-edit-button' onClick={() => { setEditMode(!editMode) }}>
          <FontAwesomeIcon icon={editMode ? faXmark : faGear} />
        </button>
      </section>
    </header>
  }

  const MapDisplay = () => {
    const trashDetect = (e: React.MouseEvent) => {
      let div = e.currentTarget as HTMLButtonElement
      div.classList.add("hover")
      deleteItem = true
    }
    const trashLeave = (e: React.MouseEvent) => {
      let div = e.currentTarget as HTMLButtonElement
      div.classList.remove("hover")
      deleteItem = false
    }

    const Buttons = () => {
      return <>
        {editMode && <button className='trash'
          onMouseEnter={trashDetect}
          onMouseLeave={trashLeave}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>}
        <div className='zoom-container'>
          <button onClick={() => { changeZoom(false) }}>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <p className='zoom-number'>{Math.round(c.config.map.zoom * 100)}%</p>
          <button onClick={() => { changeZoom(true) }}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </>
    }

    const drag = (e: React.MouseEvent) => {
      let target = e.target as HTMLDivElement
      if (target.className !== "draggable") return
      const move = (e2: MouseEvent) => {
        let left = parseInt(target.style.left)
        let top = parseInt(target.style.top)

        target.style.left = left + e2.movementX + "px"
        target.style.top = top + e2.movementY + "px"
      }
      const drop = () => {
        let target = document.querySelector(".draggable") as HTMLDivElement

        let x = parseInt(target.style.left)
        let y = parseInt(target.style.top)

        if (x !== c.config.map.x || y !== c.config.map.y) c.setConfig(
          { ...c.config, map: { ...c.config.map, x: x, y: y } })

        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", drop)
        document.removeEventListener("mouseleave", drop)
      }

      document.addEventListener("mousemove", move)
      document.addEventListener("mouseup", drop)
      document.addEventListener("mouseleave", drop)
    }
    const dragItem = (e: React.MouseEvent) => {
      let target = e.target as HTMLButtonElement

      if (!target.classList.contains("table")) return

      let shift = e.shiftKey

      const move = (e2: MouseEvent) => {
        let left = parseInt(target.style.left)
        let top = parseInt(target.style.top)

        target.style.left = left + e2.movementX + "px"
        target.style.top = top + e2.movementY + "px"
      }
      const resize = (e2: MouseEvent) => {
        let width = parseInt(target.style.width)
        let height = parseInt(target.style.height)

        target.style.width = width < 30 ? "30px" : width + e2.movementX + "px"
        target.style.height = height < 30 ? "30px" : height + e2.movementY + "px"
      }
      const drop = () => {
        let tableToEdit: TablePlaceType | undefined
        for (let i = 0; i < tdf.tables.length; i++) {
          if (target.id === tdf.tables[i]._id) {
            tableToEdit = tdf.tables[i]
            break
          }
        }

        if (!tableToEdit) return

        let x = parseInt(shift ? target.style.width : target.style.left)
        let y = parseInt(shift ? target.style.height : target.style.top)

        let val = []

        for (let i = 0; i < tdf.tables.length; i++) {
          if (tdf.tables[i]._id !== tableToEdit._id) val.push(tdf.tables[i])
          else if (deleteItem !== true || checkTable(tableToEdit._id).state !== "unnactive") val.push({
            _id: tableToEdit._id,
            number: tableToEdit.number,
            [shift ? "size" : "coords"]: {
              x: x,
              y: y
            },
            [!shift ? "size" : "coords"]: {
              ...tableToEdit[!shift ? "size" : "coords"]
            }
          } as TablePlaceType)
        }

        if (x !== tableToEdit.coords.x || y !== tableToEdit.coords.y) tdf.set(val)

        deleteItem = false

        document.removeEventListener("mousemove", shift ? resize : move)
        document.removeEventListener("mouseup", drop)
        document.removeEventListener("mouseleave", drop)
      }

      document.addEventListener("mousemove", shift ? resize : move)
      document.addEventListener("mouseup", drop)
      document.addEventListener("mouseleave", drop)
    }

    const changeZoom = (zoomin: boolean) => {
      let zone = document.querySelector(".draggable") as HTMLDivElement
      let scale = parseFloat(zone.style.scale)
      let newScale = !zoomin ? scale - 0.05 : scale + 0.05
      c.setConfig({ ...c.config, map: { ...c.config.map, zoom: newScale } })
    }

    return <section className='map-display'>
      <Buttons />
      <section className='background' onMouseDown={drag} onWheel={(e) => { changeZoom(e.deltaY < 0) }} data-edit={`${editMode}`}>
        <div className='draggable' style={{ top: c.config.map.y, left: c.config.map.x, scale: `${c.config.map.zoom}` }} >
          {tdf.tables.map(tbl => {
            let color = "var(--clightgray)"
            let selected = false
            let check = checkTable(tbl._id)
            if (tbl._id === current?._id) { color = colorSelector[current.state]; selected = true }
            else if (check.result) color = colorSelector[check.state]

            return <button
              id={tbl._id}
              onMouseDown={(e) => { if (editMode) dragItem(e) }}
              key={Math.random()}
              onClick={() => { if (!editMode) setCurrentID(tbl._id, check.state === "unnactive" ? true : false) }}
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
            </button>
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