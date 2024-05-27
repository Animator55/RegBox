import React from 'react'
import { products } from '../defaults/products'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faBottleWater, faCheck, faCookie, faDrumstickBite, faIceCream, faMartiniGlassCitrus, faPlateWheat, faWineBottle, faXmark } from '@fortawesome/free-solid-svg-icons'
import "../assets/productList.css"

type Props = {}

export type pagesRouter = {
  [key: string] : any
}
export default function ProductList({}: Props) {
  const [ProductPage, setProductPage] = React.useState("Entrada")
  const pages: pagesRouter = {
    "Entrada": faCookie,
    "Montadito": faPlateWheat,
    "Principal": faDrumstickBite,
    "Postres": faIceCream,
    "Bebidas": faBottleWater,
    "Vinos": faWineBottle,
    "Tragos": faMartiniGlassCitrus,
}


const ProductPicker = ()=>{
  const Router = ()=>{
      return <nav className='picker-nav'>
          {Object.keys(pages).map(page=>{
              let bool = false
              // selectedProds.some(it=>{
              //     return it.type === page
              // })
              return <button 
                  key={Math.random()}
                  className={ProductPage === page ? "active" : ""}
                  onClick={()=>{setProductPage(page)}}
                  style={bool ? {color: "var(--cgreen)"}:{}}
              >
                  <FontAwesomeIcon icon={pages[page]}/>
                  <p>{page}</p>
              </button>
          })}
      </nav>
  }

  return <section className='picker-section'>
      <Router/>
      <div className='product-paging'>
          <div className='product-picker' id='product-picker'>
              {RenderProducts(ProductPage)}
          </div>
      </div>
  </section>
}

  return <>
    <ProductPicker/>
  </>
}

const RenderProducts = (page: string)=>{
  return products[page].map(item=>{
      // let [boolean, index] = checkItemBuy(selectedProds, item._id)
      return <div
          key={Math.random()}
          className='pickeable-item'
      >
          <FontAwesomeIcon icon={faArrowCircleLeft}/>
          <p>{item.name}</p>
          <p>${item.price}</p>
          
      </div>
  })
}
