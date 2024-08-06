import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "../../assets/mini-sections.css"
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons"
import { TablesPlaces } from "../../roleMains/Main"
import React from "react"
import { TablePlaceType, TableType } from "../../vite-env"
import { checkTable } from "../../logic/checkTableState"
import { colorSelector } from "../../logic/colorSelector"

type Props = {
  OpenTable:Function
  Open: Function
  tablesOpenMin: { _id: string, number: string, state: "open" | "paying" | "closed" | "unnactive" }[]
  current?: TableType
}

export default function MiniMap({OpenTable, Open, tablesOpenMin, current}: Props) {
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

  return <section className="mini-map">
    <button onClick={()=>{Open()}}>
      <FontAwesomeIcon icon={faArrowLeft}/>
    </button>
    <ul>
      {list.map(el=>{
        let selected = current && current._id === el._id ? "selected" : ""
        let check = checkTable(el._id, tablesOpenMin)
        return <button 
          style={{color: colorSelector[check.state]}}
          key={Math.random()}
          className={selected}
          onClick={()=>{OpenTable(el._id, check.state === "unnactive")}}
        >{el.number}</button>
      })}
    </ul>
  </section>
}