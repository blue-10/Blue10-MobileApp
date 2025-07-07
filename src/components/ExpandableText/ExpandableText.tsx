import React, { useState } from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

const colors = {
  list: {
    separator: '#e0e0e0', // You can adjust this color as needed
  },
};

type Props = {
  text: string;
  initiallyExpanded?: boolean;
};

const ExpandableText: React.FC<Props> = ({ text, initiallyExpanded }) => {
  const [expanded, setExpanded] = useState(initiallyExpanded);

  let shortText = text.slice(0, 25);
  if (text.length > 25) {
    shortText += '...';
  }
  const displayText = expanded ? text : shortText;

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
      <Text style={styles.text}>{displayText}</Text>
    </TouchableOpacity>
  );
};

export default ExpandableText;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: '#333',
  },
});
