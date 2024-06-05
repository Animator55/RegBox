import React from 'react'
import { products } from '../defaults/products'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faBottleWater, faCircle, faCookie, faDrumstickBite, faIceCream, faList, faMartiniGlassCitrus, faPlateWheat, faTableCells, faWineBottle } from '@fortawesome/free-solid-svg-icons'
import "../assets/productList.css"
import SearchBar from './SearchBar'
import checkSearch from '../logic/checkSearch'

type Props = {
  displayList: boolean
  changeDisplay: Function
  addItem: Function
}

export type pagesRouter = {
  [key: string]: any
}
export default function ProductList({displayList, changeDisplay, addItem}: Props) {
  const [search, setSearch] = React.useState("")
  const [ProductPage, setProductPage] = React.useState("Entrada")
  const icons: pagesRouter = {
    "cookie": faCookie,
    "plate": faPlateWheat,
    "bite": faDrumstickBite,
    "ice": faIceCream,
    "water": faBottleWater,
    "wine": faWineBottle,
    "cocktail": faMartiniGlassCitrus,
    "": faCircle
  }
  const pages = [
    {name: "Entrada", icon: ""},
    {name: "Principal", icon: ""},
    {name: "Postres", icon: ""},
    {name: "Bebidas", icon: ""},
    {name: "Other", icon: ""},
    {name: "Vinos", icon: ""},
  ]


  const ProductPicker = () => {
    const Router = () => {
      return <nav className='picker-nav'>
        {pages.map(page => {
          let bool = false
          // selectedProds.some(it=>{
          //     return it.type === page
          // })
          return <button
            key={Math.random()}
            className={ProductPage === page.name ? "active" : ""}
            onClick={() => { setProductPage(page.name) }}
            style={bool ? { color: "var(--cgreen)" } : {}}
          >
            <FontAwesomeIcon icon={icons[page.icon]} />
            <p>{page.name}</p>
          </button>
        })}
      </nav>
    }

    const Top = ()=>{
      return <section className='products-top'>
        <SearchBar searchButton={setSearch} placeholder={"Buscar producto"} defaultValue={search} onChange={true}/>
        <button className='default-button' title='Cambiar disposición' onClick={()=>{
          changeDisplay()
        }}>
          <FontAwesomeIcon icon={displayList ? faList : faTableCells}/>
        </button>
      </section>
    }

    const RenderProducts = () => {
      if(!products[ProductPage]) return []

      return products[ProductPage].map(item => {
        let check = checkSearch(item.name, search)

        return <div
          key={Math.random()}
          className={search !== "" && check === item.name ? "d-none" : 'pickeable-item'}
          onClick={()=>{addItem(item)}}
        >
          <FontAwesomeIcon icon={faArrowCircleLeft} />
          <p className='name' dangerouslySetInnerHTML={{ __html: check }}></p>
          <p>${item.price}</p>

        </div>
      })
    }

    return <section className='picker-section'>
      <Router />
      <div className='product-paging'>
        <Top/>
        <div className={displayList ? 'product-picker' : "product-picker grid"} id='product-picker'>
          <RenderProducts/>
        </div>
      </div>
    </section>
  }

  return <>
    <ProductPicker />
  </>
}
