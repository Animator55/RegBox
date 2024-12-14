import { faCheck, faCircleNotch, faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { getNotificationsGeneral } from '../logic/API'
import React from 'react'
import { SingleEvent } from '../vite-env'

type Props = {
  close: Function
  EditMassiveTable: Function
  EditTable: Function
  setNotis: Function
  autoNotis:boolean
  notis: SingleEvent[]
}

export default function Notifications({ close, notis, setNotis, EditMassiveTable, EditTable, autoNotis }: Props) {
  const [list, setList] = React.useState<SingleEvent[] | undefined>(undefined)

  const [pop, OpenPop] = React.useState<SingleEvent | undefined>()

  const requestNotifications = () => {
    setList(notis)
  }

  React.useEffect(() => {
    if (!list) setTimeout(() => { requestNotifications() }, 300)
  }, [])

  const Alert = () => {
    return <section className='alert'>
      <FontAwesomeIcon icon={faWarning} />
      <h2>No hay notificaciones previas.</h2>
    </section>
  }

  const RenderList = () => {
    if (!list || list.length === 0) return <Alert />

    let ul = []
    for (let i = 0; i < list.length; i++) {
      // if(i === 10) break
      let el = list[i]
      const action = (boolean: boolean) => {
        let val = [...list.map(item => {
          if (el === item) return { ...el, accepted: boolean }
          else return item
        })]
        setList(val)
        setNotis(val)
        if (!boolean) return
        if (el.type === "products") EditMassiveTable(el._id, el.products, el.comment)
        else if (el.type === "replace") EditTable(el._id, "products", el.products, el.comment)
      }

      const actionZone = {
        "undefined": <>
          <button onClick={() => { action(true) }}>
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button onClick={() => { action(false) }}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </>,
        "null": <>
          <button onClick={() => { action(true) }}>
            <FontAwesomeIcon icon={faCheck} />
          </button>
          <button onClick={() => { action(false) }}>
            <FontAwesomeIcon icon={faXmark} />
          </button>
        </>,
        "true": <FontAwesomeIcon icon={faCheck} />,
        "false": <FontAwesomeIcon icon={faXmark} />,
      }

      ul.push(<li
        className='notification-item'
        key={Math.random()}
        onClick={(e) => {
          let target = e.target as HTMLDivElement
          if (target.className === "notification-item") OpenPop(el)
        }}
      >
        <p>Mesa {el.name}</p>
        <p className='owner-tag'>{el.timestamp}</p>

        <div className='accept-zone'>{actionZone[`${autoNotis ? true : el.accepted}`]}</div>
      </li>)
    }

    return <ul>
      {ul}
    </ul>
  }

  const ViewNotification = () => {
    if (!pop) return
    return <section className='back-blur' onClick={(e) => {
      let target = e.target as HTMLDivElement
      if (target.className === "back-blur") OpenPop(undefined)
    }}>
      <section className='pop'>
        <header>
          <div className='pop-top'>
            <h2>Detalles</h2>
            <button onClick={() => { OpenPop(undefined) }}><FontAwesomeIcon icon={faXmark} /></button>
          </div>
        </header>
        <section className='pop-content'>
          <div className='product-editor-content'>
            <div>
              <h3>Mesa {pop.name}</h3>
              <p>{pop.timestamp}</p>
              {pop.owner_name && <p>Origen: <i>{pop.owner_name}</i></p>}
            </div>
            <hr></hr>

            <div className='prod-container'>
              <div className='top-result-prod'>
                <div>Nombre</div>
                <div>Precio</div>
                <div>Cantidad</div>
              </div>
              <ul className='result-prod-list'>
                {pop.products && pop.products.map((pha, i) => {
                  return <React.Fragment
                    key={Math.random()}
                  >
                    <label>Fase {i + 1}</label>
                    <ul>
                      {pha.map(el => {
                        return el.header ? <label key={Math.random()}>{el.type}</label> :
                          <li key={Math.random()}>
                            <div title={el.name}>{el.name}</div>
                            <div>${el.price}</div>
                            <div>{el.amount}</div>
                          </li>
                      })}
                    </ul>
                  </React.Fragment>
                })}
              </ul>
            </div>
          </div>
        </section>
      </section>
    </section>
  }

  return <section className='back' onClick={(e) => {
    let target = e.target as HTMLDivElement
    if (target.className === "back") close()
  }}>
    {pop && <ViewNotification />}
    <section className='notifications'>
      {list === undefined ?
        <div className='loading-notis'><FontAwesomeIcon icon={faCircleNotch} spin /></div>
        : <RenderList />
      }
    </section>
  </section>
}