import { StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.black
    },
    dayRow: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.gray,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16
    },
    dayContainer: {
        width: 60,
        height: 36,
        borderRadius: 18,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: colors.gray,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.lightBlack
    },
    textStyle: {
        color: colors.white,
    },
    textSmall: {
        color: colors.white,
        fontSize: 12
    },
    timeBox: {

    },
    timeBoxSelected: {

    },
    textBlue: {
        color: colors.skyBlue,
        fontSize: 16,
    },
    rightColumn: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    innerRow: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingVertical: 6
    },

    flex1: { flex: 1 }
})