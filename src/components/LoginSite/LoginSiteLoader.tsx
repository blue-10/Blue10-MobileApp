import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { colors } from '../../theme';
import Box from '../Box/Box';
import Text from '../Text/Text';

const LoginSiteLoader: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Box style={styles.container}>
      <Box pb={16}>
        <ActivityIndicator color={colors.primary} size="large" />
      </Box>
      <Text variant="bodyRegularBold">{t('login_site.loading')}</Text>
    </Box>
  );
};

const styles = StyleSheet.create({
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
});

export default LoginSiteLoader;
