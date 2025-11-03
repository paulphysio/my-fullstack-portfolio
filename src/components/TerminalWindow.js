import { useState, useRef, useEffect } from 'react';

export default function TerminalWindow({ 
  title = 'terminal@paulmadu', 
  children,
  showControls = true,
  bootSequence = false,
  className = ''
}) {
  const [booted, setBooted] = useState(!bootSequence);
  const [output, setOutput] = useState([]);
  const terminalRef = useRef(null);

  useEffect(() => {
    if (bootSequence && !booted) {
      const bootMessages = [
        '[ SYSTEM ] Initializing terminal...',
        '[ OK ] Loading portfolio modules...',
        '[ OK ] Connecting to Paul Madu\'s workspace...',
        '[ OK ] Rendering ASCII interface...',
        '[ READY ] Terminal ready.',
      ];

      bootMessages.forEach((msg, i) => {
        setTimeout(() => {
          setOutput(prev => [...prev, msg]);
          if (i === bootMessages.length - 1) {
            setTimeout(() => setBooted(true), 500);
          }
        }, i * 400);
      });
    }
  }, [bootSequence, booted]);

  const copyToClipboard = () => {
    if (terminalRef.current) {
      const text = terminalRef.current.innerText;
      navigator.clipboard.writeText(text).then(() => {
        // Optional: show toast notification
      });
    }
  };

  return (
    <div className={`terminal-window ${className}`}>
      {showControls && (
        <div className="terminal-header">
          <div className="terminal-controls">
            <span className="control control-close" aria-label="Close"></span>
            <span className="control control-minimize" aria-label="Minimize"></span>
            <span className="control control-maximize" aria-label="Maximize"></span>
          </div>
          <div className="terminal-title">{title}</div>
          <button 
            className="terminal-copy"
            onClick={copyToClipboard}
            aria-label="Copy terminal content"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2h8v2H4V2zm8 4H4v8h8V6zM2 2v12h12V2H2z"/>
            </svg>
          </button>
        </div>
      )}
      <div className="terminal-body" ref={terminalRef}>
        {!booted ? (
          <div className="boot-sequence">
            {output.map((line, i) => (
              <div key={i} className="boot-line">{line}</div>
            ))}
          </div>
        ) : (
          children
        )}
      </div>
      <div className="terminal-scanline" aria-hidden="true"></div>
    </div>
  );
}
