import { faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
  close: Function
}

export default function ConfigurationComp({ close }: Props) {

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
        
      </section>
    </section>
  </section>
}