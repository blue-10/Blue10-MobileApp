import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import Box from '../Box/Box';
import { Toast } from './Toast';
import { useToastStore } from './useToast';

export const ToastProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const insets = useSafeAreaInsets();
  const toats = useToastStore((state) => state.toasts);
  const deleteToast = useToastStore((state) => state.deleteToast);

  return (
    <>
      {children}
      <Box
        style={[
          styles.toastContainer,
          {
            bottom: insets.bottom + 30,
            left: insets.left + 30,
            right: insets.right + 30,
          },
        ]}
      >
        {toats.map((toast, index) => (
          <Toast
            key={toast.id}
            item={toast}
            onClose={() => deleteToast(index)}
          />
        ))}
      </Box>
    </>
  );
};

const styles = StyleSheet.create(({
  toastContainer: {
    bottom: 0,
    height: 'auto',
    left: 0,
    pointerEvents: 'box-none',
    position: 'absolute',
  },
}));
