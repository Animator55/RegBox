import { Item } from "../vite-env"

export type productsType = {
    [key:string] : Item[]
}

export const products: productsType = {
    "Entrada": [
        {
            _id: "e.000",
            name: "Tortilla de Papa",
            price: 4750,
            type: "Entrada",
        },
        {
            _id: "e.001",
            name: "Aranccini de hongos",
            price: 4400,
            type: "Entrada",
        },
        {
            _id: "e.002",
            name: "Portobellos rellenos",
            price: 4900,
            type: "Entrada",
        },
        {
            _id: "e.003",
            name: "Sang. Mila de Tofu",
            price: 4800,
            type: "Entrada",
        },
        {
            _id: "e.004",
            name: "Picada X2",
            price: 6900,
            type: "Entrada"
        },
        {
            _id: "e.005",
            name: "Empanadas de Osobuco X2",
            price: 1400,
            type: "Entrada"
        },
        {
            _id: "e.006",
            name: "Sang. Mila de Lomo",
            price: 5300,
            type: "Entrada"
        },
        {
            _id: "e.007",
            name: "Bao Bun",
            price: 4300,
            type: "Entrada"
        },
    ],
    "Montadito": [
        {
            _id: "m.008",
            name: "Mont. Pera",
            price: 4800,
            type: "Montadito",
        },
        {
            _id: "m.009",
            name: "Mont. Tomate",
            price: 4800,
            type: "Montadito",
        },
        {
            _id: "m.010",
            name: "Mont. Jamón",
            price: 4900,
            type: "Montadito"
        },
        {
            _id: "m.011",
            name: "Mont. Brie",
            price: 4700,
            type: "Montadito"
        },
    ],
    "Principal": [
        {
            _id: "p.000",
            name: "Ojo de Bife",
            price: 9800,
            type: "Principal"
        },
        {
            _id: "p.001",
            name: "Tapa braseada",
            price: 9600,
            type: "Principal"
        },
        {
            _id: "p.002",
            name: "Ribs BBQ",
            price: 8900,
            type: "Principal"
        },
        {
            _id: "p.003",
            name: "Pesca del Día",
            price: 9300,
            type: "Principal"
        },
        {
            _id: "p.004",
            name: "Sartén de Frutos",
            price: 9900,
            type: "Principal"
        },
        {
            _id: "p.005",
            name: "Ñoquis",
            price: 4900,
            type: "Principal"
        },
    ],
    "Postres": [
        {
            _id: "d.000",
            name: "Volcán de Chocolate",
            price: 3700,
            type: "Postres"
        },
        {
            _id: "d.004",
            name: "Bocha de Helado",
            price: 1400,
            type: "Postres"
        },
        {
            _id: "d.001",
            name: "Flan Mixto",
            price: 2500,
            type: "Postres"
        },
        {
            _id: "d.002",
            name: "Nougat",
            price: 2900,
            type: "Postres"
        },
        {
            _id: "d.003",
            name: "Panqueque",
            price: 2500,
            type: "Postres"
        },
    ],
    "Bebidas": [
        {
          _id: "b.000",
          price: 950,
          name: "Agua Mineral",
          type: "Bebidas"
        },
        {
          _id: "b.001",
          price: 950,
          name: "Agua c/g",
          type: "Bebidas"
        },
        {
          _id: "b.002",
          price: 950,
          name: "Agua Savorizada",
          type: "Bebidas"
        },
        {
          _id: "b.003",
          price: 1500,
          name: "Gaseosas (CocaCola)",
          type: "Bebidas"
        },

        {
          _id: "b.004",
          price: 1800,
          name: "Corona",
          type: "Bebidas"
        },
        {
          _id: "b.005",
          price: 1950,
          name: "Heinneken",
          type: "Bebidas"
        },

        {
          _id: "b.006",
          price: 5900,
          name: "Black Label",
          type: "Bebidas"
        },
        {
          _id: "b.007",
          price: 4900,
          name: "Chivas Regal 12",
          type: "Bebidas"
        },
        {
          _id: "b.008",
          price: 2800,
          name: "Jameson",
          type: "Bebidas"
        },
    ],
    "Vinos": [
        {
          _id: "v.000",
          price: 13000,
          name: "Piatelli",
          type: "Vinos"
        },
        {
          _id: "v.001",
          price: 10000,
          name: "Animal Org.",
          type: "Vinos"
        },
        {
          _id: "v.002",
          price: 8900,
          name: "La Anita",
          type: "Vinos"
        },
        {
          _id: "v.003",
          price: 9800,
          name: "Nicasia",
          type: "Vinos"
        },
        {
          _id: "v.004",
          price: 6700,
          name: "La Iride",
          type: "Vinos"
        },

        {
          _id: "v.005",
          price: 9800,
          name: "Nicasia Blanc Viognier",
          type: "Vinos"
        },

        {
          _id: "v.006",
          price: 10600,
          name: "La Anita Chardonnay",
          type: "Vinos"
        },
        {
          _id: "v.007",
          price: 6000,
          name: "Santa Julia",
          type: "Vinos"
        },
        {
          _id: "v.008",
          price: 0,
          name: "Espumante",
          type: "Vinos"
        },
        {
          _id: "v.009",
          price: 5900,
          name: "Alto a las H. (Botella)",
          type: "Vinos"
        },
        {
          _id: "v.010",
          price: 2000,
          name: "Alto a las H (Copa)",
          type: "Vinos"
        },
        {
          _id: "v.011",
          price: 2000,
          name: "Santa Julia (Copa)",
          type: "Vinos"
        },
    ],
    "Tragos": [
        {
            _id: "t.000",
            name: "Pueblo",
            price: 1700,
            type: "Tragos"
        },
        {
            _id: "t.001",
            name: "Pugliese",
            price: 1700,
            type: "Tragos"
        },
        {
            _id: "t.002",
            name: "Bianco Ton.",
            price: 1700,
            type: "Tragos"
        },
        {
            _id: "t.003",
            name: "Hemingway",
            price: 1750,
            type: "Tragos"
        },

        {
            _id: "t.004",
            name: "Club",
            price: 1800,
            type: "Tragos"
        },
        {
            _id: "t.005",
            name: "Verano",
            price: 1700,
            type: "Tragos"
        },
        {
            _id: "t.006",
            name: "Pollock Dry",
            price: 1700,
            type: "Tragos"
        },
        {
            _id: "t.007",
            name: "Negroni",
            price: 2500,
            type: "Tragos"
        },

        {
            _id: "t.008",
            name: "Julep",
            price: 1800,
            type: "Tragos"
        },
        {
            _id: "t.009",
            name: "Cynarazo",
            price: 1800,
            type: "Tragos"
        },
        {
            _id: "t.010",
            name: "Americano de Botica",
            price: 1800,
            type: "Tragos"
        },

        {
            _id: "t.011",
            name: "Bombay Gin Tonic",
            price: 3900,
            type: "Tragos"
        },
        {
            _id: "t.012",
            name: "Beffeater/Tanqueray Gin Tonic",
            price: 3200,
            type: "Tragos"
        },
        {
            _id: "t.013",
            name: "Partha Gin Tonic",
            price: 2200,
            type: "Tragos"
        },

        {
            _id: "t.014",
            name: "Fernet",
            price: 2500,
            type: "Tragos"
        },
        {
            _id: "t.015",
            name: "Campari",
            price: 2500,
            type: "Tragos"
        },
        {
            _id: "t.016",
            name: "Aperol",
            price: 2200,
            type: "Tragos"
        },
    ],
}