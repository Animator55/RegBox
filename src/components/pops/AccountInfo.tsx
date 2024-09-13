import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { sessionType } from '../../vite-env'

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
        <ul>
          <p>{parsed._id}</p>
          <p>{parsed.role}</p>
          <p>{parsed.name}</p>
          <p>{parsed.domain}</p>
          <p>{parsed.opened}</p>
        </ul>
      </section>
    </section>
  </section>
}