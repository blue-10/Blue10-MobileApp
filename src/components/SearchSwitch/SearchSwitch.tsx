import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React, { useMemo, useState, useEffect } from 'react';

import { colors } from '@/theme';

import type { BoxProps } from '../Box/Box';
import Box from '../Box/Box';
import Text from '../Text/Text';

export type SearchSwitchItem = {
  value: string;
  title: string;
};

type Props = {
  label?: string;
  style?: BoxProps['style'];
  items: [SearchSwitchItem, SearchSwitchItem];
  defaultValue?: string;
  value?: string; // controlled
  onChange: (value: string) => void;
};

export const SearchSwitch: React.FC<Props> = ({
  style,
  label,
  items,
  defaultValue,
  value,
  onChange,
}) => {
  const isControlled = value !== undefined;

  const [selectValue, setSelectValue] = useState(
    defaultValue ?? items[0].value
  );

  useEffect(() => {
    if (isControlled) {
      setSelectValue(value!);
    }
  }, [value, isControlled]);

  const handleChange = (newValue: string) => {
    if (!isControlled) {
      setSelectValue(newValue);
    }
    onChange(newValue);
  };

  const selectedIndex = useMemo(() => {
    return items.findIndex((item) => item.value === selectValue);
  }, [items, selectValue]);

  return (
    <Box style={style}>
      <Box px={20} py={7}>
        <SegmentedControl
          appearance='light'
          selectedIndex={selectedIndex}
          values={items.map((item) => item.title)}
          onChange={(evt) => {
            const index = evt.nativeEvent.selectedSegmentIndex;
            handleChange(items[index].value);
          }}
        />
      </Box>
      <Box py={8}>
        <Text align='center' color={colors.labelLightSecondary}>
          {label}
        </Text>
      </Box>
    </Box>
  );
};
