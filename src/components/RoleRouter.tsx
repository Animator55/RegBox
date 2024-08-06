import { productsType } from '../defaults/products'
import Main from '../roleMains/Main'
import { configType, sessionType, TablePlaceType } from '../vite-env'

type Props = {
    session: sessionType
    initialData?: {
        config: configType
        products: productsType
        tablePlaces: TablePlaceType[]
    }
    logout: Function
}

export default function RoleRouter({session, initialData,logout}: Props) {
    let page: {[key:string]: any} = {
        "main": <Main initialData={initialData} logout={logout}/>,
        "pawn": <div>WiP</div>
    }

    return <main>
        {session.role !== "" ? page[session.role]: null}
    </main>
}