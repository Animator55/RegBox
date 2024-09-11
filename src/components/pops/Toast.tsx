import {  faCheckCircle, faWarning, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { router } from '../../vite-env'
import React from 'react'

type Props = {
    data:{
        title: string
        content: string
        icon: string
        _id: string
    }
    setToast: Function
}

export default function Toast({data, setToast}: Props) {

    let {title, content, icon, _id} = data

    const iconSelector: router = {
        "warn": faWarning,
        "xmark": faXmarkCircle,
        "check": faCheckCircle,
    }
    
    const colorSelector:router = {
        "warn": "var(--corange)",
        "xmark": "var(--cred)",
        "check": "var(--cgreen)",
    }

    let toastID = _id
    React.useEffect(()=>{
        setTimeout(()=>{
            let toast = document.getElementById(toastID)
            if(!toast) return
            setToast(undefined)
        }, 3000)
    },[data._id])
  return <section className='toast' id={toastID}>
    <header style={{color: colorSelector[icon]}}>
        <FontAwesomeIcon icon={iconSelector[icon]}/>
        <h3>{title}</h3>
    </header>
    <p>{content}</p>
  </section>
}