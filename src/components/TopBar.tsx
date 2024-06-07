import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../assets/topBar.css'
import { faBell, faCircleDollarToSlot, faGear, faRightFromBracket, faUserCircle } from '@fortawesome/free-solid-svg-icons'

type Props = {
  setCurrentPop: Function
}

export default function TopBar({setCurrentPop}: Props) {
  return <nav className="main-top-bar">
    <button className='text-button' onClick={()=>{
      setCurrentPop("products")
    }}><FontAwesomeIcon icon={faCircleDollarToSlot}/>Productos</button>
    <button className='text-button' onClick={()=>{
      setCurrentPop("notifications")
    }}><FontAwesomeIcon icon={faBell}/>Notificaciones</button>
    <hr></hr>
    <button className='option' onClick={()=>{
      setCurrentPop("configuration")
    }}><FontAwesomeIcon icon={faGear}/></button>
    <button className='option'><FontAwesomeIcon icon={faRightFromBracket}/></button>
    <button className='user'><FontAwesomeIcon icon={faUserCircle}/></button>
  </nav>
}