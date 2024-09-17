import { faCircle, faPen, faPlus, faTrash, faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import "../assets/productEditor.css"
import { Configuration, Products } from '../roleMains/Main'
import ConfirmPop from './ConfirmPop'
import { selectAllText } from '../logic/selectAllText'

type Props = {
    close: Function
    initialPage: string
}

let lastChanged: null | number = null
let editedEntry: string = "name"
let changeProductIndex = false

let scrollHeight = 0
let someEdit = false

export default function ProductEditor({ initialPage, close }: Props) {
    const p = React.useContext(Products)
    let c = React.useContext(Configuration)

    const [pop, setPop] = React.useState(false)
    const [resultProducts, setResult] = React.useState(p.list)
    const types = Object.keys(resultProducts)

    const [page, setPage] = React.useState(initialPage !== "" ? initialPage : "")

    const changeProd = (key: string, value: string, page: string, id: string, index: number) => {
        if (value === "") return
        let ul = document.getElementById("prod-list")
        if (!ul) return
        someEdit= true
        lastChanged = index
        scrollHeight = ul.scrollTop
        let newValue = key === "price" ? parseFloat(value) : value
        editedEntry = key === "name" ? "price" : "name" 

        setResult({
            ...resultProducts, [page]: resultProducts[page].map((el) => {
                return el._id !== id ? el : { ...el, [key]: newValue }
            })
        })
    }

    const deleteProd = (id: string, type: string) => {
        let ul = document.getElementById("prod-list")
        if (!ul) return
        scrollHeight = ul.scrollTop
        someEdit= true

        setResult({
            ...resultProducts, [type]: resultProducts[type].filter((el) => {
                if (el._id !== id) return el
            })
        })
    }

    const closeHandle = () => {
        p.setProds(resultProducts, someEdit)
        close()
    }

    const newType = () => {
        let string = "Tipo-"
        let count = 1
        types.map(str => {
            if (str.substring(0, 5) === "Tipo-") count++
        })
        string = string + count
        someEdit= true

        setResult({ ...resultProducts, [string]: [] })
        setPage(string)
    }
    const newProduct = () => {
        if (!resultProducts[page]) return
        let Item = {
            _id: `${Math.round((Math.random() * Math.random()) * 1000000000)}`,
            name: "Nombre del producto",
            price: 0,
            type: page,
        }

        let ul = document.getElementById("prod-list")
        if (!ul) return
        someEdit= true
        scrollHeight = 9999999
        lastChanged = resultProducts[page].length
        setResult({ ...resultProducts, [page]: [...resultProducts[page], Item] })
    }

    const editTypeName = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.classList.toggle("awaiting")
        let div = e.currentTarget.previousSibling as HTMLDivElement
        div.contentEditable = "true"
        div.focus()
        selectAllText(div)
    }

    const confirmName = (e: HTMLDivElement) => {
        let newName = `${e.textContent}`
        if (newName === "") return

        let newProducts = {}

        for (let i = 0; i < types.length; i++) {
            let key = types[i]
            newProducts = { ...newProducts, [key === page ? newName : key]: resultProducts[key] }
        }
        someEdit= true

        setResult(newProducts)
        setPage(newName)
    }

    const deleteType = () => {
        let newProducts = {}
        someEdit= true

        for (let i = 0; i < types.length; i++) {
            let key = types[i]
            if (key === page) continue
            newProducts = { ...newProducts, [key]: resultProducts[key] }
        }
        setPop(false)
        setResult(newProducts)
        setPage(types[0] !== undefined ? types[0] : "")
    }

    React.useEffect(() => {
        let ul = document.getElementById("prod-list")
        if (scrollHeight !== 0) {
            ul?.scrollTo({
                top: scrollHeight,
            })
            scrollHeight = 0
            
        }
        if (lastChanged === null) return
        let added = ul?.children[lastChanged] as HTMLDivElement
        if (added) {
            added.classList.add("added")
            added = changeProductIndex ? ul?.children[lastChanged+1] as HTMLDivElement : added
            changeProductIndex=false
            let div = undefined
            if(editedEntry === "name") {
                div = added.firstChild as HTMLDivElement
                if(div) selectAllText(div)
            }
            else {
                div = added.children[1] as HTMLInputElement 
                if(div) div.select()
            }
            if(div) div.focus()
        }
    })

    const compileTypes = () => {
        if (!types[0] || types[0].length === 0) return
        let result = []

        for (const key in resultProducts) {
            let array = resultProducts[key]
            if (array.length === 0) continue
            result.push(...array)
        }
        return result
    }

    let renderList = resultProducts[page] ? resultProducts[page] : page === "" ? compileTypes() : null

    const Alert = () => {
        return <section className='alert absolute'>
            <FontAwesomeIcon icon={faWarning} />
            <h2>No hay productos añadidos a este tipo.</h2>
            <button className='default-button' onClick={() => { newProduct() }}>
                {"Añadir Producto"}
            </button>
        </section>
    }
    const AlertType = () => {
        return <section className='alert absolute'>
            <FontAwesomeIcon icon={faWarning} />
            <h2>No hay tipos añadidos en el dominio.</h2>
            <button className='default-button' onClick={() => { newType() }}>
                {"Crear un tipo"}
            </button>
        </section>
    }

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") closeHandle()
    }}>
        {pop && <ConfirmPop title='¿Borrar lista de productos?' subTitle='Todos los productos de la lista actual se perderán' confirm={deleteType} close={() => { setPop(false) }} />}
        <section className='pop'>
            <header>
                <div className='pop-top'>
                    <h2>Editar Productos</h2>
                    <button onClick={() => { closeHandle() }}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
            </header>
            <section className='pop-content'>
                <nav>
                    <button onClick={() => { newType() }}>
                        <FontAwesomeIcon icon={faPlus} />
                        <p>Nuevo tipo</p>
                    </button>
                    {types.length > 0 &&
                        <button
                            className={"" === page ? "active" : ""}
                            onClick={() => { setPage("") }}
                        >
                            <p>Todos</p>
                        </button>
                    }
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
                <section className='product-editor-content' key={Math.random()} data-expanded={page === "" ? "true" : "false"}>
                    <div>
                        {resultProducts[page] && page !== "" && <>
                            <h3
                                onBlur={(e) => { e.currentTarget.textContent = page }}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter") return
                                    if(e.currentTarget.textContent === null 
                                        || e.currentTarget.textContent === "") e.currentTarget.textContent = page
                                    else confirmName(e.currentTarget)
                                }}
                            >{page}</h3>
                            <button className='change' onClick={(e) => { editTypeName(e) }}>
                                <FontAwesomeIcon icon={faPen} />
                            </button>
                            <button onClick={() => { setPop(true) }}><FontAwesomeIcon icon={faTrash} /></button>
                            <button
                                className='add-prod'
                                onClick={() => { newProduct() }}
                            >
                                <FontAwesomeIcon icon={faPlus} />
                                <p>Añadir Producto</p>
                            </button>
                        </>}
                    </div>
                    <hr></hr>
                    <ul id="prod-list" className={c.config.prodsInEditorAsList ? "" : "prod-grid-mode"}>
                        {types.length === 0 ? <AlertType /> :
                            !renderList || renderList.length === 0 ? <Alert /> :
                                renderList.map((item, i) => {
                                    return <div
                                        className={'item'}
                                        key={Math.random()}
                                    >
                                        <p
                                            dangerouslySetInnerHTML={{ __html: item.name }}
                                            onBlur={(e) => {
                                                let div = e.target as HTMLDivElement
                                                div.innerHTML = item.name
                                            }}
                                            onKeyDown={(e) => {
                                                if(e.key !== "Enter") return
                                                e.preventDefault()
                                                let div = e.target as HTMLDivElement
                                                let val = div.textContent === null ? "" : div.textContent
                                                if(val === "") div.innerHTML = item.name
                                                changeProd("name", val, item.type, item._id, i)
                                            }}
                                            contentEditable
                                        ></p>
                                        <input 
                                            type='number'
                                            defaultValue={item.price} 
                                            onBlur={(e) => { 
                                                let div = e.currentTarget as HTMLInputElement
                                                div.value = `${item.price}`
                                            }} 
                                            onKeyDown={(e) => { 
                                                if(e.key !== "Enter") return
                                                e.preventDefault()
                                                let div = e.currentTarget as HTMLInputElement
                                                if(div.value === "") div.value = `${item.price}`
                                                if(i !== renderList.length-1)changeProductIndex = true
                                                changeProd("price", e.currentTarget.value, item.type, item._id, i) 
                                            }} 
                                        />
                                        <button title='Borrar producto' onClick={() => { deleteProd(item._id, item.type) }}><FontAwesomeIcon icon={faXmark} /></button>
                                    </div>
                                })}
                    </ul>
                </section>
            </section>
        </section>
    </section>
}