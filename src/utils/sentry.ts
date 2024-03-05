import * as Sentry from '@sentry/react-native';
import type { Extras, SeverityLevel } from '@sentry/types';
import { AxiosError } from 'axios';

import { inDevelopment } from './inDevelopment';

export const getSentry = () => Sentry;

export const captureError = (
  reason: unknown,
  fallbackMessage = 'Unknown error occurred',
  level: SeverityLevel = 'error',
  extra: Extras = {},
) => {
  if (inDevelopment()) {
    if (reason instanceof AxiosError) {
      // eslint-disable-next-line no-console
      console.log({
        extra,
        fallbackMessage,
        level,
        reason: reason.message,
        response: JSON.stringify(reason.response?.data),
      });
      return;
    }
    // eslint-disable-next-line no-console
    console.log({ extra, fallbackMessage, level, reason });
  }

  if (reason instanceof Error) {
    getSentry().captureException(reason, { extra, level });
  } else {
    getSentry().captureMessage(fallbackMessage, {
      extra: { ...extra, reason },
      level,
    });
  }
};
