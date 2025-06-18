import React from 'react';
import { ActivityIndicator, View } from 'react-native';

import SvgCheckmarkIcon from '../../../assets/icons/checkmark-icon.svg';
import SvgCrossIcon from '../../../assets/icons/xmark-icon.svg';
import { UploadStepState } from '../../store/UploadStore';

export const UploadStepIcon: React.FC<{ state: UploadStepState }> = ({ state }) => {
  switch (state) {
    case UploadStepState.READY:
      return <SvgCheckmarkIcon color="rgba(255, 255, 255, 0.4)" height={15} width={15} />;

    case UploadStepState.BUSY:
      return <ActivityIndicator color="rgba(255, 255, 255, 0.8)" size={15} />;

    case UploadStepState.SUCCESS:
      return <SvgCheckmarkIcon color="rgba(20, 255, 20, 1)" height={15} width={15} />;

    case UploadStepState.ERROR:
      return <SvgCrossIcon color="rgba(255, 20, 20, 1)" height={15} width={15} />;

    default:
      return <View />;
  }
};
