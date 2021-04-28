import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './styles';
import { locales } from '../../../config/locales';
import Icon from 'react-native-vector-icons/FontAwesome';

const Doctor = props => {
    const onSchedulePress = () => {
        props.navigation.navigate('Schedule')
    }
    const onCalendarPress = () => {
        props.navigation.navigate('Calendar')
    }
    return (
        <View style={styles.container}>
            <Text style={styles.instructionStyle}>{locales.selectAction}</Text>

            <TouchableOpacity
                onPress={onSchedulePress}
                style={styles.button}>
                <Text style={styles.textStyle}>{locales.createEditSchedule}</Text>
                <Icon name='pencil' size={20} style={{ marginLeft: 12 }} color='white' />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onCalendarPress}
                style={styles.button}>
                <Text style={styles.textStyle}>{locales.viewCalendar}</Text>
                <Icon name='calendar' size={20} style={{ marginLeft: 12 }} color='white' />
            </TouchableOpacity>
        </View>
    )
}

export default Doctor
