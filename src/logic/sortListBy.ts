
function sortListByName(list: {name: string}[], reversed?: boolean) {
    let newList = [...list]
    newList.sort((a, b) => {
      const nameA = a.name;
      const nameB = b.name;
      
      // Check if the names are numeric
      const isNumberA = !isNaN(parseInt(nameA));
      const isNumberB = !isNaN(parseInt(nameB));
      
      // If both are numbers, compare numerically
      if (isNumberA && isNumberB) {
        return parseFloat(nameA) - parseFloat(nameB);
      }
      
      // If only one is a number, the numeric name goes first
      if (isNumberA) return -1;
      if (isNumberB) return 1;
      
      // If both are words, compare alphabetically
      return nameA.localeCompare(nameB);
    });
    if(reversed) newList.reverse()
    return newList
  }



export const sortBy = {
    "abc": (list: {name:string}[])=>{
        return sortListByName(list)
    }, 
    "abc-r": (list: {name:string}[])=>{
      return sortListByName(list, true)
  }, 
    "def": (list: any)=>{
      return list
    }, 
    "def-r": (list: any)=>{
      let newList = [...list]
      newList.reverse()
      return newList
    }
} 