export const checkImportancy = (val: string)=>{
    let importantList = ["switch","discount","state","number"]

    return importantList.includes(val)
}