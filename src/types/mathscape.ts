export type MilestoneType = 'active' | 'hypothesis' | 'formula' | 'solved' | 'mastered';

export interface Milestone {
  id: MilestoneType;
  label: string;
  description: string;
  isCompleted: boolean;
}

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  milestoneUnlocked?: MilestoneType;
  mathFormula?: string; // Standardized equation text
  mathExplanation?: string; // Mathematical breakdowns
  chips?: string[]; // Quick replies/suggested student inputs
}

export interface Scenario {
  title: string;
  topic: string;
  conceptType: 'quadratic' | 'linear' | 'exponential' | 'system' | 'general';
  problemStatement: string;
  independentVar: {
    name: string;
    symbol: string;
    unit: string;
  };
  dependentVar: {
    name: string;
    symbol: string;
    unit: string;
  };
  mathObjective: string; // The mathematical target
  hintSequence: string[]; // Standard scaffolding hints
  keywords: {
    hypothesis: string[];
    formula: string[];
    solved: string[];
    mastered: string[];
  };
  targetNumericAnswers: number[]; // Correct numeric benchmarks (e.g. 16 for concert ticket price)
}

export interface WorkspaceNote {
  id: string;
  title: string;
  content: string;
  timestamp: string;
}

export interface AppState {
  apiKey: string;
  isTrueAI: boolean;
  activeScenario: Scenario;
  messages: Message[];
  milestones: Milestone[];
  notes: WorkspaceNote[];
  isGeneratingScenario: boolean;
  isScribbleOpen: boolean;
  customTopicInput: string;
}
