import { TablePlaceType, TableType } from "../vite-env";

export default function createNewTable (data?: TableType): TablePlaceType{
    let map = document.querySelector(".draggable") as HTMLDivElement

    let x = 100
    let y = 100
    if (map) {
      x = map.parentElement!.clientWidth / 2 - (parseInt(map.style.left) * parseFloat(map.style.scale)) - 17.5
      y = map.parentElement!.clientHeight / 2 - (parseInt(map.style.top) * parseFloat(map.style.scale)) - 17.5
    }

    let newID = data !== undefined ? data._id: `${Math.round((Math.random() * Math.random()) * 10000000000000)}`
    let table: TablePlaceType = {
      _id: newID,
      name: data !== undefined ? data.name :`${Math.round(Math.random() * 100)}`,
      coords: {
        x: x,
        y: y,
      },
      size: {
        x: 40,
        y: 40,
      }
    }
    return table
}