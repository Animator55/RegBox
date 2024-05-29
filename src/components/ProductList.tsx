import React from 'react'
import { products } from '../defaults/products'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleLeft, faBottleWater, faCookie, faDrumstickBite, faIceCream, faMartiniGlassCitrus, faPlateWheat, faWineBottle } from '@fortawesome/free-solid-svg-icons'
import "../assets/productList.css"

type Props = {}

export type pagesRouter = {
  [key: string]: any
}
export default function ProductList({ }: Props) {
  const [ProductPage, setProductPage] = React.useState("Entrada")
  // const pages: pagesRouter = {
  //   "Entrada": faCookie,
  //   "Montadito": faPlateWheat,
  //   "Principal": faDrumstickBite,
  //   "Postres": faIceCream,
  //   "Bebidas": faBottleWater,
  //   "Vinos": faWineBottle,
  //   "Tragos": faMartiniGlassCitrus,
  // }
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
            {/* <FontAwesomeIcon icon={pages[page]} /> */}
            <p>{page.name}</p>
          </button>
        })}
      </nav>
    }

    const RenderProducts = () => {
      if(!products[ProductPage]) return []

      return products[ProductPage].map(item => {
        // let [boolean, index] = checkItemBuy(selectedProds, item._id)
        return <div
          key={Math.random()}
          className='pickeable-item'
        >
          <FontAwesomeIcon icon={faArrowCircleLeft} />
          <p>{item.name}</p>
          <p>${item.price}</p>

        </div>
      })
    }

    return <section className='picker-section'>
      <Router />
      <div className='product-paging'>
        <div className='product-picker' id='product-picker'>
          <RenderProducts/>
        </div>
      </div>
    </section>
  }

  return <>
    <ProductPicker />
  </>
}
