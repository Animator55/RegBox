import React from 'react'
import Map from './Map'
import ProductList from './ProductList'
import { Configuration } from '../roleMains/Main'
import { TableType } from '../vite-env'

type Props = {
    setCurrentID: Function
    current: TableType | undefined
    tablesMin: {_id: string, number: number, state: "open" | "paying" | "closed" | "unnactive"}[]
    addItem: Function
}

export default function ProdAndMap({current, setCurrentID, tablesMin,addItem}: Props) {
    let c = React.useContext(Configuration)
    const [page, setPage] = React.useState("map")
    
    const changeProdDisplay = ()=>{
        c.setConfig({...c.config, prodsAsList: !c.config.prodsAsList})
    }


    const NavBar = ()=>{
        return <nav className="nav-page">
            <button className={page === "products" ? "active" : ""} onClick={()=>{setPage("products")}}>Productos</button>
            <button className={page === "map" ? "active" : ""} onClick={()=>{setPage("map")}}>Mapa</button>
        </nav>
    }

    return <section className='prod-map-container'>
        <NavBar/>
        {page === "map" ? <Map current={current} setCurrentID={setCurrentID} tablesOpenMin={tablesMin}/>: <ProductList displayList={c.config.prodsAsList} changeDisplay={changeProdDisplay} addItem={addItem}/>}
    </section>
}