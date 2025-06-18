import React from 'react';
import { createRef, useRef, useState } from 'react';
import type { ImageProps, ViewStyle } from 'react-native';
import { Animated, View } from 'react-native';
import type { HandlerStateChangeEvent } from 'react-native-gesture-handler';
import { GestureHandlerRootView, PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';

// code from: https://dev.to/naderalfakesh/react-native-dealing-with-images-loading-viewing-zooming-and-caching-3p45

type Props = {
  source: ImageProps['source'];
  onLoadStart?: ImageProps['onLoadStart'];
  onLoadEnd?: ImageProps['onLoadEnd'];
  onError?: ImageProps['onError'];
  style?: ViewStyle;
};

export const ImageZoomPan: React.FC<Props> = ({ style, ...imageProps }) => {
  const [isPanEnabled, setIsPanEnabled] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const pinchRef = createRef();
  const panRef = createRef();

  const onPinchEvent = Animated.event(
    [
      {
        nativeEvent: { scale },
      },
    ],
    { useNativeDriver: true },
  );

  const onPanEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true },
  );

  const handlePinchStateChange = ({ nativeEvent }: HandlerStateChangeEvent<any>) => {
    // enabled pan only after pinch-zoom
    if (nativeEvent.state === State.ACTIVE) {
      setIsPanEnabled(true);
    }

    // when scale < 1, reset scale back to original (1)
    const nScale = nativeEvent.scale;
    if (nativeEvent.state === State.END) {
      if (nScale < 1) {
        Animated.spring(scale, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();

        setIsPanEnabled(false);
      }
    }
  };

  return (
    <GestureHandlerRootView style={style}>
      <View style={{ flex: 1, overflow: 'hidden' }}>
        <PanGestureHandler
          ref={panRef}
          shouldCancelWhenOutside
          enabled={isPanEnabled}
          failOffsetX={[-1000, 1000]}
          simultaneousHandlers={[pinchRef]}
          onGestureEvent={onPanEvent}
        >
          <Animated.View>
            <PinchGestureHandler
              ref={pinchRef}
              simultaneousHandlers={[panRef]}
              onGestureEvent={onPinchEvent}
              onHandlerStateChange={handlePinchStateChange}
            >
              <Animated.Image
                {...imageProps}
                resizeMode="contain"
                style={{
                  height: '100%',
                  transform: [{ scale }, { translateX }, { translateY }],
                  width: '100%',
                }}
              />
            </PinchGestureHandler>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </GestureHandlerRootView>
  );
};
