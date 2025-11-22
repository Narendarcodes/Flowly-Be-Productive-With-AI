
const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

export interface AgentResponse {
    classification: 'passive work' | 'active work' | 'deep flow' | 'decreasing focus' | 'focus break';
    action: 'block distraction' | 'micro-break' | 'subtle nudge' | 'continue flow' | 'amplify flow';
    reasoning: string;
}

export const AiAgent = {
    analyzeFlowState: async (metrics: any): Promise<AgentResponse> => {
        const prompt = {
            contents: [{
                parts: [{
                    text: `
            Analyze the following user behavior metrics and classify their flow state.
            
            Metrics:
            ${JSON.stringify(metrics, null, 2)}
            
            Return a JSON object with the following structure:
            {
              "classification": "passive work" | "active work" | "deep flow" | "decreasing focus" | "focus break",
              "action": "block distraction" | "micro-break" | "subtle nudge" | "continue flow" | "amplify flow",
              "reasoning": "short explanation"
            }
          `
                }]
            }]
        };

        try {
            const response = await fetch(GEMINI_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(prompt),
            });

            const data = await response.json();
            const text = data.candidates[0].content.parts[0].text;

            // Clean up markdown code blocks if present
            const jsonStr = text.replace(/```json/g, '').replace(/```/g, '').trim();
            return JSON.parse(jsonStr);
        } catch (error) {
            console.error('AI Agent Error:', error);
            return {
                classification: 'passive work',
                action: 'continue flow',
                reasoning: 'Fallback due to error'
            };
        }
    }
};
