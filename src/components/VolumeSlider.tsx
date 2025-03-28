import React from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedGestureHandler,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import { theme } from '../theme/theme';

interface VolumeSliderProps {
    onVolumeChange: (volume: number) => void;
    initialVolume?: number;
}

type GestureContext = {
    startX: number;
    [key: string]: any;
};

export const VolumeSlider = ({
    onVolumeChange,
    initialVolume = 1,
}: VolumeSliderProps) => {
    const translateX = useSharedValue(initialVolume * 200);

    const panGestureEvent = useAnimatedGestureHandler<PanGestureHandlerGestureEvent, GestureContext>({
        onStart: (_, context) => {
            context.startX = translateX.value;
        },
        onActive: (event, context) => {
            let newValue = context.startX + event.translationX;
            newValue = Math.max(0, Math.min(newValue, 200));
            translateX.value = newValue;
        },
        onEnd: () => {
            translateX.value = withSpring(translateX.value);
        },
    });

    const rStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    React.useEffect(() => {
        const volume = translateX.value / 200;
        onVolumeChange(volume);
    }, [translateX.value, onVolumeChange]);

    return (
        <View style={styles.container}>
            <View style={styles.track}>
                <Animated.View style={[styles.fill, { width: translateX.value }]} />
            </View>
            <PanGestureHandler onGestureEvent={panGestureEvent}>
                <Animated.View style={[styles.thumb, rStyle]} />
            </PanGestureHandler>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 40,
        width: '100%',
        justifyContent: 'center',
    },
    track: {
        height: 4,
        width: 200,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.button,
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
    },
    thumb: {
        position: 'absolute',
        width: 20,
        height: 20,
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.circle,
        transform: [{ translateX: -10 }],
    },
});
