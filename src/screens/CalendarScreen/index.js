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
import { getDateWithDaysAdded, getDateAndTime, getFormattedDate, timeToString } from '../../lib';
import moment from 'moment';
import { locales } from '../../../config/locales';
import { colors } from '../../../config/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Modal from 'react-native-modal';

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
            this.setState({ isDoctor: navParams.isDoctor })
        }
        this.loadSchedules();
    }

    loadSchedules = async () => {
        let beginningDate = Date.now() - 24 * 60 * 60000 * 100;
        console.log('beginningDate', beginningDate);
        // let currentDate = moment().format().split('T')[0];
        // console.log('currentDate', currentDate);
        const scheduleRes = await AsyncStorage.getItem('scheduleDays')
        if (scheduleRes) {
            let scheduleDays = JSON.parse(scheduleRes)

            let newSchedules = [];
            for (let i = 0; i < 200; i++) {
                for (let j = 1; j <= 7; j++) {
                    if ((new Date(beginningDate)).getDay() === j && scheduleDays[j - 1].slots[0].startTime && scheduleDays[j - 1].slots[0].endTime) {
                        newSchedules[moment(beginningDate).format().split('T')[0]] = [];
                        scheduleDays[j - 1].slots.forEach(slotItem => {
                            newSchedules[moment(beginningDate).format().split('T')[0]]
                                .push({
                                    activeStartTime: slotItem.startTime,
                                    activeEndTime: slotItem.endTime,
                                    date: moment(beginningDate).format().split('T')[0]
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
    handleActiveDatePicked = (date) => {
        const MillisecondsAfterStartOfDay = date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000 + date.getMilliseconds();
        const newDate = new Date(date.getTime() - MillisecondsAfterStartOfDay);
        const { pickerFor } = this.state;
        if (pickerFor === 'start') {
            this.setState({ recurStartDate: newDate, recurDatePickerVisible: false });
        } else {
            this.setState({ recurEndDate: newDate, recurDatePickerVisible: false });
        }
    };

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
        console.log('schedules...', schedules);
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
                <Text style={[styles.textStyle, { color: colors.skyBlue }]}>{item.activeStartTime + ' to ' + item.activeEndTime}</Text>
            </TouchableOpacity>
        );
    }

    agendaPressed = (item) => {
        console.log('agendaPressed item--->', item)
        this.setState({ scheduleModalVisible: true, selectedItem: item })
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

    handleConfirmStartDate = (time) => {
    }
    handleConfirmEndDate = (time) => {
    }
    hideDatePicker = () => {

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

    confirmSchedulePress = () => {

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
                        onPress={this.confirmSchedulePress}
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
            schedules,
            loading,
            isDoctor,
            isStartTimePickerVisible,
            isEndTimePickerVisible
        } = this.state;
        return (
            <View style={styles.container}>
                <View style={scheduleModalVisible ? styles.containerGray : styles.container}>
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
                        mode="time"
                        isDarkModeEnabled
                        textColor='white'
                        headerTextIOS={isStartTimePickerVisible ? locales.selectStart : locales.selectEnd}
                        onConfirm={isStartTimePickerVisible ? this.handleConfirmStartDate : this.handleConfirmEndDate}
                        onCancel={this.hideDatePicker}
                    />
                    {
                        loading && <View style={styles.loader}>
                            <Loader />
                        </View>
                    }
                </View>
                {scheduleModalVisible && (
                    <View style={{ position: 'absolute', top: (height - 260) / 2, alignSelf: 'center', width: width - 20 }}>
                        {isDoctor ? this.renderModalDoctor() : this.renderModalPatient()}
                    </View>
                )
                }
            </View >
        );
    }
}