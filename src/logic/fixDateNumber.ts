export default function fixNum(number: number){
    let string = `${number}`

    if(string.length === 2) return number
    return "0"+string
}