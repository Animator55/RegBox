import { Item } from "../vite-env";

export const calculateTotal = (prods: Item[], discount: number)=>{
    let total = 0

    for(let i=0; i<prods.length; i++) {
        total += prods[i].price * prods[i].amount! 
    }
    let result = `$${total}`
    if(discount !== 0) result = "$"+total+ " * " + discount+"%"+" = $" + Math.floor(total*(1-(discount/100))) 

    return result
}