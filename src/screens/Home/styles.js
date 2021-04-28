import { StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.black,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: colors.gray
    },
    textStyle: {
        color: colors.white
    },
    button: {
        flexDirection: 'row',
        backgroundColor: colors.lightBlack,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderColor: colors.gray,
        borderWidth: StyleSheet.hairlineWidth,
        marginTop: 20
    },
    bar: {
        width: '100%',
        height: StyleSheet.hairlineWidth,
        backgroundColor: colors.gray,
        marginVertical: 40
    },
    buttonDoctor: {
        paddingVertical: 10
    }
})