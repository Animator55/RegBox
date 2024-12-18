
import React from 'react'
import { faCheckSquare, faSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Configuration } from '../roleMains/Main'
import { router } from '../vite-env'
import { orderNameTranslations } from '../defaults/stateTraductions'

type Props = {
  close: Function
}

let bannedConfigs = ["map", "printCommand"]

export default function ConfigurationComp({ close }: Props) {
  const configTitles: router = {
    mainColor:"Color principal",
    topBarButtons: "Atajos",
    prodsAsList: "Mostrar productos como lista",
    orderedLists: "Ordenar y dividir los productos sumados",
    compressToolBar: "Comprimir la barra de funciones de mesa",
    prodsInEditorAsList: "Mostrar productos en el editor como lista",
    animations: "Mostrar animaciones",
    blur: "Difuminar fondos",
    "notifications": "Notificaciones",
    "products": "Productos",
    "historial": "Historial",
    "information": "Información",
    "configuration": "Configuración",
    "download": "Guardar datos",
    "help": "Ayuda",
    "logout": "Cerrar sesión",
    "autoAcceptNotis": "Aceptar automáticamente las notificaciones",
    miniMapOrder: "Orden de la lista de mesas",
    prodListOrder: "Orden de los productos en la lista",
    prodEditorOrder: "Orden de los productos en el editor",
  }
  const setTitle = (val: string) => {
    if (Object.keys(configTitles).includes(val)) return configTitles[val]
    return val
  }
  const c = React.useContext(Configuration)

  let configKeys = Object.keys(c.config).filter(el => { if (!bannedConfigs.includes(el)) return el })

  let conf = c.config as router

  const configsOfOrder = [
    "miniMapOrder","prodListOrder","prodEditorOrder"
  ] 

  const ListOrdersOptions = [
    "abc","abc-r","def","def-r"
  ]

  const Select = ({ val, obj, edit }: { val: string, obj: { [key: string]: any }, edit: Function }) => {
    return <div className="checkbox">
      <p>{setTitle(val)}</p>
      <select defaultValue={obj[val]} onChange={(e)=>{edit(val, e.currentTarget.value)}}>
        {ListOrdersOptions.map(opt=>{
          return <option
            key={Math.random()}
            value={opt}
          >
            {orderNameTranslations[opt]}
          </option>
        })}
      </select>
    </div>
  }
  const Color = ({ val, obj, edit }: { val: string, obj: { [key: string]: any }, edit: Function }) => {
    return <div className="checkbox">
      <p>{setTitle(val)}</p>
      <input type='color' defaultValue={obj[val]} onBlur={(e)=>{edit(val, e.currentTarget.value)}}/>
      {obj[val] !== "#f07f34" && <button onClick={()=>{edit(val, "#f07f34")}}>
        <FontAwesomeIcon icon={faXmark}/>
        </button>}
    </div>
  }

  const CheckBox = ({ val, obj, edit }: { val: string, obj: { [key: string]: any }, edit: Function }) => {
    return <div className="checkbox" onClick={() => { edit(val) }}>
      <p>{setTitle(val)}</p>
      <button style={{ color: obj[val] ? "var(--corange)" : "var(--cblack)" }}>
        <FontAwesomeIcon icon={obj[val] === true ? faCheckSquare : faSquare} />
      </button>
    </div>
  }

  const Block = ({ val }: { val: string }) => {
    const edit = (entry: string) => {
      c.setConfig({ ...c.config, [val]: { ...conf[val], [entry]: !conf[val][entry] } })
    }

    return <section className='block'>
      <label>{setTitle(val)}</label>
      <ol>
        {Object.keys(conf[val]).map(el => {
          return <CheckBox key={Math.random()} val={el} obj={conf[val]} edit={edit} />
        })}
      </ol>
    </section>
  }

  return <section className='back-blur' onClick={(e) => {
    let target = e.target as HTMLDivElement
    if (target.className === "back-blur") close()
  }}>
    <section className='pop'>
      <header>
        <div className='pop-top'>
          <h2>Configuración</h2>
          <button onClick={() => { close() }}><FontAwesomeIcon icon={faXmark} /></button>
        </div>
      </header>
      <section className='pop-content config-pop'>
        <ul>
          {configKeys.map(key => {
            const edit = (entry: string) => {
              c.setConfig({ ...c.config, [entry]: !conf[entry] })
            }
            const editStr = (entry: string, value: string) => {
              c.setConfig({ ...c.config, [entry]: value })
            }

            if (typeof conf[key] === "boolean") return <CheckBox key={Math.random()} val={key} obj={conf} edit={edit} />
            else if (typeof conf[key] === "string") {
              if(configsOfOrder.includes(key)) return <Select key={Math.random()} val={key} obj={conf} edit={editStr}/>
              else return <Color key={Math.random()} val={key} obj={conf} edit={editStr} />
            }
            else return <Block key={Math.random()} val={key} />
          })}
        </ul>
      </section>
    </section>
  </section>
}