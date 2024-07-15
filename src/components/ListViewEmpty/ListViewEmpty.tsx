import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import NoDataSvg from '@/svg/no_data';
import { colors } from '@/theme';

import Box from '../Box/Box';
import { FullScreenLoader } from '../FullscreenLoader/FullScreenLoader';
import Text from '../Text/Text';

type Props = {
  isFetching?: boolean;
  title?: string;
  description?: string;
};

export const ListViewEmpty: React.FC<Props> = ({ isFetching, title, description }) => {
  const { t } = useTranslation();

  if (isFetching) {
    return <FullScreenLoader />;
  }

  return (
    <Box px={32} py={32} style={styles.container}>
      <Box style={styles.content}>
        <NoDataSvg height={200} style={styles.illustrations} width={300} />
        <Text align="center" color={colors.labelLightSecondary} spaceAfter={16} variant="title">
          {title ?? t('listview_empty.title')}
        </Text>
        {description && (
          <Text color={colors.labelLightSecondary} spaceAfter={32} variant="bodyRegular">
            {description}
          </Text>
        )}
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
  },
  content: {
    flex: 1,
  },
  illustrations: {
    height: 200,
    marginBottom: 32,
    width: 300,
  },
});
