import { Extras, SeverityLevel } from '@sentry/types';
import * as Sentry from 'sentry-expo';

import { inDevelopment } from './inDevelopment';

export const getSentry = () => Sentry.Native;

export const captureError = (
  reason: unknown,
  fallbackMessage = 'Unknown error occurred',
  level: SeverityLevel = 'error',
  extra: Extras = {},
) => {
  if (inDevelopment()) {
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
