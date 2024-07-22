import { faCheck, faCircle, faList, faPen, faPlus, faUpload, faXmark } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'
import SearchBar from './SearchBar'
import "../assets/productEditor.css"
import { Products } from '../roleMains/Main'
import checkSearch from '../logic/checkSearch'

type Props = {
    close: Function
}

let scrollBottom = false

export default function ProductEditor({ close }: Props) {
    const p = React.useContext(Products)
    const [search, setSearch] = React.useState("")
    const [resultProducts, setResult] = React.useState(p.list)
    const types = Object.keys(resultProducts)

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

        scrollBottom = true
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

    React.useEffect(()=>{
        if(scrollBottom) {
            scrollBottom = false
            let ul = document.getElementById("prod-list")
            ul?.scrollTo({
                top: ul.clientHeight,
            })
            let added = ul?.lastChild as HTMLDivElement
            if(added) added.classList.add("added")
        }
    })

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
                        id={"prods-editor-search"}
                        onChange={true}
                        searchButton={setSearch}
                        defaultValue={search}
                        placeholder='Buscar Producto...'
                    />
                    <button className='default-button-2'><FontAwesomeIcon icon={faUpload} /></button>
                    <button className='default-button-2' title='Cambiar disposición'>
                        <FontAwesomeIcon icon={faList} />
                    </button>
                </div>
            </header>
            <section className='pop-content'>
                <nav>
                    <button onClick={()=>{newType()}}>
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
                        <button
                            className='add-prod'
                            onClick={()=>{newProduct()}}
                        >
                            <FontAwesomeIcon icon={faPlus}/>
                            <p>Añadir Producto</p>
                        </button>
                    </div>
                    <hr></hr>
                    <ul id="prod-list">
                        {resultProducts[page].map((item, i) => {
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
                                        changeProd("name", val, page, i)
                                    }}
                                    contentEditable
                                ></p>
                                <input defaultValue={item.price} onBlur={(e)=>{changeProd("price", e.currentTarget.value, page, i)}}/>
                            </div>
                        })}
                    </ul>
                </section>
            </section>
        </section>
    </section>
}