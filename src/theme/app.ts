import { StyleSheet } from 'react-native';

import { colors } from './colors';
import { dimensions } from './dimensions';

export const app = StyleSheet.create({
  errorText: {
    color: colors.error,
  },
  headerText: {
    fontSize: dimensions.fontSizes.extraLarge,
    fontWeight: 'bold',
    marginBottom: dimensions.spacing.narrow,
  },
  normalText: {
    fontSize: dimensions.fontSizes.normal,
  },
  subTitleText: {
    fontSize: dimensions.fontSizes.normal,
    marginBottom: dimensions.spacing.narrow,
  },
});
