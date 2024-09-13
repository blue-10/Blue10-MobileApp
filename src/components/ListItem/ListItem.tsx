import type React from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';

import CheckMarkIcon from '../../../assets/icons/checkmark-icon.svg';
import { colors, dimensions } from '../../theme';
import Box from '../Box/Box';
import Text from '../Text/Text';

export type ListItemProps = {
  variant?: 'checkbox' | 'default';
  isChecked?: boolean;
  isEven: boolean;
  title: string;
  subTitle?: string | null;
  suffixElement?: React.ReactNode | string;
  onPress: () => void;
};

export const ListItem: React.FC<ListItemProps> = ({
  variant = 'default',
  isEven,
  isChecked,
  title,
  subTitle,
  suffixElement,
  onPress,
}) => {
  return (
    <TouchableHighlight
      style={[styles.item, isEven ? styles.even : styles.odd]}
      underlayColor={colors.primary}
      onPress={onPress}
    >
      <>
        {variant === 'checkbox' && (
          <Box mx={8} style={styles.checkboxView}>
            {isChecked && <CheckMarkIcon color={colors.primary} height={16} width={16} />}
          </Box>
        )}
        <Box style={styles.titleContainer}>
          <Text spaceAfter={2} variant="bodyRegular">
            {title}
          </Text>
          {subTitle && (
            <Text color={colors.labelLightSecondary} variant="caption1Regular">
              {subTitle}
            </Text>
          )}
        </Box>
        {suffixElement && <Box>{suffixElement}</Box>}
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
  titleContainer: {
    flex: 1,
  },
});
