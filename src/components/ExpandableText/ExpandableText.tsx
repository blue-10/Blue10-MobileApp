import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

type Props = {
  text: string;
  initiallyExpanded?: boolean;
  color?: string;
  widthPercent: number;
};

const ExpandableText: React.FC<Props> = ({ text, initiallyExpanded, color, widthPercent }) => {
  const [expanded, setExpanded] = useState(initiallyExpanded ?? false);
  const [trimmedText, setTrimmedText] = useState(text);

  
  const screenWidth = Dimensions.get('window').width;
  const containerWidth = (widthPercent / 100) * screenWidth;

  useEffect(() => {
    const avgCharWidth = 16 * 0.5;
    const maxChars = Math.floor(containerWidth / avgCharWidth) - 1;

    if (text.length > maxChars) {
      setTrimmedText(text.slice(0, maxChars) + '…');
    } else {
      setTrimmedText(text);
    }
  }, [text, containerWidth, 16]);

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}>
      <Text
        style={[styles.text, color && { color }]}
        numberOfLines={expanded ? undefined : 1}
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
