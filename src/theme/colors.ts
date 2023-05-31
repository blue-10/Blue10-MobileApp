const primaryTextColor = '#000000';
const secondaryTextColor = '#c5c5c5';
const whiteColor = '#ffffff';
const blackColor = '#000000';

export const colors = {
  black: blackColor,
  borderColor: '#E9E9EA',
  button: {
    grey: {
      background: '#D1D1D6',
      text: whiteColor,
    },
    greyClear: {
      text: '#D1D1D6',
    },
    primary: {
      background: 'rgba(0, 122, 255, 1)',
      text: whiteColor,
    },
    primaryClear: {
      text: 'rgba(0, 122, 255, 1)',
    },
    secondary: {
      background: '#5AC8FA',
      text: whiteColor,
    },
    secondaryClear: {
      text: '#5AC8FA',
    },
  },
  dashboard: {
    approval: {
      background: 'rgba(255, 59, 48, 1)',
      text: whiteColor,
    },
    scan: {
      background: 'rgba(90, 200, 250, 1)',
      text: whiteColor,
    },
    switchEnv: {
      background: 'rgba(209, 209, 214, 1)',
    },
  },
  error: 'red',
  header: {
    background: 'rgba(249, 249, 249, 0.94)',
  },
  labelLightSecondary: 'rgba(60, 60, 67, 0.6)',
  list: {
    even: {
      background: whiteColor,
    },
    odd: {
      background: 'rgba(249, 249, 249, 1)',
    },
    separator: 'rgba(60, 60, 67, 0.36)',
    text: {
      primary: primaryTextColor,
      secondary: secondaryTextColor,
    },
  },
  overlayBackground: 'rgba(0, 0, 0, 0.4)',
  primary: 'rgb(196,214,0)',
  primaryText: primaryTextColor,
  screen: {
    background: 'rgba(249, 249, 249, 1)',
    text: primaryTextColor,
  },
  secondaryText: 'rgba(142, 142, 147, 1)',
  toast: {
    background: 'rgba(142, 142, 147, 1)',
    buttonColor: whiteColor,
    text: whiteColor,
  },
  white: whiteColor,
};
