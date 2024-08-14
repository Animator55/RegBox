import React from 'react'
import RoleRouter from './components/RoleRouter'
import AuthScreen from './components/AuthScreen'
import { sessionType } from './vite-env'
import "./assets/App.css"
import InitialDataPop from './components/auth/InitialDataPop'

export default function App() {
  const [session, setSession] = React.useState<sessionType>(
    { _id: "gnidkasgm", role: "main", opened: "", domain: "domain-1", url: "", name: "Caja" }
    // {_id: "", role: "", opened: "", domain: "", url: "", name: ""}
  )
  const [initialData, setInitialData] = React.useState()
  const [ref, refresh] = React.useState(false)
  const logout = ()=>{
    setSession({_id: "", role: "", opened: "", domain: "", url: "", name: ""})
    setInitialData(undefined)
    refresh(false)
  }

  return session._id === "" ?
    <AuthScreen setSession={setSession} />
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