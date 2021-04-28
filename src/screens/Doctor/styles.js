import { StyleSheet } from 'react-native';
import { colors } from '../../../config/colors';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: colors.black
    },

    instructionStyle: {
        color: colors.gray,
        fontSize: 18,
        marginVertical: 40
    },
    textStyle: {
        color: 'white'
    },
    button: {
        flexDirection: 'row',
        backgroundColor: colors.lightBlack,
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 4,
        borderColor: colors.gray,
        borderWidth: StyleSheet.hairlineWidth,
        marginVertical: 20
    },
})