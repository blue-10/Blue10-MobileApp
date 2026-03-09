import type { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import Box from '../Box/Box';
import Text from '../Text/Text';

type Props = {
  isError?: boolean;
};


export const FetchImageErrorMessage: React.FC<PropsWithChildren<Props>> = ({ isError, children }) => {
  const { t } = useTranslation();

  if (!isError) {
    return children as React.ReactElement;
  }

  return (
    <Box px={32} py={32} style={styles.container}>
      <Box style={styles.content}>
        <Text spaceAfter={16} variant="title">
          {t('fetch_image_error_message.title')}
        </Text>
        <Text spaceAfter={32} variant="bodyRegular">
          {t('fetch_image_error_message.description')}
        </Text>
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
    fontWeight: 'bold',
  },
});
