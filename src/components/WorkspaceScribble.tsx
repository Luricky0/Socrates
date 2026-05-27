import React, { useState } from 'react';
import type { WorkspaceNote } from '../types/mathscape';
import { X, Book, Calculator, Plus, Trash2, ArrowLeftRight, Copy } from 'lucide-react';

interface WorkspaceScribbleProps {
  isOpen: boolean;
  onClose: () => void;
  notes: WorkspaceNote[];
  onAddNote: (title: string, content: string) => void;
  onDeleteNote: (id: string) => void;
  onInsertToChat: (text: string) => void;
}

export const WorkspaceScribble: React.FC<WorkspaceScribbleProps> = ({
  isOpen,
  onClose,
  notes,
  onAddNote,
  onDeleteNote,
  onInsertToChat
}) => {
  const [activeTab, setActiveTab] = useState<'notebook' | 'calculator'>('notebook');
  
  // Notebook states
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  
  // Calculator states
  const [calcInput, setCalcInput] = useState('');
  const [calcResult, setCalcResult] = useState('');
  const [calcHistory, setCalcHistory] = useState<string[]>([]);

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;
    const title = noteTitle.trim() || `Draft Equation #${notes.length + 1}`;
    onAddNote(title, noteContent);
    setNoteTitle('');
    setNoteContent('');
  };

  // Calculator button handler
  const handleCalcClick = (val: string) => {
    if (val === 'C') {
      setCalcInput('');
      setCalcResult('');
    } else if (val === 'back') {
      setCalcInput(prev => prev.slice(0, -1));
    } else if (val === '=') {
      try {
        let sanitized = calcInput
          .replace(/e/g, Math.E.toString())
          .replace(/ln\(/g, 'Math.log(')
          .replace(/\^2/g, '**2')
          .replace(/×/g, '*')
          .replace(/÷/g, '/');

        const openBrackets = (sanitized.match(/\(/g) || []).length;
        const closeBrackets = (sanitized.match(/\)/g) || []).length;
        if (openBrackets > closeBrackets) {
          sanitized += ')'.repeat(openBrackets - closeBrackets);
        }

        const evalFunc = new Function(`return ${sanitized}`);
        const res = evalFunc();
        const formattedRes = Number.isInteger(res) ? res.toString() : Number(res).toFixed(4);
        
        setCalcResult(formattedRes);
        setCalcHistory(prev => [`${calcInput} = ${formattedRes}`, ...prev.slice(0, 5)]);
      } catch (err) {
        setCalcResult('Error');
      }
    } else {
      setCalcInput(prev => prev + val);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="scribble-drawer">
      {/* Header */}
      <div className="scribble-header">
        <div className="scribble-meta">
          <div className="scribble-icon">
            <Book size={18} />
          </div>
          <div>
            <h3 className="scribble-title">Workspace Scribble Pad</h3>
            <p className="scribble-subtitle">WORKSPACE & SCRATCHPAD</p>
          </div>
        </div>
        <button onClick={onClose} className="btn-settings" style={{ padding: '6px' }}>
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div className="scribble-tabs">
        <button
          onClick={() => setActiveTab('notebook')}
          className={`scribble-tab-btn ${activeTab === 'notebook' ? 'active' : ''}`}
        >
          <Book size={14} />
          Scratch Notebook
        </button>
        <button
          onClick={() => setActiveTab('calculator')}
          className={`scribble-tab-btn ${activeTab === 'calculator' ? 'active' : ''}`}
        >
          <Calculator size={14} />
          Math Calculator
        </button>
      </div>

      {/* Content Area */}
      <div className="scribble-content">
        {activeTab === 'notebook' ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Save Note Form */}
            <form onSubmit={handleSaveNote} className="note-form">
              <h4 className="note-form-title">DRAFT A MATH EXPLANATION</h4>
              
              <input 
                type="text" 
                placeholder="Title (e.g. Skate Vertex)" 
                value={noteTitle}
                onChange={e => setNoteTitle(e.target.value)}
                className="note-input"
              />
              
              <textarea 
                placeholder="Write your algebraic equation or Socratic notes here... (e.g. y = 1/9 * (x - 6)^2 + 2)" 
                rows={3}
                value={noteContent}
                onChange={e => setNoteContent(e.target.value)}
                className="note-textarea"
              />
              
              <button 
                type="submit"
                disabled={!noteContent.trim()}
                className="btn-primary btn-save-note"
              >
                <Plus size={14} />
                Save to Workspace
              </button>
            </form>

            {/* Saved Notes Feed */}
            <div className="saved-notes-section">
              <h4 className="saved-notes-title">SAVED DISCOVERIES ({notes.length})</h4>
              
              {notes.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '30px 10px',
                  border: '1px dashed #cbd5e1',
                  borderRadius: '12px',
                  color: '#64748b',
                  fontSize: '0.75rem'
                }}>
                  <p>Your workspace notebook is empty.</p>
                  <p style={{ marginTop: '4px', fontSize: '0.68rem', color: '#94a3b8' }}>
                    Draft math equations above to save them!
                  </p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notes.map(n => (
                    <div key={n.id} className="saved-note-card">
                      <div className="note-card-header">
                        <span className="note-card-title">{n.title}</span>
                        <span className="note-card-time">{n.timestamp}</span>
                      </div>
                      
                      <p className="note-card-text">{n.content}</p>

                      <div style={{ marginTop: '4px' }}>
                        <button 
                          onClick={() => onInsertToChat(n.content)}
                          className="btn-insert-note"
                        >
                          <ArrowLeftRight size={10} />
                          Insert to Chat
                        </button>
                      </div>

                      <button 
                        onClick={() => onDeleteNote(n.id)}
                        className="btn-delete-note"
                        title="Delete note"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Math Calculator */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            
            {/* Calculator Display Panel */}
            <div className="calculator-display">
              <span className="calc-input-preview">{calcInput || '0'}</span>
              <span className="calc-result-text">{calcResult || '0.00'}</span>
            </div>

            {/* Quick Actions */}
            {calcResult && calcResult !== 'Error' && (
              <div className="calc-actions-row">
                <button
                  onClick={() => onInsertToChat(calcResult)}
                  className="btn-secondary"
                  style={{ borderRadius: '8px' }}
                >
                  <ArrowLeftRight size={10} />
                  Insert Chat
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(calcResult);
                  }}
                  className="btn-secondary"
                  style={{ borderRadius: '8px' }}
                >
                  <Copy size={10} />
                  Copy Value
                </button>
              </div>
            )}

            {/* Calculator Buttons Grid */}
            <div className="calc-grid">
              {/* Special operators */}
              {['e', 'ln(', '^2', 'C'].map(char => (
                <button
                  key={char}
                  onClick={() => handleCalcClick(char)}
                  className={`calc-btn special ${char === 'C' ? 'clear' : ''}`}
                >
                  {char === '^2' ? 'x²' : char}
                </button>
              ))}

              {/* Number keys and operational blocks */}
              {['7', '8', '9', '÷'].map(char => (
                <button
                  key={char}
                  onClick={() => handleCalcClick(char)}
                  className={`calc-btn ${char === '÷' ? 'op' : ''}`}
                >
                  {char}
                </button>
              ))}

              {['4', '5', '6', '×'].map(char => (
                <button
                  key={char}
                  onClick={() => handleCalcClick(char)}
                  className={`calc-btn ${char === '×' ? 'op' : ''}`}
                >
                  {char}
                </button>
              ))}

              {['1', '2', '3', '-'].map(char => (
                <button
                  key={char}
                  onClick={() => handleCalcClick(char)}
                  className={`calc-btn ${char === '-' ? 'op' : ''}`}
                >
                  {char}
                </button>
              ))}

              {['.', '0', 'back', '+'].map(char => (
                <button
                  key={char}
                  onClick={() => handleCalcClick(char)}
                  className={`calc-btn ${char === '+' ? 'op' : char === 'back' ? 'special' : ''}`}
                >
                  {char === 'back' ? 'DEL' : char}
                </button>
              ))}

              {/* Equals button */}
              <button
                onClick={() => handleCalcClick('=')}
                className="calc-btn equals"
              >
                =
              </button>
            </div>

            {/* History Feed */}
            {calcHistory.length > 0 && (
              <div className="calc-history-box">
                <h4>CALCULATOR HISTORY</h4>
                <div className="calc-history-list">
                  {calcHistory.map((item, idx) => (
                    <div key={idx} className="calc-history-item">
                      <span>{item.split(' = ')[0]}</span>
                      <span style={{ color: '#0f172a', fontWeight: '700' }}>{item.split(' = ')[1]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
