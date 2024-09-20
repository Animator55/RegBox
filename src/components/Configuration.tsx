
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
  const c = React.useContext(Configuration)

  let configKeys = Object.keys(c.config).filter(el => { if (!bannedConfigs.includes(el)) return el })

  let conf = c.config as router

  const CheckBox = ({ val, obj, edit}: { val: string, obj: { [key: string]: any }, edit: Function}) => {
    return <div className="checkbox" onClick={()=>{edit(val)}}>
      <p>{val}</p>
      <button>
        <FontAwesomeIcon icon={obj[val] === true ? faCheckSquare : faSquare} />
      </button>
    </div>
  }

  const Block = ({ val }: { val: string }) => {
    const edit = (entry: string)=>{
      c.setConfig({...c.config, [val]: {...conf[val], [entry]: !conf[val][entry]}})
    }

    return <section>
      <label>{val}</label>
      <ol>
        {Object.keys(conf[val]).map(el => {
          return <CheckBox val={el} obj={conf[val]} edit={edit} />
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
      <section className='pop-content'>
        <ul>
          {configKeys.map(key => {
            const edit =(entry: string)=>{
              c.setConfig({...c.config, [entry]: !conf[entry]})
            }

            if (typeof conf[key] === "boolean") return <CheckBox val={key} obj={conf} edit={edit}/>
            else return <Block val={key} />
          })}
        </ul>
      </section>
    </section>
  </section>
}