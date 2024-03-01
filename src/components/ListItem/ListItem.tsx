import type React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';

import CheckMarkIcon from '../../../assets/icons/checkmark-icon.svg';
import { colors, dimensions } from '../../theme';
import Box from '../Box/Box';
import Text from '../Text/Text';

type Props = {
  variant?: 'checkbox' | 'default';
  isChecked?: boolean;
  isEven: boolean;
  title: string;
  subTitle?: string | null;
  onPress: () => void;
};

export const ListItem: React.FC<Props> = ({ variant = 'default', isEven, isChecked, title, subTitle, onPress }) => {
  return (
    <TouchableHighlight
      style={[styles.item, isEven ? styles.even : styles.odd]}
      underlayColor={colors.primary}
      onPress={onPress}
    >
      <>
        {variant === 'checkbox' && (
          <Box mr={8} style={styles.checkboxView}>
            {isChecked && <CheckMarkIcon color={colors.primary} height={16} width={16} />}
          </Box>
        )}
        <Box>
          <Text spaceAfter={2} variant="bodyRegular">
            {title}
          </Text>
          {subTitle && (
            <Text color={colors.labelLightSecondary} variant="caption1Regular">
              {subTitle}
            </Text>
          )}
        </Box>
      </>
    </TouchableHighlight>
  );
};

const styles = StyleSheet.create({
  checkboxView: {
    height: 16,
    width: 16,
  },
  even: {
    backgroundColor: colors.list.even.background,
  },
  item: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: dimensions.list.singleItem.margin,
    padding: dimensions.list.singleItem.padding,
  },
  odd: {
    backgroundColor: colors.list.odd.background,
  },
  title: {
    flex: 1,
    fontSize: dimensions.list.singleItem.fontSize,
  },
});
