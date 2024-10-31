import React from 'react'
import { TablePlaceType, TableType } from '../vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faExpand, faLock, faMinus, faPen, faPlus, faTrash, faUnlock, faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'
import { Configuration, TablesPlaces, ToastActivation } from '../roleMains/Main'

import "../assets/map.css"
import { colorSelector } from '../logic/colorSelector'
import { checkTable } from '../logic/checkTableState'
import { selectAllText } from '../logic/selectAllText'
import createNewTable from '../logic/createNewTable'

type Props = {
  setCurrentID: Function
  current: TableType | undefined
  tablesOpenMin: { _id: string, name: string, state: "open" | "paying" | "closed" | "unnactive" }[]
}

let deleteItem = false
let autoEditName: string | undefined = undefined

export default function Map({ current, setCurrentID, tablesOpenMin }: Props) {
  const toast = React.useContext(ToastActivation)
  const c = React.useContext(Configuration)
  const tdf = React.useContext(TablesPlaces)

  const [editMode, setEditMode] = React.useState(false)
  const [deleteMode, setDeleteMode] = React.useState(false)
  const [localMap, setMap] = React.useState<TablePlaceType[]>(tdf.tables)

  const handleSetEditMode = (confirm: boolean) => {
    if (editMode) {
      if (confirm) tdf.set(localMap)
      else setMap(tdf.tables)
    }
    setEditMode(!editMode)
  }

  const addTable = () => {
    let created = createNewTable()

    autoEditName = created._id

    let value = [...localMap, created]
    if (editMode) setMap(value)
    else {
      tdf.set(value)
      setMap(value)
    }
  }

  const Top = () => {
    let alignGrid = c.config.map.align
    return <header className='map-header'>
      <section className='edit-container'>
        {editMode && <>
          <button
            onClick={() => { c.setConfig({ ...c.config, map: { ...c.config.map, align: !alignGrid } }) }}
            className='default-button-2 align-tables'
            title={alignGrid ? "Mesas alineadas" : "Mesas desalineadas"}
          ><FontAwesomeIcon icon={alignGrid ? faLock : faUnlock} /></button>
          <button
            onClick={() => { setDeleteMode(!deleteMode) }}
            className={deleteMode ? 'default-button-2 active' : 'default-button-2'}
          ><FontAwesomeIcon icon={faTrash} />
            <p>{deleteMode ? "Dejar de Borrar" : "Borrar"}</p></button>
          {!deleteMode && <button
            onClick={addTable}
            className='default-button-2'
          ><FontAwesomeIcon icon={faPlus} />
            <p>Añadir</p></button>}
          <button className='default-button-2' onClick={() => { handleSetEditMode(false) }}>
            <FontAwesomeIcon icon={faXmark} />
            <p>Cancelar</p>
          </button>
        </>}
        <button className='default-button-2' onClick={() => { handleSetEditMode(true) }}>
          <FontAwesomeIcon icon={editMode ? faCheck : faPen} />
          <p>{editMode ? "Confirmar" : "Editar"}</p>
        </button>
      </section>
    </header>
  }

  const getTableFromId = (_id: string) => {
    let tableToEdit: TablePlaceType | undefined
    for (let i = 0; i < localMap.length; i++) {
      if (_id === localMap[i]._id) {
        tableToEdit = localMap[i]
        break
      }
    }
    return tableToEdit
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

    const deleteTable = (_id: string) => {
      if (!_id) return

      let tableToEdit: TablePlaceType | undefined = getTableFromId(_id)
      if (!tableToEdit) return

      let val = []

      for (let i = 0; i < localMap.length; i++) {
        if (localMap[i]._id !== tableToEdit._id) val.push(localMap[i])
        else if (checkTable(tableToEdit._id, tablesOpenMin).state !== "unnactive") {
          toast({
            _id: "ibsgnfaig",
            title: "Acción inválida",
            content: "La mesa no puede ser eliminada si esta misma esta abierta o no fue cobrada.",
            icon: "xmark"
          })
          val.push(localMap[i])
        }
      }

      setMap(val)
    }
    const editName = (id: string, val: string) => {
      setMap([...localMap.map((el) => {
        if (el._id !== id) return el
        else {
          return {
            ...el,
            name: val
          } as TablePlaceType
        }
      })])
    }

    const drag = (e: React.MouseEvent) => {
      let back = e.target as HTMLDivElement
      if (back.className !== "background" && back.className !== "draggable") return
      let target = back.className !== "draggable" ? back.firstChild as HTMLDivElement : back
      const move = (e2: MouseEvent) => {
        let left = parseInt(target.style.left)
        let top = parseInt(target.style.top)

        target.style.left = left + e2.movementX + "px"
        target.style.top = top + e2.movementY + "px"
      }
      const drop = () => {
        let target = document.querySelector(".draggable") as HTMLDivElement
        if(!target) return
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
    const drag_Touch = (e: React.TouchEvent) => {
      let back = e.target as HTMLDivElement
      if (back.className !== "background" && back.className !== "draggable") return
      let target = back.className !== "draggable" ? back.firstChild as HTMLDivElement : back

      let left = parseInt(target.style.left)
      let top = parseInt(target.style.top)
      let origin_x = e.touches[0].pageX - left
      let origin_y = e.touches[0].pageY - top
      const move = (e2: TouchEvent) => {
        let changeX = e2.touches[0].pageX - origin_x
        let changeY = e2.touches[0].pageY - origin_y
        target.style.left = changeX + "px"
        target.style.top = changeY + "px"
      }
      const drop = () => {
        let target = document.querySelector(".draggable") as HTMLDivElement
        if(!target) return

        let x = parseInt(target.style.left)
        let y = parseInt(target.style.top)

        if (x !== c.config.map.x || y !== c.config.map.y) c.setConfig(
          { ...c.config, map: { ...c.config.map, x: x, y: y } })

        document.removeEventListener("touchmove", move)
        document.removeEventListener("touchend", drop)
        document.removeEventListener("touchcancel", drop)
      }

      document.addEventListener("touchmove", move)
      document.addEventListener("touchend", drop)
      document.addEventListener("touchcancel", drop)
    }
    const endGrabbingTable = (entry: "size" | "coords", _id: string, or_x: number, or_y: number) => {
      let tableToEdit: TablePlaceType | undefined = getTableFromId(_id)
      if (!tableToEdit) return
      let x = or_x
      let y = or_y
      /// Check config
      if (c.config.map.align) {
        x = Math.round(or_x / 20) * 20
        y = Math.round(or_y / 20) * 20
      }
      let val = []

      for (let i = 0; i < localMap.length; i++) {
        if (localMap[i]._id !== tableToEdit._id) val.push(localMap[i])
        else if (deleteItem && checkTable(tableToEdit._id, tablesOpenMin).state !== "unnactive") {
          toast({
            _id: "ibsgnfaig",
            title: "Acción inválida",
            content: "La mesa no puede ser eliminada si esta misma esta abierta o no fue cobrada.",
            icon: "xmark"
          })
          val.push(localMap[i])
        }
        else if (deleteItem !== true || checkTable(tableToEdit._id, tablesOpenMin).state !== "unnactive") val.push({
          _id: tableToEdit._id,
          name: tableToEdit.name,
          [entry]: {
            x: x,
            y: y
          },
          [entry === "coords" ? "size" : "coords"]: {
            ...tableToEdit[entry === "coords" ? "size" : "coords"]
          }
        } as TablePlaceType)
      }

      if (x !== tableToEdit[entry === "coords" ? "size" : "coords"].x
        || y !== tableToEdit[entry === "coords" ? "size" : "coords"].y) setMap(val)

      deleteItem = false

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
        let x = parseInt(target.style.left)
        let y = parseInt(target.style.top)

        endGrabbingTable("coords", target.id, x, y)
        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", drop)
        document.removeEventListener("mouseleave", drop)
      }

      document.addEventListener("mousemove", move)
      document.addEventListener("mouseup", drop)
      document.addEventListener("mouseleave", drop)
    }
    const dragItem_Touch = (e: React.TouchEvent) => {
      let target = e.target as HTMLButtonElement

      if (!target.classList.contains("table")) return
      let left = parseInt(target.style.left)
      let top = parseInt(target.style.top)
      let origin_x = (e.touches[0].pageX - left)
      let origin_y = (e.touches[0].pageY - top)

      const move = (e2: TouchEvent) => {
        let changeX = e2.touches[0].pageX - origin_x
        let changeY = e2.touches[0].pageY - origin_y
        target.style.left = changeX / c.config.map.zoom + "px"
        target.style.top = changeY / c.config.map.zoom + "px"
      }
      const drop = () => {
        let x = parseInt(target.style.left)
        let y = parseInt(target.style.top)

        endGrabbingTable("coords", target.id, x, y)

        document.removeEventListener("touchmove", move)
        document.removeEventListener("touchend", drop)
        document.removeEventListener("touchcancel", drop)
      }

      document.addEventListener("touchmove", move)
      document.addEventListener("touchend", drop)
      document.addEventListener("touchcancel", drop)
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
        let x = parseFloat(target.style.width)
        let y = parseFloat(target.style.height)
        endGrabbingTable("size", target.id, x, y)
        document.removeEventListener("mousemove", movement)
        document.removeEventListener("mouseup", drop)
        document.removeEventListener("mouseleave", drop)
      }
      document.addEventListener("mousemove", movement)
      document.addEventListener("mouseup", drop)
      document.addEventListener("mouseleave", drop)
    }
    const resize_Touch = (e: React.TouchEvent) => {
      let target = e.target as HTMLButtonElement

      if (target.classList.contains("table")) return
      target = target.parentElement as HTMLButtonElement
      let left = parseInt(target.style.left)
      let top = parseInt(target.style.top)
      let origin_x = (e.touches[0].pageX - left)
      let origin_y = (e.touches[0].pageY - top)

      const movement = (e2: TouchEvent) => {
        let width = e2.touches[0].pageX - origin_x
        let height = e2.touches[0].pageY - origin_y

        target.style.width = width < 30 ? "30px" : width + "px"
        target.style.height = height < 30 ? "30px" : height + "px"
      }
      const drop = () => {
        let x = parseFloat(target.style.width)
        let y = parseFloat(target.style.height)
        endGrabbingTable("size", target.id, x, y)
        document.removeEventListener("touchmove", movement)
        document.removeEventListener("touchend", drop)
        document.removeEventListener("touchcancel", drop)
      }
      document.addEventListener("touchmove", movement)
      document.addEventListener("touchend", drop)
      document.addEventListener("touchcancel", drop)
    }

    /// touchresize

    const editTableName = (e: React.MouseEvent) => {
      let div = e.target as HTMLButtonElement
      if (div.className !== "edit-name") return
      let name = div.nextSibling as HTMLButtonElement

      name.contentEditable = "true"
      name.focus()
      selectAllText(name)
    }

    const changeZoom = (zoomin: boolean) => {
      let zone = document.querySelector(".draggable") as HTMLDivElement
      if (!zone) return
      let scale = parseFloat(zone.style.scale)
      let newScale = !zoomin ? scale - 0.02 : scale + 0.02
      if (newScale < 0.05) return
      zone.style.scale = `${newScale}`
      if (!zone.parentElement) return
      zone.parentElement.addEventListener("mousemove", () => {
        c.setConfig({ ...c.config, map: { ...c.config.map, zoom: newScale } })
      })
      let numberDiv = document.querySelector(".zoom-number") as HTMLDivElement
      if (!numberDiv) return
      numberDiv.textContent = `${Math.round(newScale * 100)}%`
    }


    ///components 

    const Buttons = () => {
      return <>
        {editMode && <button className='trash'
          onMouseEnter={trashDetect}
          onMouseLeave={trashLeave}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>}
        <button title='Centrar mapa' className='center-map' onClick={() => { c.setConfig({ ...c.config, map: { ...c.config.map, x: 0, y: 0 } }) }
        }><FontAwesomeIcon icon={faExpand} /></button>
        <div className='zoom-container'>
          <button title='Alejar' onClick={() => { changeZoom(false) }}>
            <FontAwesomeIcon icon={faMinus} />
          </button>
          <p title='Zoom' className='zoom-number'>{Math.round(c.config.map.zoom * 100)}%</p>
          <button title='Acercar' onClick={() => { changeZoom(true) }}>
            <FontAwesomeIcon icon={faPlus} />
          </button>
        </div>
      </>
    }

    const TableDraggable = ({ tbl }: { tbl: TablePlaceType }) => {
      let color = "var(--clightgray)"
      let selected = false
      let check = checkTable(tbl._id, tablesOpenMin)
      if (tbl._id === current?._id) { color = colorSelector[current.state]; selected = true }
      else if (check.result) color = colorSelector[check.state]


      return <button
        id={tbl._id}
        onMouseDown={(e) => { if (editMode && e.currentTarget.contentEditable !== "true") dragItem(e) }}
        onTouchStart={(e) => { if (editMode && e.currentTarget.contentEditable !== "true") dragItem_Touch(e) }}
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
        {editMode ? !deleteMode ?
          <a className='edit-name' onClick={editTableName}>
            <FontAwesomeIcon icon={faPen} />
          </a> :
          <a className='edit-name delete' onClick={() => { deleteTable(tbl._id) }}>
            <FontAwesomeIcon icon={faXmark} />
          </a> : null
        }
        <p
          onBlur={(e) => {
            if (deleteMode) return
            if (e.currentTarget.textContent !== null
              && e.currentTarget.textContent !== "") editName(tbl._id, e.currentTarget.textContent)
            else e.currentTarget.textContent = tbl.name
          }}
          onKeyDown={(e) => {
            if (deleteMode) return
            if (e.key !== "Enter") return
            e.preventDefault()
            if (e.currentTarget.textContent !== null
              && e.currentTarget.textContent !== "") editName(tbl._id, e.currentTarget.textContent)
            else e.currentTarget.textContent = tbl.name
          }}
        >{tbl.name}</p>
        {editMode && !deleteMode &&
          <a className='resize' onMouseDown={resize} onTouchStart={resize_Touch}>
          </a>}
      </button>
    }

    const Alert = () => {
      return <section className='alert'>
        <FontAwesomeIcon icon={faWarning} />
        <h2>No hay mesas añadidas a el mapa.</h2>
        <button className='default-button' onClick={() => { addTable() }}>
          Añadir mesa
        </button>
      </section>
    }

    return <section className='map-display'>
      <Buttons />
      <section className='background' onMouseDown={drag} onTouchStart={drag_Touch} onWheel={(e) => { changeZoom(e.deltaY < 0) }} data-edit={`${editMode}`}>
        {localMap && localMap.length !== 0 ?
          <div className='draggable' style={{
            top: c.config.map.y, left: c.config.map.x, scale: `${c.config.map.zoom}`
          }} >
            {localMap.map((tbl) => <TableDraggable key={Math.random()} tbl={tbl} />)}
          </div> : <Alert />
        }
      </section>
    </section>
  }

  React.useEffect(() => {
    if (autoEditName) {
      let table = document.getElementById(autoEditName)
      autoEditName = undefined
      if (!table) return
      let p = table.children[1] as HTMLParagraphElement
      if (!p) return
      p.contentEditable = "true"
      p.focus()
      selectAllText(p)
    }
  })

  return <section className='map' data-is-editing={`${editMode}`}>
    <Top />
    <MapDisplay />
  </section>

}