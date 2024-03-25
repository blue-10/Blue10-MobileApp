import type React from 'react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { FullScreenLoader } from '@/components/FullscreenLoader/FullScreenLoader';
import LoaderWrapper from '@/components/LoaderWrapper/LoaderWrapper';

import { FetchErrorMessage } from '../components/FetchErrorMessage/FetchErrorMessage';
import { ImageGallery } from '../components/ImageSlideShow/ImageSlideShow';
import { useInvoiceGetImages } from '../hooks/queries/useInvoiceGetImages';

type Props = {
  id: string;
};

export const InvoicePreviewScreen: React.FC<Props> = ({ id }) => {
  const { t } = useTranslation();
  const { images, imageCount, imagesQuery, imageCountQuery } = useInvoiceGetImages(id);

  const imageUrls = useMemo(() => {
    const imagesFill = new Array(imageCount).fill(undefined);
    if (images.length > 0) {
      imagesFill.splice(0, images.length, ...images);
    }

    return imagesFill;
  }, [images, imageCount]);

  if (imageCountQuery.isFetching) {
    return <FullScreenLoader text={t('image_slide_show.loading_count')} />;
  }

  return (
    <FetchErrorMessage isError={imageCountQuery.isError} onRetry={() => imageCountQuery.refetch()}>
      <FetchErrorMessage isError={imagesQuery.isError} onRetry={() => imagesQuery.refetch()}>
        <ImageGallery
          images={imageUrls}
          onPageSelected={(_index) => {
            if (imagesQuery.hasNextPage) {
              imagesQuery.fetchNextPage();
            }
          }}
        />
      </FetchErrorMessage>
    </FetchErrorMessage>
  );
};
