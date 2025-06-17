import React, { useEffect, useRef, useState } from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';

import SVGSearchIcon from '@/assets/icons/magnifyingglass.svg';
import SVGMarkCircleFill from '@/assets/icons/xmark-circle-fill.svg';
import Box from '@/components/Box/Box';
import { TouchableIcon } from '@/components/TouchableIcon/TouchableIcon';
import { colors, text } from '@/theme';

type Props = TextInputProps & {
  onClear?: () => void;
};

export const SearchInput: React.FC<Props> = ({
  style,
  defaultValue = '',
  value,
  onChangeText,
  onClear,
  ...props
}) => {
  const isControlled = value !== undefined;
  const [inputValue, setInputValue] = useState(defaultValue);
  const textRef = useRef<TextInput>(null);

  // Sync internal state when controlled `value` changes
  useEffect(() => {
    if (isControlled) {
      setInputValue(value ?? '');
    }
  }, [value]);

  const handleChangeText = (text: string) => {
    if (!isControlled) {
      setInputValue(text);
    }
    onChangeText?.(text);
  };

  const handleClear = () => {
    if (textRef.current) {
      textRef.current.clear();
    }
    if (!isControlled) {
      setInputValue('');
    }
    onClear?.();
    onChangeText?.('');
  };

  return (
    <Box px={16} py={8} style={styles.container}>
      <SVGSearchIcon
        color={colors.searchInput.placeholder}
        height={16}
        width={16}
      />
      <TextInput
        ref={textRef}
        autoComplete='off'
        enterKeyHint='search'
        inputMode='search'
        placeholder={colors.searchInput.placeholder}
        returnKeyType='search'
        style={[styles.input, style]}
        value={inputValue}
        onChangeText={handleChangeText}
        {...props}
      />
      {!!inputValue && (
        <TouchableIcon
          defaultColor={{
            color: colors.searchInput.placeholder,
            fill: colors.searchInput.placeholder,
          }}
          icon={SVGMarkCircleFill}
          size={16}
          onPress={handleClear}
        />
      )}
    </Box>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.searchInput.background,
    borderRadius: 10,
    color: colors.searchInput.text,
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    ...text.inputText,
  },
});
