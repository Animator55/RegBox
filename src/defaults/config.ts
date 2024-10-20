import { configType } from "../vite-env";

export const defaultConfig: configType = {
    animations: true,
    mainColor: "#f07f34",
    topBarButtons: {
        "notifications": true,
        "products": true,
        "historial": true,
        "information": false,
        "configuration": false,
        "download": false,
        "help": false,
        "logout": true,
    },
    prodsAsList: false,
    orderedLists: true,
    prodsInEditorAsList: false,
    map: {
        zoom: 1,
        x: 0,
        y: 0,
        align: true
    },
    miniMapOrder: "def",
    prodListOrder: "def",
    prodEditorOrder: "def",
}