import Box from '../Box/Box';
import Text from '../Text/Text';

type Props = {
  title?: string;
};

export const ListItemHeader: React.FC<Props> = ({ title }) => (
  <Box px={42} py={16}>
    <Text variant="bodyRegularBold">{title}</Text>
  </Box>
);
