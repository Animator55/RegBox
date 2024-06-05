import { faFilter, faList, faUpload, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import SearchBar from './SearchBar'
import { products } from '../defaults/products'

type Props = {
    close: Function
}

export default function ProductEditor({ close }: Props) {
    const [search, setSearch] = React.useState("")

    const types = Object.keys(products)


    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") close()
    }}>
        <section className='pop'>
            <header>
                <div className='top'>
                    <h2>Editar Productos</h2>
                    <button onClick={() => { close() }}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
                <div className='options'>
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
            <ul>
                {types.map(type=>{
                    return <section key={Math.random()}>
                        <h3>{type}</h3>
                        <hr></hr>
                        {products[type].map(el=>{
                            return <div key={Math.random()}>
                                <p>{el._id}</p>
                                <p>{el.name}</p>
                                <p>{el.price}</p>
                            </div>
                        })}
                    </section>
                })}
            </ul>
        </section>
    </section>
}