import React, { Component } from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    FlatList,
    Alert
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BlurView } from '@react-native-community/blur';
import { styles } from './styles';
import Loader from '../../components/Loader';
import { getDateWithDaysAdded, getDateAndTime, getFormattedDate, timeToString, get24Hour, deepCopy } from '../../lib';
import moment from 'moment';
import { locales } from '../../../config/locales';
import { colors } from '../../../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height, width } = Dimensions.get('window');
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default class CalendarScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleModalVisible: false,
            isDoctor: false,

            weekDays: [
                { day: 'Sun', selected: false },
                { day: 'Mon', selected: false },
                { day: 'Tue', selected: false },
                { day: 'Wed', selected: false },
                { day: 'Thu', selected: false },
                { day: 'Fri', selected: false },
                { day: 'Sat', selected: false },
            ],
            schedules: {},

            selectedItem: null,
            patientName: '',
            toggle: false,

            //details of a schedule (these will be saved in the schedules array)
            startTime: new Date(),
            endTime: new Date(),

            //Picker
            selectedStartTime: null,
            selectedEndTime: null,

            isStartTimePickerVisible: false,
            isEndTimePickerVisible: false
        };
    }

    componentDidMount = () => {
        const navParams = this.props.route.params;
        console.log('navParams', navParams);
        if (navParams) {
            this.setState({ isDoctor: navParams.isDoctor });
            if (navParams.patientName) {
                this.setState({ patientName: navParams.patientName })
            }
        }
        this.loadSchedules();
    }

    loadSchedules = async () => {
        let beginningDate = Date.now() - 24 * 60 * 60000 * 100;
        console.log('beginningDate', beginningDate);
        // let currentDate = moment().format().split('T')[0];
        // console.log('currentDate', currentDate);
        const scheduleRes = await AsyncStorage.getItem('scheduleDays')
        const patientSlotsRes = await AsyncStorage.getItem('patientSlots');
        console.log('............patientSlotsRes', patientSlotsRes);
        if (scheduleRes) {
            let scheduleDays = JSON.parse(scheduleRes)
            let patientSlots = patientSlotsRes ? JSON.parse(patientSlotsRes) : [];
            console.log('parsed patientSlots', patientSlots);

            let newSchedules = [];
            for (let i = 0; i < 200; i++) {
                for (let j = 1; j <= 7; j++) {
                    if ((new Date(beginningDate)).getDay() === j && scheduleDays[j - 1].slots[0].startTime && scheduleDays[j - 1].slots[0].endTime) {
                        newSchedules[moment(beginningDate).format().split('T')[0]] = [];
                        let index = 0;
                        scheduleDays[j - 1].slots.forEach(slotItem => {
                            console.log('slotItem', slotItem);
                            let filteredSlots = patientSlots.filter(pSlotItem => {
                                const slotStartTime = get24Hour(slotItem.startTime);
                                const slotEndTime = get24Hour(slotItem.endTime);
                                const slotStartmilliseconds = new Date(beginningDate).setHours(slotStartTime.hrs, slotStartTime.mins);
                                const slotEndmilliseconds = new Date(beginningDate).setHours(slotEndTime.hrs, slotEndTime.mins);
                                return (new Date(pSlotItem.startTime).getTime() > slotStartmilliseconds &&
                                    new Date(pSlotItem.endTime).getTime() < slotEndmilliseconds)
                            })
                            console.log('filteredSlots', filteredSlots);
                            newSchedules[moment(beginningDate).format().split('T')[0]]
                                .push({
                                    activeStartTime: slotItem.startTime,
                                    activeEndTime: slotItem.endTime,
                                    date: moment(beginningDate).format().split('T')[0],
                                    index: index++,
                                    patientSlots: filteredSlots
                                })
                        })
                    }
                }
                beginningDate += 24 * 60 * 60000
            }
            console.log('newSchedules', newSchedules);

            const newItems = {};
            Object.keys(newSchedules).forEach((key) => {
                newItems[key] = newSchedules[key];
            });
            this.setState({
                schedules: newItems
            });
        }
    }

    onBackPress = () => {
        const { navigation } = this.props;
        navigation.goBack();
    };

    hideDateTimePicker = () => this.setState({
        startTimePickerVisible: false,
        endTimePickerVisible: false,
        recurDatePickerVisible: false
    });

    handleStartTimePicked = (date) => {
        this.setState({ selectedStartTime: date, selectedDate: timeToString(date), startTimePickerVisible: false });
    }
    handleEndTimePicked = (date) => {
        this.setState({ selectedEndTime: date, endTimePickerVisible: false });
    }

    renderDay = (day, item) => {
        if (!day) {
            return <View style={styles.dayContainer} />;
        }
        let dayIndex = new Date(day.timestamp).getUTCDay();
        const { weekDays } = this.state;
        const weekDay = weekDays[dayIndex].day;
        return (
            <View style={styles.dayContainer}>
                <View style={{}}>
                    <Text style={styles.dateText}>{day ? day.day : 'item'}</Text>
                    <Text style={styles.dayText}>{weekDay}</Text>
                </View>
            </View>
        )
    }

    loadItems = async day => {
        let { schedules } = this.state;
        console.log('day...', day);
        for (let i = -50; i < 50; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = timeToString(time);
            // console.log('schedules[strTime]', schedules[strTime]);
            if (!schedules[strTime]) {
                schedules[strTime] = [];
            }
        }
        const newItems = {};
        Object.keys(schedules).forEach((key) => {
            newItems[key] = schedules[key];
        });
        this.setState({
            schedules: newItems
        }, () => console.log('latest schedules', this.state.schedules))
    }

    getFullName = (memberDetails) => {
        const { prefix, firstName, lastName, suffix } = memberDetails;
        let name;
        if (prefix) {
            name = prefix + ' ';
        }
        name += firstName + ' ' + lastName;
        if (suffix) {
            name += ' ' + suffix;
        }
        return name;
    };

    renderItem(item) {
        return (
            <TouchableOpacity
                onPress={() => this.agendaPressed(item)}
                style={styles.slot}>
                <Text style={[styles.textStyle, { color: colors.skyBlue, marginBottom: 4 }]}>{item.activeStartTime + ' to ' + item.activeEndTime}</Text>
                {item.patientSlots && item.patientSlots.map(patientItem => {
                    console.log('patientItem', patientItem)
                    return (
                        <View style={styles.patientContainer}>
                            <Text style={[styles.textStyle, { color: colors.yellow }]}>{patientItem.patientName}</Text>
                            <Text style={styles.textStyle}>{moment(new Date(patientItem.startTime)).format('LT')}</Text>
                            <Text style={styles.textStyle}>{'  to  '}</Text>
                            <Text style={styles.textStyle}>{moment(new Date(patientItem.endTime)).format('LT')}</Text>
                        </View>
                    )
                })}
            </TouchableOpacity>
        );
    }

    agendaPressed = (item) => {
        const { isDoctor } = this.state;
        this.setState({ selectedStartTime: null, selectedEndTime: null })
        console.log('agendaPressed item--->', item)
        if (isDoctor) {
            this.setState({ slotsModalVisible: true, selectedItem: item })
        }
        else {
            this.setState({ scheduleModalVisible: true, selectedItem: item })
        }
    };

    renderEmptyDate(item) {
        return (
            <View
                disable
                style={[styles.slot, { backgroundColor: colors.lightGray }]}>
                <Text style={styles.textStyle}>{locales.inactiveSlot}</Text>
            </View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    handleConfirmStartTime = (time) => {
        this.setState({ selectedStartTime: time });
        this.hideTimePicker();
    }
    handleConfirmEndTime = (time) => {
        this.setState({ selectedEndTime: time });
        this.hideTimePicker();
    }
    hideTimePicker = () => {
        this.setState({ isStartTimePickerVisible: false, isEndTimePickerVisible: false })
    }

    startTimePressed = () => {
        this.setState({ isStartTimePickerVisible: true })
    }
    endTimePressed = () => {
        this.setState({ isEndTimePickerVisible: true })
    }

    cancelSchedulePress = () => {
        this.setState({ scheduleModalVisible: false })
    }

    confirmSchedulePress = async () => {
        const { selectedStartTime, selectedEndTime, selectedItem, schedules, patientName } = this.state;
        if (!(selectedEndTime && selectedEndTime)) {
            Alert.alert('Please select Start time and End time!!');
            return;
        }
        if (selectedEndTime < selectedStartTime) {
            Alert.alert('End time must be after Start time!!');
            return;
        }
        const { activeStartTime, activeEndTime } = selectedItem;
        const slotStartTime = get24Hour(activeStartTime);
        const slotEndTime = get24Hour(activeEndTime);
        console.log('selectedStartTime', selectedStartTime);
        // console.log('selectedEndTime', selectedEndTime);
        // console.log('slotStartTime', slotStartTime);
        // console.log('slotEndTime', slotEndTime);
        // console.log('selectedItem', selectedItem);
        const slotStartmilliseconds = new Date(selectedItem.date).setHours(slotStartTime.hrs, slotStartTime.mins);
        const slotEndmilliseconds = new Date(selectedItem.date).setHours(slotEndTime.hrs, slotEndTime.mins);
        console.log('slotStartmilliseconds', slotStartmilliseconds);
        if (selectedStartTime.getTime() < slotStartmilliseconds) {
            Alert.alert('Start time must be after ' + activeStartTime);
            return;
        }
        if (selectedEndTime.getTime() > slotEndmilliseconds) {
            Alert.alert('Start time must be before ' + activeEndTime);
            return;
        }
        let patientSlotObject = {
            patientName: patientName,
            startTime: selectedStartTime,
            endTime: selectedEndTime
        };

        const patientSlotsRes = await AsyncStorage.getItem('patientSlots');
        if (patientSlotsRes) {
            let pSlots = JSON.parse(patientSlotsRes);
            pSlots.push(patientSlotObject);
            AsyncStorage.setItem('patientSlots', JSON.stringify(pSlots));
        }
        else {
            AsyncStorage.setItem('patientSlots', JSON.stringify([patientSlotObject]));
        }


        console.log('schedules', schedules);
        if (schedules[selectedItem.date][selectedItem.index].patientSlots) {
            schedules[selectedItem.date][selectedItem.index].patientSlots.push(patientSlotObject)
        }
        else {
            schedules[selectedItem.date][selectedItem.index].patientSlots = [patientSlotObject]
        }

        const newItems = {};
        Object.keys(schedules).forEach((key) => {
            newItems[key] = schedules[key];
        });
        this.setState({
            schedules: newItems
        });

        // this.setState({ schedules: deepCopy(schedules) }, () => {
        //     console.log('new schedules', this.state.schedules);
        //     this.loadItems()
        // })

        this.setState({ scheduleModalVisible: false });
        Alert.alert(
            'Successfully booked appointment!',
            '',
            [
                {
                    text: 'Okay',
                    onPress: () => this.props.navigation.goBack()
                }
            ]
        )
    }

    viewSlotsPress = () => {
        this.setState({ slotsModalVisible: true })
    }

    hideSlotsModal = () => {
        this.setState({ slotsModalVisible: false })
    }

    renderSlotsModal = () => {
        const { selectedItem, isDoctor } = this.state;
        return (
            <View style={styles.modalContainer}>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleTextStyle}>{(isDoctor ? locales.yourSlotsOn : locales.doctorsSlotsOn) + ' on   ' + selectedItem.date}</Text>
                </View>
                {selectedItem.patientSlots && selectedItem.patientSlots.map(patientItem => {
                    console.log('patientItem', patientItem)
                    return (
                        <View style={styles.patientContainer}>
                            <Text style={[styles.textStyle, { color: colors.yellow }]}>{patientItem.patientName}</Text>
                            <Text style={styles.textStyle}>{moment(new Date(patientItem.startTime)).format('LT')}</Text>
                            <Text style={styles.textStyle}>{'  to  '}</Text>
                            <Text style={styles.textStyle}>{moment(new Date(patientItem.endTime)).format('LT')}</Text>
                        </View>
                    )
                })}
                {(!selectedItem.patientSlots || selectedItem.patientSlots.length < 1) ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                        <Text style={styles.textStyle}>{'No appointments in this slot'}</Text>
                    </View>
                    : null}
                <View
                    style={styles.buttonSection}>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={this.hideSlotsModal}
                    >
                        <Text style={styles.buttonText}>{locales.back}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderModalPatient = () => {
        const { selectedItem, selectedStartTime, selectedEndTime } = this.state;
        return (
            <View style={styles.modalContainer}>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleTextStyle}>{locales.bookAppointment + ' on   ' + selectedItem.date}</Text>
                </View>

                <View style={styles.row}>
                    <View>
                        <Text style={styles.leftText}>Start Time</Text>
                    </View>
                    <View style={styles.right}>
                        <TouchableOpacity
                            // disabled={recurrenceModalVisible}
                            onPress={this.startTimePressed}
                            style={styles.right}
                        >
                            <Text style={styles.rightBlueText}>
                                {selectedStartTime ? getDateAndTime(selectedStartTime) : locales.selectStart}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.leftText}>End Time</Text>
                    </View>
                    <View style={styles.right}>
                        <TouchableOpacity
                            // disabled={recurrenceModalVisible}
                            onPress={this.endTimePressed}
                            style={styles.right}
                        >
                            <Text style={styles.rightBlueText}>
                                {selectedEndTime ? getDateAndTime(selectedEndTime) : locales.selectEnd}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View
                    style={styles.buttonSection}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={this.cancelSchedulePress}
                    >
                        <Text style={styles.buttonText}>{locales.cancel}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.viewButton}
                        onPress={this.viewSlotsPress}
                    >
                        <Text style={styles.buttonTextBlack}>{locales.viewSlots}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={this.confirmSchedulePress}
                    >
                        <Text style={styles.buttonText}>{locales.confirm}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    renderModalDoctor = () => {
        const { selectedItem } = this.state;
        return (
            <View style={styles.modalContainer}>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleTextStyle}>{selectedItem.date + '   ' + selectedItem.activeStartTime + ' to ' + selectedItem.activeEndTime}</Text>
                </View>
            </View>
        )
    }


    render() {
        const {
            onCallGroupName,
            scheduleModalVisible,
            slotsModalVisible,
            schedules,
            loading,
            isDoctor,
            selectedItem,
            isStartTimePickerVisible,
            isEndTimePickerVisible
        } = this.state;
        return (
            <View style={styles.container}>
                <View style={(scheduleModalVisible || slotsModalVisible) ? styles.containerGray : styles.container}>
                    <Agenda
                        items={schedules}
                        loadItemsForMonth={this.loadItems.bind(this)}
                        renderItem={this.renderItem.bind(this)}
                        renderEmptyDate={this.renderEmptyDate.bind(this)}
                        rowHasChanged={this.rowHasChanged.bind(this)}
                        onDayPress={() => console.log('Day is pressed')}
                        theme={agendaTheme}
                        renderDay={(day, item) => this.renderDay(day, item)}
                        hideExtraDays={false}
                    />
                    <DateTimePickerModal
                        isVisible={isStartTimePickerVisible || isEndTimePickerVisible}
                        mode="datetime"
                        isDarkModeEnabled
                        textColor='white'
                        headerTextIOS={isStartTimePickerVisible ? locales.selectStart : locales.selectEnd}
                        onConfirm={isStartTimePickerVisible ? this.handleConfirmStartTime : this.handleConfirmEndTime}
                        onCancel={this.hideTimePicker}
                    />
                    {
                        loading && <View style={styles.loader}>
                            <Loader />
                        </View>
                    }
                </View>
                {slotsModalVisible ?
                    <View style={{ position: 'absolute', top: (height - 260) / 2, alignSelf: 'center', width: width - 20 }}>
                        {this.renderSlotsModal()}
                    </View>
                    :
                    scheduleModalVisible ?
                        <View style={{ position: 'absolute', top: (height - 260) / 2, alignSelf: 'center', width: width - 20 }}>
                            {this.renderModalPatient()}
                        </View>
                        : null

                }
            </View >
        );
    }
}