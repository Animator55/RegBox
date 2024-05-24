import React from 'react'
import RoleRouter from './components/RoleRouter'
import AuthScreen from './components/AuthScreen'
import { sessionType } from './vite-env'
import "./assets/App.css"

export default function App() {
  const [session, setSession] = React.useState<sessionType>({_id: "", role: "", opened: "", domain: "", url: "", name: ""})
  
  

  return session._id === "" ? 
    <AuthScreen setSession={setSession}/>
  : 
    <RoleRouter session={session}/>
}