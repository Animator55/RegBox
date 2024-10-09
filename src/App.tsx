import React from 'react'
import AuthScreen from './components/AuthScreen'
import { HistorialTableType, sessionType, TableType } from './vite-env'
import "./assets/App.css"
import InitialDataPop from './components/auth/InitialDataPop'
import Main from './roleMains/Main'
import { getDomainData } from './logic/API'

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
          discountType: table.discountType,
          products: table.products,
          opened: table.opened,
          payMethod: table.payMethod,
          state: table.state
        })
      }
    }

    ///getting prods 
    let {prods, config, tablePlaces} = getDomainData(val.domain)
    let initial = {
      products: prods, 
      config: config,
      tablePlaces: tablePlaces, 
    }
    setSession(val)
    setInitialData(initial)

    setInitialHistorial(array)
  }


  return session._id === "" ?
    <AuthScreen setSession={setSessionHandler} />
    :
    <>
      {!ref && <InitialDataPop
        close={() => { refresh(true) }}
        confirm={(val: any)=>{setInitialData(val); refresh(true)}}
      />
      }
      <Main initialData={initialData} initialHistorial={initialHistorial} logout={logout}/>
    </>
}