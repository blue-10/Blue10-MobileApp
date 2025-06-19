import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import PagerView from 'react-native-pager-view';

import Box from '@/components/Box/Box';
import { FetchErrorMessage } from '@/components/FetchErrorMessage/FetchErrorMessage';
import { FullScreenLoader } from '@/components/FullscreenLoader/FullScreenLoader';
import Text from '@/components/Text/Text';
import { useInvoiceGetImage } from '@/hooks/queries/useInvoiceGetImage';
import { useInvoiceGetImagesCount } from '@/hooks/queries/useInvoiceGetImagesCount';
import { colors } from '@/theme';
import { ImageZoomPan } from '@/components/ImageZoomPan/ImageZoomPan';
import Button from '@/components/Button/Button';
import RotateIcon from '../../assets/icons/rotate-right.svg';

type InvoicePreviewScreenProps = {
  id: string;
};

type InvoiceImageLoaderProps = {
  id: string;
  page: number;
  isVisible: boolean;
  rotation: number;
};

const InvoiceImageLoader: React.FC<InvoiceImageLoaderProps> = ({ id, page, isVisible = false, rotation }) => {
  const { t } = useTranslation();
  const [isFirstLoad, setIsFirstLoad] = useState(false);
  const { imageDataUri, query } = useInvoiceGetImage(id, page, isFirstLoad);
  useEffect(() => {
    if (isVisible) {
      setIsFirstLoad(true);
    }
  }, [isVisible]);

  return (
    <FetchErrorMessage isError={query.isError} onRetry={() => query.refetch()}>
      <View style={styles.page}>
        {!query.isFetching ? (
          <Box height="100%" px={8} py={8} width="100%">
            <ImageZoomPan
              source={{ uri: imageDataUri }}
              key={`invoiceImage-${id}`}
              style={{ transform: [{ rotate: `${rotation}deg` }] }}
            />
          </Box>
        ) : (
          <Box height="100%" px={8} py={8} style={styles.page} width="100%">
            <Box pb={16}>
              <ActivityIndicator color={colors.primary} size="large" />
            </Box>
            <Text variant="bodyRegularBold">{t('image_slide_show.loading_image', { index: page })}</Text>
          </Box>
        )}
      </View>
    </FetchErrorMessage>
  );
};

export const InvoicePreviewScreen: React.FC<InvoicePreviewScreenProps> = ({ id }) => {
  const { t } = useTranslation();
  const { imageCount, imageCountQuery } = useInvoiceGetImagesCount(id);
  const [activePage, setActivePage] = useState(0);
  const [rotation, setRotation] = useState(0);

  const images = useMemo(() => {
    return new Array(imageCount).fill(undefined);
  }, [imageCount]);

  if (imageCountQuery.isFetching) {
    return <FullScreenLoader text={t('image_slide_show.loading_count')} />;
  }

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  return (
    <FetchErrorMessage isError={imageCountQuery.isError} onRetry={() => imageCountQuery.refetch()}>
      <PagerView
        initialPage={0}
        style={styles.container}
        onPageSelected={(e) => {
          setActivePage(e.nativeEvent.position);
          setRotation(0); // Reset rotation when changing images
        }}
      >
        {images.map((_image, index) => (
          <InvoiceImageLoader
            key={`invoiceImage${index.toString()}`}
            id={id}
            isVisible={index === activePage}
            page={index + 1}
            rotation={rotation}
          />
        ))}
      </PagerView>
      <Box
        width={60}
        height={60}
        style={{
          position: 'absolute',
          bottom: 32,
          right: 32,
          zIndex: 100,
        }}
      >
        <Button
          iconLeft={RotateIcon}
          size="M"
          textAlign="left"
          title={t('invoice_details.previous_button')}
          variant={'grey'}
          onPress={handleRotate}
        />
      </Box>
    </FetchErrorMessage>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  image: {
    height: '100%',
    resizeMode: 'contain',
    width: '100%',
  },

  page: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: '100%',
  },
});
