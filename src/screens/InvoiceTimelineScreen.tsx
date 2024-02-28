import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import type React from 'react';
import { useCallback, useMemo } from 'react';
import type { ListRenderItem } from 'react-native';
import { FlatList, RefreshControl, View } from 'react-native';

import { FetchErrorMessage } from '../components/FetchErrorMessage/FetchErrorMessage';
import InvoiceTimelineItem from '../components/InvoiceTimelineItem/InvoiceTimelineItem';
import { ListHeaderLastUpdatedAt } from '../components/ListHeaderLastUpdatedAt/ListHeaderLastUpdatedAt';
import { ListSeparator } from '../components/ListSeparator/ListSeparator';
import { queryKeys } from '../constants';
import { normalizeInvoiceHistoryItemFromResponse } from '../entity/invoice/normalizer';
import type { InvoiceHistoryItem } from '../entity/invoice/types';
import { useGetAllUsers } from '../hooks/queries/useGetAllUsers';
import { useActionIdToCompleteText } from '../hooks/useActionIdToText';
import { useApi } from '../hooks/useApi';
import type { RootStackParamList } from '../navigation/types';
import { colors } from '../theme';
import { normalizeMap } from '../utils/normalizerUtils';
import { useQueryKeySuffix } from '../utils/queryUtils';

type Props = NativeStackScreenProps<RootStackParamList, 'InvoiceTimelineScreen'>;

const useGetTimelineOfInvoice = (id: string) => {
  const api = useApi();
  const { getUserById, data: allUsers = [] } = useGetAllUsers();
  const actionIdToText = useActionIdToCompleteText();

  const query = useQuery({
    enabled: allUsers.length > 0,
    queryFn: async () => normalizeMap(await api.invoice.getInvoiceHistory(id), normalizeInvoiceHistoryItemFromResponse),
    queryKey: useQueryKeySuffix([queryKeys.invoiceBookings, id]),
  });

  const data: InvoiceHistoryItem[] = useMemo(() => {
    return (query.data ?? []).map((item) => ({
      ...item,
      actionText: actionIdToText(item.action),
      toUserAbbreviation: getUserById(item.toUser)?.abbreviation ?? item.toUser,
      userAbbreviation: getUserById(item.userId)?.abbreviation ?? item.userId,
    }));
  }, [query.data, actionIdToText, getUserById]);

  return {
    data,
    query,
  };
};

export const InvoiceTimelineScreen: React.FC<Props> = ({ route }) => {
  const id = route.params.id;
  const {
    data,
    query: { isFetching, refetch, dataUpdatedAt, isError },
  } = useGetTimelineOfInvoice(id);

  const renderItem: ListRenderItem<InvoiceHistoryItem> = useCallback(
    ({ item, index }) => <InvoiceTimelineItem isEven={index % 2 === 0} item={item} />,
    [],
  );

  const refreshControl = useMemo(
    () => (
      <RefreshControl
        colors={[colors.primary]} // android
        refreshing={isFetching}
        tintColor={colors.primary} // ios
        onRefresh={() => refetch()}
      />
    ),
    [isFetching, refetch],
  );

  return (
    <View style={{ flex: 1 }}>
      <FetchErrorMessage isError={isError} onRetry={() => refetch()}>
        <FlatList<InvoiceHistoryItem>
          data={data}
          ItemSeparatorComponent={ListSeparator}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => <ListHeaderLastUpdatedAt lastUpdatedAt={dataUpdatedAt} />}
          refreshControl={refreshControl}
          renderItem={renderItem}
          style={{ minHeight: 90 }}
        />
      </FetchErrorMessage>
    </View>
  );
};
