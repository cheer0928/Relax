import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  useSharedValue,
  withDelay,
} from 'react-native-reanimated';
import { theme } from '../theme/theme';

interface WaveformAnimationProps {
  isPlaying: boolean;
}

const BAR_COUNT = 5;
const ANIMATION_DURATION = 1000;

export const WaveformAnimation = ({ isPlaying }: WaveformAnimationProps) => {
  const bars = Array(BAR_COUNT).fill(0).map((_, index) => {
    const height = useSharedValue(20);

    React.useEffect(() => {
      if (isPlaying) {
        height.value = withDelay(
          index * 200,
          withRepeat(
            withSequence(
              withTiming(60, { duration: ANIMATION_DURATION }),
              withTiming(20, { duration: ANIMATION_DURATION })
            ),
            -1
          )
        );
      } else {
        height.value = withTiming(20, { duration: 300 });
      }
    }, [isPlaying]);

    const animatedStyle = useAnimatedStyle(() => ({
      height: height.value,
    }));

    return (
      <Animated.View
        key={index}
        style={[styles.bar, animatedStyle]}
      />
    );
  });

  return (
    <View style={styles.container}>
      {bars}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 100,
    marginVertical: theme.spacing.xl,
  },
  bar: {
    width: 4,
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.button,
    marginHorizontal: theme.spacing.xs,
  },
}); 