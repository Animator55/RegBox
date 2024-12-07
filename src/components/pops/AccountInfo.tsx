import { faQrcode, faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { sessionType } from '../../vite-env'
import { domainType, selectDomainById } from '../../logic/API'

type Props = {
  close: Function
  peers: string[]
}

export default function AccountInfo({ close, peers }: Props) {
  let session = window.localStorage.getItem("RegBoxSession")
  let parsed: sessionType = session ? JSON.parse(session) : undefined

  let dom = selectDomainById(parsed.domain) as domainType
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
            <p>{dom.name}</p>
            <label>Nombre de Usuario</label>
            <p>{parsed.name}<i style={{opacity:.5}}>{" (ID:"+parsed._id+")"}</i></p>
            <label>Hora de apertura</label>
            <p>{parsed.opened}</p>
          </div>
          <div>
            <label>Usuarios Conectados</label>
            <ul className='users-connected'>
              {peers.length !== 0 ? peers.map(el=>{
                return <li key={Math.random()}>
                  {el}
                </li>
              }) : 
              <section className='alert'>
                  <FontAwesomeIcon icon={faWarning} />
                  <h3>No hay usuarios conectados.</h3>
                  <button className='default-button'>
                      <FontAwesomeIcon icon={faQrcode}/> Generar QR
                  </button>
              </section>}
            </ul>
          </div>
        </section>
      </section>
    </section>
  </section>
}