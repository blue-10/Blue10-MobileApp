import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import Box from '../Box/Box';
import Button from '../Button/Button';
import Text from '../Text/Text';

type LoginSiteErrorProps = {
  errorName?: string;
  errorCode: number;
  errorDescription: string;
  onRetry: () => void;
}

const LoginSiteError: React.FC<LoginSiteErrorProps> = ({ errorName, errorCode, errorDescription, onRetry }) => {
  const error = [errorName, ' (', errorCode, ')', ':', errorDescription];
  const { t } = useTranslation();

  return (
    <Box style={styles.container} px={16}>
      <Box style={styles.contentHolder}>
        <Box pb={24}>
          <Box pb={16}>
            <Text variant="title" align="center">{t('login_site_error.title')}</Text>
          </Box>
          <Text variant="bodyRegular">{error.join('').trim()}</Text>
        </Box>
        <Box style={styles.buttonHolder}>
          <Button
            title={t('login_site_error.retry_button')}
            onPress={() => {
              onRetry();
            }}
            size="L"
            variant="primary"
          />
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create(
  {
    buttonHolder: {
      height: 64,
    },
    container: {
      alignItems: 'center',
      backgroundColor: 'white',
      bottom: 0,
      height: '100%',
      justifyContent: 'center',
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
      width: '100%',
    },
    contentHolder: {
      alignContent: 'center',
      alignSelf: 'center',
      flexGrow: 0,
      flexShrink: 0,
      height: 100,
    },
  },
);

export default LoginSiteError;
