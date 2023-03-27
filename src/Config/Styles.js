import { StyleSheet } from "react-native";
import { SW, c } from "./Config";

export default s = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomColor: c.yellow,
        borderBottomWidth: 1,
        paddingVertical: '2%',
        paddingHorizontal: '3%',
        alignItems: 'center'
    },
    headerInner: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: c.white + '50',
        borderRadius: 10
    },
    profileImage: {
        width: SW / 8,
        height: SW / 8,
        borderRadius: SW / 8,
        borderColor: c.yellow,
        borderWidth: 1.5,
        backgroundColor: c.white,
        alignSelf: 'center'
    },
    avatarIntials: {
        borderColor: c.yellow,
        borderWidth: 1.5,
        backgroundColor: '#410B00',
        alignSelf: 'center'
    },
    slider: {
        position: 'absolute',
        zIndex: 115,
        alignSelf: 'center',
        top: '15%'
    },
    sliderImage: {
        width: SW / 1.2,
        height: SW / 3,
        borderColor: c.yellow,
        borderWidth: 1,
        resizeMode: 'contain'
    },
    closeBtn: {
        backgroundColor: c.yellow,
        position: 'absolute',
        left: -20,
        top: -20,
        zIndex: 4
    },
    avatarImg: {
        width: SW / 10, height: SW / 10, borderRadius: SW / 10, borderColor: c.green,
        backgroundColor: c.white
    },
    gridImg: { width: '100%', height: '70%', resizeMode: 'contain' },
    textWhite: {
        color: c.white
    },
    bold: {
        fontWeight: 'bold'
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: '2%',
        paddingHorizontal: '3%',
    },
    justifyCenter: {
        justifyContent: 'center'
    },
    justifyAround: {
        justifyContent: 'space-around'
    },
    justifyBetween: {
        justifyContent: 'space-between'
    },
    alignCenter: {
        alignItems: 'center'
    },
    textCenter: {
        textAlign: 'center'
    },
    shadow: {
        shadowColor: c.yellow,
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 10,
    },
    menuListItem: {
        backgroundColor: c.white,
        borderRadius: 10,
        paddingVertical: '3%',
        marginBottom: '5%'
    },
    menuListText: {
        color: '#000',
        fontWeight: 'bold',
        textAlign: 'center',
        fontSize: 17,
        alignSelf: 'center'
    },
    menuListContainer: {
        // paddingHorizontal: '4%',
        paddingVertical: '7%',
        backgroundColor: '#000',
        borderRadius: 20,
        borderColor: c.yellow,
        borderWidth: 2
    },
    menuTopImage: {
        width: '50%',
        height: 100,
        resizeMode: 'contain',
        position: 'absolute',
        alignSelf: 'center',
        top: -90
    },
    menuCloseBtn: {
        backgroundColor: c.yellow,
        position: 'absolute',
        top: '17%',
        right: 10,
        zIndex: 5
    },
    profileMenuListItem: {
        backgroundColor: c.white,
        borderRadius: 10,
        paddingVertical: '3%',
        marginBottom: '5%',
        paddingHorizontal: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // elevation: 10,
        // shadowColor: '#ffffff',
        // shadowOffset: {
        //     width: 0,
        //     height: 0
        // },
        // shadowOpacity: 1,
        // shadowRadius: 5
    },
    profileMenuListText: {
        color: '#000',
        fontWeight: 'bold',
        // textAlign: 'center',
        fontSize: 17,
        // alignSelf: 'center'
    },
    iconImage: {
        width: SW / 8,
        height: SW / 8,
        resizeMode: 'contain'
    },
    chooseAvatar: {
        width: SW / 6,
        height: SW / 6,
        resizeMode: 'contain',
        backgroundColor: c.white,
        borderColor: c.green,
        borderRadius: SW / 3,
        marginBottom: '5%'
    },
    smallIcon: {
        width: SW / 10,
        height: SW / 10,
        resizeMode: 'contain',
        alignSelf: 'center'
    },
    popUpBg: {
        backgroundColor: c.white,
        padding: '5%',
        borderRadius: 20,
        shadowColor: c.yellow,
        shadowOpacity: 1,
        shadowRadius: 5,
        elevation: 10,
        position: 'relative'
    },
    modalBg: {
        flex: 1,
        backgroundColor: '#00000090',
        justifyContent: 'center',
        paddingHorizontal: '5%'
    },
    smallList: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: '2%',
        paddingHorizontal: '3%',
        marginVertical: '2%',
        borderWidth: 1,
        borderColor: c.white,
        borderRadius: 10
    },
    homeGrid: {
        width: SW / 4,
        height: SW / 4,
        marginBottom: '3%'
    },
    w_100: {
        width: '100%',
        height: '100%'
    },
    subHeading: {
        fontSize: 12,
        color: c.white,
        textAlign: 'center'
    },
    packageGrid: {
        width: '28%',
        backgroundColor: '#02a608',
        borderRadius: 10,
        borderColor: c.white,
        borderWidth: 1,
        marginBottom: '2%',
        paddingHorizontal: '2%'
    },
    logo: {
        width: SW / 2.3,
        height: SW / 3.5,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginVertical: '10%'
    }
})