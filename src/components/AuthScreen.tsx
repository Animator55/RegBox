import React from 'react'
import { faCircleExclamation, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { checkUser } from '../logic/API'
import "../assets/auth.css"

type Props = {
    setSession: Function
}

export default function AuthScreen({ setSession }: Props) {

    //get AuthComp
    const [error, setError] = React.useState("")

    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        let form = e.currentTarget as HTMLFormElement

        let [name, password, domain] = [form["user"].value, form["password"].value, form["domain"].value]
        if (name === "" || domain === "" || password === "") return setError("Complete all inputs")

        let submit = form["login"]

        submit.classList.add('loading-button')


        // send request ---- then =>

        let result = checkUser(name, password, domain)

        setTimeout(() => {
            submit.classList.remove('loading-button')
            if (result.type === "error") return setError(result.data)
            else setSession(result.data)
        }, 2000)
    }

    const togglePassword = (e: React.MouseEvent) => {
        let button = e.currentTarget as HTMLButtonElement
        button.classList.toggle('check')

        let input = button.previousElementSibling as HTMLInputElement
        input.type = input.type === "text" ? "password" : "text"
    }

    return <section className='auth-screen'>
        <div className="info-background">
            <div className="ball-4" />
            <div className="ball-1" />
            <div className="ball-2" />
            <div className="ball-3" />
        </div>
        <section className='auth-section'>
            <h1>Iniciar sesión</h1>

            <div className='divisor' data-text=""></div>
            <section className='error-box'>
                {error !== "" && <FontAwesomeIcon icon={faCircleExclamation}/>}
                {error}
            </section>

            <form onSubmit={submit} className='form'>
                <div className='labeled-input'>
                    <label>Dominio</label>
                    <input name='domain' defaultValue={"TestDomain"}/>
                </div>
                <div className='labeled-input'>
                    <label>Usuario</label>
                    <input name='user'  defaultValue={"Caja"}/>
                </div>
                <div className='labeled-input'>
                    <label>Contraseña</label>
                    <div className='input-container'>
                        <input name="password" type='password' defaultValue={"1234"}/>
                        <button type='button' onClick={togglePassword}>
                            <FontAwesomeIcon icon={faEyeSlash} />
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                    </div>
                </div>

                <button name='login' type='submit' data-text="Confirmar"></button>
            </form>
        </section>
    </section>
}

