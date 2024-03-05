import type React from 'react';
import { useRef } from 'react';
import type { TextInputProps } from 'react-native';
import { StyleSheet, TextInput } from 'react-native';
import { useBinding } from 'use-binding';

import SVGSearchIcon from '@/assets/icons/magnifyingglass.svg';
import SVGMarkCircleFill from '@/assets/icons/xmark-circle-fill.svg';
import Box from '@/components/Box/Box';
import { TouchableIcon } from '@/components/TouchableIcon/TouchableIcon';
import { colors, text } from '@/theme';

type Props = TextInputProps;

export const SearchInput: React.FC<Props> = ({ style, defaultValue, value, onChangeText, ...props }) => {
  const [inputValue, setInputValue] = useBinding(defaultValue, value, onChangeText);
  const textRef = useRef<TextInput>(null);

  return (
    <Box px={16} py={8} style={styles.container}>
      <SVGSearchIcon color={colors.searchInput.placeholder} height={16} width={16} />
      <TextInput
        ref={textRef}
        autoComplete="off"
        inputMode="search"
        placeholder={colors.searchInput.placeholder}
        returnKeyType="search"
        style={[styles.input, style]}
        value={inputValue}
        onChangeText={setInputValue}
        {...props}
      />
      {inputValue && inputValue.length > 0 && (
        <TouchableIcon
          defaultColor={{ color: colors.searchInput.placeholder, fill: colors.searchInput.placeholder }}
          icon={SVGMarkCircleFill}
          size={16}
          onPress={() => {
            if (textRef.current) {
              textRef.current.clear();
            }
          }}
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
