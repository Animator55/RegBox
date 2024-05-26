import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../assets/topBar.css'
import { faBell, faCircleDollarToSlot, faGear, faRightFromBracket, faUserCircle } from '@fortawesome/free-solid-svg-icons'

type Props = {}

export default function TopBar({}: Props) {
  return <nav className="main-top-bar">
    <button className='text-button'><FontAwesomeIcon icon={faCircleDollarToSlot}/>Productos</button>
    <button className='text-button'><FontAwesomeIcon icon={faBell}/>Notificaciones</button>
    <hr></hr>
    <button className='option'><FontAwesomeIcon icon={faGear}/></button>
    <button className='option'><FontAwesomeIcon icon={faRightFromBracket}/></button>
    <button className='user'><FontAwesomeIcon icon={faUserCircle}/></button>
  </nav>
}