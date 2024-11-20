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


export const renewedOrderByTypes = (items: Item[] | undefined, typeOrder: string[]): Item[][] => {
    // Crear un mapa para agrupar los elementos por `_id`
    if(!items) return []
    const groupedItems: Map<string, Item> = new Map();

    items.forEach((item) => {
        if (groupedItems.has(item._id)) {
            // Si el _id ya existe, sumamos los `amount`
            const existingItem = groupedItems.get(item._id)!;
            existingItem.amount = (existingItem.amount || 1) + (item.amount || 1);
        } else {
            // Si no existe, lo añadimos al mapa
            groupedItems.set(item._id, { ...item, amount: item.amount || 1 });
        }
    });

    // Convertimos el mapa en un array y organizamos los elementos según typeOrder
    const groupedByType: Item[][] = typeOrder.map((type) => {
        // Filtrar los items por tipo
        return Array.from(groupedItems.values()).filter((item) => item.type === type);
    });

    return groupedByType.filter((group) => group.length > 0); // Filtrar tipos sin elementos
};