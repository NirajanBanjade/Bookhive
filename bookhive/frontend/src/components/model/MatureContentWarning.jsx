import { useEffect, useState } from 'react';
import './MatureContentWarning.css';

const MatureContentWarning = ({ isOpen, onClose, onAccept, bookTitle }) => {
  const [dontAskAgain, setDontAskAgain] = useState(false);

  // Add keyboard support (ESC key to close)
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Handle accept with "Don't Ask Again" preference
  const handleAccept = () => {
    if (dontAskAgain) {
      localStorage.setItem('skipMatureWarnings', 'true');
    }
    onAccept();
  };

  if (!isOpen) return null;

  return (
    <div className="mature-warning-overlay" onClick={onClose}>
      <div className="mature-warning-modal" onClick={(e) => e.stopPropagation()}>
        <div className="mature-warning-header">
          <span className="warning-icon">⚠️</span>
          <h2>Mature Content Warning</h2>
        </div>
        
        <div className="mature-warning-body">
          <p className="warning-message">
            The book <strong>"{bookTitle}"</strong> has been marked as containing mature content 
            that may not be suitable for minors.
          </p>
          
          <p className="warning-details">
            This content may include themes, language, or situations intended for adult audiences.
          </p>
          
          <p className="warning-question">
            Do you wish to continue?
          </p>

          {/* Don't Ask Again Checkbox */}
          <div className="dont-ask-again">
            <label className="checkbox-label">
              <input 
                type="checkbox" 
                checked={dontAskAgain}
                onChange={(e) => setDontAskAgain(e.target.checked)}
              />
              <span>Don't ask me again for mature content</span>
            </label>
          </div>
        </div>
        
        <div className="mature-warning-actions">
          <button 
            className="btn-decline" 
            onClick={onClose}
          >
            No, Go Back
          </button>
          <button 
            className="btn-accept" 
            onClick={handleAccept}
          >
            Yes, I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatureContentWarning;