import React from 'react'
import { TablePlaceType, TableType } from '../vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faMinus, faPen, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons'
import { Configuration, TablesPlaces } from '../roleMains/Main'

import "../assets/map.css"
import { colorSelector } from '../logic/colorSelector'
import { checkTable } from '../logic/checkTableState'
import { selectAllText } from '../logic/selectAllText'

type Props = {
  setCurrentID: Function
  current: TableType | undefined
  tablesOpenMin: { _id: string, number: string, state: "open" | "paying" | "closed" | "unnactive" }[]
}

let deleteItem = false
let autoEditName: string | undefined = undefined

export default function Map({ current, setCurrentID, tablesOpenMin }: Props) {
  const c = React.useContext(Configuration)
  const tdf = React.useContext(TablesPlaces)

  const [editMode, setEditMode] = React.useState(false)

  const addTable = () => {
    let map = document.querySelector(".draggable") as HTMLDivElement

    let x = map.parentElement!.clientWidth/2 - parseInt(map.style.left)
    let y = map.parentElement!.clientHeight/2 - parseInt(map.style.top)
    
    let newID = `${Math.round((Math.random()*Math.random())*10000000000)}`
    let table: TablePlaceType = {
      _id: newID,
      number: `${Math.round(Math.random()*100)}`,
      coords: {
        x: x,
        y: y,
      },
      size: {
        x: 70,
        y: 70,
      }
    }

    autoEditName = newID

    tdf.set([...tdf.tables, table])
  }

  const Top = () => {
    return <header className='map-header'>
      <select>
        <option>Mapa 1</option>
      </select>
      <section className='edit-container'>
        {editMode && 
          <button
            onClick={addTable}
            className='default-button-2'
          ><FontAwesomeIcon icon={faPlus} />Añadir</button>
        }
        <button className='default-button-2' onClick={() => { setEditMode(!editMode) }}>
          <FontAwesomeIcon icon={editMode ? faCheck : faPen} />
          {editMode ? "Confirmar" : "Editar"}
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
      let back = e.target as HTMLDivElement
      if (back.className !== "background" && back.className !== "draggable" ) return
      let target = back.className !== "draggable" ? back.firstChild as HTMLDivElement : back
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

      const move = (e2: MouseEvent) => {
        let left = parseFloat(target.style.left)
        let top = parseFloat(target.style.top)

        target.style.left = left + (e2.movementX / c.config.map.zoom) + "px"
        target.style.top = top + (e2.movementY / c.config.map.zoom) + "px"
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

        let x = parseInt(target.style.left)
        let y = parseInt(target.style.top)

        let val = []

        for (let i = 0; i < tdf.tables.length; i++) {
          if (tdf.tables[i]._id !== tableToEdit._id) val.push(tdf.tables[i])
          else if (deleteItem !== true || checkTable(tableToEdit._id, tablesOpenMin).state !== "unnactive") val.push({
            _id: tableToEdit._id,
            number: tableToEdit.number,
            ["coords"]: {
              x: x,
              y: y
            },
            ["size"]: {
              ...tableToEdit["size"]
            }
          } as TablePlaceType)
        }

        if (x !== tableToEdit.coords.x || y !== tableToEdit.coords.y) tdf.set(val)

        deleteItem = false

        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", drop)
        document.removeEventListener("mouseleave", drop)
      }

      document.addEventListener("mousemove", move)
      document.addEventListener("mouseup", drop)
      document.addEventListener("mouseleave", drop)
    }
    const resize = (e: React.MouseEvent) => {
      let target = e.target as HTMLButtonElement

      if (target.classList.contains("table")) return
      target = target.parentElement as HTMLButtonElement
      const movement = (e2: MouseEvent) => {
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

        let x = parseInt(target.style.width)
        let y = parseInt(target.style.height)

        let val = []

        for (let i = 0; i < tdf.tables.length; i++) {
          if (tdf.tables[i]._id !== tableToEdit._id) val.push(tdf.tables[i])
          else if (deleteItem !== true || checkTable(tableToEdit._id, tablesOpenMin).state !== "unnactive") val.push({
            _id: tableToEdit._id,
            number: tableToEdit.number,
            ["size"]: {
              x: x,
              y: y
            },
            ["coords"]: {
              ...tableToEdit["coords"]
            }
          } as TablePlaceType)
        }

        if (x !== tableToEdit.size.x || y !== tableToEdit.size.y) tdf.set(val)


        document.removeEventListener("mousemove", movement)
        document.removeEventListener("mouseup", drop)
        document.removeEventListener("mouseleave", drop)
      }
      document.addEventListener("mousemove", movement)
      document.addEventListener("mouseup", drop)
      document.addEventListener("mouseleave", drop)
    }

    const editTableName = (e: React.MouseEvent)=>{
      let div = e.target as HTMLButtonElement 
      if(div.className !== "edit-name") return
      let name = div.nextSibling as HTMLButtonElement

      name.contentEditable = "true"
      name.focus()
      selectAllText(name)
    }

    const changeZoom = (zoomin: boolean) => {
      let zone = document.querySelector(".draggable") as HTMLDivElement
      let scale = parseFloat(zone.style.scale)
      let newScale = !zoomin ? scale - 0.02 : scale + 0.02
      if(newScale < 0.05) return
      zone.style.scale = `${newScale}`
      if(!zone.parentElement) return
      zone.parentElement.addEventListener("mousemove", ()=>{
        c.setConfig({ ...c.config, map: { ...c.config.map, zoom: newScale } })
      })
      let numberDiv = document.querySelector(".zoom-number") as HTMLDivElement
      if(!numberDiv) return
      numberDiv.textContent =`${Math.round(newScale* 100)}%`
    }

    return <section className='map-display'>
      <Buttons />
      <section className='background' onMouseDown={drag} onWheel={(e) => { changeZoom(e.deltaY < 0) }} data-edit={`${editMode}`}>
        <div className='draggable' style={{ top: c.config.map.y, left: c.config.map.x, scale: `${c.config.map.zoom}` }} >
          {tdf.tables.map((tbl) => {
            let color = "var(--clightgray)"
            let selected = false
            let check = checkTable(tbl._id, tablesOpenMin)
            if (tbl._id === current?._id) { color = colorSelector[current.state]; selected = true }
            else if (check.result) color = colorSelector[check.state]

            return <button
              id={tbl._id}
              onMouseDown={(e) => { if (editMode && e.currentTarget.contentEditable !== "true") dragItem(e) }}
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
              { editMode && <a className='edit-name' onClick={editTableName}>
                <FontAwesomeIcon icon={faPen}/>
              </a>}
              <p
                onBlur={(e)=>{
                  if(e.currentTarget.textContent !== null 
                    && e.currentTarget.textContent !== "") tdf.editName(tbl._id, e.currentTarget.textContent)
                  else e.currentTarget.textContent = tbl.number
                }}
                onKeyDown={(e)=>{
                  if(e.key !== "Enter") return
                  e.preventDefault()
                  if(e.currentTarget.textContent !== null 
                    && e.currentTarget.textContent !== "") tdf.editName(tbl._id, e.currentTarget.textContent)
                  else e.currentTarget.textContent = tbl.number
                }}
              >{tbl.number}</p>
              { editMode && <a className='resize' onMouseDown={resize}>
              </a>}
            </button>
          })}
        </div>
      </section>
    </section>
  }

  React.useEffect(()=>{
    if(autoEditName) {
      let table = document.getElementById(autoEditName)
      autoEditName = undefined 
      if(!table) return
      let p = table.children[1] as HTMLParagraphElement
      if(!p) return
      p.contentEditable = "true"
      p.focus()
      selectAllText(p)
    }
  })

  return <section className='map'>
    <Top />
    <MapDisplay />
  </section>

}