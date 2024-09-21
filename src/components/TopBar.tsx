import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../assets/topBar.css'
import { faBell, faCircleDollarToSlot, faClockRotateLeft, faFloppyDisk, faGear, faInfoCircle, faQuestionCircle, faRightFromBracket, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import React from 'react'
import { Configuration } from '../roleMains/Main'
import { router } from '../vite-env'

type Props = {
  OpenPop: Function
  download: Function
}

export default function TopBar({ OpenPop,download }: Props) {

  const c = React.useContext(Configuration)

  const textButtons: router = {
    notifications:<button className='text-button notifications-pop-button' onClick={() => {
      OpenPop("notifications")
    }}><FontAwesomeIcon icon={faBell} />Notificaciones</button>,
    products: <button className='text-button prod-edit-pop-button' data-page={""} onClick={(e) => {
      OpenPop("products", e.currentTarget.dataset.page)
    }}><FontAwesomeIcon icon={faCircleDollarToSlot} />Productos</button>,
    historial: <button className='text-button historial-general-pop-button' data-page={"false"} onClick={(e) => {
      OpenPop("historial", e.currentTarget.dataset.page)
      e.currentTarget.dataset.page = "false"
    }}><FontAwesomeIcon icon={faClockRotateLeft} />Historial</button>,
  }
  const shortButtons :router = {
    "information":<button className="option" onClick={() => { OpenPop("information") }}><FontAwesomeIcon icon={faInfoCircle}/>
    </button>,
    "configuration":<button className="option" onClick={() => { OpenPop("configuration") }}><FontAwesomeIcon icon={faGear}/>
    </button>,
    "download": <button className="option" onClick={() => { download() }}><FontAwesomeIcon icon={faFloppyDisk}/>
    </button>,
    "help": <button className="option" >
      <a href='https://github.com/Animator55/RegBox' target='_blank'>
        <FontAwesomeIcon icon={faQuestionCircle}/>
      </a>
    </button>,
    "logout": <button className="option" onClick={() => { OpenPop("closesession") }}><FontAwesomeIcon icon={faRightFromBracket}/>
    </button>
  }
  const topButtons = c.config.topBarButtons

  return <nav className="main-top-bar">
    {Object.keys(topButtons).map(btn=>{
      if(topButtons[btn])return textButtons[btn]
      else return null
    })}
    
    <hr></hr>
    {Object.keys(topButtons).map(btn=>{
      if(topButtons[btn])return shortButtons[btn]
      else return null
    })}

    <button className='user' onClick={() => {
      OpenPop("account")
    }}><FontAwesomeIcon icon={faUserCircle} /></button>

  </nav>
}