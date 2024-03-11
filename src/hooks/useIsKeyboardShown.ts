import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

export const useIsKeyboardShown = () => {
  const [isKeyboardShown, setIsKeyboardShown] = useState<boolean>(Keyboard.isVisible);

  useEffect(() => {
    const shownEvent = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardShown(true);
    });

    const hideEvent = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardShown(false);
    });

    return () => {
      shownEvent.remove();
      hideEvent.remove();
    };
  });

  return {
    isKeyboardShown,
  };
};
