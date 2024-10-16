
export const checkTable = (tableID: string, array: { _id: string, name: string, state: "open" | "paying" | "closed" | "unnactive" }[]) => {
    let state: "open" | "paying" | "closed" | "unnactive" = "unnactive"
    let result = false
    for (let i = 0; i < array.length; i++) {
      if (array[i]._id === tableID) {
        result = true
        state = array[i].state
        break
      }
    }
    return { result, state }
  }