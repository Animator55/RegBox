
import React from 'react'
import { faCheckSquare, faSquare, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Configuration } from '../roleMains/Main'
import { router } from '../vite-env'

type Props = {
  close: Function
}

let bannedConfigs = ["map"]

export default function ConfigurationComp({ close }: Props) {
  const configTitles: router = {
    topBarButtons: "Atajos",
    prodsAsList: "Mostrar productos como lista",
    orderedLists: "Ordenar y dividir los productos sumados",
    prodsInEditorAsList: "Mostrar productos en el editor como lista",
    animations: "Mostrar animaciones",
    "notifications": "Notificaciones",
    "products": "Productos",
    "historial": "Historial",
    "information": "Información",
    "configuration": "Configuración",
    "download": "Guardar datos",
    "help": "Ayuda",
    "logout": "Cerrar sesión",
  }
  const setTitle = (val: string) => {
    if (Object.keys(configTitles).includes(val)) return configTitles[val]
    return val
  }
  const c = React.useContext(Configuration)

  let configKeys = Object.keys(c.config).filter(el => { if (!bannedConfigs.includes(el)) return el })

  let conf = c.config as router

  const Color = ({ val, obj, edit }: { val: string, obj: { [key: string]: any }, edit: Function }) => {
    return <div className="checkbox">
      <p>{setTitle(val)}</p>
      <input type='color' defaultValue={obj[val]} onBlur={(e)=>{edit(val, e.currentTarget.value)}}/>
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
            else if (typeof conf[key] === "string") return <Color key={Math.random()} val={key} obj={conf} edit={editStr} />
            else return <Block key={Math.random()} val={key} />
          })}
        </ul>
      </section>
    </section>
  </section>
}