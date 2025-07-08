import { colors } from '@/theme';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ScrollView, Image, View, Text, StyleSheet, Pressable, Modal, TouchableWithoutFeedback } from 'react-native';
import RNFS from 'react-native-fs';

const BASE_FOLDER = `${RNFS.DocumentDirectoryPath}/blue10Images`;

type ImagesByCompany = {
  [companyName: string]: string[];
};

export const HistoryScreen = () => {
  const [imagesByCompany, setImagesByCompany] = useState<ImagesByCompany>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [preview, setPreview] = useState<string | undefined>(undefined);

  const { t } = useTranslation();

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
          const companyName = entry.name.replaceAll('_', '    ').replace('-', ':');
          const companyFiles = await RNFS.readDir(entry.path);
          const companyImages = companyFiles
            .filter((file) => file.isFile() && (file.name.endsWith('.jpg') || file.name.endsWith('.png')))
            .map((file) => 'file://' + file.path);

          if (companyImages.length > 0) {
            groupedImages[companyName] = companyImages;
          }
        } else if (entry.isFile()) {
          if (entry.name.endsWith('.jpg') || entry.name.endsWith('.png')) {
            if (!groupedImages['Uncategorized']) groupedImages['Uncategorized'] = [];
            groupedImages['Uncategorized'].push('file://' + entry.path);
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
      {Object.entries(imagesByCompany).map(([companyName, images]) => (
        <View key={companyName} style={{ marginBottom: 30 }}>
          <Text style={styles.imageTitle}>{companyName}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.container}>
              <View style={styles.imageContainer}>
                {images.map((uri) => (
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

      <Modal visible={modalVisible} transparent>
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            {preview && <Image source={{ uri: preview }} style={styles.fullImage} resizeMode="contain" />}
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: colors.list.images.background,
    borderRadius: 8,
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
    gap: 8,
  },
  imageItem: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  imageTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
