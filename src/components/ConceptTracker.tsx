import React from 'react';
import type { Milestone, MilestoneType } from '../types/mathscape';
import { Check, Compass, BookOpen, Calculator, Award, Sparkles } from 'lucide-react';

interface ConceptTrackerProps {
  milestones: Milestone[];
}

export const ConceptTracker: React.FC<ConceptTrackerProps> = ({ milestones }) => {
  const getIconForMilestone = (id: MilestoneType, isCompleted: boolean) => {
    const size = 14;
    const color = isCompleted ? "currentColor" : "#64748b";
    
    switch (id) {
      case 'active':
        return <Compass size={size} color={color} />;
      case 'hypothesis':
        return <BookOpen size={size} color={color} />;
      case 'formula':
        return <Calculator size={size} color={color} />;
      case 'solved':
        return <Award size={size} color={color} />;
      case 'mastered':
        return <Sparkles size={size} color={color} />;
    }
  };

  const getMilestoneIndex = (milestones: Milestone[]): number => {
    let lastIndex = -1;
    for (let i = 0; i < milestones.length; i++) {
      if (milestones[i].isCompleted) {
        lastIndex = i;
      }
    }
    return lastIndex;
  };

  const activeIndex = getMilestoneIndex(milestones);
  const completionPercentage = ((activeIndex + 1) / milestones.length) * 100;

  return (
    <div className="tracker-container">
      <div className="tracker-content">
        
        {/* Progress Bar Header */}
        <div className="progress-meta">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="level-badge">
              LEVEL {activeIndex === -1 ? 0 : activeIndex + 1}
            </span>
            <span style={{ color: '#334155' }}>CONCEPT MASTERY STATUS</span>
          </div>
          <span className="percent-text">
            {Math.round(completionPercentage)}% COMPLETE
          </span>
        </div>

        {/* The Progress Line */}
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill"
            style={{ width: `${Math.max(4, completionPercentage)}%` }}
          />
        </div>

        {/* Milestone Steps Container */}
        <div className="steps-row">
          {milestones.map((m, index) => {
            const isCompleted = m.isCompleted;
            const isActive = index === activeIndex + 1;
            const statusClass = isCompleted 
              ? 'completed' 
              : isActive 
              ? 'active' 
              : 'inactive';
            
            return (
              <React.Fragment key={m.id}>
                <div className={`step-node-wrapper ${statusClass}`}>
                  {/* Milestone Node Circle */}
                  <div className="step-node">
                    {isCompleted ? (
                      <Check size={14} strokeWidth={3} />
                    ) : (
                      getIconForMilestone(m.id, isActive)
                    )}
                  </div>

                  {/* Milestone Labels */}
                  <div className="step-info">
                    <span className="step-label">
                      {m.label}
                    </span>
                    <span className="step-id">
                      {m.id.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Link line divider between nodes */}
                {index < milestones.length - 1 && (
                  <div className="divider-line" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};
