
const GEMINI_API_KEY = '';
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

interface Metrics {
  typingCadence: number;
  errors: number;
  mouseSmoothness: number;
  switchCount: number;
  [key: string]: unknown;
}

export interface AgentResponse {
    classification: 'passive work' | 'active work' | 'deep flow' | 'decreasing focus' | 'focus break';
    action: 'block distraction' | 'micro-break' | 'subtle nudge' | 'continue flow' | 'amplify flow';
    reasoning: string;
}

export const AiAgent = {
    analyzeFlowState: async (metrics: Metrics): Promise<AgentResponse> => {
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
    },

    checkUrlRelevance: async (url: string, goal: string): Promise<boolean> => {
        // If no API key, use simple heuristic blocking
        if (!GEMINI_API_KEY) {
            console.log('⚠️ No API key - using heuristic blocking');
            return AiAgent.heuristicUrlCheck(url);
        }

        const prompt = {
            contents: [{
                parts: [{
                    text: `
            User's work goal: "${goal}"
            Website URL: ${url}
            
            Determine if this website is relevant to achieving the user's goal.
            
            Consider:
            - Is it a distraction (social media, news, entertainment)?
            - Does it help with the stated goal?
            - Is it a productivity tool or resource?
            
            Respond with only "RELEVANT" or "DISTRACTION" and a brief reason.
            
            Format: RELEVANT|reason or DISTRACTION|reason
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
            const text = data.candidates[0].content.parts[0].text.trim();
            
            console.log('🤖 AI Decision:', text);
            
            const isRelevant = text.toUpperCase().startsWith('RELEVANT');
            return isRelevant;
        } catch (error) {
            console.error('URL Check Error:', error);
            // On error, use heuristic
            return AiAgent.heuristicUrlCheck(url);
        }
    },

    heuristicUrlCheck: (url: string): boolean => {
        const hostname = new URL(url).hostname.toLowerCase();
        
        // Common distraction sites
        const distractionPatterns = [
            'facebook.com', 'twitter.com', 'x.com', 'instagram.com', 'tiktok.com',
            'youtube.com', 'reddit.com', 'netflix.com', 'twitch.tv',
            'pinterest.com', 'snapchat.com', 'linkedin.com/feed',
            'news', 'sports', 'gaming', 'entertainment'
        ];
        
        // Check if URL contains any distraction patterns
        const isDistraction = distractionPatterns.some(pattern => 
            hostname.includes(pattern)
        );
        
        // Productivity sites (always allow)
        const productivityPatterns = [
            'github.com', 'stackoverflow.com', 'docs.', 'developer.',
            'learn', 'tutorial', 'documentation', 'api',
            'notion.so', 'trello.com', 'asana.com', 'slack.com'
        ];
        
        const isProductivity = productivityPatterns.some(pattern =>
            hostname.includes(pattern)
        );
        
        // If productivity site, always allow
        if (isProductivity) return true;
        
        // If distraction site, block
        if (isDistraction) return false;
        
        // Default: allow unknown sites
        return true;
    }
};
