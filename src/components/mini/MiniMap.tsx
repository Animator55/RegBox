import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "../../assets/mini-sections.css"
import { faPlus } from "@fortawesome/free-solid-svg-icons"
import { TablesPlaces, ToastActivation } from "../../roleMains/Main"
import React from "react"
import { TablePlaceType, TableType } from "../../vite-env"
import { checkTable } from "../../logic/checkTableState"
import { colorSelector } from "../../logic/colorSelector"
import OpenTable from "../pops/OpenTable"

type Props = {
  openTable:Function
  tablesOpenMin: { _id: string, number: string, state: "open" | "paying" | "closed" | "unnactive" }[]
  current?: TableType
}

export default function MiniMap({openTable, tablesOpenMin, current}: Props) {
  const toast = React.useContext(ToastActivation)
  const [openTablePop, setPop] = React.useState(false)

  const tdf = React.useContext(TablesPlaces)

  const constructor: {[key:string]: TablePlaceType[]} = {
    open: [],
    paying: [],
    closed: [],
    unnactive: [],
  }

  for(let i = 0; i<tdf.tables.length; i++) {
    let result = checkTable(tdf.tables[i]._id, tablesOpenMin)
    constructor[result.state].push(tdf.tables[i])
  }

  let list = Object.values(constructor).flat()

  const confirmPop = (value: string)=>{
    let table = ""

    for(let i=0; i<constructor.unnactive.length; i++) {
      if(value === constructor.unnactive[i].number) {
        table = constructor.unnactive[i]._id
        break
      }
    }

    if(table === "") return toast({
      _id: "Nuiansgia", title:"Acción inválida", icon: "xmark",
      content: "La mesa no esta inactiva o no existe."
    })
    openTable(table, true)
    setPop(false)
  }

  return <section className="mini-map">
    {openTablePop && <OpenTable confirm={confirmPop} close={()=>{setPop(false)}}/>}
    <button onClick={()=>{setPop(true)}}>
      <FontAwesomeIcon icon={faPlus}/>
    </button>
    <ul>
      {list.map(el=>{
        let selected = current && current._id === el._id ? "selected" : ""
        let check = checkTable(el._id, tablesOpenMin)
        return <button 
          style={{color: colorSelector[check.state]}}
          key={Math.random()}
          className={selected}
          onClick={()=>{openTable(el._id, check.state === "unnactive")}}
        >{el.number}</button>
      })}
    </ul>
  </section>
}