import { faCircle, faFilter, faList, faPlus, faUpload, faXmark } from '@fortawesome/free-solid-svg-icons'
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
                    <div className='filter-zone'>
                        <FontAwesomeIcon icon={faFilter} />
                        <select>
                            {types.map(el => {
                                return <option key={Math.random()}>
                                    {el}
                                </option>
                            })}
                        </select>
                    </div>
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
                <section key={Math.random()}>
                    <h3>{page}</h3>
                    <hr></hr>
                    <ul>
                        {products[page].map(item => {
                            return <div className='item' key={Math.random()}>
                                <p>{item._id}</p>
                                <p>{item.name}</p>
                                <p>{item.price}</p>
                            </div>
                        })}
                    </ul>
                </section>
            </section>
        </section>
    </section>
}