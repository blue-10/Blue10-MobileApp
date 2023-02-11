/* eslint-disable no-console */
export const globalDisableConsoleForProductionAndStaging = () => {
  const env = process.env.NODE_ENV;
  const isLogDisabled = env === 'production' || env === 'staging';

  if (isLogDisabled) {
    console.log = () => null;
    console.info = () => null;
    console.warn = () => null;
    console.error = () => null;
  } else {
    console.info('console.log|info|warn|error are enabled');
  }
};
