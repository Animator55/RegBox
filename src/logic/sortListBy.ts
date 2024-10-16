
function sortListByName(list: {name: string}[]) {
    return list.sort((a, b) => {
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
  }



export const sortBy = {
    "Alfabetico": (list: {name:string}[])=>{

    }, 
    "Alfabetico Inverso": ()=>{

    }, 
    "Creación": ()=>{

    }, 
    "Creación Inverso": ()=>{

    }
} 