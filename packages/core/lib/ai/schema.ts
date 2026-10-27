import { z } from 'zod';

const stripFences = (text: string): string =>
  text
    .trim()
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/, '')
    .trim();

const GeminiEnvelopeSchema = z.object({
  candidates: z
    .array(
      z.object({
        content: z.object({
          parts: z.array(z.object({ text: z.string().optional() })).min(1),
        }),
      }),
    )
    .min(1),
});

/** What the optional LLM must return for a relevance tiebreak. */
export const RelevanceAnswerSchema = z.object({
  relevant: z.boolean(),
  confidence: z.number().min(0).max(1),
  reason: z.string().max(300),
});

export type RelevanceAnswer = z.infer<typeof RelevanceAnswerSchema>;

/** The same schema in the OpenAPI subset Gemini's `responseSchema` accepts. */
export const GEMINI_RESPONSE_SCHEMA = {
  type: 'OBJECT',
  properties: {
    relevant: { type: 'BOOLEAN' },
    confidence: { type: 'NUMBER' },
    reason: { type: 'STRING' },
  },
  required: ['relevant', 'confidence', 'reason'],
  propertyOrdering: ['relevant', 'confidence', 'reason'],
} as const;

/** JSON Schema for Chrome's built-in Prompt API `responseConstraint`. */
export const JSON_RESPONSE_SCHEMA = {
  type: 'object',
  properties: {
    relevant: { type: 'boolean' },
    confidence: { type: 'number', minimum: 0, maximum: 1 },
    reason: { type: 'string', maxLength: 300 },
  },
  required: ['relevant', 'confidence', 'reason'],
  additionalProperties: false,
} as const;

/** Parse model text into a validated answer. Returns null for anything malformed. */
export const parseRelevanceAnswer = (text: unknown): RelevanceAnswer | null => {
  if (typeof text !== 'string' || !text.trim()) return null;
  try {
    const parsed = RelevanceAnswerSchema.safeParse(JSON.parse(stripFences(text)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
};

/** Extract the first text part from a Gemini generateContent response body. */
export const extractGeminiText = (body: unknown): string | null => {
  const parsed = GeminiEnvelopeSchema.safeParse(body);
  if (!parsed.success) return null;
  return parsed.data.candidates[0]?.content.parts.find(p => typeof p.text === 'string')?.text ?? null;
};
