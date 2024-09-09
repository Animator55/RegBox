import { faCheck, faWarning, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { router } from '../../vite-env'
import React from 'react'

type Props = {
    data:{
        title: string
        content: string
        icon: string
    }
    setToast: Function
}

export default function Toast({data, setToast}: Props) {
    let {title, content, icon} = data

    const iconSelector: router = {
        "warn": faWarning,
        "xmark": faXmarkCircle,
        "check": faCheck,
    }

    let toastID = `${Math.random()}`
    React.useEffect(()=>{
        setTimeout(()=>{
            let toast = document.getElementById(toastID)
            if(!toast) return
            setToast(undefined)
        }, 2500)
    },[])
  return <section className='toast' id={toastID}>
    <header>
        <FontAwesomeIcon icon={iconSelector[icon]}/>
        <h3>{title}</h3>
    </header>
    <p>{content}</p>
  </section>
}