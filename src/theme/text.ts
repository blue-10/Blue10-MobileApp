import { TextStyle } from 'react-native';

export type TextStyleType = 'bodyRegular' |
  'bodyRegularBold' |
  'buttonLarge' |
  'buttonMedium' |
  'buttonSmall' |
  'caption1Regular' |
  'title'
  ;
type TextStyles = Record<TextStyleType, TextStyle>

export const text: TextStyles = {
  bodyRegular: {
    fontSize: 17,
    fontWeight: '400',
    letterSpacing: -0.408,
    lineHeight: 22,
  },
  bodyRegularBold: {
    fontSize: 17,
    fontWeight: '600',
    letterSpacing: -0.8,
    lineHeight: 18,
  },
  buttonLarge: {
    fontSize: 18,
    fontWeight: '700', // design says 656 (not possible in react-native)
    lineHeight: 21,
  },
  buttonMedium: {
    fontSize: 16,
    fontWeight: '700', // design says 656 (not possible in react-native)
    lineHeight: 19,
  },
  buttonSmall: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 16,
  },
  caption1Regular: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  title: {
    fontSize: 34,
    fontWeight: '300',
    lineHeight: 41,
  },
};
