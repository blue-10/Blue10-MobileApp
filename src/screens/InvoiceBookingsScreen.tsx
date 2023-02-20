import { useQuery } from '@tanstack/react-query';
import React, { useCallback } from 'react';
import { Alert, FlatList, ListRenderItem, RefreshControl, View } from 'react-native';

import { getInvoiceBookings } from '../api/api';
import { InvoiceBooking } from '../api/types';
import { ListItem } from '../components/ListItem/ListItem';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import i18n, { translationKeys } from '../i18n/i18n';
import { useAuthStore } from '../store/AuthStore';
import { colors } from '../theme';
import { humanFileSize } from '../utils/humanFileSize';
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../navigation/types";


type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceBookingsScreen'>;

export const InvoiceBookingsScreen: React.FC<Props> = ({ route }) => {
  const id = route.params.id;
  const { token, environmentId } = useAuthStore(({ token, environmentId }) => ({ environmentId, token }));

  const {
    data: users = [],
    isFetching,
    refetch,
  } = useQuery(
    [queryKeys.invoiceBookings, environmentId],
    () => getInvoiceBookings(token ?? 'xxx', environmentId ?? 'xxx', id),
  );
  const renderItem: ListRenderItem<InvoiceBooking> = useCallback(({ item, index }) => (
    <ListItem
      isEven={(index % 2 === 0)}
      title={item.name}
      subTitle={i18n.translate(
        translationKeys.invoice_bookings.file_size, {
          size: humanFileSize(item.fileSize),
        })}
      onPress={() => {
        Alert.alert('TODO', 'Add some action for listitem');
      }}
    />
  ), []);

  return (
    <View style={{ flex: 1 }}>
      <FlatList<InvoiceBooking>
        style={{ minHeight: 90 }}
        data={users}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={ListSeparator}
        refreshControl={(
          <RefreshControl
            colors={[colors.primary]} // android
            tintColor={colors.primary} // ios
            refreshing={isFetching}
            onRefresh={() => refetch()}
          />)}
      />
    </View>
  );
};
