import React from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import SvgArrowLeftIcon from '../../assets/icons/arrow-round-left.svg';
import SvgRetryIcon from '../../assets/icons/retry-icon.svg';
import SvgStopIcon from '../../assets/icons/stop-icon.svg';
import SvgUploadIcon from '../../assets/icons/upload-icon.svg';
import type { TableListItem } from '../components/TableList/TableList';
import { TableList } from '../components/TableList/TableList';
import Text from '../components/Text/Text';
import { ToastProvider } from '../components/Toast/ToastProvider';
import { useAddToast } from '../components/Toast/useToast';
import { UploadStepIcon } from '../components/UploadStepIcon/UploadStepIcon';
import { UploadStepState, useUploadStore } from '../store/UploadStore';
import { colors } from '../theme';

type ScanUploadModalScreenProps = {
  isOpen: boolean;
  shouldAbort: boolean;
  tableListItems?: TableListItem[];
  onUploadStart: () => void;
  onUploadAbort: () => void;
  onClose: (uploadSuccessful: boolean) => void;
};

export const ScanUploadModalScreen: React.FC<ScanUploadModalScreenProps> = ({
  isOpen,
  shouldAbort,
  tableListItems = [],
  onClose,
  onUploadStart,
  onUploadAbort,
}) => {
  const addToast = useAddToast();
  const { t } = useTranslation();
  const uploadStore = useUploadStore();

  const closeDialog = useCallback(() => {
    if (uploadStore.isStarted && !uploadStore.isAborted && !uploadStore.isFinished) {
      addToast(t('scan.upload_busy_toast'), 5000);
    } else {
      onClose(uploadStore.isFinished && uploadStore.errorMessage === undefined);
    }
  }, [
    addToast,
    onClose,
    t,
    uploadStore.errorMessage,
    uploadStore.isAborted,
    uploadStore.isFinished,
    uploadStore.isStarted,
  ]);

  return (
    <Modal transparent animationType="slide" visible={isOpen} onRequestClose={closeDialog}>
      <ToastProvider>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.headerContainer}>
            <View style={styles.header}>
              <Text color={colors.white} spaceAfter={10} variant="bodyRegularBold">
                {t('scan.upload_title')}
              </Text>
            </View>
            <TableList
              items={tableListItems}
              labelTextProps={{
                color: colors.white,
                variant: 'bodyRegularBold',
              }}
              valueTextProps={{ color: colors.white }}
            />
            {!uploadStore.isStarted && !uploadStore.isFinished && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity disabled={uploadStore.isStarted} onPress={closeDialog}>
                  <SvgArrowLeftIcon
                    color={colors.scan.uploadIconColor}
                    fill={colors.scan.transparentBackground}
                    height={48}
                    width={48}
                  />
                </TouchableOpacity>
                <TouchableOpacity disabled={uploadStore.isStarted} onPress={onUploadStart}>
                  <SvgUploadIcon
                    color={colors.scan.uploadIconColor}
                    fill={colors.scan.transparentBackground}
                    height={48}
                    width={48}
                  />
                </TouchableOpacity>
              </View>
            )}
            {(uploadStore.isStarted || uploadStore.isFinished) && (
              <>
                <View style={styles.stepListContainer}>
                  <View style={styles.stepListItem}>
                    <View style={styles.stepListItemIcon}>
                      <UploadStepIcon state={uploadStore.preparingDocumentState} />
                    </View>
                    <View style={styles.stepListItemText}>
                      <Text color={colors.white} variant="bodyRegular">
                        Document voorbereiden
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stepListItem}>
                    <View style={styles.stepListItemIcon}>
                      <UploadStepIcon state={uploadStore.startingSessionState} />
                    </View>
                    <View style={styles.stepListItemText}>
                      <Text color={colors.white} variant="bodyRegular">
                        Uploadsessie starten
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stepListItem}>
                    <View style={styles.stepListItemIcon}>
                      <UploadStepIcon state={uploadStore.documentUploadState} />
                    </View>
                    <View style={styles.stepListItemText}>
                      <Text color={colors.white} variant="bodyRegular">
                        Document uploaden
                      </Text>
                    </View>
                  </View>
                  <View style={styles.stepListItem}>
                    <View style={styles.stepListItemIcon}>
                      <UploadStepIcon state={uploadStore.finishSessionState} />
                    </View>
                    <View style={styles.stepListItemText}>
                      <Text color={colors.white} variant="bodyRegular">
                        Uploadsessie afronden
                      </Text>
                    </View>
                  </View>
                </View>
                {!uploadStore.isFinished && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      disabled={shouldAbort || uploadStore.finishSessionState === UploadStepState.BUSY}
                      onPress={onUploadAbort}
                    >
                      {shouldAbort ? (
                        <ActivityIndicator color={colors.scan.uploadIconColor} size={48} />
                      ) : (
                        <SvgStopIcon
                          color={colors.scan.uploadIconColor}
                          fill={colors.scan.transparentBackground}
                          height={48}
                          width={48}
                        />
                      )}
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            {(uploadStore.isAborted || uploadStore.isFinished) && (
              <>
                {uploadStore.errorMessage !== undefined && (
                  <>
                    <View style={styles.errorMessageContainer}>
                      <Text color={colors.white} variant="bodyRegularBold">
                        {uploadStore.errorMessage}
                      </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity disabled={uploadStore.isStarted} onPress={closeDialog}>
                        <SvgArrowLeftIcon
                          color={colors.scan.uploadIconColor}
                          fill={colors.scan.transparentBackground}
                          height={48}
                          width={48}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity disabled={uploadStore.isStarted} onPress={onUploadStart}>
                        <SvgRetryIcon
                          color={colors.scan.uploadIconColor}
                          fill={colors.scan.transparentBackground}
                          height={48}
                          width={48}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {uploadStore.errorMessage === undefined && (
                  <>
                    <View style={styles.successMessageContainer}>
                      <Text color={colors.white} variant="bodyRegularBold">
                        {t('scan.upload_success')}
                      </Text>
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity disabled={uploadStore.isStarted} onPress={closeDialog}>
                        <SvgArrowLeftIcon
                          color={colors.scan.uploadIconColor}
                          fill={colors.scan.transparentBackground}
                          height={48}
                          width={48}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}
          </View>
          <View style={styles.footer}></View>
        </SafeAreaView>
      </ToastProvider>
    </Modal>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginBottom: 10,
    marginTop: 40,
  },
  errorMessageContainer: {
    backgroundColor: 'rgb(120, 0, 0)',
    color: colors.white,
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: 40,
    padding: 20,
  },
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
  headerContainer: {},
  modalContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    color: colors.white,
    flex: 1,
    justifyContent: 'space-between',
  },
  stepListContainer: {
    alignItems: 'flex-start',
    flexDirection: 'column',
    justifyContent: 'center',
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: 40,
  },
  stepListItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    paddingVertical: 5,
  },
  stepListItemIcon: {
    marginRight: 10,
    paddingTop: 3,
  },
  stepListItemText: {
    flex: 1,
  },
  successMessageContainer: {
    backgroundColor: 'rgb(0, 120, 0)',
    color: colors.white,
    marginLeft: '10%',
    marginRight: '10%',
    marginTop: 40,
    padding: 20,
  },
});
