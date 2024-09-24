import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faList, faPenToSquare, faTableCells, faWarning } from '@fortawesome/free-solid-svg-icons'
import "../assets/productList.css"
import SearchBar from './SearchBar'
import checkSearch from '../logic/checkSearch'
import { Products } from '../roleMains/Main'

type Props = {
  displayList: boolean
  changeDisplay: Function
  addItem: Function
}

export type pagesRouter = {
  [key: string]: any
}

export default function ProductList({displayList, changeDisplay, addItem}: Props) {
  const p = React.useContext(Products).list

  const pages = Object.keys(p)
  const [search, setSearch] = React.useState("")
  const [ProductPage, setProductPage] = React.useState(pages.length !== 0 ? pages[0] : "")


  const OpenPop = ()=>{
    let button = document.querySelector(".prod-edit-pop-button") as HTMLButtonElement
    button.dataset.page = ProductPage
    button.click()
  }

  const ProductPicker = () => {
    const Router = () => {
      return <nav className='picker-nav'>
        {pages.map(page => {
          return <button
            key={Math.random()}
            id={"prod-nav."+page}
            className={ProductPage === page ? "active" : ""}
            onClick={() => { setProductPage(page) }}
          >
            <p>{page}</p>
          </button>
        })}
      </nav>
    }

    const Top = ()=>{
      return <section className='products-top'>
        <SearchBar searchButton={setSearch} placeholder={"Buscar producto"} defaultValue={search} onChange={true}/>
        <button className='default-button-2' title='Editar productos' onClick={()=>{
          OpenPop()
        }}>
          <FontAwesomeIcon icon={faPenToSquare}/>
        </button>
        <button className='default-button-2' title='Cambiar disposición' onClick={()=>{
          changeDisplay()
        }}>
          <FontAwesomeIcon icon={displayList ? faList : faTableCells}/>
        </button>
      </section>
    }

    const Alert = ()=>{
      return <section className='alert absolute'>
          <FontAwesomeIcon icon={faWarning}/>
          <h2>No hay productos añadidos a este tipo.</h2>
          <button className='default-button' onClick={()=>{OpenPop()}}>
              {"Ir al editor"}
          </button>
      </section>
    }
    const AlertType = ()=>{
      return <section className='alert absolute'>
          <FontAwesomeIcon icon={faWarning}/>
          <h2>No hay tipos añadidos en el dominio.</h2>
          <button className='default-button' onClick={()=>{OpenPop()}}>
              {"Ir al editor"}
          </button>
      </section>
    }
    const RenderProducts = () => {

      if(!p[ProductPage]) return []

      return p[ProductPage].map(item => {
        let check = checkSearch(item.name, search)

        return <div
          title={item.name}
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
        <Top/>
      <div className='product-paging'>
        <Router />
        <div className={displayList ? 'product-picker' : "product-picker grid"} id='product-picker'>
          {Object.keys(p).length === 0 && <AlertType/>}
          {!p[ProductPage] || p[ProductPage].length === 0 && <Alert/>}
          <RenderProducts/>
        </div>
      </div>
    </section>
  }

  return <ProductPicker />
}
