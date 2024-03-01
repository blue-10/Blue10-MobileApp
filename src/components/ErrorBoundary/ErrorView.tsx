import { useTranslation } from 'react-i18next';

import { useApiStore } from '../../store/ApiStore';
import Box from '../Box/Box';
import Button from '../Button/Button';
import { ScreenWithStatusBarAndHeader } from '../ScreenWithStatusBarAndHeader';
import Text from '../Text/Text';

type ErrorViewProps = {
  onLogout: () => void;
};

const ErrorView: React.FC<ErrorViewProps> = ({ onLogout }) => {
  const clearRefreshToken = useApiStore((state) => state.clearRefreshToken);
  const { t } = useTranslation();

  return (
    <ScreenWithStatusBarAndHeader>
      <Box pb={16}>
        <Text align="center" variant="title">
          {t('error_view.title')}
        </Text>
      </Box>
      <Text variant="bodyRegular">{t('error_view.description')}</Text>
      <Box height={96} pt={32}>
        <Button
          size="M"
          title={t('error_view.logout_button')}
          variant="primary"
          onPress={() => {
            clearRefreshToken();
            onLogout();
          }}
        />
      </Box>
    </ScreenWithStatusBarAndHeader>
  );
};

export default ErrorView;
