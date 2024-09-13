import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import Box from '../Box/Box';
import Button from '../Button/Button';
import Text from '../Text/Text';

type Props = {
  isError?: boolean;
  onRetry?: () => void;
};

export const FetchErrorMessage: React.FC<PropsWithChildren<Props>> = ({ isError, children, onRetry }) => {
  const { t } = useTranslation();

  if (!isError) {
    return <>{children}</>;
  }

  return (
    <Box px={32} py={32} style={styles.container}>
      <Box style={styles.content}>
        <Text spaceAfter={16} variant="title">
          {t('fetch_error_message.title')}
        </Text>
        <Text spaceAfter={32} variant="bodyRegular">
          {t('fetch_error_message.description')}
        </Text>
        {onRetry && (
          <Button
            size="M"
            style={styles.button}
            title={t('fetch_error_message.button_retry')}
            variant="primary"
            onPress={onRetry}
          />
        )}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  button: {
    flex: 0,
    height: 48,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    flex: 0,
  },
});
