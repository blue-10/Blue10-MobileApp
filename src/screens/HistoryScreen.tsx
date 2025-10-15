import Box from '@/components/Box/Box';
import { ImageZoomPan } from '@/components/ImageZoomPan/ImageZoomPan';
import { colors } from '@/theme';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Image, View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import RNFS from 'react-native-fs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import SvgCrossIcon from '../../assets/icons/xmark-circle-fill.svg';
import { SafeAreaView } from 'react-native-safe-area-context';

const BASE_FOLDER = `${RNFS.DocumentDirectoryPath}/blue10Images`;

type ImagesByCompany = {
  [companyName: string]: {
    companyName?: string;
    images: string[];
    documentTitle?: string;
    dateSet?: string;
    timeSet?: string;
  };
};

export const HistoryScreen = () => {
  const [imagesByCompany, setImagesByCompany] = useState<ImagesByCompany>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const { t } = useTranslation();

  const readMetaData = async (folderPath: string) => {
    try {
      const metaFilePath = `${folderPath}/metadata.json`;
      const exists = await RNFS.exists(metaFilePath);
      if (exists) {
        const metaData = await RNFS.readFile(metaFilePath, 'utf8');
        const parsedMetaData = JSON.parse(metaData) || {};
        return parsedMetaData;
      }
    } catch (error) {
      console.warn('Error reading metadata:', error);
    }
  };

  const loadImages = async () => {
    try {
      const exists = await RNFS.exists(BASE_FOLDER);

      if (!exists) {
        setImagesByCompany({});
        setLoading(false);
        return;
      }

      const entries = await RNFS.readDir(BASE_FOLDER);
      const groupedImages: ImagesByCompany = {};

      // Sort by modification time, descending (latest first)
      entries.sort((a, b) => {
        const timeA = a.mtime?.getTime() ?? 0;
        const timeB = b.mtime?.getTime() ?? 0;
        return timeB - timeA;
      });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          const metaFile = await readMetaData(entry.path);
          const documentTitle = t(`scan.document_type_${metaFile?.documentType}`);
          const companyName = entry.name.split('_')[2];
          const dateSet = entry.name.split('_')[0];
          const timeSet = metaFile.timestamp.split(',')[1]?.split(':').slice(0, 2).join(':').trim();

          const companyFiles = await RNFS.readDir(entry.path);
          const companyImages = companyFiles
            .filter((file) => file.isFile() && (file.name.endsWith('.jpg') || file.name.endsWith('.png')))
            .map((file) => 'file://' + file.path);

          if (companyImages.length > 0) {
            const folderKey = entry.name;

            groupedImages[folderKey] = {
              companyName,
              images: companyImages,
              documentTitle: documentTitle,
              dateSet: dateSet,
              timeSet: timeSet,
            };
          }
        } else if (entry.isFile()) {
          if (entry.name.endsWith('.jpg') || entry.name.endsWith('.png')) {
            if (!groupedImages['Uncategorized']) {
              groupedImages['Uncategorized'] = { images: [] };
            }
            groupedImages['Uncategorized'].images.push('file://' + entry.path);
          }
        }
      }

      setImagesByCompany(groupedImages);
    } catch (error) {
      console.warn('Error loading images:', error);
      setImagesByCompany({});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  if (loading) {
    return <Text>{t('login_site.loading')} ...</Text>;
  }

  if (Object.keys(imagesByCompany).length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{t('history.empty_history_list')}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 10 }}>
      {Object.entries(imagesByCompany).map(([folderKey, images]) => (
        <View key={folderKey} style={{ marginBottom: 30 }}>
          <Box style={{ flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' }}>
            <Text style={styles.imageTitle}>{images.companyName} / </Text>
            {images.documentTitle && <Text style={styles.imageTitle}>{images.documentTitle}</Text>}
          </Box>
          <Box style={{ flexDirection: 'row', alignItems: 'center' }}>
            {images.dateSet && <Text style={styles.imageTitle}>{images.dateSet}  </Text>}
            {images.timeSet && <Text style={styles.imageTitle}>{images.timeSet}</Text>}
          </Box>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                {images.images.map((uri) => (
                  <Pressable
                    key={uri}
                    onLongPress={() => {
                      setPreview(uri);
                      setModalVisible(true);
                    }}
                  >
                    <Image source={{ uri }} style={styles.imageItem} />
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      ))}

      <Modal visible={modalVisible} transparent animationType="fade">
        <GestureHandlerRootView style={{ flex: 1 }}>
          <SafeAreaView style={{ flex: 1, backgroundColor: colors.dashboard.history.modal.background }}>
            <View style={styles.modalBackground}>
              <Pressable style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <SvgCrossIcon width={32} height={32} color="#fff" />
              </Pressable>

              {preview && <ImageZoomPan source={{ uri: preview }} style={styles.fullImage} />}
            </View>
          </SafeAreaView>
        </GestureHandlerRootView>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.list.images.background,
    borderRadius: 8,
    marginTop: 10,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: colors.dashboard.history.modal.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '90%',
    height: '70%',
    borderRadius: 8,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  imageItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'relative',
    top: 40,
    right: '-40%',
    zIndex: 10,
    borderRadius: 20,
  },
});
