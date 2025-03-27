import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';

// 先创建占位的screen组件，后续会替换为实际的组件
const WhiteNoiseScreen = () => null;
const BreathingScreen = () => null;
const TimerScreen = () => null;
const StoryScreen = () => null;

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: '#121212',
                        borderTopColor: 'rgba(255, 255, 255, 0.1)',
                    },
                    tabBarActiveTintColor: '#6BD9A4',
                    tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.5)',
                }}
            >
                <Tab.Screen
                    name="WhiteNoise"
                    component={WhiteNoiseScreen}
                    options={{
                        title: '白噪音',
                    }}
                />
                <Tab.Screen
                    name="Breathing"
                    component={BreathingScreen}
                    options={{
                        title: '呼吸',
                    }}
                />
                <Tab.Screen
                    name="Timer"
                    component={TimerScreen}
                    options={{
                        title: '计时器',
                    }}
                />
                <Tab.Screen
                    name="Story"
                    component={StoryScreen}
                    options={{
                        title: '故事',
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}; 