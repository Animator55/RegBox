import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faList, faPenToSquare, faTableCells } from '@fortawesome/free-solid-svg-icons'
import "../assets/productList.css"
import SearchBar from './SearchBar'
import checkSearch from '../logic/checkSearch'
import { Products } from '../roleMains/Main'

type Props = {
  displayList: boolean
  changeDisplay: Function
  addItem: Function
  OpenPop: Function
}

export type pagesRouter = {
  [key: string]: any
}

export default function ProductList({displayList, changeDisplay, addItem, OpenPop}: Props) {
  const p = React.useContext(Products).list

  const [search, setSearch] = React.useState("")
  const [ProductPage, setProductPage] = React.useState("Entrada")

  const pages = Object.keys(p)

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
            className={ProductPage === page ? "active" : ""}
            onClick={() => { setProductPage(page) }}
            style={bool ? { color: "var(--cgreen)" } : {}}
          >
            {/* <FontAwesomeIcon icon={faCircle} /> */}
            <p>{page}</p>
          </button>
        })}
      </nav>
    }

    const Top = ()=>{
      return <section className='products-top'>
        <SearchBar searchButton={setSearch} placeholder={"Buscar producto"} defaultValue={search} onChange={true}/>
        <button className='backgroundless-button' title='Editar productos' onClick={()=>{
          OpenPop("products", ProductPage)
        }}>
          <FontAwesomeIcon icon={faPenToSquare}/>
        </button>
        <button className='default-button' title='Cambiar disposición' onClick={()=>{
          changeDisplay()
        }}>
          <FontAwesomeIcon icon={displayList ? faList : faTableCells}/>
        </button>
      </section>
    }

    const RenderProducts = () => {
      if(!p[ProductPage]) return []

      return p[ProductPage].map(item => {
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
