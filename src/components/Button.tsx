import React from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    TouchableOpacityProps,
    ViewStyle,
    TextStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import Animated, {
    useAnimatedStyle,
    withSpring,
    useSharedValue,
} from 'react-native-reanimated';
import { theme } from '../theme/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps extends TouchableOpacityProps {
    title: string;
    variant?: 'primary' | 'secondary';
    size?: 'small' | 'medium' | 'large';
    style?: ViewStyle;
    textStyle?: TextStyle;
}

export const Button = ({
    title,
    variant = 'primary',
    size = 'medium',
    style,
    textStyle,
    onPress,
    ...props
}: ButtonProps) => {
    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const handlePress = async () => {
        scale.value = withSpring(theme.animation.pressScale, {}, () => {
            scale.value = withSpring(1);
        });
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.();
    };

    return (
        <AnimatedTouchable
            style={[
                styles.button,
                styles[variant],
                styles[size],
                style,
                animatedStyle,
            ]}
            onPress={handlePress}
            {...props}
        >
            <Text style={[
                styles.text,
                styles[`${variant}Text`],
                styles[`${size}Text`],
                textStyle,
            ]}>
                {title}
            </Text>
        </AnimatedTouchable>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: theme.borderRadius.button,
        alignItems: 'center',
        justifyContent: 'center',
    },
    primary: {
        backgroundColor: theme.colors.primary,
    },
    secondary: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: theme.colors.secondary,
    },
    small: {
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
    },
    medium: {
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.md,
    },
    large: {
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
    },
    text: {
        ...theme.typography.body,
    },
    primaryText: {
        color: theme.colors.background,
    },
    secondaryText: {
        color: theme.colors.secondary,
    },
    smallText: {
        fontSize: theme.typography.caption.fontSize,
    },
    mediumText: {
        fontSize: theme.typography.body.fontSize,
    },
    largeText: {
        fontSize: theme.typography.title.fontSize,
    },
}); 