import React from 'react'
import Map from './Map'
import ProductList from './ProductList'

type Props = {
    setCurrent: Function
}

export default function ProdAndMap({setCurrent}: Props) {
    const [page, setPage] = React.useState("map")

    const NavBar = ()=>{
        return <nav>
            <button onClick={()=>{setPage("products")}}>Productos</button>
            <button onClick={()=>{setPage("map")}}>Mapa</button>
        </nav>
    }

    return <section>
        <NavBar/>
        {page === "map" ? <Map setCurrent={setCurrent}/>: <ProductList/>}
    </section>
}