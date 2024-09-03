import React from 'react'
import RoleRouter from './components/RoleRouter'
import AuthScreen from './components/AuthScreen'
import { sessionType } from './vite-env'
import "./assets/App.css"
import InitialDataPop from './components/auth/InitialDataPop'

export default function App() {
  const [session, setSession] = React.useState<sessionType>(
    {_id: "", role: "", opened: "", domain: "", url: "", name: ""}
  )
  const [initialData, setInitialData] = React.useState()
  const [ref, refresh] = React.useState(false)
  const logout = ()=>{
    window.location.reload()     
    window.localStorage.setItem("RegBoxSession", "")
  }
  
  const setSessionHandler = (val: sessionType)=>{
    let stor = window.localStorage.getItem("RegBoxSession")
    if(!stor || stor === "") window.localStorage.setItem("RegBoxSession", JSON.stringify(val))
    else {
      let parsed: sessionType = JSON.parse(stor)
      if(val._id !== parsed._id || val.domain !== parsed.domain 
        || val.url !== parsed.url) window.localStorage.setItem("RegBoxSession", JSON.stringify(val))
    }
    setSession(val)
  }

  return session._id === "" ?
    <AuthScreen setSession={setSessionHandler} />
    :
    <>
      {initialData === undefined && !ref && <InitialDataPop
        close={() => { refresh(true) }}
        confirm={setInitialData}
      />
      }
      <RoleRouter session={session} initialData={initialData} logout={logout} />
    </>
}