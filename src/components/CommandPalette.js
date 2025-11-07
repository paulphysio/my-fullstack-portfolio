import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';

const COMMANDS = [
  { cmd: 'open projects', desc: 'View all projects', action: '/projects' },
  { cmd: 'show contact', desc: 'Contact information', action: '/contact' },
  { cmd: 'about me', desc: 'Learn about Paul', action: '/about' },
  { cmd: 'read blog', desc: 'Read blog posts', action: '/blog' },
  { cmd: 'go home', desc: 'Return to home', action: '/' },
  { cmd: 'deploy demo', desc: 'View deployment info', action: '#deploy' },
  { cmd: 'run live', desc: 'See live projects', action: '/projects?filter=live' },
];

export default function CommandPalette({ isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [filteredCommands, setFilteredCommands] = useState(COMMANDS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ctrl+K or Cmd+K to toggle
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open from parent
        }
      }

      // Escape to close
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (input.trim()) {
      const filtered = COMMANDS.filter((cmd) =>
        cmd.cmd.toLowerCase().includes(input.toLowerCase()) ||
        cmd.desc.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredCommands(filtered);
      setSelectedIndex(0);
    } else {
      setFilteredCommands(COMMANDS);
    }
  }, [input]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => 
        prev < filteredCommands.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(filteredCommands[selectedIndex]);
    }
  };

  const executeCommand = (command) => {
    if (!command) return;
    
    if (command.action.startsWith('#')) {
      // Handle special actions
      // Special action executed
    } else {
      router.push(command.action);
    }
    
    setInput('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="command-palette-overlay" onClick={onClose}>
      <div 
        className="command-palette"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Command palette"
      >
        <div className="command-input-wrapper">
          <span className="command-prompt">$</span>
          <input
            ref={inputRef}
            type="text"
            className="command-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            aria-label="Command input"
          />
        </div>
        <div className="command-results">
          {filteredCommands.length > 0 ? (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.cmd}
                className={`command-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => executeCommand(cmd)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <span className="command-name">{cmd.cmd}</span>
                <span className="command-desc">{cmd.desc}</span>
              </div>
            ))
          ) : (
            <div className="command-empty">No commands found</div>
          )}
        </div>
        <div className="command-footer">
          <kbd>↑↓</kbd> Navigate <kbd>Enter</kbd> Execute <kbd>Esc</kbd> Close
        </div>
      </div>
    </div>
  );
}
