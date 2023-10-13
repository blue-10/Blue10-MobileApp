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

  const selectableCompanies = useMemo(() => {
    if (currentUser?.MayValidateAllCompanies === true) {
      return allCompanies;
    } else if ((currentUser?.ValidateCompanies || []).length > 0) {
      return allCompanies?.filter((company) => currentUser?.ValidateCompanies.includes(company.Id));
    } else if (currentUser?.MaySeeAllCompanies === true) {
      return allCompanies;
    } else if ((currentUser?.SeeCompanies || []).length > 0) {
      return allCompanies?.filter((company) => currentUser?.SeeCompanies.includes(company.Id));
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
