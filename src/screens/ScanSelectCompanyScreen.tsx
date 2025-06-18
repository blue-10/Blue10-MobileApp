import type { StackScreenProps } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { useCallback, useMemo } from 'react';
import { FlatList, View } from 'react-native';

import type { GetCompanyResponseItem } from '../api/ApiResponses';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { useAllCompanies } from '../hooks/queries/useAllCompanies';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';
import type { RootStackParamList } from '../navigation/types';
import { useImageStore } from '../store/ImageStore';

export type ScanSelectCompanyScreenProps = StackScreenProps<RootStackParamList, 'ScanSelectCompanyScreen'>;

export const ScanSelectCompanyScreen: React.FC<ScanSelectCompanyScreenProps> = ({ navigation }) => {
  const { data: allCompanies } = useAllCompanies();
  const { currentUser } = useGetCurrentUser();
  const { company, setCompany } = useImageStore();

  const renderItem = useCallback(
    ({ item, index }: { item: GetCompanyResponseItem; index: number }) => {
      return (
        <ListItem
          isChecked={company?.Id === item.Id}
          isEven={index % 2 === 0}
          title={item.DisplayName}
          onPress={() => {
            setCompany(item);
            navigation.navigate('ScanSelectDocumentTypeScreen');
          }}
        />
      );
    },
    [company, navigation, setCompany],
  );

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
      <StatusBar animated style="dark" />
      <FlatList<GetCompanyResponseItem>
        data={selectableCompanies}
        ItemSeparatorComponent={ListSeparator}
        keyExtractor={(item) => item.Id}
        ListEmptyComponent={View}
        renderItem={renderItem}
        style={{ minHeight: 90 }} // without height the refresh indicator is not visible during reload
      />
    </View>
  );
};
