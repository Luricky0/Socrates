import { useState, useEffect } from 'react';
import type { Message, Milestone, MilestoneType, Scenario, WorkspaceNote } from './types/mathscape';
import { ConceptTracker } from './components/ConceptTracker';
import { WorkspaceScribble } from './components/WorkspaceScribble';
import { AICoachPanel } from './components/AICoachPanel';
import { MathText } from './components/MathText';
import { 
  PRESET_SCENARIOS, 
  generateScenarioFromTopic, 
  generateLocalSocraticResponse 
} from './services/localCoachService';
import { 
  generateScenarioWithAI, 
  getGeminiSocraticResponse 
} from './services/geminiService';
import { 
  Sparkles, 
  BookOpen, 
  Settings, 
  Flame, 
  Key, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

const DEFAULT_MILESTONES = [
  { id: 'active', label: 'Scenario Active', description: 'Real-world math context activated.', isCompleted: false },
  { id: 'hypothesis', label: 'First Hypothesis', description: 'Formulated a logical mathematical guess.', isCompleted: false },
  { id: 'formula', label: 'Math Formula', description: 'Algebraic relationship modeled.', isCompleted: false },
  { id: 'solved', label: 'Problem Solved', description: 'Derived correct numerical targets.', isCompleted: false },
  { id: 'mastered', label: 'Concept Master', description: 'Explained real-world math alignment.', isCompleted: false }
] as Milestone[];

export default function App() {
  // Core configurations
  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('mathscape_gemini_key') || '';
  });
  const [isTrueAI, setIsTrueAI] = useState<boolean>(() => {
    const saved = localStorage.getItem('mathscape_true_ai');
    // Default to true (using backend proxy key) if no preference is explicitly stored as false
    return saved !== 'false';
  });

  // UI state controllers
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isScribbleOpen, setIsScribbleOpen] = useState(false);
  const [isGeneratingScenario, setIsGeneratingScenario] = useState(false);
  const [customTopicInput, setCustomTopicInput] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);

  // Mathscape content states
  const [activeScenario, setActiveScenario] = useState<Scenario>(PRESET_SCENARIOS[0]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [milestones, setMilestones] = useState<Milestone[]>(DEFAULT_MILESTONES);
  const [notes, setNotes] = useState<WorkspaceNote[]>(() => {
    const saved = localStorage.getItem('mathscape_scribble_notes');
    return saved ? JSON.parse(saved) : [];
  });

  // Save notes helper
  useEffect(() => {
    localStorage.setItem('mathscape_scribble_notes', JSON.stringify(notes));
  }, [notes]);

  // Handle local storage key syncing
  const handleSaveApiKey = (key: string, enableTrueAI: boolean) => {
    localStorage.setItem('mathscape_gemini_key', key);
    localStorage.setItem('mathscape_true_ai', enableTrueAI ? 'true' : 'false');
    setApiKey(key);
    setIsTrueAI(enableTrueAI && !!key);
    setIsSettingsOpen(false);
  };

  // Initialize First Message
  useEffect(() => {
    resetScenarioSession(PRESET_SCENARIOS[0]);
  }, []);

  /**
   * Resets active session and logs Socratic intro
   */
  const resetScenarioSession = (scenario: Scenario) => {
    setActiveScenario(scenario);
    setMilestones(DEFAULT_MILESTONES.map(m => ({ ...m, isCompleted: false })));
    setMessages([
      {
        id: `intro-${Date.now()}`,
        sender: 'ai',
        text: `Welcome to the **${scenario.title}**! 🚀 I'm Socrates, your Socratic math coach.
        
I have designed a custom math microworld just for you. Please read the **Real-World Math Challenge** in the side panel carefully to understand the context.

To kick off our mathematical journey: **In your own words, what do you think is our primary goal here? What variables are we analyzing?** Explain your initial thoughts!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: ["Let's start! Describe the variables.", "What is the math concept here?", "Give me a hint 💡"]
      }
    ]);
    setInputMessage('');
  };

  /**
   * Triggers Confetti explosions based on levels
   */
  const triggerMasteryConfetti = (type: MilestoneType) => {
    if (type === 'mastered') {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

      const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: ['#2563eb', '#0284c7', '#0d9488'] });
        confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: ['#2563eb', '#0284c7', '#0d9488'] });
      }, 250);
    } else {
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#38bdf8', '#0284c7', '#60a5fa']
      });
    }
  };

  /**
   * Launches AI or Fallback dynamically generated mathematical scenario
   */
  const handleLaunchCustomTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTopicInput.trim()) return;
    
    setIsGeneratingScenario(true);
    try {
      let scenario: Scenario;
      
      if (isTrueAI && apiKey) {
        scenario = await generateScenarioWithAI(customTopicInput.trim(), apiKey);
      } else {
        scenario = generateScenarioFromTopic(customTopicInput.trim());
      }
      
      resetScenarioSession(scenario);
      setCustomTopicInput('');
    } catch (err) {
      alert("Failed to generate AI scenario. Starting a procedurally generated local challenge instead!");
      const scenario = generateScenarioFromTopic(customTopicInput.trim());
      resetScenarioSession(scenario);
      setCustomTopicInput('');
    } finally {
      setIsGeneratingScenario(false);
    }
  };

  /**
   * Appends User messages, triggers Socratic AI responses asynchronously,
   * evaluates mathematical progress, and unlocks milestones with confetti sparkles!
   */
  const handleSendMessage = async (text: string) => {
    if (isAITyping) return;

    const userMsg: Message = {
      id: `student-${Date.now()}`,
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsAITyping(true);

    try {
      let aiText = "";
      let unlockedMilestone: MilestoneType | undefined = undefined;

      const activeMilestoneTypes = milestones
        .filter(m => m.isCompleted)
        .map(m => m.id);

      if (isTrueAI && apiKey) {
        const result = await getGeminiSocraticResponse(
          updatedMessages,
          activeScenario,
          activeMilestoneTypes,
          apiKey
        );
        aiText = result.text;
        unlockedMilestone = result.unlockedMilestone;
      } else {
        const result = generateLocalSocraticResponse(
          updatedMessages,
          activeScenario,
          activeMilestoneTypes
        );
        aiText = result.response.text;
        unlockedMilestone = result.unlockedMilestone;
      }

      setTimeout(() => {
        const aiMsg: Message = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: aiText,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          chips: isTrueAI ? ["Give me a hint", "Am I on track?", "Try next concept"] : generateLocalSocraticResponse(updatedMessages, activeScenario, activeMilestoneTypes).response.chips
        };

        setMessages(prev => [...prev, aiMsg]);
        setIsAITyping(false);

        if (unlockedMilestone) {
          const targetType = unlockedMilestone;
          setMilestones(prev => 
            prev.map(m => m.id === targetType ? { ...m, isCompleted: true } : m)
          );
          triggerMasteryConfetti(targetType);
        }
      }, 900);

    } catch (error) {
      setIsAITyping(false);
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ **Oops! My Socratic transmission encountered a connection error.** Please double check your Gemini API key in settings or continue in offline Socratic mode!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: ["Toggle offline mode", "Explain what happened"]
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  /**
   * Forces a Socratic hint to display
   */
  const handleTriggerSocraticHint = () => {
    if (isAITyping) return;

    const completedCount = milestones.filter(m => m.isCompleted).length;
    const hintIdx = Math.min(3, completedCount);
    const activeHint = activeScenario.hintSequence[hintIdx];

    setIsAITyping(true);
    setTimeout(() => {
      const hintMsg: Message = {
        id: `hint-${Date.now()}`,
        sender: 'ai',
        text: `${activeHint}
        
How does this mathematical scaffold change your approach?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        chips: ["I understand, let me recalculate!", "Can you explain this step?", "Try another math angle"]
      };
      setMessages(prev => [...prev, hintMsg]);
      setIsAITyping(false);
    }, 600);
  };

  // Notebook methods
  const handleAddWorkspaceNote = (title: string, content: string) => {
    const newNote: WorkspaceNote = {
      id: `note-${Date.now()}`,
      title,
      content,
      timestamp: new Date().toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteWorkspaceNote = (id: string) => {
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  const handleInsertToChat = (text: string) => {
    setInputMessage(prev => prev + (prev ? ' ' : '') + text);
    setIsScribbleOpen(false);
  };

  return (
    <div className="app-container">
      
      {/* 1. Header Toolbar */}
      <header className="header-bar">
        
        {/* Brand Logo */}
        <div className="header-left">
          <div className="logo-container">
            <div className="logo-icon">
              <Sparkles size={16} />
            </div>
            <div>
              <h1 className="logo-title">MathScape</h1>
              <p className="logo-sub">SOCRATES MATH COACH</p>
            </div>
          </div>
        </div>

        {/* Action Panel Utilities */}
        <div className="header-right">
          {/* Active AI Status HUD */}
          <span 
            onClick={() => setIsSettingsOpen(true)}
            className={`status-badge ${isTrueAI ? 'active' : ''}`}
          >
            <span className="status-dot" />
            {isTrueAI ? 'GEMINI ACTIVE' : 'LOCAL ENGINE'}
          </span>

          {/* Settings Button */}
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="btn-settings"
            title="Socrates Settings"
          >
            <Settings size={18} />
          </button>

          {/* Notebook Workspace Button */}
          <button 
            onClick={() => setIsScribbleOpen(true)}
            className="btn-primary"
            style={{ borderRadius: '12px', padding: '8px 14px' }}
          >
            <BookOpen size={14} />
            Notebook
            {notes.length > 0 && (
              <span style={{
                background: 'white',
                color: 'var(--brand-primary)',
                padding: '1px 6px',
                borderRadius: '99px',
                fontSize: '8px',
                fontWeight: '700',
                marginLeft: '4px'
              }}>
                {notes.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. Scenario Creator / Launcher Bar */}
      <section className="launcher-bar">
        <div className="launcher-content">
          <div className="launcher-meta">
            <TrendingUp size={14} />
            <span>GENERATE DYNAMIC SCENARIO</span>
          </div>

          <form onSubmit={handleLaunchCustomTopic} className="launcher-form">
            <input 
              type="text" 
              placeholder="e.g. baking cookies in space, rollercoasters, rocket launches..." 
              value={customTopicInput}
              onChange={e => setCustomTopicInput(e.target.value)}
              disabled={isGeneratingScenario}
              className="launcher-input"
            />
            <button 
              type="submit"
              disabled={!customTopicInput.trim() || isGeneratingScenario}
              className="btn-primary launcher-btn"
            >
              {isGeneratingScenario ? 'Generating...' : 'Launch AI'}
            </button>
          </form>
        </div>
      </section>

      {/* 3. Concept Progress Tracker */}
      <ConceptTracker milestones={milestones} />

      {/* 4. Core Double Column Panel Layout */}
      <main className="workspace-grid">
        
        {/* LEFT COLUMN: Immersive Math Microworld Card */}
        <aside className="scenario-panel">
          <div className="glass-card scenario-card">
            
            {/* Header badges */}
            <div className="badge-row">
              <span className="badge-left">
                ACTIVE MATH MICROWORLD
              </span>
              <span className="badge-right">
                <Flame size={10} style={{ marginRight: '2px' }} />
                {activeScenario.topic}
              </span>
            </div>

            {/* Title & Objective */}
            <h2 className="scenario-title">
              {activeScenario.title}
            </h2>
            
            <div className="objective-box">
              🎯 Target: <MathText text={activeScenario.mathObjective} />
            </div>

            <div className="problem-narrative">
              <MathText text={activeScenario.problemStatement} />
            </div>

            {/* Micro-Parameters HUD */}
            <div className="variables-hud">
              <div className="var-col">
                <span className="var-title">INDEPENDENT VARIABLE</span>
                <span className="var-value">{activeScenario.independentVar.name} ({activeScenario.independentVar.symbol})</span>
                <span className="var-unit">{activeScenario.independentVar.unit}</span>
              </div>
              <div className="divider-v" />
              <div className="var-col text-right">
                <span className="var-title">DEPENDENT VARIABLE</span>
                <span className="var-value">{activeScenario.dependentVar.name} ({activeScenario.dependentVar.symbol})</span>
                <span className="var-unit">{activeScenario.dependentVar.unit}</span>
              </div>
            </div>

            {/* Preset Selector */}
            <div className="preset-row">
              <span className="preset-title">SWAP PRESET SCENARIOS</span>
              <div className="preset-btn-list">
                {PRESET_SCENARIOS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => resetScenarioSession(p)}
                    className={`preset-btn ${activeScenario.title === p.title ? 'active' : ''}`}
                  >
                    Preset #{idx+1}: {p.title.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </aside>

        {/* RIGHT COLUMN: Socratic Chat Feed */}
        <section className="chat-panel-wrapper glass-card">
          <AICoachPanel
            messages={messages}
            isAITyping={isAITyping}
            onSendMessage={handleSendMessage}
            inputMessage={inputMessage}
            setInputMessage={setInputMessage}
            onTriggerHint={handleTriggerSocraticHint}
            onResetScenario={() => resetScenarioSession(activeScenario)}
          />
        </section>
      </main>

      {/* 5. Settings Modal (API Key configuration popup) */}
      {isSettingsOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              onClick={() => setIsSettingsOpen(false)}
              className="modal-close-btn"
            >
              <X size={18} />
            </button>

            <div className="modal-header">
              <div className="modal-header-icon">
                <Key size={18} />
              </div>
              <div>
                <h3 className="scribble-title" style={{ fontSize: '0.95rem' }}>Socrates API Configuration</h3>
                <p className="scribble-subtitle">AI CHAT ENGINE SETTINGS</p>
              </div>
            </div>

            <div className="modal-body">
              <div className="alert-box" style={{ background: 'var(--brand-teal-light)', borderColor: '#99f6e4', color: 'var(--brand-teal)', padding: '10px', fontSize: '0.72rem', marginBottom: '15px' }}>
                🎓 <strong>Classroom Mode Active!</strong>
                <span style={{ display: 'block', marginTop: '4px', fontWeight: 'normal' }}>
                  Your Socratic Coach is configured with a secure server-side API key. You do not need to enter a key to use Socratic AI!
                </span>
              </div>

              <div className="settings-group">
                <label className="settings-label">
                  GEMINI API KEY (OPTIONAL OVERRIDE)
                </label>
                <input 
                  type="password" 
                  placeholder={apiKey ? "••••••••••••••••" : "AIzaSy..."}
                  defaultValue={apiKey}
                  id="gemini-key-input"
                  style={{ fontFamily: 'var(--font-mono)', fontSize: '0.78rem' }}
                />
              </div>

              <div className="checkbox-group">
                <input 
                  type="checkbox" 
                  id="enable-true-ai" 
                  defaultChecked={isTrueAI}
                  className="checkbox-input"
                />
                <div>
                  <label htmlFor="enable-true-ai" className="checkbox-label">
                    Enable Gemini Socratic Mode
                  </label>
                  <span className="checkbox-desc">
                    If unchecked, Socratic offline fallback is active.
                  </span>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  const keyVal = (document.getElementById('gemini-key-input') as HTMLInputElement)?.value || '';
                  const checkVal = (document.getElementById('enable-true-ai') as HTMLInputElement)?.checked || false;
                  handleSaveApiKey(keyVal, checkVal);
                }}
                className="btn-primary"
              >
                Save Configs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Sliding Scribble notebook drawer */}
      <WorkspaceScribble
        isOpen={isScribbleOpen}
        onClose={() => setIsScribbleOpen(false)}
        notes={notes}
        onAddNote={handleAddWorkspaceNote}
        onDeleteNote={handleDeleteWorkspaceNote}
        onInsertToChat={handleInsertToChat}
      />

      {/* 7. Welcome Quick Help Modal */}
      {showWelcomeModal && (
        <div className="modal-overlay">
          <div className="modal-content wide">
            <button 
              onClick={() => setShowWelcomeModal(false)}
              className="modal-close-btn"
            >
              <X size={18} />
            </button>

            <div className="modal-header">
              <div className="modal-header-icon">
                <Sparkles size={18} />
              </div>
              <div>
                <h3 className="scribble-title" style={{ fontSize: '0.95rem' }}>Welcome to MathScape!</h3>
                <p className="scribble-subtitle">LEARNER USER INTERVIEW GUIDE</p>
              </div>
            </div>

            <div className="modal-body">
              <p>
                MathScape is an educational microworld platform. Here, you learn math by exploring scenarios <strong>conceptually in words</strong> with your Socratic math coach, <strong>Socrates</strong>.
              </p>
              
              <div>
                <h4>How to Learn:</h4>
                <ol className="modal-list">
                  <li>
                    <strong>Read the Challenge:</strong> View the detailed narrative on the left (e.g. <em>Skatepark ramp vertexes, concert tickets, wildlife recovery</em>).
                  </li>
                  <li>
                    <strong>Chat with Socrates:</strong> Propose answers in the chat. Socrates will ask scaffolding questions to guide your understanding rather than giving out simple equations.
                  </li>
                  <li>
                    <strong>Unlock Milestones:</strong> Complete checklist progress nodes at the top of the screen: <em>Active, Hypothesis, Formula, Solved, and Mastery</em>.
                  </li>
                  <li>
                    <strong>Draft in Notebook:</strong> Use your <strong>Scribble Pad drawer</strong> to draft solutions or use the built-in scientific calculator, then insert directly into chat!
                  </li>
                </ol>
              </div>

              <div className="alert-box">
                💡 <strong>Want open-ended AI conversation?</strong>
                <span style={{ display: 'block', marginTop: '2px', fontWeight: 'normal' }}>
                  Click the settings gear icon ⚙️ in the top bar, enter a Google Gemini API Key, and toggle <em>Gemini Socratic Mode</em>!
                </span>
              </div>
            </div>

            <button 
              onClick={() => setShowWelcomeModal(false)}
              className="btn-primary"
              style={{ padding: '12px', borderRadius: '12px', fontSize: '0.85rem' }}
            >
              Start Socratic Exploration
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

// Inline replacement for X icon since we need it in simple settings popups
const X = ({ size, className, onClick }: { size: number; className?: string; onClick?: () => void }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
    onClick={onClick}
    style={{ cursor: 'pointer' }}
  >
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
