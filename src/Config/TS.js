import { StyleSheet } from "react-native";
import { c } from "./Config";
import adjustFont from "./adjustFont";

export default TS = StyleSheet.create({
    name: {
        maxWidth: 100,
        fontSize: adjustFont(9),
        color: c.white,
        textAlign: 'center'
    },
    whiteBold: {
        color: c.white,
        fontWeight: '600',
        fontSize: adjustFont(10)
    },
    homeGrid: {
        color: c.white,
        fontWeight: '600',
        textAlign: 'center',
        fontSize: adjustFont(10)
    },
    iconLabel: {
        fontSize: adjustFont(9),
        color: c.white,
        textAlign: 'center'
    },
    zoomTime: {
        textAlign: 'center',
        color: c.white,
        fontWeight: '600',
        fontSize: adjustFont(9)
    },
    WS: {
        textAlign: 'center',
        color: c.white
    }
})