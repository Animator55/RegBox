import { faCircle, faList, faPen, faPlus, faUpload, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import SearchBar from './SearchBar'
import { products } from '../defaults/products'
import "../assets/productEditor.css"

type Props = {
    close: Function
}

export default function ProductEditor({ close }: Props) {
    const [search, setSearch] = React.useState("")
    const types = Object.keys(products)

    const [page, setPage] = React.useState(types[0] !== undefined ? types[0] : "")

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop'>
            <header>
                <div className='pop-top'>
                    <h2>Editar Productos</h2>
                    <button onClick={() => { close() }}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
                <div className='pop-options'>
                    <SearchBar
                        onChange={true}
                        searchButton={setSearch}
                        defaultValue={search}
                        placeholder='Buscar Producto...'
                    />
                    <button><FontAwesomeIcon icon={faUpload} /></button>
                    <button className='default-button' title='Cambiar disposición'>
                        <FontAwesomeIcon icon={faList} />
                    </button>
                </div>
            </header>
            <section className='pop-content'>
                <nav>
                    <button>
                        <FontAwesomeIcon icon={faPlus} />
                        <p>Nuevo tipo</p>
                    </button>
                    {types.map(type => {
                        return <button
                            key={Math.random()}
                            className={type === page ? "active" : ""}
                            onClick={() => { setPage(type) }}
                        >
                            <FontAwesomeIcon icon={faCircle} />
                            <p>{type}</p>
                        </button>
                    })}
                </nav>
                <section className='product-editor-content' key={Math.random()}>
                    <div>
                        <h3>{page}</h3>
                        <button><FontAwesomeIcon icon={faPen}/></button>
                    </div>
                    <hr></hr>
                    <ul>
                        {products[page].map(item => {
                            return <div className='item' key={Math.random()}>
                                <p>{item._id}</p>
                                <input defaultValue={item.name}/>
                                <input defaultValue={item.price}/>
                            </div>
                        })}
                    </ul>
                </section>
            </section>
        </section>
    </section>
}