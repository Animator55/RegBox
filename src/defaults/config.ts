import { configType } from "../vite-env";

export const defaultConfig: configType = {
    animations: true,
    blur: false,
    mainColor: "#f07f34",
    compressToolBar: false,
    topBarButtons: {
        "notifications": true,
        "products": true,
        "historial": true,
        "information": true,
        "configuration": true,
        "download": false,
        "help": false,
        "logout": true,
    },
    prodsAsList: false,
    orderedLists: false     ,
    prodsInEditorAsList: false,
    map: {
        zoom: 1,
        x: 0,
        y: 0,
        align: true
    },
    printCommand: [],
    autoAcceptNotis: false,
    miniMapOrder: "def",
    prodListOrder: "def",
    prodEditorOrder: "def",
}