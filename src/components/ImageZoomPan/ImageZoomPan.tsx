import React, { useRef } from 'react';
import type { ImageProps, ViewStyle } from 'react-native';
import { Animated, View, StyleSheet } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';

type Props = {
  source: ImageProps['source'];
  style?: ViewStyle;
};

export const ImageZoomPan: React.FC<Props> = ({ source, style }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;

  // Pinch gesture using Gesture API
  const pinchGesture = Gesture.Pinch()
    .onUpdate((e) => {
      Animated.spring(scale, {
        toValue: e.scale,
        useNativeDriver: true,
        friction: 5,
        tension: 70,
      }).start();
    })
    .onEnd(() => {
      scale.flattenOffset();
    });

  // Pan gesture using Gesture API
  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.setValue(e.translationX);
      translateY.setValue(e.translationY);
    })
    .onEnd(() => {
      translateX.flattenOffset();
      translateY.flattenOffset();
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture);

  return (
    <View style={[styles.container, style]}>
      <GestureDetector gesture={composedGesture}>
        <Animated.Image
          source={source}
          resizeMode="contain"
          style={[
            styles.image,
            {
              transform: [{ scale }, { translateX }, { translateY }],
            },
          ]}
        />
      </GestureDetector>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
