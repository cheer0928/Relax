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
        // @ts-ignore
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
// 修复主题样式以确保符合 TextStyle
const typographyBody: TextStyle = {
    fontSize: theme.typography.body.fontSize,
    fontWeight: getValidFontWeight(theme.typography.body.fontWeight), // 调用函数获取合法值
};

// 辅助函数：确保 fontWeight 是合法值
function getValidFontWeight(fontWeight?: string): TextStyle['fontWeight'] {
    const validFontWeights: TextStyle['fontWeight'][] = [
        'normal',
        'bold',
        '100',
        '200',
        '300',
        '400',
        '500',
        '600',
        '700',
        '800',
        '900',
    ];
    return validFontWeights.includes(fontWeight as any) ? (fontWeight as TextStyle['fontWeight']) : 'normal';
}


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
        ...typographyBody,
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