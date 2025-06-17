import React, { useMemo, useState, useEffect } from 'react';
import { Switch } from 'react-native';

import { colors, dimensions } from '@/theme';

import type { ListItemProps } from '../ListItem/ListItem';
import { ListItem } from '../ListItem/ListItem';

type Props = Omit<ListItemProps, 'isChecked' | 'onPress'> & {
  isDisabled?: boolean;
  isChecked?: boolean; // controlled prop
  isDefaultChecked?: boolean; // uncontrolled initial value
  onChecked?: (isChecked: boolean) => void;
};

export const ListItemCheckbox: React.FC<Props> = ({
  isDisabled = false,
  isChecked,
  isDefaultChecked = false,
  onChecked,
  ...listProps
}) => {
  const isControlled = isChecked !== undefined;

  const [isCheckedValue, setIsCheckedValue] = useState(isDefaultChecked);

  // Sync state when controlled prop changes
  useEffect(() => {
    if (isControlled) {
      setIsCheckedValue(isChecked!);
    }
  }, [isChecked, isControlled]);

  const handleSetCheckedValue = (value: boolean) => {
    if (!isControlled) {
      setIsCheckedValue(value);
    }
    onChecked?.(value);
  };

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
        onChange={(evt) => handleSetCheckedValue(evt.nativeEvent.value)}
      />
    ),
    [isCheckedValue, isDisabled],
  );

  return (
    <ListItem
      {...listProps}
      suffixElement={suffixElement}
      onPress={() => {
        handleSetCheckedValue(!isCheckedValue);
      }}
    />
  );
};
