import React, { Component } from 'react';
import {
    TextInput,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    SectionList,
    FlatList,
    Alert
} from 'react-native';
import { Agenda } from 'react-native-calendars';
import DateTimePicker from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { BlurView } from '@react-native-community/blur';
import { styles } from './styles';
import Loader from '../../components/Loader';
import { getDateWithDaysAdded, getDateAndTime, getFormattedDate, timeToString } from '../../lib';
import moment from 'moment';

const { height } = Dimensions.get('window');
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default class CalendarScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scheduleModalVisible: false,
            recurDatePickerVisible: false,
            // currentUser: {},

            recurrence: 'Custom',
            weekDays: [
                { day: 'Sun', selected: false },
                { day: 'Mon', selected: false },
                { day: 'Tue', selected: false },
                { day: 'Wed', selected: false },
                { day: 'Thu', selected: false },
                { day: 'Fri', selected: false },
                { day: 'Sat', selected: false },
            ],
            search: '',
            memberList: [],
            memberSearchBarVisible: false,

            schedules: [],

            //details of a schedule (these will be saved in the schedules array)
            startTime: new Date(),
            endTime: new Date(),
            recurStartDate: '',
            recurEndDate: '',
            members: [],
            activeDays: [],

            //Picker
            selectedStartTime: null,
            selectedEndTime: null,
            groupName: '',
            adminIds: []
        };
    }

    // componentDidMount = async () => {
    //     const lightTheme = EStyleSheet.value('$theme') === 'light';
    //     this.setState({ lightTheme });
    //     const { navigation } = this.props;
    //     const defaultMembers = navigation.getParam('members');
    //     const isScreenEditable = navigation.getParam('isScreenEditable');
    //     const onCallGroupName = navigation.getParam('onCallGroupName');
    //     this.setState({ defaultMembers, isScreenEditable, onCallGroupName });
    //     const usrRes = await getCurrentUser();
    //     console.log('user', usrRes.user);
    //     this.setState({ currentUser: usrRes.user });
    //     // this.loadSchedulesFromDatabase();
    // }

    onBackPress = () => {
        const { navigation } = this.props;
        navigation.goBack();
    };

    recurStartDatePressed = () => {
        const { recurDatePickerVisible } = this.state;
        this.setState({
            recurDatePickerVisible: !recurDatePickerVisible,
            pickerFor: 'start'
        });
    };
    recurEndDatePressed = () => {
        const { recurDatePickerVisible } = this.state;
        this.setState({
            recurDatePickerVisible: !recurDatePickerVisible,
            pickerFor: 'end'
        });
    };

    startTimePressed = () => {
        const { startTimePickerVisible } = this.state;
        this.setState({
            startTimePickerVisible: !startTimePickerVisible,
            pickerFor: 'start'
        });
    };
    endTimePressed = () => {
        const { endTimePickerVisible } = this.state;
        this.setState({ endTimePickerVisible: !endTimePickerVisible, pickerFor: 'end' });
    };

    cancelSchedulePress = () => {
        const { defaultMembers } = this.state;
        defaultMembers.forEach(defaultMember => defaultMember.activated = false);
        this.setState({ scheduleModalVisible: false, selectedStartTime: null, selectedEndTime: null, members: defaultMembers });
    };

    confirmSchedulePress = async () => {
    }

    removeSchedulePress = () => {
    };

    onMembersPressed = () => {
        this.setState({ memberModalVisible: true });
    };

    memberConfirmPress = () => {
        //this.onClearSearch();
        this.setState({ memberModalVisible: false, memberList: [], memberSearchBarVisible: false, });
    };

    getSearchResult = () => {
        const { navigation } = this.props;
        const loggedInId = navigation.getParam('loggedInId');
        const { search, members } = this.state;
        let filteredUsers = [];
        members.forEach((user) => {
            if (
                (user.lastName.startsWith(search) ||
                    user.firstName.startsWith(search))
            ) {
                filteredUsers.push(user);
            }
        });
        return filteredUsers;
    };


    onAddMemberChange = async (input) => {
        this.setState({ addMemberText: input, search: '' });
        if (input && input.trim().length > 0) {
            let result = await getCoworkersBySearch(input.trim());
            let memberList = result.users;
            //memberList.push(userObj);
            this.setState({ memberList });
        } else {
            this.setState({ memberList: [] });
        }
    };

    onRemoveMemberPress = (id) => {
        let { members } = this.state;
        members = members.filter((member) => member.id !== id);
        this.setState({ members });
    };

    onCoworkerItemPress = async (member) => {
        this.setState({
            loading: true
        });;
        let { members, defaultMembers } = this.state;
        let res = { status: 'success' };

        if (!defaultMembers.some(defaultMember => defaultMember.id === member.id)) {
            //Add member to the on call group
            const { navigation } = this.props;
            const onCallGroupId = navigation.getParam('onCallGroupId');
            res = await addMemberToOncallGroup(onCallGroupId, member);
        }

        if (res.status === 'success') {
            member.activated = !member.activated;
            members.push(member);
            this.setState({
                members,
            });
        }
        this.setState({
            loading: false,
            search: '',
            addMemberText: '',
            memberList: []
        })
    };

    activateMember = id => {
        //console.log('id--------', id);
        let { members } = this.state;
        members.forEach(member => member.id === id ? member.activated = !member.activated : member.activated = member.activated)
        this.setState({ members });
    }

    renderMemberModal = () => {
        const { lightTheme, members, addMemberText, search, memberList, memberSearchBarVisible } = this.state;
        return (
            <View style={styles.memberModalStyle}>
                <View style={styles.recurrenceHeaderStyle}>
                    <Text style={styles.headerTextStyle}>Members</Text>
                </View>
                <View style={styles.controlsContentStyle}>
                    <View style={styles.paddingHorzTen}>
                        {/* {memberSearchBarVisible && <Search
              search={search}
              onSearchTextChange={this.onSearchTextChange}
              onClearSearch={this.onClearSearch}
              simpleBar
              showFilters={false}
            />} */}
                        {/* {search.trim().length > 0 && (
                            <SectionList
                                style={styles.memberModalList}
                                renderItem={({ item }) => (
                                    <SectionListItem
                                        user={item}
                                        mugIcon
                                        onPress={() => this.activateMember(item.id)}
                                        isAdmin
                                        onRemoveUserPress={() => this.onRemoveMemberPress(item.id)}
                                        backgroundColor={EStyleSheet.value('$theme') === 'dark'
                                            ? 'rgb(32,32,33)'
                                            : 'white'}
                                    />
                                )}
                                sections={getSectionListData(this.getSearchResult())}
                                listKey={(item, index) => item + index}
                            />
                        )} */}
                        {search.trim().length === 0 && (
                            <View style={styles.addMemberRow}>
                                <Icon name='user-alt' color='#444445' size={18} />
                                <TextInput
                                    style={styles.addMemberStyle}
                                    placeholder='Add Member'
                                    value={addMemberText}
                                    onChangeText={this.onAddMemberChange}
                                    placeholderTextColor='#444445'
                                    keyboardAppearance={lightTheme ? 'light' : 'dark'}
                                />
                                {/* {!memberSearchBarVisible &&
                  <Icon
                    onPress={this.searchIconPress}
                    name="search"
                    color="white"
                    size={20}
                    style={{ position: 'absolute', right: 10 }} />} */}
                            </View>
                        )}
                        {memberList && memberList.length > 0 && (
                            <FlatList
                                style={styles.memberModalList}
                                keyboardShouldPersistTaps='handled'
                                data={memberList}
                                listKey={(item) => item.id}
                                renderItem={({ item }) => {
                                    return (
                                        <Text>name</Text>
                                        // <CoworkerItem
                                        //     coworker={item}
                                        //     onCoworkerItemPress={this.onCoworkerItemPress}
                                        // />
                                    );
                                }}
                            />
                        )}

                        {/* {members &&
                            members.length > 0 &&
                            search.trim().length === 0 &&
                            memberList &&
                            memberList.length === 0 && (
                                <SectionList
                                    style={styles.memberModalList}
                                    renderItem={({ item }) => (
                                        <SectionListItem
                                            user={item}
                                            mugIcon
                                            onPress={() => this.activateMember(item.id)}
                                            onRemoveUserPress={() =>
                                                this.onRemoveMemberPress(item.id)
                                            }
                                            backgroundColor={EStyleSheet.value('$theme') === 'dark'
                                                ? 'rgb(32,32,33)'
                                                : 'white'}
                                        //disableSwipe={!editable}
                                        />
                                    )}
                                    // renderSectionHeader={({ section: { title } }) => (
                                    //   <SectionListHeader rounded={true} text={title} />
                                    // )}
                                    sections={getSectionListData(members)}
                                    listKey={(item, index) => item + index}
                                />
                            )} */}
                    </View>
                </View>
                <View style={styles.buttonSection}>
                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={this.memberConfirmPress}
                    >
                        <Text style={styles.buttonText}>Done</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    renderModalBody = () => {
        const {
            currentTitle,
            startTime,
            endTime,
            selectedStartTime,
            selectedEndTime,
            recurStartDate,
            recurrence,
            recurrenceModalVisible,
            daysPassedFromInitial,
            editMode,
            isStartOfSchedule
        } = this.state;
        return (
            <View>
                <View style={styles.titleStyle}>
                    <Text style={styles.titleTextStyle}>{!editMode ? 'Add Schedule' : currentTitle}</Text>
                </View>

                <View style={styles.row}>
                    <View>
                        <Text style={styles.leftText}>Start Time</Text>
                    </View>
                    <View style={styles.right}>
                        <TouchableOpacity
                            disabled={recurrenceModalVisible}
                            onPress={this.startTimePressed}
                            style={styles.right}
                        >
                            <Text style={styles.rightBlueText}>
                                {selectedStartTime ? getDateAndTime(selectedStartTime) : editMode && !isStartOfSchedule ? getDateWithDaysAdded(recurStartDate, daysPassedFromInitial, startTime) : getDateAndTime(startTime)}
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
                            disabled={recurrenceModalVisible}
                            onPress={this.endTimePressed}
                            style={styles.right}
                        >
                            <Text style={styles.rightBlueText}>
                                {selectedEndTime ? getDateAndTime(selectedEndTime) : editMode && !isStartOfSchedule ? getDateWithDaysAdded(recurStartDate, daysPassedFromInitial, endTime) : getDateAndTime(endTime)}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.leftText}>Recurrence</Text>
                    </View>
                    <View style={styles.right}>
                        <TouchableOpacity
                            disabled={recurrenceModalVisible}
                            onPress={this.recurrencePressed}
                            style={styles.right}
                        >
                            <Text style={styles.rightBlueText}>{recurrence}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.leftText}>Members</Text>
                    </View>
                    <View style={styles.right}>
                        <TouchableOpacity
                            disabled={recurrenceModalVisible}
                            onPress={this.onMembersPressed}
                            style={styles.right}
                        >
                            <Text style={styles.rightBlueText}>{'Custom'}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }

    // renderModal = () => {
    //     const {
    //         startTimePickerVisible,
    //         endTimePickerVisible,
    //         recurDatePickerVisible,
    //         recurrenceModalVisible,
    //         memberModalVisible,
    //         selectedStartTime,
    //         selectedEndTime,
    //         startTime,
    //         endTime,
    //         editMode,
    //         lightTheme
    //     } = this.state;
    //     return (
    //         <View style={styles.modalContainer}>
    //             {recurrenceModalVisible || memberModalVisible
    //                 ?
    //                 (<BlurView
    //                     blurType="light"
    //                     blurAmount={100}
    //                 >
    //                     {this.renderModalBody()}
    //                 </BlurView>)
    //                 :
    //                 (<View>
    //                     {this.renderModalBody()}
    //                 </View>)
    //             }
    //             {recurrenceModalVisible && (
    //                 <View style={styles.pickerStyle}>{this.renderRecurrenceModal()}</View>
    //             )}
    //             {memberModalVisible && (
    //                 <View style={styles.memberModalContainerStyle}>
    //                     {this.renderMemberModal()}
    //                 </View>
    //             )}
    //             <DateTimePicker
    //                 isVisible={startTimePickerVisible || endTimePickerVisible || recurDatePickerVisible}
    //                 onConfirm={
    //                     startTimePickerVisible ?
    //                         this.handleStartTimePicked :
    //                         endTimePickerVisible ?
    //                             this.handleEndTimePicked :
    //                             this.handleActiveDatePicked}
    //                 onCancel={this.hideDateTimePicker}
    //                 date={
    //                     startTimePickerVisible ?
    //                         selectedStartTime :
    //                         endTimePickerVisible ?
    //                             selectedEndTime :
    //                             new Date()
    //                 }
    //                 mode={recurDatePickerVisible ? 'date' : 'datetime'}
    //                 isDarkModeEnabled={!lightTheme}
    //                 style={lightTheme ? { backgroundColor: 'white' } : { backgroundColor: '#8899aa' }}
    //             />
    //             {/* <DateTimePicker
    //       // maximumDate={new Date(startTime.getTime() + 24 * 60 * 60 * 1000 - 1)} //maximium 24 hours slot allowed
    //       isVisible={endTimePickerVisible}
    //       onConfirm={this.handleEndTimePicked}
    //       onCancel={this.hideEndTimeTimePicker}
    //       date={selectedEndTime}
    //       mode='datetime'
    //       isDarkModeEnabled={true}
    //       style={{ backgroundColor: 'gray' }}
    //     />
    //     <DateTimePicker
    //       isVisible={recurDatePickerVisible}
    //       onConfirm={this.handleActiveDatePicked}
    //       onCancel={this.hideActiveDateTimePicker}
    //       mode='date'
    //       isDarkModeEnabled={true}
    //       style={{ backgroundColor: 'gray' }}
    //     /> */}

    //             {recurrenceModalVisible || memberModalVisible
    //                 ?
    //                 (<BlurView
    //                     blurType="light"
    //                     blurAmount={100}
    //                     style={styles.buttonSection}>
    //                 </BlurView>)
    //                 :
    //                 (<View
    //                     style={styles.buttonSection}>
    //                     {!recurrenceModalVisible && <TouchableOpacity
    //                         style={styles.cancelButton}
    //                         onPress={this.cancelSchedulePress}
    //                     >
    //                         <Text style={styles.buttonTextGrey}>Cancel</Text>
    //                     </TouchableOpacity>}

    //                     {!recurrenceModalVisible && editMode && (<TouchableOpacity
    //                         style={styles.deleteButton}
    //                         onPress={this.removeSchedulePress}
    //                     >
    //                         <Text style={styles.buttonText}>Remove</Text>
    //                     </TouchableOpacity>)
    //                     }

    //                     {!recurrenceModalVisible && <TouchableOpacity
    //                         style={styles.confirmButton}
    //                         onPress={this.confirmSchedulePress}
    //                     >
    //                         <Text style={styles.buttonText}>Confirm</Text>
    //                     </TouchableOpacity>}
    //                 </View>)
    //             }
    //         </View>
    //     );
    // };

    recurrencePressed = () => {
        const { recurrenceModalVisible } = this.state;
        this.setState({ recurrenceModalVisible: !recurrenceModalVisible });
    };

    recurrenceCancelPress = () => {
        this.setState({ recurrenceModalVisible: false });
    };

    recurrenceConfirmPress = () => {
        let { recurStartDate, recurEndDate, startTime, activeDays } = this.state;
        if (!recurStartDate) {
            this.setState({
                popupVisible: true,
                popupTitle: 'Please select Start Date!',
                popupButton1: 'Okay'
            });
            return;
        }
        if (recurEndDate) {
            let recurStartMilliseconds = new Date(recurStartDate).getTime();
            let recurEndMilliseconds = new Date(recurEndDate).getTime();
            if (recurEndMilliseconds < recurStartMilliseconds) {
                this.setState({
                    popupVisible: true,
                    popupTitle: 'End date cannot be before Start date!',
                    popupButton1: 'Okay'
                })
                return;
            }
        }
        else {
            this.setState({
                popupVisible: true,
                popupTitle: 'Please select End Date!',
                popupButton1: 'Okay'
            })
            return;
        }

        if (!activeDays || activeDays.length < 1) {
            this.setState({
                popupVisible: true,
                popupTitle: 'Please select At least one active day!',
                popupButton1: 'Okay'
            });
            return;
        }

        this.setState({ recurrenceModalVisible: false });
    };

    closeFrequencyPicker = () => {
        this.setState({ frequencyPickerVisible: false });
    };

    weekDayPressed = (weekDay) => {
        let { activeDays } = this.state;
        const ind = activeDays.indexOf(weekDay.day);
        if (ind === -1) {
            activeDays.push(weekDay.day);
        }
        else {
            activeDays.splice(ind, 1);
        }
        this.setState({ activeDays });
    };

    renderWeekDays = () => {
        let { weekDays, activeDays } = this.state;
        weekDays.forEach(weekDay => {
            if (activeDays.includes(weekDay.day)) {
                weekDay.selected = true;
            }
            else {
                weekDay.selected = false;
            }
        })
        return (
            <View style={styles.weekDaysContainer}>
                {weekDays.map((weekDay) => {
                    return (
                        <TouchableOpacity
                            style={
                                weekDay.selected
                                    ? styles.weekdayButtonSelected
                                    : styles.weekdayButton
                            }
                            onPress={() => this.weekDayPressed(weekDay)}
                        >
                            <Text
                                style={
                                    weekDay.selected
                                        ? styles.weekDayTextSelected
                                        : styles.weekDayText
                                }
                            >
                                {weekDay.day.charAt(0)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        );
    };

    renderRecurrenceModal = () => {
        const { startTime, endTime, recurStartDate, recurEndDate } = this.state;
        return (
            <View style={styles.recurrenceModalStyle}>
                <View style={styles.recurrenceHeaderStyle}>
                    <Text style={styles.headerTextStyle}>Custom Recurrence</Text>
                </View>
                {this.renderWeekDays()}
                <View style={styles.row}>
                    <View>
                        <Text style={styles.leftText}>Start Date</Text>
                    </View>
                    <View style={styles.right}>
                        <TouchableOpacity
                            onPress={this.recurStartDatePressed}
                            style={styles.right}
                        >
                            <Text style={styles.rightBlueText}>
                                {recurStartDate ? getFormattedDate(recurStartDate) : 'Select'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.row}>
                    <View>
                        <Text style={styles.leftText}>End Date</Text>
                    </View>
                    <View style={styles.right}>
                        <TouchableOpacity
                            onPress={this.recurEndDatePressed}
                            style={styles.right}
                        >
                            <Text style={styles.rightBlueText}>
                                {recurEndDate ? getFormattedDate(recurEndDate) : 'Select'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.buttonSection}>
                    <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={this.recurrenceCancelPress}
                    >
                        <Text style={styles.buttonTextGrey}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.confirmButton}
                        onPress={this.recurrenceConfirmPress}
                    >
                        <Text style={styles.buttonText}>Confirm</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
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


    render() {
        const {
            onCallGroupName,
            scheduleModalVisible,
            schedules,
            loading,
            isScreenEditable } = this.state;
        return (
            <View style={styles.container}>
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
                {/* {scheduleModalVisible && (
                    <View
                        style={{
                            position: 'absolute',
                            top: height / 2 - 150,
                            width: '100%'
                        }}
                    >
                        {this.renderModal()}
                    </View>
                )} */}
                {/* {isScreenEditable && <TouchableOpacity
                    style={styles.floatingButton}
                    onPress={() => this.onAddAgendaPress(new Date())}>
                    <Icon name='plus' size={20} color='white' />
                </TouchableOpacity>} */}
                {
                    loading && <View style={styles.loader}>
                        <Loader />
                    </View>
                }
            </View>
        );
    }

    loadItems = async day => {
        let { schedules } = this.state;
        for (let i = -50; i < 50; i++) {
            const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            const strTime = timeToString(time);
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
        })
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

            <View
                style={styles.padding10}>
                <TouchableOpacity
                    // disabled={isPast || !isScreenEditable}
                    onPress={() => this.agendaPressed(item)}
                >
                    <Text style={styles.textStyle}>{item.name || 'na'}</Text>
                    {
                        noMember && !isMultiDaySlot &&
                        <Text style={styles.textStyle2}>No members scheduled for this time block</Text>
                    }
                </TouchableOpacity>
                {
                    ((members && members.length > 0) || isMultiDaySlot) && (
                        <View style={styles.memberContainer}>
                            <TouchableOpacity
                                disabled={isPast || !isScreenEditable}
                                onPress={() => this.agendaPressed(item)}
                                style={styles.memberHeader}>
                                {!noMember &&
                                    <>
                                        <Icon name='mug-hot' color='rgb(52,108,240)' size={14} />
                                        <Text style={[styles.textStyle, styles.paddingLeft5, !isMultiDaySlot && { width: '100%' }]}>Members</Text>
                                    </>
                                }
                                {isPast && <Icon name="clock" solid color='#31922e' style={styles.paddingLeft5} size={14} />}
                                {isPast && <Text style={[styles.textStyle, styles.paddingLeft5]}>Completed</Text>}
                                {!isPast && isMultiDaySlot && <Icon name="clock" solid color='#4284f3' style={styles.paddingLeft5} size={14} />}
                                {!isPast && isMultiDaySlot && <Text style={[styles.textStyle, styles.paddingLeft5]}>{isEndOfMultiDaySlot ? 'Starts previous day' : 'Extends to next day'}</Text>}
                            </TouchableOpacity>
                            {!isPast && <TouchableOpacity
                                disabled={!isScreenEditable}
                                onPress={() => this.agendaPressed(item)}
                                style={styles.memberNames}>
                                <FlatList
                                    data={members.filter(memberItem => memberItem.activated)}
                                    horizontal
                                    renderItem={(member) => {
                                        return (
                                            <Text style={styles.memberTextStyle}>
                                                {this.getFullName(member.item)}
                                            </Text>
                                        );
                                    }}
                                />
                            </TouchableOpacity>}
                            {
                                noMember &&
                                <Text style={styles.textStyle2}>No members scheduled for this time block</Text>
                            }
                        </View>
                    )

                }
            </View>
        );
    }

    agendaPressed = (item) => {
        console.log('agendaPressed item--->', item)
    };

    onAddAgendaPress = (strDate) => {
        let { schedules, defaultMembers } = this.state;
        defaultMembers.forEach(defaultMember => defaultMember.activated = false);
        let strTime = timeToString(strDate);
        this.setState({
            title: 'Add Schedule',
            scheduleModalVisible: true,
            selectedDate: strTime,
            startTime: strDate,
            endTime: strDate,
            selectedStartTime: strDate,
            selectedEndTime: strDate,
            recurStartDate: '',
            recurEndDate: '',
            members: defaultMembers,
            activeDays: [],
            editMode: false,
            selectedIndex: schedules[strTime].length
        });
    };

    renderEmptyDate(item) {
        return (
            <TouchableOpacity
                onPress={() => this.agendaPressed(item)}
                style={styles.emptyDate}>
                <Text style={styles.textStyle}>No one scheduled for this day</Text>
            </TouchableOpacity>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }
}