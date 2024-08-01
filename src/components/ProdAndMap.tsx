import React from 'react'
import Map from './Map'
import ProductList from './ProductList'
import { Configuration } from '../roleMains/Main'
import { TableType } from '../vite-env'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleNotch } from '@fortawesome/free-solid-svg-icons'

type Props = {
    setCurrentID: Function
    current: TableType | undefined
    tablesMin: {_id: string, number: string, state: "open" | "paying" | "closed" | "unnactive"}[]
    addItem: Function
    OpenPop: Function
}

export default function ProdAndMap({current, setCurrentID, tablesMin,addItem, OpenPop}: Props) {
    let c = React.useContext(Configuration)
    const [page, setPage] = React.useState("map")
    const [loading, setLoading] = React.useState("")
    
    const changeProdDisplay = ()=>{
        c.setConfig({...c.config, prodsAsList: !c.config.prodsAsList})
    }


    const NavBar = ()=>{
        return <nav id='main-router' className="nav-page">
            <button className={page === "products" ? "active" : ""} onClick={()=>{setPage("products")}}>Productos</button>
            <button className={page === "map" ? "active" : ""} onClick={()=>{setPage("map")}}>Mapa</button>
        </nav>
    }

    const Loading = ()=>{
        return <section className='loading'>
            <FontAwesomeIcon icon={faCircleNotch} spin/>
            <h3>Creando mesa...</h3>
        </section>
    }

    const setCurrentHandler = (id: string, creating: boolean)=>{
        if(creating)setLoading(id)
        else setCurrentID(id)
    }
    React.useEffect(()=>{
        if(loading) setTimeout(()=>{
            setCurrentID(loading)
            setPage("products")
            setLoading("")
        }, 200)
    })

    return <section className='prod-map-container'>
        <NavBar/>
        {page === "map" ? <Map current={current} setCurrentID={setCurrentHandler} tablesOpenMin={tablesMin}/>: <ProductList OpenPop={OpenPop} displayList={c.config.prodsAsList} changeDisplay={changeProdDisplay} addItem={addItem}/>}
        {loading !== "" && <Loading/>}
    </section>
}