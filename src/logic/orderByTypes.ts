import { Item } from "../vite-env";

export default function orderByTypes(list: Item[] | undefined, types: string[], pushTitles: boolean) {
    if (!list || list.length === 0) return list

    let newList = [...list]

    const orderedEntries = newList.sort((a, b) => {
        return types.indexOf(a.type) - types.indexOf(b.type);
    });

    if(!pushTitles) return orderedEntries

    const result: any[] = [];
    let currentType = "";

    orderedEntries.forEach(entry => {
        if (entry.type !== currentType) {
            currentType = entry.type;
            result.push({ "type": currentType, "header": true });
        }
        result.push(entry);
    });

    return result
}