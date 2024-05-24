import Main from '../roleMains/Main'
import { sessionType } from '../vite-env'

type Props = {
    session: sessionType
}

export default function RoleRouter({session}: Props) {
    let page: {[key:string]: any} = {
        "main": <Main/>,
        "pawn": <div>WiP</div>
    }

    return <main>
        {session.role !== "" ? page[session.role]: null}
    </main>
}