import React from 'react'
import Map from './Map'
import ProductList from './ProductList'
import { Configuration } from '../roleMains/Main'
import { TableType } from '../vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'
import MiniProductList from './mini/MiniProductList'
import MiniMap from './mini/MiniMap'

type Props = {
    setCurrentID: Function
    current: TableType | undefined
    tablesMin: { _id: string, number: string, state: "open" | "paying" | "closed" | "unnactive" }[]
    addItem: Function
}

let subPage = ""

export default function ProdAndMap({ current, setCurrentID, tablesMin, addItem }: Props) {
    let c = React.useContext(Configuration)
    const [page, setPageState] = React.useState("map")
    const [loading, setLoading] = React.useState("")

    const changeProdDisplay = () => {
        c.setConfig({ ...c.config, prodsAsList: !c.config.prodsAsList })
    }

    const setPage = (pageStr: string, sub?: string) => {
        if (page === pageStr) return
        if(c.config.animations === false) {
            subPage = sub === undefined ? "" : sub
            setPageState(pageStr)
            return 
        }
        let container = document.querySelector(".prod-map-container") as HTMLDivElement
        if (!container) return
        container.classList.remove("change-to-products")
        container.classList.remove("change-to-map")
        container.offsetWidth
        container.classList.add("change-to-" + pageStr)
        setTimeout(() => {
            subPage = sub === undefined ? "" : sub
            setPageState(pageStr)
            setTimeout(() => {
                container.classList.remove("change-to-" + pageStr)
            }, 10)
        }, 300)
    }

    const NavBar = () => {
        return <nav id='main-router' className="nav-page">
            <button className={page === "products" ? "active" : ""} onClick={() => { setPage("products") }}>Productos</button>
            <button className={page === "map" ? "active" : ""} onClick={() => { setPage("map") }}>Mapa</button>
        </nav>
    }

    const Loading = () => {
        return <section className='loading'>
            <FontAwesomeIcon icon={faCircleNotch} spin />
            <h3>Creando mesa...</h3>
        </section>
    }

    const setCurrentHandler = (id: string, creating: boolean) => {
        if (creating) setLoading(id) 
        else setCurrentID(id)
    }
    React.useEffect(() => {
        if (subPage !== "") {
            let button = document.getElementById("prod-nav." + subPage) as HTMLButtonElement
            button.click()
            subPage = ""
        }
        if (loading) {
            if(!c.config.animations) {
                setCurrentID(loading)
                setLoading("")
                setPageState("products")
                return
            }
            let container = document.querySelector(".prod-map-container") as HTMLDivElement
            if (!container) return

            if(page !== "products")container.classList.add("change-to-products")
            setTimeout(() => {
                if(page !== "products") setTimeout(() => {
                    container.classList.remove("change-to-products")
                }, 100)
                setCurrentID(loading)
                setLoading("")
                setPageState("products")
            }, 200)
        }
    })

    return <section
        className='prod-map-container'>
        <NavBar />
        <div className='prod-map-sub-container'>
            {page === "map" ? <>
                <MiniProductList Open={(val: string) => { setPage("products", val) }} />
                <Map current={current} setCurrentID={setCurrentHandler} tablesOpenMin={tablesMin} />
            </>
                :
                <>
                    <ProductList
                        displayList={c.config.prodsAsList}
                        changeDisplay={changeProdDisplay}
                        addItem={addItem}
                    />
                    <MiniMap 
                        openTable={(_id: string, isNew: boolean) => {
                            setCurrentHandler(_id, isNew)
                        }}
                        tablesOpenMin={tablesMin}
                        current={current}
                    />
                </>
            }
        </div>
        {loading !== "" && <Loading />}
    </section>
}