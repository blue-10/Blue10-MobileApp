import { TextInput as ReactTextInput } from '@react-native-material/core';

type Props = {
  value?: string | undefined;
  label?: string;
  onChangeText?: (text: string) => void;
  isSecureTextEntry?: boolean;
}

const TextInput: React.FC<Props> = ({ label, isSecureTextEntry, ...props }) => (
  <ReactTextInput
    helperText={label}
    secureTextEntry={isSecureTextEntry}
    {...props}
  />
);

export default TextInput;
