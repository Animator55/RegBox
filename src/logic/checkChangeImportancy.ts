export const checkImportancy = (val: string)=>{
    let importantList = ["switch","discount","state","name"]

    return importantList.includes(val)
}