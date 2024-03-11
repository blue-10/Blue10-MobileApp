import { TextInput, type TextInputProps } from 'react-native';

import { colors, text } from '@/theme';

import Box from '../Box/Box';
import Text from '../Text/Text';

type Props = TextInputProps & {
  label?: string;
};

export const TextLabelInput: React.FC<Props> = ({ label, style, ...props }) => (
  <Box borderBottom={1} borderColor={colors.borderColor} gap={8} py={4}>
    <TextInput style={[text.inputText, style]} {...props} />
    <Text color={colors.labelLightSecondary} variant="caption1Regular">
      {label}
    </Text>
  </Box>
);
