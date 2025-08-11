import React, { useState } from 'react';
import type { NativeSyntheticEvent, TextLayoutEventData } from 'react-native';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
  text: string;
  initiallyExpanded?: boolean;
};

const ExpandableText: React.FC<Props> = ({ text, initiallyExpanded }) => {
  const [expanded, setExpanded] = useState(initiallyExpanded ?? false);
  const [trimmedText, setTrimmedText] = useState(text);

  const handleTextLayout = (e: NativeSyntheticEvent<TextLayoutEventData>) => {
    if (!expanded) {
      const { lines } = e.nativeEvent;
      if (lines.length > 1) {
        setTrimmedText(lines[0].text.trimEnd() + '…');
      }
    }
  };

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
      <Text
        style={styles.text}
        numberOfLines={expanded ? undefined : 1}
        onTextLayout={handleTextLayout}
      >
        {expanded ? text : trimmedText}
      </Text>
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
