import type { Scenario, Message, MilestoneType } from '../types/mathscape';

/**
 * Invokes Vercel Serverless Function to dynamically create a brand-new high school math scenario.
 */
export async function generateScenarioWithAI(topic: string, apiKey: string): Promise<Scenario> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'generateScenario',
        payload: { topic }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Proxy error: ${response.statusText}`);
    }

    const data = await response.json();
    const rawText = data.candidates[0].content.parts[0].text;
    
    // Parse the generated JSON scenario
    const parsedScenario: Scenario = JSON.parse(rawText.trim());
    return parsedScenario;
  } catch (error) {
    console.error("Failed to generate AI scenario, falling back to local procedurally generated template.", error);
    throw error;
  }
}

/**
 * Communicates with the Vercel Serverless Function to get Socrates tutoring response.
 * Parses the model's text for hidden tag indicators to advance the Concept Mastery progress!
 */
export async function getGeminiSocraticResponse(
  messages: Message[],
  scenario: Scenario,
  activeMilestones: MilestoneType[],
  apiKey: string
): Promise<{ text: string; unlockedMilestone?: MilestoneType }> {
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (apiKey) {
      headers['x-api-key'] = apiKey;
    }

    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        action: 'socraticResponse',
        payload: {
          messages,
          scenario,
          activeMilestones
        }
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Proxy error: ${response.statusText}`);
    }

    const data = await response.json();
    let replyText = data.candidates[0].content.parts[0].text;
    
    // Parse for the milestone tags
    let unlockedMilestone: MilestoneType | undefined = undefined;
    const tagMatch = replyText.match(/\[UNLOCK_MILESTONE:\s*(\w+)\]/);
    if (tagMatch) {
      unlockedMilestone = tagMatch[1] as MilestoneType;
      // Strip the tag from the student-facing text
      replyText = replyText.replace(/\[UNLOCK_MILESTONE:\s*\w+\]/, '').trim();
    }

    return {
      text: replyText,
      unlockedMilestone
    };
  } catch (error) {
    console.error("Gemini Socratic fetch failed.", error);
    throw error;
  }
}
