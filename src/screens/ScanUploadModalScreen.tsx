import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

import SvgArrowLeftIcon from '../../assets/icons/arrow-round-left.svg';
import SvgRetryIcon from '../../assets/icons/retry-icon.svg';
import SvgStopIcon from '../../assets/icons/stop-icon.svg';
import SvgUploadIcon from '../../assets/icons/upload-icon.svg';
import { TableList } from '../components/TableList/TableList';
import Text from '../components/Text/Text';
import { ToastProvider } from '../components/Toast/ToastProvider';
import { useAddToast } from '../components/Toast/useToast';
import { UploadStepIcon } from '../components/UploadStepIcon/UploadStepIcon';
import { useGetCurrentCustomer } from '../hooks/queries/useGetCurrentCustomer';
import { useGetCurrentUser } from '../hooks/queries/useGetCurrentUser';
import { useApi } from '../hooks/useApi';
import { useImageStore } from '../store/ImageStore';
import { UploadStepState, useUploadStore } from '../store/UploadStore';
import { colors } from '../theme';
import { deleteFile } from '../utils/fileSystem';
import {
  finishUploadSession,
  prepareDocument,
  startUploadSession,
  uploadPdfDocuments,
  UserAbortError,
} from '../utils/scanUtils';
import { captureError } from '../utils/sentry';

type ScanUploadModalScreenProps = {
  isOpen: boolean;
  onClose: (uploadSuccessful: boolean) => void;
};

export const ScanUploadModalScreen: React.FC<ScanUploadModalScreenProps> = ({ isOpen, onClose }) => {
  const addToast = useAddToast();
  const api = useApi();
  const currentCustomer = useGetCurrentCustomer();
  const { currentUser } = useGetCurrentUser();
  const { company, documentType, images } = useImageStore();
  const [isAbortRequested, setIsAbortRequested] = useState<boolean>(false);
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

  const tableListItems = [
    { label: t('scan.upload_table_user'), value: currentUser?.Name || t('general.unknown') },
    { label: t('scan.upload_table_customer'), value: currentCustomer.customerName || t('general.unknown') },
    { label: t('scan.upload_table_company'), value: company?.DisplayName || t('general.unknown') },
    { label: t('scan.upload_table_document_type'), value: t(`scan.document_type_${documentType?.key}`) },
    { label: t('scan.upload_table_images'), value: `${images.length}` },
  ];

  const shouldAbort = useCallback(() => isAbortRequested, [isAbortRequested]);

  const startUploadProcess = useCallback(() => {
    uploadStore.reset();
    uploadStore.setIsStarted(true);
    uploadStore.setPreparingDocumentState(UploadStepState.BUSY);

    const errorContext: Record<string, unknown> = {
      company: company?.Id,
      customer: currentCustomer.customerId,
      documentType: documentType?.key,
      images,
      user: currentUser?.Email,
    };

    prepareDocument(images, shouldAbort)
      .then((pdfDocuments) => {
        errorContext.pdfDocuments = pdfDocuments;

        if (pdfDocuments.length === 0) {
          throw new Error('prepareDocuments finished successfully but 0 PDF documents were created');
        }

        uploadStore.setPreparingDocumentState(UploadStepState.SUCCESS);
        uploadStore.setStartingSessionState(UploadStepState.BUSY);

        startUploadSession(api, company, documentType, shouldAbort)
          .then((sessionId) => {
            errorContext.sessionId = sessionId;

            uploadStore.setStartingSessionState(UploadStepState.SUCCESS);
            uploadStore.setDocumentUploadState(UploadStepState.BUSY);

            uploadPdfDocuments(api, sessionId, pdfDocuments, shouldAbort)
              .then(() => {
                uploadStore.setDocumentUploadState(UploadStepState.SUCCESS);
                uploadStore.setFinishSessionState(UploadStepState.BUSY);

                finishUploadSession(api, sessionId)
                  .then(() => {
                    uploadStore.setFinishSessionState(UploadStepState.SUCCESS);
                    uploadStore.setIsStarted(false);
                    uploadStore.setIsFinished(true);
                    uploadStore.setErrorMessage(undefined);
                    uploadStore.setIsAborted(false);
                    setIsAbortRequested(false);

                    pdfDocuments.forEach(deleteFile);
                  })
                  .catch((reason) => {
                    captureError(
                      reason,
                      'Failed to finalize the upload session after successful upload',
                      'warning',
                      errorContext,
                    );

                    uploadStore.setIsStarted(false);
                    uploadStore.setIsFinished(true);
                    uploadStore.setFinishSessionState(UploadStepState.ERROR);
                    uploadStore.setErrorMessage(t('scan.upload_finalize_warning') as string);
                    setIsAbortRequested(false);

                    pdfDocuments.forEach(deleteFile);
                  });
              })
              .catch((reason) => {
                uploadStore.setIsStarted(false);
                uploadStore.setIsFinished(true);
                uploadStore.setDocumentUploadState(UploadStepState.ERROR);
                setIsAbortRequested(false);

                if (reason instanceof UserAbortError) {
                  uploadStore.setIsAborted(true);
                  uploadStore.setErrorMessage(t('scan.upload_user_aborted') as string);
                } else {
                  captureError(reason, 'Failed to upload a document', 'error', errorContext);
                  uploadStore.setErrorMessage(t('scan.upload_upload_error') as string);
                }

                pdfDocuments.forEach(deleteFile);
              });
          })
          .catch((reason) => {
            uploadStore.setIsStarted(false);
            uploadStore.setIsFinished(true);
            uploadStore.setStartingSessionState(UploadStepState.ERROR);
            setIsAbortRequested(false);

            if (reason instanceof UserAbortError) {
              uploadStore.setIsAborted(true);
              uploadStore.setErrorMessage(t('scan.upload_user_aborted') as string);
            } else {
              captureError(reason, 'Failed to start upload session', 'error', errorContext);
              uploadStore.setErrorMessage(t('scan.upload_start_session_error') as string);
            }

            pdfDocuments.forEach(deleteFile);
          });
      })
      .catch((reason) => {
        uploadStore.setIsStarted(false);
        uploadStore.setIsFinished(true);
        uploadStore.setPreparingDocumentState(UploadStepState.ERROR);
        setIsAbortRequested(false);

        if (reason instanceof UserAbortError) {
          uploadStore.setIsAborted(true);
          uploadStore.setErrorMessage(t('scan.upload_user_aborted') as string);
        } else {
          captureError(reason, 'Failed to prepare PDF document', 'error', errorContext);
          uploadStore.setErrorMessage(t('scan.upload_generate_document_error') as string);
        }
      });
  }, [api, company, currentCustomer.customerId, currentUser?.Email, documentType, images, shouldAbort, t, uploadStore]);

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
            {(!uploadStore.isStarted && !uploadStore.isFinished) && (
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  disabled={uploadStore.isStarted}
                  onPress={closeDialog}
                >
                  <SvgArrowLeftIcon
                    color={colors.scan.uploadIconColor}
                    fill={colors.scan.transparentBackground}
                    width={48}
                    height={48}
                  />
                </TouchableOpacity>
                <TouchableOpacity disabled={uploadStore.isStarted} onPress={startUploadProcess}>
                  <SvgUploadIcon
                    color={colors.scan.uploadIconColor}
                    fill={colors.scan.transparentBackground}
                    width={48}
                    height={48}
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
                      <Text variant="bodyRegular" color={colors.white}>Document voorbereiden</Text>
                    </View>
                  </View>
                  <View style={styles.stepListItem}>
                    <View style={styles.stepListItemIcon}>
                      <UploadStepIcon state={uploadStore.startingSessionState} />
                    </View>
                    <View style={styles.stepListItemText}>
                      <Text variant="bodyRegular" color={colors.white}>Uploadsessie starten</Text>
                    </View>
                  </View>
                  <View style={styles.stepListItem}>
                    <View style={styles.stepListItemIcon}>
                      <UploadStepIcon state={uploadStore.documentUploadState} />
                    </View>
                    <View style={styles.stepListItemText}>
                      <Text variant="bodyRegular" color={colors.white}>Document uploaden</Text>
                    </View>
                  </View>
                  <View style={styles.stepListItem}>
                    <View style={styles.stepListItemIcon}>
                      <UploadStepIcon state={uploadStore.finishSessionState} />
                    </View>
                    <View style={styles.stepListItemText}>
                      <Text variant="bodyRegular" color={colors.white}>Uploadsessie afronden</Text>
                    </View>
                  </View>
                </View>
                {!uploadStore.isFinished && (
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity
                      disabled={isAbortRequested || uploadStore.finishSessionState === UploadStepState.BUSY}
                      onPress={() => setIsAbortRequested(true)}
                    >
                      {isAbortRequested
                        ? <ActivityIndicator color={colors.scan.uploadIconColor} size={48} />
                        : (
                          <SvgStopIcon
                            color={colors.scan.uploadIconColor}
                            fill={colors.scan.transparentBackground}
                            width={48}
                            height={48}
                          />
                        )}
                    </TouchableOpacity>
                  </View>
                )}
              </>
            )}
            {(uploadStore.isAborted || uploadStore.isFinished) && (
              <>
                {(uploadStore.errorMessage !== undefined) && (
                  <>
                    <View style={styles.errorMessageContainer}>
                      <Text variant="bodyRegularBold" color={colors.white}>{uploadStore.errorMessage}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        disabled={uploadStore.isStarted}
                        onPress={closeDialog}
                      >
                        <SvgArrowLeftIcon
                          color={colors.scan.uploadIconColor}
                          fill={colors.scan.transparentBackground}
                          width={48}
                          height={48}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity disabled={uploadStore.isStarted} onPress={startUploadProcess}>
                        <SvgRetryIcon
                          color={colors.scan.uploadIconColor}
                          fill={colors.scan.transparentBackground}
                          width={48}
                          height={48}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
                {(uploadStore.errorMessage === undefined) && (
                  <>
                    <View style={styles.successMessageContainer}>
                      <Text variant="bodyRegularBold" color={colors.white}>{t('scan.upload_success')}</Text>
                    </View>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity
                        disabled={uploadStore.isStarted}
                        onPress={closeDialog}
                      >
                        <SvgArrowLeftIcon
                          color={colors.scan.uploadIconColor}
                          fill={colors.scan.transparentBackground}
                          width={48}
                          height={48}
                        />
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </>
            )}
          </View>
          <View style={styles.footer}></View>
        </View>
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
  headerContainer: {
  },
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
