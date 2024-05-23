import React from 'react'
import { sessionType } from '../vite-env'

type Props = {
    session: sessionType
    setSession: Function
}

export default function AuthScreen({session, setSession}: Props) {
    const setSessionHandler = (name: string, domain: string, password: string)=>{
        if(name === "" || domain === "" || password === "") return 
        setSession(name)
    }

    //get AuthComp

    return <main>
        
    </main>
}