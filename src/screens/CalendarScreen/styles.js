import { StyleSheet, Dimensions } from 'react-native';

const { height, width } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'black'
    },
    modalContainer: {
        backgroundColor: 'black',
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'grey',
        width: '90%',
        alignSelf: 'center',
    },
    titleStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'grey'
    },
    titleTextStyle: {
        fontSize: 16,
        letterSpacing: -1,
        color: 'white'
    },
    row: {
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'grey',
        paddingVertical: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16
    },
    leftText: {
        fontSize: 16,
        letterSpacing: -1,
        color: '#848085'
    },
    right: {
        flexDirection: 'row',
        alignSelf: 'flex-end'
    },
    rightWhiteText: {
        fontSize: 16,
        letterSpacing: -1,
        color: 'white',
        paddingHorizontal: 5
    },
    rightBlueText: {
        fontSize: 16,
        letterSpacing: -1,
        color: '#4284f3',
        paddingHorizontal: 5
    },
    item: {
        backgroundColor: 'green',
        flex: 1,
        borderRadius: 5,
        marginRight: 10,
        marginTop: 17,
    },
    item2: {
        backgroundColor: '#392525',
        flex: 1,
        borderRadius: 5,
        marginRight: 10,
        marginTop: 17
    },
    pastOverlay: {
        padding: 10,
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: '#222023',
        borderRadius: 5,
        opacity: 0.60
    },
    pastOverlay2: {
        padding: 10,
        position: 'absolute',
        height: '100%',
        width: '100%',
        backgroundColor: '#222023',
        borderRadius: 5,
        opacity: 0.20
    },
    padding10: {
        padding: 10
    },
    emptyDate: {
        backgroundColor: 'black',
        height: 15,
        flex: 1,
        height: 80,
        marginVertical: 5,
        marginRight: 10,
        borderRadius: 5,
        padding: 10,
    },
    textStyle: {
        color: '#ababac'
    },
    textStyle2: {
        color: '#ff533b',
        marginRight: 20,
        marginTop: 15
    },
    paddingLeft5: {
        paddingLeft: 5
    },

    pickerStyle: {
        position: 'absolute',
        zIndex: 1,
        height: 240,
        width: '85%',
        marginHorizontal: '2.5%',
        backgroundColor: 'black',
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'grey',
        alignSelf: 'center'
    },

    memberModalContainerStyle: {
        position: 'absolute',
        zIndex: 1,
        height: '160%',
        width: '95%',
        top: -40,
        marginHorizontal: '5%',
        paddingVertical: 10,
        backgroundColor: 'black',
        borderRadius: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'grey',
        alignSelf: 'center'
    },
    memberModalList: {
        height: '68%'
    },
    pickerDoneStyle: {
        position: 'absolute',
        zIndex: 2,
        bottom: 10,
        width: '70%',
        width: 80,
        alignSelf: 'center',
        justifyContent: 'space-around'
    },
    recurrenceModalStyle: {
        justifyContent: 'center',
        paddingTop: 10
    },
    memberModalStyle: {
        justifyContent: 'center',
        paddingTop: 10
    },
    recurrenceHeaderStyle: {
        paddingBottom: 10
    },
    headerTextStyle: {
        color: '#ababab',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold'
    },

    buttonSection: {
        paddingVertical: 22,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    deleteButton: {
        backgroundColor: '#ff533b',
        paddingHorizontal: 20,
        paddingVertical: 4,
        borderRadius: 10
    },
    cancelButton: {
        backgroundColor: '#736f74',
        paddingHorizontal: 20,
        paddingVertical: 4,
        borderRadius: 10
    },
    confirmButton: {
        backgroundColor: '#4284f3',
        paddingHorizontal: 20,
        paddingVertical: 4,
        borderRadius: 10
    },
    buttonText: {
        color: 'white',
        fontSize: 14
    },
    buttonTextGrey: {
        color: '#c4c0c5',
        fontSize: 14
    },
    weekDaysContainer: {
        flexDirection: 'row',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: 'grey',
        paddingVertical: 12,
        justifyContent: 'space-between',
        paddingHorizontal: 12
    },
    weekdayButton: {
        backgroundColor: '#ababac',
        height: 24,
        width: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    weekdayButtonSelected: {
        backgroundColor: '#4284f3',
        height: 24,
        width: 24,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    weekDayText: {
        color: 'black'
    },
    weekDayTextSelected: {
        color: 'white'
    },
    background: {
        flexGrow: 0
    },
    paddingHorzTen: {
        paddingHorizontal: 10
    },
    searchBarWrapper: {
        paddingHorizontal: 10,
        paddingTop: 5,
        backgroundColor: 'black'
    },
    addMemberStyle: {
        fontSize: 14,
        letterSpacing: -1,
        paddingLeft: 5,
        paddingVertical: 3,
        color: 'white'
    },
    addMemberRow: {
        paddingHorizontal: 7,
        flexDirection: 'row',
        marginTop: 10
    },
    memberContainer: {
        paddingTop: 8
    },
    memberHeader: {
        flexDirection: 'row',
        paddingBottom: 4
    },
    memberNames: {
        flexDirection: 'row'
    },
    memberTextStyle: {
        color: '#cdcdce',
        letterSpacing: -1,
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 8,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: 'gray',
        backgroundColor: 'blue',
        marginRight: 4
    },
    addButton: {
        position: 'absolute',
        top: 6,
        right: 10
    },
    floatingButton: {
        position: 'absolute',
        bottom: 25,
        right: 15,
        height: 40,
        width: 40,
        borderRadius: 20,
        borderWidth: 3,
        borderRadius: 20,
        borderColor: 'white',
        backgroundColor: 'rgb(52,108,240)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dayContainer: {
        flexDirection: 'row',
        width: 55,
        justifyContent: 'center',
        alignItems: 'center'
    },
    dateText: {
        color: '#6f8291',
        fontWeight: '300',
        fontSize: 28,
        textAlign: 'center'
    },
    dayText: {
        color: '#6f8291',
        fontSize: 12,
    },
    loader: {
        position: 'absolute',
        top: height / 2,
        left: width / 2
    },
});

agendaTheme = {
    calendarBackground: 'black',
    agendaKnobColor: 'gray',
    selectedDayBackgroundColor: 'white',
    selectedDayTextColor: 'black',
    dayTextColor: 'white',
    backgroundColor: '#454545'
};
