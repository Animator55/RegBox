import React from 'react'
import MainScreen from './components/MainScreen'
import AuthScreen from './components/AuthScreen'
import { sessionType } from './vite-env'

export default function App() {
  const [session, setSession] = React.useState<sessionType>({_id: "", role: "", opened: "", domain: ""})
  
  

  return session._id === "" ? 
    <AuthScreen session={session} setSession={setSession}/>
  : 
    <MainScreen/>
}