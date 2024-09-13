import { inDevelopment } from './inDevelopment';

/* eslint-disable no-console */
export const globalDisableConsoleForProductionAndStaging = () => {
  if (!inDevelopment()) {
    console.log = () => null;
    console.info = () => null;
    console.warn = () => null;
    console.error = () => null;
  } else {
    console.info('console.log|info|warn|error are enabled');
  }
};
