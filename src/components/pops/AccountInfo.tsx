import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { sessionType } from '../../vite-env'
import { selectDomainById } from '../../logic/API'

type Props = {
  close: Function
}

export default function AccountInfo({ close }: Props) {
  let session = window.localStorage.getItem("RegBoxSession")
  let parsed: sessionType = session ? JSON.parse(session) : undefined
  return parsed && <section className='back-blur' onClick={(e) => {
    let target = e.target as HTMLDivElement
    if (target.className === "back-blur") close()
  }}>
    <section className='pop'>
      <header>
        <div className='pop-top'>
          <h2>Información de la cuenta</h2>
          <button onClick={() => { close() }}><FontAwesomeIcon icon={faXmark} /></button>
        </div>
      </header>
      <section className='pop-content'>
        <section className='account-info'> 
          <div>
            <label>Dominio</label>
            <p>{selectDomainById(parsed.domain)?.name}</p>
          </div>
          <div>
            <label>Nombre de Usuario</label>
            <p>{parsed.name}<i style={{opacity:.7}}>{" (ID:"+parsed._id+")"}</i></p>
          </div>
          <div>
            <label>Hora de apertura</label>
            <p>{parsed.opened}</p>
          </div>
        </section>
      </section>
    </section>
  </section>
}