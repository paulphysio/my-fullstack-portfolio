import React, { useState, useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';

export default function TerminalText({ text, speed = 50 }) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const textArray = Array.isArray(text) ? text : [text];
  const fullText = textArray.join('\n');

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + fullText[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);

      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText, speed]);

  return (
    <Text style={styles.text}>
      {displayedText}
      <Text style={styles.cursor}>█</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'monospace',
    fontSize: 14,
    color: '#00ff9f',
    lineHeight: 20,
  },
  cursor: {
    color: '#00f0ff',
  },
});
