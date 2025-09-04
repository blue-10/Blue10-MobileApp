import { TextInput as ReactTextInput } from '@react-native-material/core';

type Props = {
  value?: string | undefined;
  label?: string;
  onChangeText?: (text: string) => void;
  isSecureTextEntry?: boolean;
  isDisabled?: boolean;
};

const TextInput: React.FC<Props> = ({ label, isSecureTextEntry, isDisabled = false, ...props }) => (
  <ReactTextInput editable={!isDisabled} helperText={label} selectTextOnFocus={!isDisabled} {...props} />
);

export default TextInput;
