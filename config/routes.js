import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../src/screens/Home';
import { colors } from './colors';
import Doctor from '../src/screens/Doctor';
import CalendarScreen from '../src/screens/CalendarScreen';
import Schedule from '../src/screens/Schedule';


const AppContainer = createStackNavigator();

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <AppContainer.Navigator>
                <AppContainer.Screen
                    options={{
                        gestureEnabled: false,
                        headerStyle: { backgroundColor: colors.lightBlack },
                        headerTintColor: colors.white
                    }}
                    name="Login"
                    component={Home} />

                <AppContainer.Screen
                    options={{
                        gestureEnabled: false,
                        headerStyle: { backgroundColor: colors.lightBlack },
                        headerTintColor: colors.white
                    }}
                    name="Doctor"
                    component={Doctor} />

                <AppContainer.Screen
                    options={{
                        gestureEnabled: false,
                        headerStyle: { backgroundColor: colors.lightBlack },
                        headerTintColor: colors.white
                    }}
                    name="Calendar"
                    component={CalendarScreen} />

                <AppContainer.Screen
                    options={{
                        gestureEnabled: false,
                        headerStyle: { backgroundColor: colors.lightBlack },
                        headerTintColor: colors.white
                    }}
                    name="Schedule"
                    component={Schedule} />

            </AppContainer.Navigator>
        </NavigationContainer>
    )
}