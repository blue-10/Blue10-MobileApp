const primaryColor = 'rgb(196,214,0)';
const primaryBlueColor = 'rgba(0, 122, 255, 1)';
const secondaryBlueColor = '#5AC8FA';
const primaryTextColor = '#000000';
const secondaryTextColor = '#c5c5c5';
const whiteColor = '#ffffff';
const blackColor = '#000000';

export const colors = {
  black: blackColor,
  borderColor: '#E9E9EA',
  button: {
    grey: {
      background: '#AEAEB2',
      text: whiteColor,
    },
    greyClear: {
      text: '#AEAEB2',
    },
    primary: {
      background: primaryBlueColor,
      text: whiteColor,
    },
    primaryClear: {
      text: primaryBlueColor,
    },
    secondary: {
      background: secondaryBlueColor,
      text: whiteColor,
    },
    secondaryClear: {
      text: secondaryBlueColor,
    },
    iconColor: '#7c7c7c',
  },
  dashboard: {
    scan: {
      background: 'rgba(90, 200, 250, 1)',
      text: whiteColor,
    },
    search: {
      background: '#FF9500',
    },
    switchEnv: {
      background: 'rgba(209, 209, 214, 1)',
    },
    toDo: {
      background: 'rgba(255, 59, 48, 1)',
      text: whiteColor,
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
  primary: primaryColor,
  primaryText: primaryTextColor,
  scan: {
    addIconColor: 'rgba(52, 199, 89, 1)',
    deleteIconBackgroundColor: 'rgba(255, 59, 48, 1)',
    deleteIconColor: whiteColor,
    deleteIconDisabledBackgroundColor: 'rgba(142, 32, 28, 1)',
    deleteIconDisabledColor: 'rgba(142, 142, 147, 1)',
    toggleDisabledColor: 'rgba(142, 142, 147, 1)',
    toggleEnabledColor: whiteColor,
    transparentBackground: 'rgba(0, 0, 0, 0.6)',
    uploadIconColor: whiteColor,
    uploadIconDisabledColor: 'rgba(142, 142, 147, 1)',
  },
  screen: {
    background: 'rgba(249, 249, 249, 1)',
    text: primaryTextColor,
  },
  searchInput: {
    background: 'background: rgba(118, 118, 128, 0.12)',
    placeholder: 'background: rgba(60, 60, 67, 0.6)',
    text: blackColor,
  },
  secondaryText: 'rgba(142, 142, 147, 1)',
  switch: {
    thumbColor: undefined,
    trackcolorFalse: null,
    trackcolorTrue: primaryColor,
  },
  toast: {
    background: 'rgba(142, 142, 147, 1)',
    buttonColor: whiteColor,
    text: whiteColor,
  },
  white: whiteColor,
};
