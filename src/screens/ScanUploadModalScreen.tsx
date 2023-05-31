import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, StyleSheet, View } from 'react-native';

import { TableList } from '../components/TableList/TableList';
import Text from '../components/Text/Text';
import { ToastProvider } from '../components/Toast/ToastProvider';
import { useAddToast } from '../components/Toast/useToast';
import { useGetCurrentCustomer } from '../hooks/queries/useGetCurrentCustomer';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';
import { useImageStore } from '../store/ImageStore';
import { colors } from '../theme';

type ScanUploadModalScreenProps = {
  isOpen: boolean;
  onClose: (uploadSuccessful: boolean) => void;
};

export const ScanUploadModalScreen: React.FC<ScanUploadModalScreenProps> = ({ isOpen, onClose }) => {
  const addToast = useAddToast();
  const currentCustomer = useGetCurrentCustomer();
  const { currentUser } = useGetCurrentUser();
  const { t } = useTranslation();
  const { company, documentType, images } = useImageStore();

  const [isUploading, setIsUploading] = useState<boolean>(true);

  const closeDialog = useCallback(() => {
    if (isUploading) {
      addToast(t('scan.upload_busy_toast'), 5000);
    } else {
      onClose(true);
    }
  }, [addToast, isUploading, onClose, t]);

  const tableListItems = [
    { label: t('Gebruiker'), value: currentUser?.Name || 'Onbekend' },
    { label: t('Klant'), value: currentCustomer.customerName || 'Onbekend' },
    { label: t('Bedrijf'), value: company?.DisplayName || 'Onbekend' },
    { label: t('Documentsoort'), value: t(`scan.document_type_${documentType?.key}`) },
    { label: t('Afbeeldingen'), value: `${images.length}` },
  ];

  return (
    <Modal
      animationType="slide"
      transparent
      visible={isOpen}
      onRequestClose={closeDialog}
    >
      <ToastProvider>
        <View style={styles.modalContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <Text variant="bodyRegularBold" spaceAfter={10} color={colors.white}>
                {t('scan.upload_title')}
              </Text>
            </View>
            <TableList
              items={tableListItems}
              labelTextProps={{ color: colors.white, variant: 'bodyRegularBold' }}
              valueTextProps={{ color: colors.white }}
            />

            {/* Indien nog niet gestart met uploaden of upload is afgebroken door gebruiker: */}
            {/* - Knop "Start uploaden" */}
            {/* - Knop "Annuleren" */}

            {/* Indien bezig met uploaden: */}
            {/* - Lijst met icoontjes (grayed-out vinkje/spinner/groen vinkje/rood kruis) per stap */}
            {/*   - Document voorbereiden (PDF genereren) */}
            {/*   - Uploadsessie starten (API call File/StartUploadSession) */}
            {/*   - Document uploaden (API call File/UploadDocumentForSource) */}
            {/*   - Upload afronden (API call File/FinalizeUploadSession) */}
            {/* - Knop "Upload afbreken" */}

            {/* Indien upload is afgebroken door foutmelding: */}
            {/* - Melding dat er een fout is opgetreden */}
            {/* - Knop "Opnieuw proberen" */}
            {/* - Knop "Annuleren" */}

            {/* Indien upload is succesvol afgerond: */}
            {/* - Melding dat de upload succesvol was */}
            {/* - Knop "Sluiten" */}
          </View>
          <View style={styles.footer}></View>
        </View>
      </ToastProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  footer: {
    alignItems: 'center',
    color: colors.white,
    height: 75,
    justifyContent: 'flex-start',
  },
  header: {
    alignItems: 'center',
    color: colors.white,
    justifyContent: 'flex-end',
    marginBottom: 10,
    marginTop: 40,
  },
  headerContainer: {
  },
  listContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  listItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  listItemLabel: {
    width: '50%',
  },
  listItemValue: {
    width: '50%',
  },
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: colors.white,
    flex: 1,
    justifyContent: 'space-between',
  },
});
