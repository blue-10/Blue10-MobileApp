import { useActionSheet } from '@expo/react-native-action-sheet';
import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

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
  modalTitle,
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

  const isControlled = value !== undefined;
  const [selectValue, setSelectValue] = useState<SelectItemValue | undefined>(defaultValue);

  // Sync internal state with controlled value if present
  useEffect(() => {
    if (isControlled) {
      setSelectValue(value);
    }
  }, [value, isControlled]);

  const buttonTitle = useMemo(() => {
    return items.find((item) => item.value === selectValue)?.title;
  }, [items, selectValue]);

  const [isModalOpen, setIsModalOpen] = useState(false);

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
        if (selectedIndex !== undefined && selectedIndex < items.length) {
          const newValue = items[selectedIndex].value;
          if (!isControlled) {
            setSelectValue(newValue);
          }
          onChange(newValue);
        }
      },
    );
  }, [items, modalTitle, onChange, showActionSheetWithOptions, t, isControlled]);

  return (
    <Box style={style}>
      <Button
        isDisabled={isDisabled}
        isLoading={isLoading}
        size="M"
        title={buttonTitle ?? placeholder}
        variant={buttonVariant}
        onPress={() => {
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
        title={modalTitle || label || 'Select a item...'}
        onClose={() => setIsModalOpen(false)}
        onSelect={(item) => {
          if (!isControlled) {
            setSelectValue(item.value);
          }
          onChange(item.value);
          setIsModalOpen(false);
        }}
      />
    </Box>
  );
};
