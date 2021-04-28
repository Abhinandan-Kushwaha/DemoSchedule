import { Dimensions, Platform, AsyncStorage } from 'react-native';
import moment from 'moment';

export const getDateAndTime = (date) => {
    return moment(date).format('MMM Do YYYY, h:mm a');
};

export const getDateWithDaysAdded = (date, daysPassedFromInitial, time) => {
    date.setHours(time.getHours());
    date.setMinutes(time.getMinutes());
    if (daysPassedFromInitial)
        return moment(date.getTime() + daysPassedFromInitial * 24 * 3600000).format(
            'MMM Do YYYY, h:mm a'
        );
    return moment(date).format('MMM Do YYYY, h:mm a');
};

export const getFormattedDate = (date) => {
    return moment(date).format('MMM Do YYYY');
};

export const getScheduleName = (scheduleObj) => {
    const { startTime, endTime, type } = scheduleObj;
    let newEndTime = new Date(endTime);
    let newStartTime = new Date(startTime);
    if (type) {
        if (type === 'startOfMultiDaySlot') {
            newEndTime = new Date(startTime);
            newEndTime.setHours(23);
            newEndTime.setMinutes(59);
            // console.log('newEndTime', newEndTime);
        }
        else if (type === 'endOfMultiDaySlot') {
            newStartTime = new Date(endTime);
            newStartTime.setHours(0);
            newStartTime.setMinutes(0);
            // console.log('newStartTime', newStartTime);
        }
    }
    let name = getTime(newStartTime) + ' to ' + getTime(newEndTime);

    const durationInMinutes = Math.round((newEndTime - newStartTime) / 60000);
    const hours = Math.floor(durationInMinutes / 60);

    const minutes = durationInMinutes % 60;
    if (hours == 0) {
        name = name + ' (' + minutes + ' minutes)';
    } else {
        if (minutes === 0) {
            name = name + ' (' + hours + ' hours)';
        } else {
            name = name + ' (' + hours + ' hours, ' + minutes + ' minutes)';
        }
    }
    return name;
};

export const timeToString = (time) => {
    return moment(time)
        .format()
        .split('T')[0];
};

export const get24Hour = time => {
    if (!time) return '';
    time = time.trim()
    if (time.endsWith('PM')) {
        time = time.substring(0, time.indexOf('PM') - 1)
        if (time.indexOf(':') !== -1) {
            let times = time.split(':')
            // time = ((parseInt(times[0]) + 12) % 24) + ':' + (times[1])
            return { hrs: (parseInt(times[0]) + 12) % 24, mins: parseInt(times[1]) }
        }
        time = (parseInt(time) + 12) % 24
        return { hrs: time, mins: 0 }
    }
    if (time.indexOf(':') !== -1) {
        let times = (time.substring(0, time.indexOf('AM') - 1)).split(':')
        return { hrs: parseInt(times[0]), mins: parseInt(times[1]) }
    }
    time = time.substring(0, time.indexOf('AM') - 1)
    return { hrs: parseInt(time), mins: 0 }
}

export const deepCopy = obj => {
    let newObj = {};
    if (Array.isArray(obj)) {
        newObj = []
    }

    Object.keys(obj).map((keyItem) => {
        if (typeof obj[keyItem] === "object") {
            newObj[keyItem] = deepCopy(obj[keyItem]);
        } else {
            newObj[keyItem] = obj[keyItem];
        }
    });
    return newObj;
}

export const getDayNumber = (day) => {
    switch (day) {
        case 'Sun':
            return 0;
        case 'Mon':
            return 1;
        case 'Tue':
            return 2;
        case 'Wed':
            return 3;
        case 'Thu':
            return 4;
        case 'Fri':
            return 5;
        case 'Sat':
            return 6;
    }
};
