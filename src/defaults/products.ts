import { Item } from "../vite-env"

export type productsType = {
    [key:string] : Item[]
}
export const products1: productsType = {
  "Entradas": [
    { _id: "ent01", name: "Empanadas de Carne", price: 900, type: "Entradas" },
    { _id: "ent02", name: "Provoleta al Horno", price: 1200, type: "Entradas" },
    { _id: "ent03", name: "Bruschettas con Jamón Crudo", price: 1300, type: "Entradas" },
    { _id: "ent04", name: "Tabla de Fiambres", price: 2800, type: "Entradas" },
    { _id: "ent05", name: "Choclo con Manteca y Especias", price: 950, type: "Entradas" },
    { _id: "ent06", name: "Rabas Fritas", price: 1800, type: "Entradas" },
    { _id: "ent07", name: "Patitas de Pollo con Salsa BBQ", price: 1600, type: "Entradas" },
    { _id: "ent08", name: "Queso Brie con Mermelada de Tomate", price: 1500, type: "Entradas" }
  ],
  "Principales": [
    { _id: "main01", name: "Bife de Chorizo con Papas Fritas", price: 4000, type: "Principales", presets:["A punto", "Cocido", "Jugoso"]},
    { _id: "main02", name: "Ravioles de Ricota con Salsa Bolognesa", price: 3500, type: "Principales" },
    { _id: "main03", name: "Suprema de Pollo con Puré", price: 3200, type: "Principales" },
    { _id: "main04", name: "Risotto de Hongos", price: 3700, type: "Principales" },
    { _id: "main05", name: "Salmón a la Parrilla con Verduras Asadas", price: 4500, type: "Principales" },
    { _id: "main06", name: "Canelones de Espinaca y Pollo", price: 3400, type: "Principales" },
    { _id: "main07", name: "Matambre a la Pizza con Papas", price: 3800, type: "Principales" },
    { _id: "main08", name: "Fetuccini con Salsa de Mariscos", price: 4200, type: "Principales" }
  ],
  "Postres": [
    { _id: "dess01", name: "Flan Casero con Dulce de Leche", price: 1200, type: "Postres" },
    { _id: "dess02", name: "Tiramisú", price: 1500, type: "Postres" },
    { _id: "dess03", name: "Helado Artesanal (2 Sabores)", price: 1000, type: "Postres" },
    { _id: "dess04", name: "Chocotorta", price: 1300, type: "Postres" },
    { _id: "dess05", name: "Tarta de Manzana con Helado de Vainilla", price: 1400, type: "Postres" },
    { _id: "dess06", name: "Brownie con Helado", price: 1600, type: "Postres" },
    { _id: "dess07", name: "Crumble de Peras con Crema", price: 1400, type: "Postres" },
    { _id: "dess08", name: "Panqueques con Dulce de Leche", price: 1300, type: "Postres" }
  ],
  "Bebidas": [
    { _id: "bev01", name: "Agua Mineral sin Gas (500ml)", price: 600, type: "Bebidas" },
    { _id: "bev02", name: "Gaseosa (500ml)", price: 800, type: "Bebidas" },
    { _id: "bev03", name: "Cerveza Artesanal (Pinta)", price: 1200, type: "Bebidas" },
    { _id: "bev04", name: "Copa de Vino Tinto", price: 1500, type: "Bebidas" },
    { _id: "bev05", name: "Limonada Casera", price: 1100, type: "Bebidas" },
    { _id: "bev06", name: "Jugo de Naranja Natural", price: 1000, type: "Bebidas" },
    { _id: "bev07", name: "Agua Tónica", price: 900, type: "Bebidas" },
    { _id: "bev08", name: "Aperol Spritz", price: 1800, type: "Bebidas" }
  ],
  "Guarniciones": [
    { _id: "side01", name: "Papas Fritas", price: 1000, type: "Guarniciones" },
    { _id: "side02", name: "Puré de Papas", price: 900, type: "Guarniciones" },
    { _id: "side03", name: "Ensalada Mixta", price: 800, type: "Guarniciones" },
    { _id: "side04", name: "Verduras Asadas", price: 1000, type: "Guarniciones" },
    { _id: "side05", name: "Arroz Pilaf", price: 850, type: "Guarniciones" },
    { _id: "side06", name: "Papas a la Provenzal", price: 1100, type: "Guarniciones" }
  ],
  "Sopas": [
    { _id: "soup01", name: "Sopa de Calabaza", price: 1300, type: "Sopas" },
    { _id: "soup02", name: "Sopa de Cebolla Gratinada", price: 1400, type: "Sopas" },
    { _id: "soup03", name: "Crema de Espinaca", price: 1200, type: "Sopas" },
    { _id: "soup04", name: "Gazpacho Andaluz", price: 1100, type: "Sopas" }
  ],
  "Pizzas": [
    { _id: "pizza01", name: "Pizza Margherita", price: 1800, type: "Pizzas" },
    { _id: "pizza02", name: "Pizza de Jamón y Morrones", price: 2000, type: "Pizzas" },
    { _id: "pizza03", name: "Pizza Fugazzetta", price: 1900, type: "Pizzas" },
    { _id: "pizza04", name: "Pizza Napolitana", price: 1950, type: "Pizzas" },
    { _id: "pizza05", name: "Pizza Cuatro Quesos", price: 2100, type: "Pizzas" }
  ],
  "Sandwiches": [
    { _id: "sand01", name: "Sandwich de Milanesa", price: 2200, type: "Sandwiches" },
    { _id: "sand02", name: "Lomito Completo", price: 2500, type: "Sandwiches" },
    { _id: "sand03", name: "Sandwich de Vegetales Asados", price: 1800, type: "Sandwiches" },
    { _id: "sand04", name: "Sandwich de Bondiola Braseada", price: 2300, type: "Sandwiches" },
    { _id: "sand05", name: "Sandwich de Pollo con Palta", price: 2100, type: "Sandwiches" }
  ],
  "Tartas": [
    { _id: "tart01", name: "Tarta de Espinaca y Ricota", price: 1700, type: "Tartas" },
    { _id: "tart02", name: "Tarta de Calabaza y Queso", price: 1650, type: "Tartas" },
    { _id: "tart03", name: "Tarta de Atún", price: 1800, type: "Tartas" },
    { _id: "tart04", name: "Tarta de Jamón y Queso", price: 1750, type: "Tartas" }
  ],
  "Cervezas": [
    { _id: "beer01", name: "Cerveza Rubia (Pinta)", price: 1200, type: "Cervezas" },
    { _id: "beer02", name: "Cerveza Roja (Pinta)", price: 1300, type: "Cervezas" },
    { _id: "beer03", name: "Cerveza Negra (Pinta)", price: 1300, type: "Cervezas" },
    { _id: "beer04", name: "Cerveza IPA (Pinta)", price: 1400, type: "Cervezas" }
  ]
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