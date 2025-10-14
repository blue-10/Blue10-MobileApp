import type { RootStackParamList } from '@/navigation/types';
import { useImageStore } from '@/store/ImageStore';
import { colors } from '@/theme';
import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

interface PopUpProps {
  images: any[];
}

const PopUp = ({ images }: PopUpProps) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { addImages, reset } = useImageStore();

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (images?.length > 0) {
      setVisible(true);
    }
  }, [images]);

  const handleYes = () => {
    reset();
    const normalizedImages = images.map((image) => `file://${image}`);
    addImages(normalizedImages);
    setVisible(false);
    navigation.navigate('ScanSelectCompanyScreen');
  };

  const handleNo = () => {
    setVisible(false);
  };

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={() => setVisible(false)}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <View>
            <View style={styles.images}>
              {images?.map((image, index) => (
                <Image width={80} height={80} borderRadius={4} source={{ uri: `file://${image}` }} key={index} />
              ))}
            </View>
            <Text style={styles.title}>Your files were received. Do you want to continue?</Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.buttonNo} onPress={handleNo}>
              <Text style={styles.buttonText}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonYes} onPress={handleYes}>
              <Text style={styles.buttonText}>Yes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PopUp;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 15,
    marginTop: 10,
    fontWeight: 500,
    lineHeight: 28,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  buttonYes: {
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  buttonNo: {
    backgroundColor: colors.dashboard.toDo.background,
    padding: 10,
    borderRadius: 8,
    flex: 1,
  },
  buttonText: {
    color: colors.white,
    textAlign: 'center',
  },
  images: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
});
