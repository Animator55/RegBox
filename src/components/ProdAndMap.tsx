import React from 'react'
import Map from './Map'
import ProductList from './ProductList'

type Props = {
    setCurrent: Function
}

export default function ProdAndMap({setCurrent}: Props) {
    const [page, setPage] = React.useState("map")

    const NavBar = ()=>{
        return <nav className="nav-page">
            <button className={page === "products" ? "active" : ""} onClick={()=>{setPage("products")}}>Productos</button>
            <button className={page === "map" ? "active" : ""} onClick={()=>{setPage("map")}}>Mapa</button>
        </nav>
    }

    return <section className='prod-map-container'>
        <NavBar/>
        {page === "map" ? <Map setCurrent={setCurrent}/>: <ProductList/>}
    </section>
}