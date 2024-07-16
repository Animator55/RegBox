import { faCircle, faList, faPen, faPlus, faUpload, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import SearchBar from './SearchBar'
import "../assets/productEditor.css"
import { Products } from '../roleMains/Main'

type Props = {
    close: Function
}

export default function ProductEditor({ close }: Props) {
    const p = React.useContext(Products)
    const [search, setSearch] = React.useState("")
    const [resultProducts, setResult] = React.useState(p.list)
    const types = Object.keys(p.list)

    const [page, setPage] = React.useState(types[0] !== undefined ? types[0] : "")

    const changeProd = (key: string, value:string, page:string, index: number)=>{
        setResult({...resultProducts, [page]: resultProducts[page].map((el, i)=>{
            return i !== index ? el : {...el, [key]: value} 
        })})
    }

    const closeHandle = ()=>{
        p.setProds(resultProducts)
        close()
    }

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") closeHandle()
    }}>
        <section className='pop'>
            <header> 
                <div className='pop-top'>
                    <h2>Editar Productos</h2>
                    <button onClick={() => { closeHandle() }}><FontAwesomeIcon icon={faXmark} /></button>
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
                        {resultProducts[page].map((item, i) => {
                            return <div className='item' key={Math.random()}>
                                <p>{item._id}</p>
                                <input defaultValue={item.name} onBlur={(e)=>{changeProd("name", e.currentTarget.value, page, i)}}/>
                                <input defaultValue={item.price} onBlur={(e)=>{changeProd("price", e.currentTarget.value, page, i)}}/>
                            </div>
                        })}
                    </ul>
                </section>
            </section>
        </section>
    </section>
}