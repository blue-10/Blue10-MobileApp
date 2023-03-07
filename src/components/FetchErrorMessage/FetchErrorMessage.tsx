import { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import Box from '../Box/Box';
import Button from '../Button/Button';
import Text from '../Text/Text';

type Props = {
  isError?: boolean;
  onRetry?: () => void;
}

export const FetchErrorMessage: React.FC<PropsWithChildren<Props>> = ({
  isError,
  children,
  onRetry,
}) => {
  const { t } = useTranslation();

  if (!isError) {
    return <>{children}</>;
  }

  return (
    <Box style={styles.container} px={32} py={32}>
      <Box style={styles.content}>
        <Text variant="title" spaceAfter={16}>{t('fetch_error_message.title')}</Text>
        <Text variant="bodyRegular" spaceAfter={32}>{t('fetch_error_message.description')}</Text>
        {onRetry && (
          <Button
            style={styles.button}
            title={t('fetch_error_message.button_retry')}
            size="M"
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
