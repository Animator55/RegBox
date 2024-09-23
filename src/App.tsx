import React from 'react'
import AuthScreen from './components/AuthScreen'
import { HistorialTableType, sessionType, TableType } from './vite-env'
import "./assets/App.css"
import InitialDataPop from './components/auth/InitialDataPop'
import Main from './roleMains/Main'

export default function App() {
  const [session, setSession] = React.useState<sessionType>(
    { _id: "", role: "", opened: "", domain: "", url: "", name: "" }
  )
  const [initialData, setInitialData] = React.useState<undefined | any>()
  const [initialHistorial, setInitialHistorial] = React.useState<undefined | any>()
  const [ref, refresh] = React.useState(false)
  const logout = () => {
    window.localStorage.setItem("RegBoxSession", "")
    for (const key in window.localStorage) {
      if (key.startsWith("RegBoxID:")) window.localStorage.removeItem(key)
    }
    window.location.reload()
  }

  const setSessionHandler = (val: sessionType) => {
    let storage = window.localStorage
    let stor = storage.getItem("RegBoxSession")
    if (!stor || stor === "") storage.setItem("RegBoxSession", JSON.stringify(val))
    else {
      let parsed: sessionType = JSON.parse(stor)
      if (val._id !== parsed._id || val.domain !== parsed.domain
        || val.url !== parsed.url) storage.setItem("RegBoxSession", JSON.stringify(val))
    }

    let array: TableType[] = []

    for (const key in window.localStorage) {
      if (key.startsWith("RegBoxID:")) {
        let stor: HistorialTableType = JSON.parse(window.localStorage[key])

        let table = stor.historial[stor.historial.length - 1]
        if (!table || table.state === "unnactive") continue
        array.push({
          _id: stor._id,
          number: stor.number,
          discount: table.discount,
          products: table.products,
          opened: table.opened,
          payMethod: table.payMethod,
          state: table.state
        })
      }
    }

    setInitialHistorial(array)
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
      <Main initialData={initialData} initialHistorial={initialHistorial} logout={logout}/>
    </>
}