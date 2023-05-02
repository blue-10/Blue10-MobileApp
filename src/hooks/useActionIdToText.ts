import { useCallback } from 'react';

import { Action } from '../entity/system/enums';
import { useGetSource } from './queries/useGetSource';

export const useActionIdToText = () => {
  const { data: sourceData } = useGetSource('Shared');

  return useCallback((actionId: number) => {
    const actionName = Action[actionId].toUpperCase();
    if ((sourceData) && (actionName in sourceData)) {
      return sourceData[actionName];
    }

    return [actionId, ': ', actionName].join('');
  }, [sourceData]);
};

export const useActionIdToCompleteText = () => {
  const { data: sourceData } = useGetSource('Shared');

  return useCallback((actionId: number) => {
    const actionNameCompleted = Action[actionId].toUpperCase() + '_COMPLETED';
    const actionName = Action[actionId].toUpperCase();
    if (sourceData) {
      if (actionNameCompleted in sourceData) {
        return sourceData[actionNameCompleted];
      }

      if (actionName in sourceData) {
        return sourceData[actionName];
      }
    }

    return [actionId, ': ', actionName].join('');
  }, [sourceData]);
};
