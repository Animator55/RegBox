import { TablePlaceType } from "../vite-env";

export default function getTableData (id:string, list: TablePlaceType[]){
    if(id === "" || list.length === 0) return null
    
    let obj = null
    for(let i=0; i<list.length; i++) {
        let item = list[i]
        if(item._id === id) {
            obj = item
            break
        } 
    }

    return obj
}