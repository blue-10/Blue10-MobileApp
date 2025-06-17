import type { StackCardInterpolationProps } from '@react-navigation/stack';
import { Animated } from 'react-native';

export const forSlideRightToLeft = ({ current, next, inverted, layouts: { screen } }: StackCardInterpolationProps) => {
  const progress = Animated.add(
    current.progress.interpolate({
      extrapolate: 'clamp',
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    next
      ? next.progress.interpolate({
          extrapolate: 'clamp',
          inputRange: [0, 1],
          outputRange: [0, 1],
        })
      : 0,
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              extrapolate: 'clamp',
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width, // Focused, but offscreen in the beginning
                0, // Fully focused
                screen.width * -0.3, // Fully unfocused
              ],
            }),
            inverted,
          ),
        },
      ],
    },
  };
};

export const forSlideLeftToRight = ({ current, next, inverted, layouts: { screen } }: StackCardInterpolationProps) => {
  const progress = Animated.add(
    current.progress.interpolate({
      extrapolate: 'clamp',
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    next
      ? next.progress.interpolate({
          extrapolate: 'clamp',
          inputRange: [0, 1],
          outputRange: [0, 1],
        })
      : 0,
  );

  return {
    cardStyle: {
      transform: [
        {
          translateX: Animated.multiply(
            progress.interpolate({
              extrapolate: 'clamp',
              inputRange: [0, 1, 2],
              outputRange: [
                screen.width * -0.3, // Fully unfocused
                0, // Fully focused
                screen.width, // Focused, but offscreen in the beginning
              ],
            }),
            inverted,
          ),
        },
      ],
    },
  };
};
