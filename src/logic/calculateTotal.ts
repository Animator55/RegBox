import { Item } from "../vite-env";

export const calculateTotal = (prods: Item[], discount: number, discountType: "percent" | "amount") => {
    let total = 0

    for (let i = 0; i < prods.length; i++) {
        total += prods[i].price * prods[i].amount!
    }
    let result = `$${total}`
    if (discount !== 0) {
        if(discountType === "percent") result = "$" + total + " * " + discount + "%" + " = $" + Math.floor(total * (1 - (discount / 100)))
        else result = "$" +total +" - $"+ discount +" = $" + (total -discount)
    }

    return result
}
export const calculateTotalAsNumber = (prods: Item[], discount: number, discountType: "percent" | "amount") => {
    let total = 0

    for (let i = 0; i < prods.length; i++) {
        total += prods[i].price * prods[i].amount!
    }
    let resultNum = total
    if (discount !== 0) {
        if(discountType === "percent") resultNum = Math.floor(total * (1 - (discount / 100)))
        else resultNum = total - discount
    }
    return resultNum
}