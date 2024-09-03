import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import React from "react"

type Props = {
  searchButton: Function
  placeholder: string
  defaultValue: string
  onChange: boolean
  focus?: boolean
  id?: string
}

export default function SearchBar({ searchButton, placeholder, defaultValue, onChange, id, focus}: Props) {
  const cleanInput = (e: React.MouseEvent) => {
    let input = e.currentTarget.previousSibling as HTMLInputElement
    input.value = ""
    searchButton("")
  }

  React.useEffect(() => {
    if(!focus) return
    let input = !id ? document.querySelector(".input-expand") as HTMLInputElement : document.getElementById(id) as HTMLInputElement
    if (input) input.focus()
  })

  return <section className="input-search">
    <button>
      <FontAwesomeIcon icon={faMagnifyingGlass} size='xl' />
    </button>
    <input
      id={id}
      className={defaultValue !== "" ? "input-expand expanded" : "input-expand"}
      defaultValue={defaultValue}
      onChange={(e) => {
        if (onChange) searchButton(e.currentTarget.value)
      }}
      onKeyDown={(e) => { if (e.key === "Enter") searchButton(e.currentTarget.value) }}
      placeholder={placeholder}
    />
    <button className="xmark" onClick={cleanInput}>
      <FontAwesomeIcon icon={faXmark} />
    </button>
  </section>
}