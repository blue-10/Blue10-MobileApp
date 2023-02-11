import React from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';

import Box from '../components/Box/Box';
import { colors } from '../theme';

// eslint-disable-next-line max-len
const exampleImage = 'https://images.unsplash.com/photo-1584445584400-1a7cc5de77ae?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=920&q=80';

export const InvoicePreviewScreen: React.FC = () => {
  return (
    <Box style={{ flex: 1 }}>
      <ImageViewer
        backgroundColor={colors.borderColor}
        imageUrls={[{ url: exampleImage }]}
        renderIndicator={(_currentIndex, _allSize) => <></>}
        saveToLocalByLongPress={false}
      />
    </Box>
  );
};
