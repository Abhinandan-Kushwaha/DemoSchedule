import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from './styles';
import { locales } from '../../../config/locales';
import Icon from 'react-native-vector-icons/FontAwesome';

Icon.loadFont();

const Home = props => {
    const onButtonPress = () => {
        props.navigation.navigate('Calendar')
    }
    const onButtonPressDoctor = () => {
        props.navigation.navigate('Doctor')
    }
    return (
        <View style={styles.container}>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={onButtonPressDoctor}
                    style={styles.button}>
                    <Text style={styles.textStyle}>{locales.loginAsDoctor}</Text>
                    <Icon name='stethoscope' size={22} style={{ marginLeft: 12 }} color='white' />
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <TouchableOpacity
                    onPress={onButtonPress}
                    style={styles.button}>
                    <Text style={styles.textStyle}>{locales.loginAsPatient + ' 1'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onButtonPress}
                    style={styles.button}>
                    <Text style={styles.textStyle}>{locales.loginAsPatient + ' 2'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onButtonPress}
                    style={styles.button}>
                    <Text style={styles.textStyle}>{locales.loginAsPatient + ' 3'}</Text>
                </TouchableOpacity>
            </View>
        </View >
    )
}

export default Home