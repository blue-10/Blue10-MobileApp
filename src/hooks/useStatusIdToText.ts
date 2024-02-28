import { useCallback } from 'react';

import { Status } from '../entity/system/enums';
import { useGetSource } from './queries/useGetSource';

export const useStatusIdToText = () => {
  const { data: customData } = useGetSource('Custom');
  const { data: sourceData } = useGetSource('Shared');

  return useCallback(
    (statusId: number) => {
      const statusName = Status[statusId].toUpperCase();

      if (customData) {
        if (statusName in customData) {
          return customData[statusName];
        }
      }

      if (sourceData) {
        if (statusName in sourceData) {
          return sourceData[statusName];
        }
      }

      return [statusId, ': ', statusName].join('');
    },
    [customData, sourceData],
  );
};
