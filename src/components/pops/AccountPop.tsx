import { faFloppyDisk, faGear, faInfoCircle, faQuestionCircle, faRightFromBracket} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { sessionType } from "../../vite-env"

type Props = {
    OpenPop: Function
    close: Function
    download: Function
}
export default function AccountPop({ OpenPop, close, download }: Props) {
    let session = window.localStorage.getItem("RegBoxSession")
    let parsed: sessionType = session ? JSON.parse(session) : undefined
    return parsed && <section className='back'
        onClick={(e) => {
            let target = e.target as HTMLDivElement
            if (target.className === "back") close()
        }}>
        <section className='account-span'>
            <ul>
                <button onClick={() => {
                    OpenPop("information")
                }}><FontAwesomeIcon icon={faInfoCircle} />
                    <p>Información</p>
                </button>
                <button onClick={() => {
                    OpenPop("configuration")
                }}><FontAwesomeIcon icon={faGear} />
                    <p>Configuración</p>
                </button>
                <button onClick={() => {
                    download()
                }}><FontAwesomeIcon icon={faFloppyDisk} />
                    <p>Guardar datos</p>
                </button>
                <button onClick={() => {}}><FontAwesomeIcon icon={faQuestionCircle} />
                    <p>Ayuda</p>
                </button>
                <button onClick={() => { OpenPop("closesession") }}><FontAwesomeIcon icon={faRightFromBracket} />
                    <p>Cerrar Sesión</p>
                </button>
            </ul>
        </section>
    </section>
}

