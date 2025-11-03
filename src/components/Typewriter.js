import { useState, useEffect, useRef } from 'react';

export default function Typewriter({
  text,
  speed = 50,
  pauseAfterLine = 500,
  loop = false,
  cursorChar = '█',
  humanize = true,
  onComplete,
  className = '',
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [lineIndex, setLineIndex] = useState(0);
  const timeoutRef = useRef(null);

  const textArray = Array.isArray(text) ? text : [text];
  const fullText = textArray.join('\n');

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (currentIndex < fullText.length) {
      const char = fullText[currentIndex];
      const isNewLine = char === '\n';
      
      // Humanize: add variance to typing speed
      const variance = humanize ? Math.random() * speed * 0.5 : 0;
      const delay = speed + variance;
      
      // Longer pause for punctuation
      const punctuationDelay = ['.', '!', '?', ','].includes(char) ? 150 : 0;

      timeoutRef.current = setTimeout(
        () => {
          setDisplayedText((prev) => prev + char);
          setCurrentIndex((prev) => prev + 1);

          if (isNewLine) {
            setLineIndex((prev) => prev + 1);
          }
        },
        isNewLine ? pauseAfterLine : delay + punctuationDelay
      );
    } else if (loop) {
      setTimeout(() => {
        setDisplayedText('');
        setCurrentIndex(0);
        setLineIndex(0);
      }, 2000);
    } else if (onComplete) {
      onComplete();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, fullText, speed, pauseAfterLine, loop, humanize, onComplete]);

  return (
    <div
      className={`typewriter ${className}`}
      role="status"
      aria-live="polite"
      aria-atomic="false"
    >
      <pre className="typewriter-text">
        {displayedText}
        {showCursor && <span className="cursor">{cursorChar}</span>}
      </pre>
    </div>
  );
}
