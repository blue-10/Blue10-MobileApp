import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import { GetCompanyResponseItem } from '../api/ApiResponses';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { useAllCompanies } from '../hooks/queries/useAllCompanies';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';
import { RootStackParamList } from '../navigation/types';
import { useImageStore } from '../store/ImageStore';

export type ScanSelectCompanyScreenProps = NativeStackScreenProps<RootStackParamList, 'ScanSelectCompanyScreen'>;

export const ScanSelectCompanyScreen: React.FC<ScanSelectCompanyScreenProps> = ({ navigation }) => {
  const { data: allCompanies } = useAllCompanies();
  const { currentUser } = useGetCurrentUser();
  const { company, setCompany } = useImageStore();

  const renderItem = useCallback(({ item, index }: { item: GetCompanyResponseItem; index: number }) => {
    return (
      <ListItem
        title={item.DisplayName}
        isEven={index % 2 === 0}
        isChecked={company?.Id === item.Id}
        onPress={() => {
          setCompany(item);
          navigation.navigate('ScanSelectDocumentTypeScreen');
        }}
      />
    );
  }, [company, navigation, setCompany]);

  /* Permission flow validated with Alain on 2023-10-13:
   *
   * - If a user may validate, this has precedence over anything else
   * - Only if a user may not validate anything, check the See permissions
   *
   * We previously also checked MayHandle*** but this was incorrect, any Blue10 user is allowed to upload new invoices
   * as long as they can see any companies (which should be all users, otherwise the Blue10 application is pointless).
   */
  const selectableCompanies = useMemo(() => {
    const companies = allCompanies ?? [];

    if (currentUser?.MayValidateAllCompanies === true) {
      return companies;
    } else if ((currentUser?.ValidateCompanies || []).length > 0) {
      return companies.filter((company) => currentUser?.ValidateCompanies.includes(company.Id));
    } else if (currentUser?.MaySeeAllCompanies === true) {
      return companies;
    } else if ((currentUser?.SeeCompanies || []).length > 0) {
      return companies.filter((company) => currentUser?.SeeCompanies.includes(company.Id));
    }

    return [];
  }, [allCompanies, currentUser]);

  return (
    <View>
      <StatusBar style="dark" animated />
      <FlatList<GetCompanyResponseItem>
        style={{ minHeight: 90 }} // without height the refresh indicator is not visible during reload
        data={selectableCompanies}
        renderItem={renderItem}
        keyExtractor={(item) => item.Id}
        ItemSeparatorComponent={ListSeparator}
        ListEmptyComponent={View}
      />
    </View>
  );
};
