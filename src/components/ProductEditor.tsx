import { faCircle, faList, faPen, faPlus, faSortAlphaDownAlt, faSortAlphaUpAlt, faSortAmountAsc, faSortAmountDesc, faTableCells, faTrash, faWarning, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import "../assets/productEditor.css"
import { Configuration, Products } from '../roleMains/Main'
import ConfirmPop from './ConfirmPop'
import { selectAllText } from '../logic/selectAllText'
import { sortBy } from '../logic/sortListBy'
import SearchBar from './SearchBar'
import OrderListPop from './pops/OrderListPop'
import checkSearch from '../logic/checkSearch'

type Props = {
    close: Function
    initialPage: string
}

let lastChanged: null | number = null
let editedEntry: string = "name"
let changeProductIndex = false

let scrollHeight = 0
let scrollToIndex: number | undefined = undefined /// when added and scrollHeight is unknown
let someEdit = false
let iterationLength = 25

export default function ProductEditor({ initialPage, close }: Props) {
    const p = React.useContext(Products)
    let c = React.useContext(Configuration)
    const UlRef = React.useRef<HTMLUListElement | null>(null);

    const [search, setSearch] = React.useState("")
    const [pop, setPop] = React.useState<string | undefined>(undefined)
    const [resultProducts, setResult] = React.useState(p.list)
    const types = Object.keys(resultProducts)
    const [loadedIteration, setLoadedIteration] = React.useState(1)

    const [page, setPage] = React.useState(initialPage !== "" ? initialPage : "")

    const changeProd = (key: string, value: string, page: string, id: string, index: number) => {
        if (value === "") return
        let ul = document.getElementById("prod-list")
        if (!ul || !resultProducts[page]) return
        someEdit = true
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
        someEdit = true

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
        someEdit = true

        setResult({ ...resultProducts, [string]: [] })
        setPage(string)
        setLoadedIteration(1)
    }
    const newProduct = () => {
        if (!resultProducts[page]) return
        let id = `${Math.round((Math.random() * Math.random()) * 100000000000)}`
        let Item = {
            _id: id,
            name: "",
            price: 0,
            type: page,
        }

        let ul = document.getElementById("prod-list")
        if (!ul) return
        someEdit = true
        let simulateSorted = sortBy[c.config.prodEditorOrder]([...resultProducts[page], Item])
        
        //getting item form sorted array
        let index = -1
        for(let i=0; i<simulateSorted.length; i++) if(simulateSorted[i]._id ===  id) {index = i; break}
        scrollToIndex = index

        lastChanged = index === -1 ? resultProducts[page].length : index
        setLoadedIteration(Math.floor(lastChanged / iterationLength) + 1)
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
            let change = key === page
            newProducts = {
                ...newProducts, [change ? newName : key]: change ?
                    resultProducts[key].map(el => {
                        return { ...el, type: newName }
                    })
                    :
                    resultProducts[key]
            }
        }
        someEdit = true

        setResult(newProducts)
        setPage(newName)
    }

    const deleteType = () => {
        let newProducts = {}
        someEdit = true

        for (let i = 0; i < types.length; i++) {
            let key = types[i]
            if (key === page) continue
            newProducts = { ...newProducts, [key]: resultProducts[key] }
        }
        setPop(undefined)
        setResult(newProducts)
        setPage(types[0] !== undefined ? types[0] : "")
        setLoadedIteration(1)
    }

    React.useEffect(() => {
        let ul = document.getElementById("prod-list")
        if (lastChanged === null) return
        let added = ul?.children[lastChanged] as HTMLDivElement
        if (added) {
            added.classList.add("added")
            added = changeProductIndex ? ul?.children[lastChanged + 1] as HTMLDivElement : added
            changeProductIndex = false
            let div = undefined
            if (editedEntry === "name") {
                div = added.firstChild as HTMLDivElement
                if (div) selectAllText(div)
            }
            else {
                div = added.children[1] as HTMLInputElement
                if (div && div.select) div.select()
            }
            if (div) div.focus()
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

    let preSortedList = resultProducts[page] ? resultProducts[page] : page === "" ? compileTypes() : null
    let renderList = preSortedList !== null && preSortedList !== undefined ? sortBy[c.config.prodEditorOrder](preSortedList) : null

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

    const setScrollPosition = (element: HTMLUListElement) => {
        if (!element) return
        if(scrollToIndex !== undefined) {
            let ul = document.getElementById("prod-list")
            let added = ul?.children[scrollToIndex] as HTMLDivElement
            if (added) scrollHeight = added.offsetTop
            scrollToIndex = undefined
        } 
        element.scrollTop = scrollHeight
        scrollHeight = 0
    }


    const confirmOrderList = (value: "abc" | "abc-r" | "def" | "def-r") => {
        c.setConfig({ ...c.config, prodEditorOrder: value })
        setPop(undefined)
    }
    const changeDisplay = () => {
        c.setConfig({ ...c.config, prodsInEditorAsList: !c.config.prodsInEditorAsList })
    }

    const orderOptions = ["abc", "abc-r", "def", "def-r"]
    const sortIcons: { [key: string]: any } = {
        "abc-r": faSortAlphaDownAlt,
        "def": faSortAmountDesc,
        "abc": faSortAlphaUpAlt,
        "def-r": faSortAmountAsc,
    }

    let displayList = c.config.prodsInEditorAsList

    ///////// COMPONENTS


    const TypeRouter = () => {
        return <nav>
            <button onClick={() => { newType() }}>
                <FontAwesomeIcon icon={faPlus} />
                <p>Nuevo tipo</p>
            </button>
            {types.length > 0 &&
                <button
                    className={"" === page ? "active" : ""}
                    onClick={() => { setPage(""); setLoadedIteration(1) }}
                >
                    <p>Todos</p>
                </button>
            }
            {types.map(type => {
                return <button
                    key={Math.random()}
                    className={type === page ? "active" : ""}
                    onClick={() => { setPage(type); setLoadedIteration(1) }}
                >
                    <FontAwesomeIcon icon={faCircle} />
                    <p>{type}</p>
                </button>
            })}
        </nav>
    }

    const UlComp = () => {
        if (types.length === 0) return <AlertType />
        if (!renderList || renderList.length === 0) return <Alert />
        let jsx = []
        for (let i = 0; i < loadedIteration; i++) {
            for (let j = i * iterationLength; j < i * iterationLength + iterationLength; j++) {
                if (!renderList[j]) break
                let item = renderList[j]
                let check = checkSearch(item.name, search)
                jsx.push(<div
                    className={search !== "" && check === item.name ? "d-none" : 'item'}
                    key={Math.random()}
                >
                    <p
                        dangerouslySetInnerHTML={{ __html: check }}
                        onBlur={(e) => {
                            let div = e.target as HTMLDivElement
                            div.innerHTML = item.name
                        }}
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return
                            e.preventDefault()
                            let div = e.target as HTMLDivElement
                            let val = div.textContent === null ? "" : div.textContent
                            if (val === "") div.innerHTML = item.name
                            changeProd("name", val, item.type, item._id, j)
                        }}
                        contentEditable={search === "" || check !== item.name}
                    ></p>
                    <input
                        type='number'
                        defaultValue={item.price}
                        onBlur={(e) => {
                            let div = e.currentTarget as HTMLInputElement
                            div.value = `${item.price}`
                        }}
                        onKeyDown={(e) => {
                            if (e.key !== "Enter") return
                            e.preventDefault()
                            let div = e.currentTarget as HTMLInputElement
                            if (div.value === "") div.value = `${item.price}`
                            if (j !== renderList.length - 1) changeProductIndex = true
                            changeProd("price", e.currentTarget.value, item.type, item._id, j)
                        }}
                        
                        disabled={search !== "" && check === item.name}
                    />
                    <button title='Borrar producto' onClick={() => { deleteProd(item._id, item.type) }}><FontAwesomeIcon icon={faXmark} /></button>
                </div>)
            }
        }

        return jsx
    }

    const pops: { [key: string]: any } = {
        "order": <OrderListPop options={orderOptions} actual={c.config.prodEditorOrder} confirm={confirmOrderList} close={() => { setPop(undefined) }} />,
        "confirm": <ConfirmPop title='¿Borrar lista de productos?' subTitle='Todos los productos de la lista actual se perderán' confirm={deleteType} close={() => { setPop(undefined) }} />
    }

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") closeHandle()
    }}>
        {pop && pops[pop]}
        <section className='pop'>
            <header>
                <div className='pop-top'>
                    <h2>Editar Productos</h2>
                    <button onClick={() => { closeHandle() }}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
                <section className='pop-options'>
                    <SearchBar searchButton={setSearch} placeholder={"Buscar producto"} defaultValue={search} onChange={true} />
                    <button className='default-button-2' title='Ordenar Lista' onClick={() => {
                        setPop("order")
                    }}>
                        <FontAwesomeIcon icon={sortIcons[c.config.prodEditorOrder]} />
                    </button>
                    <button className='default-button-2' title='Cambiar disposición' onClick={() => {
                        changeDisplay()
                    }}>
                        <FontAwesomeIcon icon={displayList ? faList : faTableCells} />
                    </button>
                </section>
                <i>* Los productos se editarán una vez cerrada la ventana.</i>
            </header>
            <section className='pop-content'>
                <TypeRouter />
                <section className='product-editor-content' key={Math.random()} data-expanded={page === "" ? "true" : "false"}>
                    <div>
                        {resultProducts[page] && page !== "" && <>
                            <h3
                                onBlur={(e) => { e.currentTarget.textContent = page }}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter") return
                                    if (e.currentTarget.textContent === null
                                        || e.currentTarget.textContent === "") e.currentTarget.textContent = page
                                    else confirmName(e.currentTarget)
                                }}
                            >{page}</h3>
                            <button className='change' onClick={(e) => { editTypeName(e) }}>
                                <FontAwesomeIcon icon={faPen} />
                            </button>
                            <button onClick={() => { setPop("confirm") }}><FontAwesomeIcon icon={faTrash} /></button>
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
                    <ul
                        id="prod-list"
                        ref={(element: HTMLUListElement) => {
                            UlRef.current = element;
                            setScrollPosition(element)
                        }}
                        className={displayList ? "" : "prod-grid-mode"}
                        onScroll={(e) => {
                            let ul = e.target as HTMLUListElement
                            const isScrolledToBottom = ul.scrollHeight - (ul.scrollTop + 50) < ul.clientHeight;

                            if (renderList
                                && isScrolledToBottom
                                && Math.floor(renderList?.length / iterationLength) + 1 > loadedIteration) {
                                scrollHeight = ul.scrollTop
                                setLoadedIteration(loadedIteration + 1)
                            }
                        }}

                    >
                        <UlComp />
                    </ul>
                </section>
            </section>
        </section>
    </section>
}