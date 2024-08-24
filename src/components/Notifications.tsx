import { faCircleNotch, faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { getHistorialGeneral } from '../logic/API'
import React from 'react'
import { SingleEvent } from '../vite-env'

type Props = {
  close: Function
}

export default function Notifications({ close }: Props) {
  const [list, setList]= React.useState<SingleEvent[] | undefined>(undefined)

  const [pop, OpenPop] = React.useState<SingleEvent | undefined>()

  const requestNotifications = ()=>{
    let data = getHistorialGeneral()
    setList(data)
  }

  React.useEffect(()=>{
    if(!list) setTimeout(()=>{requestNotifications()}, 500)
  }, [])

  const Alert = ()=>{
    return <section className='alert'>
      <FontAwesomeIcon icon={faWarning} />
      <h2>No hay notificaciones previas.</h2>
  </section>
  }

  const RenderList = ()=>{
    if(!list || list.length === 0) return
    return <ul>
      {list.map(el=>{
        return <li
          key={Math.random()}
          onClick={()=>{OpenPop(el)}}
        >{el}</li>
      })}
    </ul>
  }

  const ViewNotification = ()=>{
    return <section className='pop'>
      Notification 
    </section>
  }

  return <section className='back-blur' onClick={(e) => {
    let target = e.target as HTMLDivElement
    if (target.className === "back-blur") close()
  }}>
    {pop && <ViewNotification/>}
    <section className='notifications'>
      {list === undefined ?
        <FontAwesomeIcon icon={faCircleNotch} spin/>
        : list.length === 0 ? 
        <Alert/> 
        :
        <RenderList/>
      }
    </section>
  </section>
}