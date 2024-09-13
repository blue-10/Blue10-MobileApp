import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';

import { queryKeys } from '../../constants';
import { normalizeInvoiceActionsFromResponse } from '../../entity/invoice/normalizer';
import { useNewActionMutation } from '../../hooks/mutations/useNewActionMutation';
import { useGetAllUsers } from '../../hooks/queries/useGetAllUsers';
import { useInvoiceDetails } from '../../hooks/queries/useInvoiceDetails';
import { useActionIdToText } from '../../hooks/useActionIdToText';
import { useApi } from '../../hooks/useApi';
import type { RootStackParamList } from '../../navigation/types';
import { useInvoiceActionFormStore } from '../../store/InvoiceActionFormStore';
import { colors } from '../../theme';
import { useQueryKeySuffix } from '../../utils/queryUtils';
import Box from '../Box/Box';
import Button from '../Button/Button';
import Text from '../Text/Text';
import TextInput from '../TextInput/TextInput';

const tableColor = colors.labelLightSecondary;
const itemsMarginX = 26;

type Props = {
  invoiceId: string;
};

export const InvoiceActionForm: React.FC<Props> = ({ invoiceId }) => {
  const api = useApi();
  const { t } = useTranslation();
  const { getUserById } = useGetAllUsers();
  const actionIdToText = useActionIdToText();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isPending: isMutationLoading } = useNewActionMutation(invoiceId);
  const { isFetching: isFetchingInvoice, isFetchedAfterMount: isInvoiceFetchedAfterMount } =
    useInvoiceDetails(invoiceId);
  const { comment, reset, selectedActionId, selectedUserId, setComment, setSelectedActionId, setSelectedUserId } =
    useInvoiceActionFormStore();
  const {
    data: formActions,
    isFetchedAfterMount,
    isFetching,
  } = useQuery({
    enabled: isInvoiceFetchedAfterMount,
    queryFn: async () => normalizeInvoiceActionsFromResponse(await api.invoice.getActionsForInvoice(invoiceId)),
    queryKey: useQueryKeySuffix([queryKeys.invoiceActions, invoiceId]),
  });
  const {
    data: actionData,
    isFetchedAfterMount: isFetchedAfterAction,
    isFetching: isFetchingUsersForAction,
  } = useQuery({
    enabled: !!selectedActionId,
    queryFn: async () =>
      normalizeInvoiceActionsFromResponse(await api.invoice.getUsersForAction(invoiceId, selectedActionId || -1)),
    queryKey: useQueryKeySuffix([queryKeys.invoiceActions, invoiceId, `action-${selectedActionId}`]),
  });
  const isDisabled = isFetchingInvoice || isFetching || isMutationLoading;

  useEffect(() => reset(), [reset]);

  // region set suggested values in state
  useEffect(() => {
    if (isFetchedAfterMount && formActions?.suggestedRemark) {
      setComment(formActions.suggestedRemark);
    }
  }, [formActions?.suggestedRemark, isFetchedAfterMount, setComment]);

  useEffect(() => {
    if (isFetchedAfterMount && formActions?.suggestedUserId) {
      setSelectedUserId(formActions.suggestedUserId);
    }
  }, [formActions?.suggestedUserId, isFetchedAfterMount, setSelectedUserId]);

  useEffect(() => {
    if (isFetchedAfterMount && formActions?.suggestedAction) {
      setSelectedActionId(formActions.suggestedAction);
    }
  }, [formActions?.suggestedAction, isFetchedAfterMount, setSelectedActionId]);

  useEffect(() => {
    if (isFetchedAfterAction) {
      if (actionData?.suggestedUserId && selectedUserId === '') {
        setSelectedUserId(actionData.suggestedUserId);
      } else if (!(actionData?.userIds || []).includes(selectedUserId)) {
        setSelectedUserId('');
      }
    }
  }, [actionData?.suggestedUserId, actionData?.userIds, isFetchedAfterAction, selectedUserId, setSelectedUserId]);
  // endregion

  // region actions
  const onUserPress = () => {
    navigation.navigate('InvoiceSelectUserScreen', {
      id: invoiceId,
      onlyShowUsers: actionData?.userIds,
      selectedUserId,
    });
  };

  const onActionSelected = () => {
    navigation.navigate('InvoiceSelectActionScreen', {
      id: invoiceId,
      onlyShowActions: formActions?.actions,
      selectedActionId,
    });
  };
  // endregion

  return (
    <Box>
      <Box mx={itemsMarginX} pb={16}>
        <Text variant="title">{t('invoice_action_form.title')}</Text>
      </Box>
      <Box mx={itemsMarginX} pb={16}>
        <TextInput
          isDisabled={isDisabled}
          label={t('invoice_action_form.comment')}
          value={comment}
          onChangeText={(value) => setComment(value)}
        />
      </Box>
      {(formActions?.actions.length || 0) > 0 && (
        <Box mx={itemsMarginX} pt={16} style={styles.itemsFlexRow}>
          <Box pr={10} style={styles.itemFlex1}>
            <Button
              isDisabled={isDisabled}
              size="S"
              title={selectedActionId ? actionIdToText(selectedActionId) : t('invoice_action_form.no_action_selected')}
              variant="secondary"
              onPress={onActionSelected}
            />
          </Box>
          <Box pl={10} style={styles.itemFlex1}>
            <Button
              isDisabled={!selectedActionId || isFetchingUsersForAction || isDisabled}
              size="S"
              title={getUserById(selectedUserId)?.name ?? t('invoice_action_form.no_user_selected')}
              variant="secondary"
              onPress={onUserPress}
            />
          </Box>
        </Box>
      )}
      <Box mx={itemsMarginX} py={4} style={styles.itemsFlexRow}>
        <Box style={styles.itemFlex1}>
          <Text align="center" color={tableColor}>
            {t('invoice_action_form.button_action_help_text')}
          </Text>
        </Box>
        <Box style={styles.itemFlex1}>
          <Text align="center" color={tableColor}>
            {t('invoice_action_form.button_user_help_text')}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create({
  itemFlex1: {
    flex: 1,
  },
  itemsFlexRow: {
    flexDirection: 'row',
  },
  scrollContainer: {
    flex: 1,
  },
});
