import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../assets/topBar.css'
import { faBell, faCircleDollarToSlot, faFloppyDisk, faGear, faRightFromBracket, faUserCircle } from '@fortawesome/free-solid-svg-icons'

type Props = {
  OpenPop: Function
  download: Function
  logout: Function
}

export default function TopBar({OpenPop, download, logout}: Props) {
  return <nav className="main-top-bar">
    <button className='text-button prod-edit-pop-button' data-page={""} onClick={(e)=>{
      OpenPop("products", e.currentTarget.dataset.page)
    }}><FontAwesomeIcon icon={faCircleDollarToSlot}/>Productos</button>
    <button className='text-button' onClick={()=>{
      OpenPop("notifications")
    }}><FontAwesomeIcon icon={faBell}/>Notificaciones</button>
    <hr></hr>
    <button className='option' onClick={()=>{
      OpenPop("configuration")
    }}><FontAwesomeIcon icon={faGear}/></button>
    <button className='option' onClick={()=>{
      download()
    }}><FontAwesomeIcon icon={faFloppyDisk}/></button>
    <button className='option' onClick={()=>{logout()}}><FontAwesomeIcon icon={faRightFromBracket}/></button>
    <button className='user'><FontAwesomeIcon icon={faUserCircle}/></button>
  </nav>
}