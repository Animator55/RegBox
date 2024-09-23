import { configType } from "../vite-env";

export const defaultConfig: configType = {
    animations: true,
    mainColor: "",
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
        y: 0
    }
}