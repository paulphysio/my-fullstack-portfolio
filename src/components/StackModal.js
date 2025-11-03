import { useEffect } from 'react';

export default function StackModal({ stack, onClose }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!stack) return null;

  return (
    <div className="stack-modal-overlay" onClick={onClose}>
      <div className="stack-modal" onClick={(e) => e.stopPropagation()}>
        <div className="stack-modal-header">
          <div className="stack-modal-controls">
            <span className="control control-close" onClick={onClose}></span>
            <span className="control control-minimize"></span>
            <span className="control control-maximize"></span>
          </div>
          <h3 className="stack-modal-title">
            <span className="prompt">$</span> cat /tech-stack/{stack.name.toLowerCase()}.info
          </h3>
          <button className="stack-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="stack-modal-body">
          <div className="stack-modal-content">
            <div className="stack-modal-icon">
              <img src={stack.image} alt={stack.name} />
            </div>
            
            <div className="stack-modal-info">
              <h2 className="stack-name">{stack.name}</h2>
              
              <div className="stack-section">
                <h4 className="stack-section-title">
                  <span className="prompt">→</span> Description
                </h4>
                <p className="stack-description">{stack.description}</p>
              </div>

              <div className="stack-section">
                <h4 className="stack-section-title">
                  <span className="prompt">→</span> Primary Use Cases
                </h4>
                <ul className="stack-uses">
                  {stack.uses.map((use, index) => (
                    <li key={index}>
                      <span className="list-marker">▸</span> {use}
                    </li>
                  ))}
                </ul>
              </div>

              {stack.expertise && (
                <div className="stack-section">
                  <h4 className="stack-section-title">
                    <span className="prompt">→</span> Expertise Level
                  </h4>
                  <div className="expertise-bar">
                    <div 
                      className="expertise-fill" 
                      style={{ width: `${stack.expertise}%` }}
                    >
                      <span className="expertise-text">{stack.expertise}%</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="stack-section">
                <h4 className="stack-section-title">
                  <span className="prompt">→</span> Category
                </h4>
                <span className="stack-category-badge">{stack.category}</span>
              </div>
            </div>
          </div>
          
          <div className="stack-modal-footer">
            <div className="terminal-prompt">
              <span className="prompt">$</span> Press ESC or click outside to close
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
