export const config = {
  runtime: 'edge',
};

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

interface RequestBody {
  action: string;
  payload: any;
}

export default async function handler(request: Request) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { action, payload } = await request.json() as RequestBody;
    
    // Resolve the API key: either a client-supplied override or the secure server-side env variable
    const clientKey = request.headers.get('x-api-key') || '';
    const apiKey = clientKey || process.env.GEMINI_API_KEY || '';

    if (!apiKey) {
      return new Response(JSON.stringify({ 
        error: 'API key is missing. Please configure GEMINI_API_KEY in Vercel settings or the app settings panel.' 
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (action === 'generateScenario') {
      const { topic } = payload;
      const prompt = `Create a mathematical "microworld" scenario based on the following real-world theme: "${topic}".
  The math challenge must represent high school level algebra, geometry, pre-calculus, or statistics.
  
  You MUST return ONLY a valid JSON object matching the following TypeScript schema exactly. Do NOT put markdown formatting, backticks, or any explanation before or after the JSON.
  
  Schema:
  interface Scenario {
    title: string; // Engaging title of the challenge
    topic: string; // Specific high school math topic (e.g., Quadratic Equations, Exponential Growth, Linear Systems)
    conceptType: 'quadratic' | 'linear' | 'exponential' | 'system' | 'general';
    problemStatement: string; // An engaging 2-3 paragraph real-world narrative that poses a specific math problem. Write using markdown for text styling and standard LaTeX $...$ or $$...$$ for math formulas.
    independentVar: { name: string; symbol: string; unit: string };
    dependentVar: { name: string; symbol: string; unit: string };
    mathObjective: string; // Clear 1-sentence description of the target mathematical goal
    hintSequence: string[]; // 4 sequential hints (numbered 0 to 3) representing Socratic scaffolding steps
    keywords: {
      hypothesis: string[]; // 5-6 lower-case keywords indicating the student is explaining the visual/conceptual trend
      formula: string[]; // 5-6 keywords indicating algebraic models (e.g. "y=a(x-h)^2", "=a", "exponential")
      solved: string[]; // 4-5 keywords representing numeric solutions or correct values
      mastered: string[]; // 5-6 keywords showing physical interpretation (e.g. "limit", "peak", "vertex", "carrying capacity")
    };
    targetNumericAnswers: number[]; // 2-4 critical numeric benchmarks (e.g., target vertex height, peak price, capacity year)
  }
  
  Ensure the problem is solvable using high school level mathematics, has beautiful narrative styling, and realistic parameters. Ensure all JSON fields are fully escaped and valid.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ error: `Gemini API error: ${response.statusText}`, details: errorText }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });

    } else if (action === 'socraticResponse') {
      const { messages, scenario, activeMilestones } = payload;
      
      const formattedHistory = messages.map((m: any) => 
        `${m.sender === 'user' ? 'Student' : 'Socrates'}: ${m.text}`
      ).join('\n');

      const systemInstruction = `You are Socrates, a highly encouraging, brilliant, and patient high-school level math tutor in an interactive educational application.
  
  Your pedagogical goals:
  1. Actively guide the student through a narrative mathematical "microworld" scenario.
  2. NEVER give the mathematical formula, answer, or steps directly. Instead, ask guided Socratic questions, hint at relationships, and scaffold conceptual thinking in words.
  3. Validate student calculations. Check if their numbers are close to the target numbers in the scenario.
  4. Format all responses using beautiful markdown, using bold titles and clear spacing. Format mathematical formulas using LaTeX-like notation (e.g. $y = a(x - h)^2 + k$).
  
  ACTIVE SCENARIO INFO:
  - Title: ${scenario.title}
  - Math Topic: ${scenario.topic}
  - Concept: ${scenario.conceptType}
  - Objective: ${scenario.mathObjective}
  - Target Numeric Answers: ${scenario.targetNumericAnswers.join(', ')}
  
  STUDENT PROGRESS MILESTONES:
  Current unlocked milestones: ${activeMilestones.join(', ')}
  
  If the student's latest message shows they have completed the next logical step, you MUST append a hidden tag at the very end of your response to unlock their progress. Choose EXACTLY one tag if appropriate:
  - Append \`[UNLOCK_MILESTONE: hypothesis]\` if the student has successfully explained a qualitative, conceptual hypothesis or trend in words.
  - Append \`[UNLOCK_MILESTONE: formula]\` if the student has successfully modeled their hypothesis as an algebraic formula/equation.
  - Append \`[UNLOCK_MILESTONE: solved]\` if the student has successfully calculated the correct numeric values or target answers.
  - Append \`[UNLOCK_MILESTONE: mastered]\` if the student has successfully explained the conceptual, real-world justification of their math (achieving full mastery).
  
  Provide your response in words, behaving like Socrates. Make sure to encourage the student!`;

      const prompt = `Here is the conversation log:
  ${formattedHistory}
  
  Respond as Socrates.`;

      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            { role: 'user', parts: [{ text: prompt }] }
          ],
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ error: `Gemini API error: ${response.statusText}`, details: errorText }), {
          status: response.status,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
      
    } else {
      return new Response(JSON.stringify({ error: `Invalid action: ${action}` }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Internal Server Error', details: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
