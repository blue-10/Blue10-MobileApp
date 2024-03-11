import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { useMemo } from 'react';
import { useBinding } from 'use-binding';

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
  value?: string;
  onChange: (value: string) => void;
};

export const SearchSwitch: React.FC<Props> = ({ style, label, items, defaultValue, value, onChange }) => {
  const [selectValue, setSelectValue] = useBinding<string>(defaultValue, value, onChange);

  const selectedIndex = useMemo(() => {
    return items.findIndex((item) => item.value === selectValue);
  }, [items, selectValue]);

  return (
    <Box style={style}>
      <Box px={20} py={7}>
        <SegmentedControl
          appearance="light"
          selectedIndex={selectedIndex}
          values={items.map((item) => item.title)}
          onChange={(evt) => {
            const index = evt.nativeEvent.selectedSegmentIndex;
            setSelectValue(items[index].value);
          }}
        />
      </Box>
      <Box py={8}>
        <Text align="center" color={colors.labelLightSecondary}>
          {label}
        </Text>
      </Box>
    </Box>
  );
};
