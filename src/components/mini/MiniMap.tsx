import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "../../assets/mini-sections.css"
import { faArrowLeft, faPlus,  faSortAlphaDownAlt, faSortAlphaUpAlt, faSortAmountAsc, faSortAmountDesc } from "@fortawesome/free-solid-svg-icons"
import { Configuration, TablesPlaces, ToastActivation } from "../../roleMains/Main"
import React from "react"
import { TablePlaceType, TableType } from "../../vite-env"
import { checkTable } from "../../logic/checkTableState"
import { colorSelector } from "../../logic/colorSelector"
import OpenTable from "../pops/OpenTable"
import OrderListPop from "../pops/OrderListPop"
import { sortBy } from "../../logic/sortListBy"

type Props = {
  openTable:Function
  Open:Function
  tablesOpenMin: { _id: string, name: string, state: "open" | "paying" | "closed" | "unnactive" }[]
  current?: TableType
}

export default function MiniMap({openTable, Open, tablesOpenMin, current}: Props) {
  const toast = React.useContext(ToastActivation)
  const [openTablePop, setPop] = React.useState<undefined | "add" | "order">(undefined)

  const tdf = React.useContext(TablesPlaces)
  const c = React.useContext(Configuration)

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
      if(value === constructor.unnactive[i].name) {
        table = constructor.unnactive[i]._id
        break
      }
    }

    if(table === "") return toast({
      _id: "Nuiansgia", title:"Acción inválida", icon: "xmark",
      content: "La mesa no esta inactiva o no existe."
    })
    openTable(table, true)
    setPop(undefined)
  }

  const confirmOrderList = (value: "abc" | "abc-r" | "def" | "def-r")=>{
    c.setConfig({...c.config, miniMapOrder: value})
    setPop(undefined)
  }

  const orderOptions = ["abc", "abc-r", "def", "def-r"]

  const pops = {
    "add": <OpenTable confirm={confirmPop} close={()=>{setPop(undefined)}}/>,
    "order": <OrderListPop options={orderOptions} actual={c.config.miniMapOrder} confirm={confirmOrderList} close={()=>{setPop(undefined)}}/>
  }
  let sortValue = c.config.miniMapOrder
  let sortedList: TablePlaceType[] = sortBy[sortValue](list)

  const sortIcons:{[key:string]: any} = {
    "abc-r": faSortAlphaDownAlt,
    "def": faSortAmountDesc,
    "abc": faSortAlphaUpAlt,
    "def-r": faSortAmountAsc,
  }

  return <section className="mini-map">
    {openTablePop && pops[openTablePop]}
    {list.length!==0 ? <>
      <button onClick={()=>{
          if(constructor.unnactive.length === 0) return toast({
            _id: "tege", title:"Acción inválida", icon: "xmark",
            content: "No hay mesas inactivas existentes."
          })
          setPop("add")
        }}>
        <FontAwesomeIcon icon={faPlus}/>
      </button>
      <button onClick={()=>{
          setPop("order")
        }}>
        <FontAwesomeIcon icon={sortIcons[sortValue]}/>
      </button>
    </>
      :
      <button onClick={()=>{Open()}}>
        <FontAwesomeIcon icon={faArrowLeft}/>
      </button>
    }
    <ul>
      {sortedList.map(el=>{
        let selected = current && current._id === el._id ? "selected" : ""
        let check = checkTable(el._id, tablesOpenMin)
        return <button 
          style={{color: colorSelector[check.state]}}
          key={Math.random()}
          className={selected}
          onClick={()=>{openTable(el._id, check.state === "unnactive")}}
        >{el.name}</button>
      })}
    </ul>
  </section>
}