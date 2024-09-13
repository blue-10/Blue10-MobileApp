import { useCallback } from 'react';

import { Action, FreeAction } from '../entity/system/enums';
import { useGetSource } from './queries/useGetSource';

export const useActionIdToText = () => {
  const { data: customData } = useGetSource('Custom');
  const { data: sourceData } = useGetSource('Shared');

  return useCallback(
    (actionId: number) => {
      const actionNameFree = (FreeAction[actionId] || '').toUpperCase();
      const actionName = Action[actionId].toUpperCase();

      if (customData && actionNameFree in customData) {
        return customData[actionNameFree];
      }

      if (customData && actionName in customData) {
        return customData[actionName];
      }

      if (sourceData && actionNameFree in sourceData) {
        return sourceData[actionNameFree];
      }

      if (sourceData && actionName in sourceData) {
        return sourceData[actionName];
      }

      return [actionId, ': ', actionName].join('');
    },
    [customData, sourceData],
  );
};

export const useActionIdToCompleteText = () => {
  const { data: customData } = useGetSource('Custom');
  const { data: sourceData } = useGetSource('Shared');

  return useCallback(
    (actionId: number) => {
      const actionNameCompleted = `${Action[actionId].toUpperCase()}_COMPLETED`;
      const actionName = Action[actionId].toUpperCase();
      if (customData) {
        if (actionNameCompleted in customData) {
          return customData[actionNameCompleted];
        }

        if (actionName in customData) {
          return customData[actionName];
        }
      }

      if (sourceData) {
        if (actionNameCompleted in sourceData) {
          return sourceData[actionNameCompleted];
        }

        if (actionName in sourceData) {
          return sourceData[actionName];
        }
      }

      return [actionId, ': ', actionName].join('');
    },
    [customData, sourceData],
  );
};
