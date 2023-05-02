import { NavigationProp, useNavigation } from '@react-navigation/native';
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
import { RootStackParamList } from '../../navigation/types';
import { useInvoiceActionFormStore } from '../../store/InvoiceActionFormStore';
import { colors } from '../../theme';
import Box from '../Box/Box';
import Button from '../Button/Button';
import Text from '../Text/Text';
import TextInput from '../TextInput/TextInput';

const tableColor = colors.labelLightSecondary;
const itemsMarginX = 26;

type Props = {
  invoiceId: string;
}

export const InvoiceActionForm: React.FC<Props> = ({ invoiceId }) => {
  const api = useApi();
  const { t } = useTranslation();
  const { getUserById } = useGetAllUsers();
  const actionIdToText = useActionIdToText();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { isLoading: isMutationLoading } = useNewActionMutation(invoiceId);
  const {
    isFetching: isFetchingInvoice,
    isFetchedAfterMount: isInvoiceFetchedAfterMount,
  } = useInvoiceDetails(invoiceId);
  const {
    data: formActions,
    isFetchedAfterMount,
    isFetching,
  } = useQuery(
    [queryKeys.invoiceActions, invoiceId],
    async() =>
      normalizeInvoiceActionsFromResponse(
        await api.invoice.getActionsForInvoice(invoiceId),
      ),
    {
      enabled: isInvoiceFetchedAfterMount,
    },
  );
  const {
    comment,
    reset,
    selectedActionId,
    selectedUserId,
    setComment,
    setSelectedActionId,
    setSelectedUserId,
  } = useInvoiceActionFormStore();

  const isDisabled = isFetchingInvoice || isFetching || isMutationLoading;

  useEffect(() => reset(), [reset]);

  // region set suggested values in state
  useEffect(() => {
    if (isFetchedAfterMount && formActions?.suggestedRemark) {
      setComment(formActions.suggestedRemark);
    }
  },
  [formActions?.suggestedRemark, isFetchedAfterMount, setComment],
  );

  useEffect(() => {
    if (isFetchedAfterMount && formActions?.suggestedUserId) {
      setSelectedUserId(formActions.suggestedUserId);
    }
  },
  [formActions?.suggestedUserId, isFetchedAfterMount, setSelectedUserId],
  );

  useEffect(() => {
    if (isFetchedAfterMount && formActions?.suggestedAction) {
      setSelectedActionId(formActions.suggestedAction);
    }
  },
  [formActions?.suggestedAction, isFetchedAfterMount, setSelectedActionId],
  );
  // endregion

  // region actions
  const onUserPress = () => {
    navigation.navigate('InvoiceSelectUserScreen', {
      id: invoiceId,
      onlyShowUsers: formActions?.userIds,
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
          value={comment}
          onChangeText={(value) => setComment(value)}
          isDisabled={isDisabled}
          label={t('invoice_action_form.comment') ?? ''}
        />
      </Box>
      <Box style={styles.itemsFlexRow} pt={16} mx={itemsMarginX}>
        <Box style={styles.itemFlex1} pr={10}>
          <Button
            variant="secondary"
            size="S"
            title={selectedActionId ? actionIdToText(selectedActionId) : t('invoice_action_form.no_action_selected')}
            isDisabled={isDisabled}
            onPress={onActionSelected}
          />

        </Box>
        <Box style={styles.itemFlex1} pl={10}>
          <Button
            variant="secondary"
            size="S"
            title={getUserById(selectedUserId)?.name ?? t('invoice_action_form.no_user_selected')}
            isDisabled={isDisabled}
            onPress={onUserPress}
          />
        </Box>
      </Box>
      <Box style={styles.itemsFlexRow} py={4} mx={itemsMarginX}>
        <Box style={styles.itemFlex1}>
          <Text align="center" color={tableColor}>{t('invoice_action_form.button_action_help_text')}</Text>
        </Box>
        <Box style={styles.itemFlex1}>
          <Text align="center" color={tableColor}>{t('invoice_action_form.button_user_help_text')}</Text>
        </Box>
      </Box>
    </Box>
  );
};

const styles = StyleSheet.create(
  {
    itemFlex1: {
      flex: 1,
    },
    itemsFlexRow: {
      flexDirection: 'row',
    },
    scrollContainer: {
      flex: 1,
    },
  },
);
