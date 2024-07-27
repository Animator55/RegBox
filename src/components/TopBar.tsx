import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../assets/topBar.css'
import { faBell, faCircleDollarToSlot, faGear, faRightFromBracket, faUserCircle } from '@fortawesome/free-solid-svg-icons'

type Props = {
  OpenPop: Function
}

export default function TopBar({OpenPop}: Props) {
  return <nav className="main-top-bar">
    <button className='text-button' onClick={()=>{
      OpenPop("products")
    }}><FontAwesomeIcon icon={faCircleDollarToSlot}/>Productos</button>
    <button className='text-button' onClick={()=>{
      OpenPop("notifications")
    }}><FontAwesomeIcon icon={faBell}/>Notificaciones</button>
    <hr></hr>
    <button className='option' onClick={()=>{
      OpenPop("configuration")
    }}><FontAwesomeIcon icon={faGear}/></button>
    <button className='option'><FontAwesomeIcon icon={faRightFromBracket}/></button>
    <button className='user'><FontAwesomeIcon icon={faUserCircle}/></button>
  </nav>
}