import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';

import SvgBackShape from '../../assets/icons/arrow-round-left.svg';
import { DashboardItem } from '../components/DashboardItem/DashboardItem';
import LoaderWrapper from '../components/LoaderWrapper/LoaderWrapper';
import { ScreenWithStatusBarAndHeader } from '../components/ScreenWithStatusBarAndHeader';
import Text from '../components/Text/Text';
import { RootStackParamList } from '../navigation/types';
import { colors, dimensions, text } from '../theme/';

type Props = NativeStackScreenProps<RootStackParamList, 'ScanPreviewScreen'>;

export const ScanPreviewScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();

  return (
    <ScreenWithStatusBarAndHeader>
      <LoaderWrapper isLoading={false} width={300} height={text.largeTitle.lineHeight} mb={10}>
        <Text variant="largeTitle" spaceAfter={10}>
          {t('scan.preview_title')}
        </Text>
      </LoaderWrapper>
      <View style={styles.dashboardItemsContainer}>
        <DashboardItem
          isLoading={false}
          title={t('dashboard.title')}
          color={colors.dashboard.switchEnv.background}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <SvgBackShape color={colors.white} style={{ alignSelf: 'center' }} width={75} height={75} />
        </DashboardItem>
      </View>
    </ScreenWithStatusBarAndHeader>
  );
};

const styles = StyleSheet.create({
  dashboardItemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: dimensions.spacing.normal,
  },
});
