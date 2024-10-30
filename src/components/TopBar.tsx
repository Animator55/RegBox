import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../assets/topBar.css'
import { faBell, faCircleDollarToSlot, faClockRotateLeft, faFloppyDisk, faGear, faInfoCircle, faQuestionCircle, faRightFromBracket } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { Configuration } from '../roleMains/Main'
import { router } from '../vite-env'
import Logo from "../assets/logo.png"

type Props = {
  OpenPop: Function
  download: Function
}

export default function TopBar({ OpenPop, download }: Props) {

  const c = React.useContext(Configuration)
  const topButtons = c.config.topBarButtons

  const textButtons: router = {
    notifications: <button
      className='text-button notifications-pop-button'
      style={topButtons.notifications ? {}: {display: "none"}}
      onClick={() => {
        OpenPop("notifications")
      }}><FontAwesomeIcon icon={faBell} />Notificaciones</button>,
    products: <button
      className='text-button prod-edit-pop-button'
      data-page={""}
      style={topButtons.products ? {}: {display: "none"}}
      onClick={(e) => {
        OpenPop("products", e.currentTarget.dataset.page)
      }}><FontAwesomeIcon icon={faCircleDollarToSlot} />Productos</button>,
    historial: <button
      className='text-button historial-general-pop-button'
      data-page={"false"}
      style={topButtons.historial ? {}: {display: "none"}}
      onClick={(e) => {
        OpenPop("historial", e.currentTarget.dataset.page)
        e.currentTarget.dataset.page = "false"
      }}><FontAwesomeIcon icon={faClockRotateLeft} />Historial</button>,
  }
  const shortButtons: router = {
    "information": <button className="option" title='Información de la sesión' onClick={() => { OpenPop("information") }}><FontAwesomeIcon icon={faInfoCircle} />
    </button>,
    "configuration": <button className="option" title='Configuración' onClick={() => { OpenPop("configuration") }}><FontAwesomeIcon icon={faGear} />
    </button>,
    "download": <button className="option" title='Descargar datos locales' onClick={() => { download() }}><FontAwesomeIcon icon={faFloppyDisk} />
    </button>,
    "help": <button className="option"  title='Ayuda'>
      <a href='https://github.com/Animator55/RegBox' target='_blank'>
        <FontAwesomeIcon icon={faQuestionCircle} />
      </a>
    </button>,
    "logout": <button className="option" title='Cerrar la sesión' onClick={() => { OpenPop("closesession") }}><FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  }

  return <nav className="main-top-bar">
    {topButtons && Object.keys(textButtons).map(btn => {
      return <React.Fragment key={Math.random()}>
        {textButtons[btn]}
      </React.Fragment>
    })}

    <hr></hr>
    {topButtons && Object.keys(topButtons).map(btn => {
      if (topButtons[btn]) return <React.Fragment key={Math.random()}>{shortButtons[btn]}</React.Fragment>
      else return null
    })}

    <button className='user' onClick={() => {
      OpenPop("account")
    }}><img src={Logo} style={{width: "2rem"}}/></button>

  </nav>
}