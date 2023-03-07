import { useTranslation } from 'react-i18next';

import { useApiStore } from '../../store/ApiStore';
import Box from '../Box/Box';
import Button from '../Button/Button';
import { ScreenWithStatusBarAndHeader } from '../ScreenWithStatusBarAndHeader';
import Text from '../Text/Text';

type ErrorViewProps = {
  onLogout: () => void;
}

const ErrorView: React.FC<ErrorViewProps> = ({ onLogout }) => {
  const clearRefreshToken = useApiStore((state) => state.clearRefreshToken);
  const { t } = useTranslation();

  return (
    <ScreenWithStatusBarAndHeader>
      <Box pb={16}>
        <Text variant="title" align="center">{t('error_view.title')}</Text>
      </Box>
      <Text variant="bodyRegular">
        {t('error_view.description')}
      </Text>
      <Box pt={32} height={96}>
        <Button
          variant="primary"
          title={t('error_view.logout_button')}
          size="M"
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
