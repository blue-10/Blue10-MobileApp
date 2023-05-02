import { useCallback, useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';

import XMarkIcon from '../../../assets/icons/xmark-icon.svg';
import { colors, dimensions } from '../../theme';
import Box from '../Box/Box';
import IconButton from '../IconButton/IconButton';
import Text from '../Text/Text';
import { ToastItem } from './types';

type Props = {
  item: ToastItem;
  onClose: () => void;
}

export const Toast: React.FC<Props> = ({ item, onClose }) => {
  const timeoutRef = useRef<number | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = useCallback(() => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeAnim, {
      duration: 500,
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const fadeOutAndClose = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    // Will change fadeAnim value to 0 in 3 seconds
    Animated.timing(fadeAnim, {
      duration: 250,
      toValue: 0,
      useNativeDriver: true,
    }).start(() => {
      onClose();
    });
  }, [fadeAnim, onClose]);

  useEffect(() => {
    if (item.timeout && timeoutRef.current === null) {
      timeoutRef.current = window.setTimeout(fadeOutAndClose, 500 + item.timeout);
    }
  }, [fadeOutAndClose, item.timeout]);

  useEffect(() => fadeIn(), [fadeIn]);

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [100, 0],
            }),
          },
        ],
      }}
    >
      <Box
        style={[
          styles.container,
        ]}
        px={dimensions.spacing.normal}
        py={dimensions.spacing.narrow}
      >
        <Text
          color="white"
          variant="bodyRegular"
          style={styles.text}
        >
          {item.message}
        </Text>
        {!item.timeout && (
          <IconButton
            icon={XMarkIcon}
            size={12}
            color={colors.toast.buttonColor}
            onPress={() => {
              onClose();
            }}
          />
        )}
      </Box>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.toast.background,
    borderRadius: 10,
    elevation: 3,
    flexDirection: 'row',
    marginTop: dimensions.spacing.narrow,
    rowGap: dimensions.spacing.narrow,
    shadowColor: '#000',
    shadowOffset: {
      height: 1,
      width: 0,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  text: {
    color: colors.toast.text,
    flex: 1,
  },
});
