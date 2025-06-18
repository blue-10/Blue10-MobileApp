import type { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { useTranslation } from 'react-i18next';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from 'react-native';

import SVGArrowCounterClockwise from '@/assets/icons/arrow-counterclockwise-circle-fill.svg';
import Box from '@/components/Box/Box';
import Button from '@/components/Button/Button';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { SearchSwitch } from '@/components/SearchSwitch/SearchSwitch';
import { type SelectItemValue } from '@/components/Select/Select';
import { SelectCompany } from '@/components/SelectCompany/SelectCompany';
import { SelectOverviewStatus } from '@/components/SelectOverviewStatus/SelectOverviewStatus';
import { SelectUser } from '@/components/SelectUser/SelectUser';
import Text from '@/components/Text/Text';
import { TextLabelInput } from '@/components/TextLabelInput/TextLabelInput';
import { TouchableIcon } from '@/components/TouchableIcon/TouchableIcon';
import { searchKeys } from '@/constants';
import { useIsScrollable } from '@/hooks/useIsScrollable';
import type { RootStackParamList } from '@/navigation/types';
import { useSearchFilterStore } from '@/store/SearchFilterStore';
import { colors } from '@/theme';

type Props = StackScreenProps<RootStackParamList, 'SearchFiltersScreen'>;

export const SearchFiltersScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useTranslation();
  const isIOS = Platform.OS === 'ios';
  const { isScrollable, onContenteSizeChange, onLayout } = useIsScrollable();
  const { reset, setFilter, getFilter } = useSearchFilterStore();

  return (
    <KeyboardAvoidingView behavior={isIOS ? 'padding' : 'height'} keyboardVerticalOffset={96} style={styles.container}>
      <StatusBar animated style="dark" />
      <ScrollView
        bounces={isScrollable}
        style={styles.container}
        onContentSizeChange={onContenteSizeChange}
        onLayout={onLayout}
      >
        <Box style={styles.container}>
          <Box px={26} py={26} style={styles.content}>
            <Box style={styles.titleView}>
              <Text style={styles.titleText} variant="largeTitle">
                {t('search_filter.title')}
              </Text>
              <TouchableIcon
                defaultColor={{
                  color: colors.button.grey.background,
                  fill: colors.button.grey.background,
                }}
                icon={SVGArrowCounterClockwise}
                size={32}
                onPress={() => reset()}
              />
            </Box>
            <Box py={16}>
              <SearchInput
                defaultValue=""
                placeholder={t('search_filter.search_placeholder')}
                value={getFilter(searchKeys.description)}
                onChangeText={(value) => setFilter(searchKeys.description, value)}
              />
            </Box>
            <Box style={styles.containerRow}>
              <SelectOverviewStatus
                label={t('search_filter.status_label')}
                placeholder={t('search_filter.status_placeholder')}
                style={styles.selectItem}
                value={getFilter(searchKeys.status)}
                onChange={(value: SelectItemValue) => setFilter(searchKeys.status, value)}
              />
              <SelectCompany
                label={t('search_filter.company_label')}
                placeholder={t('search_filter.company_placeholder')}
                style={styles.selectItem}
                value={getFilter(searchKeys.company)}
                onChange={(value: SelectItemValue) => setFilter(searchKeys.company, value)}
              />
            </Box>
            <Box pb={8} style={styles.containerRow}>
              <SelectUser
                label={t('search_filter.user_label')}
                placeholder={t('search_filter.user_placeholder')}
                style={styles.selectItem}
                value={getFilter(searchKeys.userList)}
                onChange={(value: SelectItemValue) => setFilter(searchKeys.userList, value)}
              />
              <SearchSwitch
                items={[
                  { title: t('search_filter.invoice_type_debit'), value: '1' },
                  { title: t('search_filter.invoice_type_credit'), value: '2' },
                ]}
                label={t('search_filter.invoice_type_label')}
                style={styles.selectItem}
                value={getFilter(searchKeys.invoiceType, '1')}
                onChange={(value: SelectItemValue) => setFilter(searchKeys.invoiceType, value)}
              />
            </Box>
            <TextLabelInput
              label={t('search_filter.ledger_entry_number_label')}
              placeholder={t('search_filter.ledger_entry_number_label')}
              value={getFilter(searchKeys.ledgerEntryNumber)}
              onChangeText={(value) => setFilter(searchKeys.ledgerEntryNumber, value)}
            />
            <TextLabelInput
              label={t('search_filter.relation_label')}
              placeholder={t('search_filter.relation_label')}
              value={getFilter(searchKeys.relation)}
              onChangeText={(value) => setFilter(searchKeys.relation, value)}
            />
            <TextLabelInput
              label={t('search_filter.document_number_label')}
              placeholder={t('search_filter.document_number_label')}
              value={getFilter(searchKeys.documentNumber)}
              onChangeText={(value) => setFilter(searchKeys.documentNumber, value)}
            />
          </Box>
        </Box>
      </ScrollView>
      <Box borderColor={colors.borderColor} borderTop={1} px={26} py={32}>
        <Button
          size="L"
          title={t('search_filter.button_search')}
          variant="primary"
          onPress={() => navigation.navigate('SearchResultsScreen')}
        />
      </Box>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerRow: {
    flexDirection: 'row',
    gap: 40,
  },
  content: {
    flex: 1,
  },
  selectItem: {
    flex: 1,
  },
  titleText: {
    flex: 1,
  },
  titleView: {
    alignItems: 'center',
    flexDirection: 'row',
  },
});
