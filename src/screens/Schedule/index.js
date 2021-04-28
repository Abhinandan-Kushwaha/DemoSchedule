import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert } from 'react-native';
import { styles } from './styles';
import { locales } from '../../../config/locales';
import Icon from 'react-native-vector-icons/FontAwesome';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

const Schedule = props => {
    const dd = [
        { day: 'Mon', slots: [{ startTime: '9 AM', endTime: '11 AM' }, { startTime: '3 PM', endTime: '5 PM' }] },
        { day: 'Tue', slots: [{}] },
        { day: 'Wed', slots: [{ startTime: '11 AM', endTime: '4 PM' }] },
        { day: 'Thu', slots: [{}] },
        { day: 'Fri', slots: [{ startTime: '9 AM', endTime: '5 PM' }] },
        { day: 'Sat', slots: [{}] },
        { day: 'Sun', slots: [{}] }
    ];
    const [days, setDays] = useState(dd);

    useEffect(() => {
        getDaysFromAsyncStore()
    }, [])

    const getDaysFromAsyncStore = async () => {
        const scheduleRes = await AsyncStorage.getItem('scheduleDays')
        if (scheduleRes) {
            // console.log('scheduleRes', JSON.parse(scheduleRes))
            setDays(JSON.parse(scheduleRes))
        }
    }

    const [isStartTimePickerVisible, setIsStartTimePickerVisible] = useState(false);
    const [isEndTimePickerVisible, setIsEndTimePickerVisible] = useState(false);
    const [selectedSlotIndex, setSelectedSlotIndex] = useState(0);
    const [selectedIndex, setSelectedIndex] = useState(0)

    const handleConfirmStartDate = (time) => {
        // console.log('time', time)
        // console.log('moment', moment(time).format('LT'))
        days[selectedIndex].slots[selectedSlotIndex].startTime = moment(time).format('LT')
        setDays([...days])
        AsyncStorage.setItem('scheduleDays', JSON.stringify(days))
        hideDatePicker();
    }
    const handleConfirmEndDate = (time) => {
        days[selectedIndex].slots[selectedSlotIndex].endTime = moment(time).format('LT')
        setDays([...days])
        AsyncStorage.setItem('scheduleDays', JSON.stringify(days))
        hideDatePicker();
    }
    const hideDatePicker = () => {
        setIsStartTimePickerVisible(false);
        setIsEndTimePickerVisible(false)
    }

    const onStartPressed = (item, slotIndex, index) => {
        if (item.startTime) {
            Alert.alert(
                'Choose Action',
                '',
                [
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            days[index].slots.splice(slotIndex, 1)
                            if (!days[index].slots.length) {
                                days[index].slots.push({})
                            }
                            setDays([...days])
                            AsyncStorage.setItem('scheduleDays', JSON.stringify(days))
                        }
                    },
                    {
                        text: 'Edit',
                        onPress: () => {
                            setSelectedIndex(index)
                            setSelectedSlotIndex(slotIndex)
                            setIsStartTimePickerVisible(true)
                        }
                    }
                ]
            )
        }
        else {
            setSelectedIndex(index)
            setSelectedSlotIndex(slotIndex)
            setIsStartTimePickerVisible(true)
        }
    }

    const onEndPressed = (item, slotIndex, index) => {
        if (item.endTime) {
            Alert.alert(
                'Choose Action',
                '',
                [
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => {
                            days[index].slots.splice(slotIndex, 1)
                            if (!days[index].slots.length) {
                                days[index].slots.push({})
                            }
                            setDays([...days])
                            AsyncStorage.setItem('scheduleDays', JSON.stringify(days))
                        }
                    },
                    {
                        text: 'Edit',
                        onPress: () => {
                            setSelectedIndex(index)
                            setSelectedSlotIndex(slotIndex)
                            setIsEndTimePickerVisible(true)
                        }
                    }
                ]
            )
        }
        else {
            setSelectedIndex(index)
            setSelectedSlotIndex(slotIndex)
            setIsEndTimePickerVisible(true)
        }
    }


    return (
        <View style={styles.container}>
            <FlatList
                data={days}
                renderItem={({ item, index }) => {
                    return (
                        <View style={styles.dayRow}>
                            <View style={styles.dayContainer}>
                                <Text style={styles.textStyle}>{item.day}</Text>
                            </View>
                            <View style={styles.rightColumn}>
                                <View style={styles.flex1}>
                                    {item.slots.map((slotItem, slotIndex) => {
                                        return (
                                            <View style={styles.innerRow}>
                                                <TouchableOpacity
                                                    onPress={() => onStartPressed(slotItem, slotIndex, index)}
                                                    style={slotItem.startTime ? styles.timeBoxSelected : styles.timeBox}>
                                                    <Text style={slotItem.startTime ? styles.textBlue : styles.textSmall}>
                                                        {slotItem.startTime || locales.selectStart}
                                                    </Text>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    onPress={() => onEndPressed(slotItem, slotIndex, index)}
                                                    style={slotItem.endTime ? styles.timeBoxSelected : styles.timeBox}>
                                                    <Text style={slotItem.endTime ? styles.textBlue : styles.textSmall}>
                                                        {slotItem.endTime || locales.selectEnd}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    })}
                                </View>

                                {(item.slots && item.slots.length && item.slots[item.slots.length - 1] && item.slots[item.slots.length - 1].startTime && item.slots[item.slots.length - 1].endTime) &&
                                    <Icon
                                        name='plus'
                                        color='white'
                                        size={16}
                                        onPress={() => {
                                            days[index].slots.push({})
                                            setDays([...days])
                                            AsyncStorage.setItem('scheduleDays', JSON.stringify(days))
                                        }}
                                        style={styles.plus} />}
                            </View>
                        </View>
                    )
                }}
                keyExtractor={(item, index) => index.toString()}
            />
            <DateTimePickerModal
                isVisible={isStartTimePickerVisible || isEndTimePickerVisible}
                mode="time"
                isDarkModeEnabled
                textColor='white'
                headerTextIOS={isStartTimePickerVisible ? locales.selectStart : locales.selectEnd}
                onConfirm={isStartTimePickerVisible ? handleConfirmStartDate : handleConfirmEndDate}
                onCancel={hideDatePicker}
            />
        </View>
    )
}

export default Schedule
