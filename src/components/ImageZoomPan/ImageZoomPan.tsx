import React, { useRef, useEffect } from 'react';
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

  const currentScale = useRef(1);
  const currentTranslateX = useRef(0);
  const currentTranslateY = useRef(0);

  useEffect(() => {
    const scaleListenerId = scale.addListener(({ value }) => {
      currentScale.current = value;
    });
    const translateXListenerId = translateX.addListener(({ value }) => {
      currentTranslateX.current = value;
    });
    const translateYListenerId = translateY.addListener(({ value }) => {
      currentTranslateY.current = value;
    });

    return () => {
      scale.removeListener(scaleListenerId);
      translateX.removeListener(translateXListenerId);
      translateY.removeListener(translateYListenerId);
    };
  }, [scale, translateX, translateY]);

  // Pinch gesture
  const pinchGesture = Gesture.Pinch()
    .onStart(() => {
      scale.setOffset(currentScale.current);
      scale.setValue(1);
    })
    .onUpdate((e) => {
       scale.setValue(e.scale);
    })
    .onEnd(() => {
      scale.flattenOffset();
    });

  // Pan gesture
  const panGesture = Gesture.Pan()
    .onStart(() => {
      translateX.setOffset(currentTranslateX.current);
      translateY.setOffset(currentTranslateY.current);
      translateX.setValue(0);
      translateY.setValue(0);
    })
    .onUpdate((e) => {
      translateX.setValue(e.translationX);
      translateY.setValue(e.translationY);
    })
    .onEnd(() => {
      translateX.flattenOffset();
      translateY.flattenOffset();
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2).onTouchesUp(() => {
      // Reset to initial state on double tap
      scale.setValue(1);
      translateX.setValue(0);
      translateY.setValue(0);
      scale.setOffset(0);
      translateX.setOffset(0);
      translateY.setOffset(0);
    });

  const composedGesture = Gesture.Simultaneous(pinchGesture, panGesture, doubleTapGesture);

  return (
    <View style={[styles.container, style]}>
      <GestureDetector gesture={composedGesture}>
        <Animated.Image
          source={source}
          resizeMode="contain"
          style={[
            styles.image,
            {
              transform: [
                { translateX },
                { translateY },
                { scale },
              ],
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
