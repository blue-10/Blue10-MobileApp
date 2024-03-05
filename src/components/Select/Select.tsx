import { useActionSheet } from '@expo/react-native-action-sheet';
import type React from 'react';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useBinding } from 'use-binding';

import { colors } from '@/theme';

import type { BoxProps } from '../Box/Box';
import Box from '../Box/Box';
import type { ButtonProps } from '../Button/Button';
import Button from '../Button/Button';
import Text from '../Text/Text';
import { SelectModal } from './SelectModal';

export type SelectItemValue = string;

export type SelectItem = {
  value: SelectItemValue;
  title: string;
  subTitle?: string;
};

export type SelectProps = {
  isDisabled?: boolean;
  isLoading?: boolean;
  hasSearch?: boolean;
  buttonVariant?: ButtonProps['variant'];
  placeholder?: string;
  style?: BoxProps['style'];
  label?: string;
  modalTitle?: string;
  selectType?: 'actionsheet' | 'modal';
  items: SelectItem[];
  defaultValue?: SelectItemValue;
  value?: SelectItemValue;
  onChange: (value: SelectItemValue) => void;
};

export const Select: React.FC<SelectProps> = ({
  isDisabled = false,
  isLoading = false,
  style,
  label,
  modalTitle = 'Select a item...',
  placeholder = 'No item selected',
  buttonVariant = 'secondary',
  selectType = 'modal',
  hasSearch = false,
  items,
  defaultValue,
  value,
  onChange,
}) => {
  const { showActionSheetWithOptions } = useActionSheet();
  const { t } = useTranslation();

  const [selectValue, setSelectValue] = useBinding<SelectItemValue>(defaultValue, value, onChange);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const buttonTitle = useMemo(() => {
    return items.find((item) => item.value === selectValue)?.title;
  }, [items, selectValue]);

  const showActionSheet = useCallback(() => {
    const options = items.map((item) => item.title);
    options.push(t('general.button_cancel'));

    showActionSheetWithOptions(
      {
        cancelButtonIndex: options.length - 1,
        options,
        showSeparators: true,
        title: modalTitle,
        titleTextStyle: {
          fontWeight: 'bold',
        },
      },
      (selectedIndex) => {
        if (selectedIndex && selectedIndex < items.length) {
          onChange(items[selectedIndex].value);
        }
      },
    );
  }, [items, modalTitle, onChange, showActionSheetWithOptions, t]);

  return (
    <Box style={style}>
      <Button
        isDisabled={isDisabled}
        isLoading={isLoading}
        size="M"
        title={buttonTitle ?? placeholder}
        variant={buttonVariant}
        onPress={function (): void {
          if (selectType === 'actionsheet') {
            showActionSheet();
            return;
          }
          setIsModalOpen(true);
        }}
      />
      <Box py={8}>
        <Text align="center" color={colors.labelLightSecondary}>
          {label}
        </Text>
      </Box>
      <SelectModal
        hasSearch={hasSearch}
        isShown={isModalOpen}
        items={items}
        selectedItem={selectValue}
        title={modalTitle}
        onClose={() => setIsModalOpen(false)}
        onSelect={(item) => {
          setSelectValue(item.value);
          setIsModalOpen(false);
        }}
      />
    </Box>
  );
};
