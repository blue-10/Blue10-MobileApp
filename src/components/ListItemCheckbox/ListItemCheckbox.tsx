import { useMemo } from 'react';
import { Switch } from 'react-native';
import { useBinding } from 'use-binding';

import { colors, dimensions } from '@/theme';

import type { ListItemProps } from '../ListItem/ListItem';
import { ListItem } from '../ListItem/ListItem';

type Props = Omit<ListItemProps, 'isChecked' | 'onPress'> & {
  isDisabled?: boolean;
  isChecked?: boolean;
  isDefaultChecked?: boolean;
  onChecked?: (isChecked: boolean) => void;
};

export const ListItemCheckbox: React.FC<Props> = ({
  isDisabled = false,
  isChecked,
  isDefaultChecked,
  onChecked,
  ...listProps
}) => {
  const [isCheckedValue, setIsCheckedValue] = useBinding(isDefaultChecked, isChecked, onChecked);

  const suffixElement = useMemo(
    () => (
      <Switch
        disabled={isDisabled}
        style={{ marginLeft: dimensions.spacing.narrow }}
        thumbColor={colors.switch.thumbColor}
        trackColor={{
          false: colors.switch.trackcolorFalse,
          true: colors.switch.trackcolorTrue,
        }}
        value={isCheckedValue}
        onChange={(evt) => setIsCheckedValue(evt.nativeEvent.value)}
      />
    ),
    [isCheckedValue, isDisabled, setIsCheckedValue],
  );

  return (
    <ListItem
      {...listProps}
      suffixElement={suffixElement}
      onPress={() => {
        setIsCheckedValue((value) => (value === undefined ? true : !value));
      }}
    />
  );
};
