import { faCheck, faCircle, faList, faPen, faPlus, faTableCells, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import SearchBar from './SearchBar'
import "../assets/productEditor.css"
import { Configuration, Products } from '../roleMains/Main'
import checkSearch from '../logic/checkSearch'
import ConfirmPop from './ConfirmPop'

type Props = {
    close: Function
    initialPage: string
}

let lastChanged: null | number = null

let scrollHeight = 0

export default function ProductEditor({ initialPage, close }: Props) {
    const p = React.useContext(Products)
    let c = React.useContext(Configuration)

    const [pop, setPop] = React.useState(false)
    const [search, setSearch] = React.useState("")
    const [resultProducts, setResult] = React.useState(p.list)
    const types = Object.keys(resultProducts)

    const [page, setPage] = React.useState(initialPage !== "" ? initialPage : "")

    const changeProdDisplay = ()=>{
        c.setConfig({...c.config, prodsInEditorAsList: !c.config.prodsInEditorAsList})
    }

    const changeProd = (key: string, value:string, page:string, id: string, index: number)=>{
        let ul = document.getElementById("prod-list")
        if(!ul) return
        lastChanged = index
        scrollHeight = ul.scrollTop
        let newValue = key === "price" ? parseFloat(value) : value

        setResult({...resultProducts, [page]: resultProducts[page].map((el)=>{
            return el._id !== id ? el : {...el, [key]: newValue} 
        })})
    }

    const deleteProd = (id: string)=>{
        let ul = document.getElementById("prod-list")
        if(!ul) return
        scrollHeight = ul.scrollTop

        setResult({...resultProducts, [page]: resultProducts[page].filter((el)=>{
            if(el._id !== id) return el
        })})
    }

    const closeHandle = ()=>{
        p.setProds(resultProducts)
        close()
    }

    const newType = ()=>{
        let string = "Tipo-"
        let count = 1
        types.map(str=>{
            if(str.substring(0, 5) === "Tipo-") count++
        })
        string = string + count

        setResult({...resultProducts, [string]: []})
        setPage(string)
    }
    const newProduct = ()=>{
        let Item = {
            _id: `${Math.round((Math.random()*Math.random())*1000)}`,
            name: "Nuevo producto",
            price: 0,
            type: page,
        }
        
        let ul = document.getElementById("prod-list")
        if(!ul) return
        scrollHeight = 9999999
        lastChanged = resultProducts[page].length
        setResult({...resultProducts, [page]: [...resultProducts[page], Item]})
    }

    const editTypeName = (e: React.MouseEvent<HTMLButtonElement>)=>{
        e.currentTarget.classList.toggle("awaiting")
        let div = e.currentTarget.previousSibling as HTMLDivElement
        div.contentEditable = "true"
        div.focus() 
        let selection = window.getSelection()
        if (selection) {
            var range = document.createRange();
            range.selectNodeContents(div);
            selection.removeAllRanges();
            selection.addRange(range);
        }
    }

    const confirmName = (e: HTMLDivElement)=>{
        let newName = `${e.textContent}`
        if(newName === "") return 
        
        let newProducts = {}

        for(let i=0;i<types.length;i++) {
            let key = types[i]
            newProducts = {...newProducts, [key === page ? newName:key]: resultProducts[key]}
        }
        
        setResult(newProducts)
        setPage(newName)
    }

    const deleteType = () =>{
        let newProducts = {}

        for(let i=0;i<types.length;i++) {
            let key = types[i]
            if(key === page) continue
            newProducts = {...newProducts, [key]: resultProducts[key]}
        }
        setPop(false)
        setResult(newProducts)
        setPage(types[0] !== undefined ? types[0] : "")
    }

    React.useEffect(()=>{
        if(scrollHeight !== 0) {
            let ul = document.getElementById("prod-list")
            ul?.scrollTo({
                top: scrollHeight,
            })
            scrollHeight = 0
            if(!lastChanged) return
            let added = ul?.children[lastChanged] as HTMLDivElement
            if(added) added.classList.add("added")
        }
    })

    const compileTypes = ()=>{
        if(!types[0] || types[0].length === 0) return 
        let result = []

        for(const key in resultProducts) {
            let array = resultProducts[key]
            if(array.length === 0) continue
            result.push(...array)
        }
        return result
    }

    let renderList = resultProducts[page] ? resultProducts[page] : page === "" ? compileTypes(): null

    return <section className='back-blur' onClick={(e) => {
        let target = e.target as HTMLDivElement
        if (target.className === "back-blur") closeHandle()
    }}>
        {pop && <ConfirmPop title='¿Borrar lista de productos?' subTitle='Todos los productos de la lista actual se perderán' confirm={deleteType} close={()=>{setPop(false)}}/>}
        <section className='pop'>
            <header> 
                <div className='pop-top'>
                    <h2>Editar Productos</h2>
                    <button onClick={() => { closeHandle() }}><FontAwesomeIcon icon={faXmark} /></button>
                </div>
                <div className='pop-options'>
                    <SearchBar
                        id={"prods-editor-search"}
                        onChange={true}
                        searchButton={setSearch}
                        defaultValue={search}
                        placeholder='Buscar Producto...'
                    />
                    {/* <button className='default-button-2'><FontAwesomeIcon icon={faUpload} /></button> */}
                    <button onClick={changeProdDisplay} className='default-button-2' title='Cambiar disposición'>
                        <FontAwesomeIcon icon={c.config.prodsInEditorAsList ? faList : faTableCells} />
                    </button>
                </div>
            </header>
            <section className='pop-content'>
                <nav>
                    <button onClick={()=>{newType()}}>
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
                <section className='product-editor-content' key={Math.random()}>
                    <div>
                        {resultProducts[page] && page !== "" && <>
                            <h3
                                onBlur={(e)=>{confirmName(e.currentTarget)}}
                                onKeyDown={(e)=>{
                                    if(e.key === "Enter") confirmName(e.currentTarget)
                                }}
                            >{page}</h3>
                            <button className='change' onClick={(e)=>{editTypeName(e)}}>
                                <FontAwesomeIcon icon={faPen}/>
                                <FontAwesomeIcon icon={faCheck}/>
                            </button>
                            <button onClick={()=>{setPop(true)}}><FontAwesomeIcon icon={faTrash}/></button>
                            <button
                                className='add-prod'
                                onClick={()=>{newProduct()}}
                            >
                                <FontAwesomeIcon icon={faPlus}/>
                                <p>Añadir Producto</p>
                            </button>
                        </>}
                    </div>
                    <hr></hr>
                    <ul id="prod-list" className={c.config.prodsInEditorAsList ? "" : "prod-grid-mode"}>
                        {renderList && renderList.map((item, i) => {
                            let check = checkSearch(item.name, search)
                            return <div
                                className={search !== "" && check === item.name ? "d-none" : 'item'} 
                                key={Math.random()}
                            >
                                <p
                                    dangerouslySetInnerHTML={{ __html: check }}
                                    onBlur={(e)=>{
                                        let div = e.target as HTMLDivElement
                                        let val = div.textContent === null ? "" : div.textContent 
                                        changeProd("name", val, item.type, item._id,i)
                                    }}
                                    contentEditable
                                ></p>
                                <input type='number' defaultValue={item.price} onBlur={(e)=>{changeProd("price", e.currentTarget.value, item.type, item._id,i)}}/>
                                <button title='Borrar producto' onClick={()=>{deleteProd(item._id)}}><FontAwesomeIcon icon={faXmark}/></button>
                            </div>
                        })}
                    </ul>
                </section>
            </section>
        </section>
    </section>
}