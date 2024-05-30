export default function checkSearch (name:string, query: string): string {
    if(query === "" || !/^[a-zA-Z]+$/.test(query)) return name
    let cleanedQuery = query.replace(/(<([^>]+)>)/ig, '')
    var regex = new RegExp(cleanedQuery, "i");
    let selected = name.replace(regex, "<mark>$&</mark>")
    return selected
}