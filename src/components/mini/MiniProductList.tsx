import { faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Products } from '../../roleMains/Main'
import React from 'react'

import "../../assets/mini-sections.css"

type Props = {
  Open: Function
}

export default function MiniProductList({Open}: Props) {
  const typeList = Object.keys(React.useContext(Products).list)

  return <section className='mini-prod-list'>
    <button onClick={()=>{Open()}}>
      <FontAwesomeIcon icon={faArrowRight}/>
    </button>
    <ul>
      {typeList.map(el=>{
        return <button 
          title={el}
          key={Math.random()}
          onClick={()=>{Open(el)}}
        >{el}</button>
      })}
    </ul>
  </section>
}