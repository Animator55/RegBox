import { faCheck, faWarning, faXmarkCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { router } from '../../vite-env'

type Props = {
    data:{
        title: string
        content: string
        icon: string
    }
}

export default function Toast({data}: Props) {
    let {title, content, icon} = data

    const iconSelector: router = {
        "warn": faWarning,
        "xmark": faXmarkCircle,
        "check": faCheck,
    }
  return <section className='toast'>
    <header>
        <FontAwesomeIcon icon={iconSelector[icon]}/>
        <h3>{title}</h3>
    </header>
    <p>{content}</p>
  </section>
}