import {
  buildRelevancePrompt,
  extractGeminiText,
  GEMINI_ENDPOINT,
  GEMINI_MODEL,
  geminiRelevance,
  parseRelevanceAnswer,
} from '../index';
import { describe, expect, it, vi } from 'vitest';

const geminiBody = (text: string) => ({ candidates: [{ content: { parts: [{ text }] } }] });
const okResponse = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

describe('parseRelevanceAnswer', () => {
  it('accepts valid JSON, including fenced output', () => {
    expect(parseRelevanceAnswer('{"relevant":true,"confidence":0.8,"reason":"docs"}')).toEqual({
      relevant: true,
      confidence: 0.8,
      reason: 'docs',
    });
    expect(parseRelevanceAnswer('```json\n{"relevant":false,"confidence":0.2,"reason":"feed"}\n```')?.relevant).toBe(
      false,
    );
  });
  it('rejects malformed or out-of-schema output', () => {
    expect(parseRelevanceAnswer('RELEVANT|looks fine')).toBeNull();
    expect(parseRelevanceAnswer('{"relevant":"yes","confidence":0.5,"reason":"x"}')).toBeNull();
    expect(parseRelevanceAnswer('{"relevant":true,"confidence":3,"reason":"x"}')).toBeNull();
    expect(parseRelevanceAnswer('{"relevant":true}')).toBeNull();
    expect(parseRelevanceAnswer('')).toBeNull();
    expect(parseRelevanceAnswer(undefined)).toBeNull();
  });
});

describe('extractGeminiText', () => {
  it('pulls the first text part', () => {
    expect(extractGeminiText(geminiBody('hi'))).toBe('hi');
    expect(extractGeminiText({ candidates: [] })).toBeNull();
    expect(extractGeminiText({ error: { code: 400 } })).toBeNull();
  });
});

describe('geminiRelevance', () => {
  it('uses the current model, sends the key as a header and requests structured JSON', async () => {
    const fetchMock = vi.fn(async () =>
      okResponse(geminiBody('{"relevant":true,"confidence":0.9,"reason":"API docs"}')),
    );
    const result = await geminiRelevance(
      { apiKey: ' test-key ', goal: 'Ship the billing API', hostname: 'stripe.com', title: 'Stripe API reference' },
      fetchMock,
    );
    expect(result).toEqual({ ok: true, answer: { relevant: true, confidence: 0.9, reason: 'API docs' } });
    expect(GEMINI_MODEL).toBe('gemini-2.5-flash-lite');
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe(GEMINI_ENDPOINT);
    expect(url).not.toContain('key=');
    expect((init.headers as Record<string, string>)['x-goog-api-key']).toBe('test-key');
    const body = JSON.parse(init.body as string);
    expect(body.generationConfig.responseMimeType).toBe('application/json');
    expect(body.generationConfig.responseSchema.required).toEqual(['relevant', 'confidence', 'reason']);
  });

  it('never sends page content — only goal, hostname and title', async () => {
    const fetchMock = vi.fn(async () => okResponse(geminiBody('{"relevant":false,"confidence":0.7,"reason":"feed"}')));
    await geminiRelevance({ apiKey: 'k', goal: 'Write essay', hostname: 'reddit.com', title: 'r/all' }, fetchMock);
    const body = JSON.parse((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body as string);
    const text: string = body.contents[0].parts[0].text;
    expect(text).toBe(buildRelevancePrompt('Write essay', 'reddit.com', 'r/all'));
  });

  it('fails closed on HTTP errors, bad schema, and network errors', async () => {
    const args = { apiKey: 'k', goal: 'g', hostname: 'h.com', title: 't' };
    expect(
      await geminiRelevance(
        args,
        vi.fn(async () => okResponse({ error: 'bad key' }, 403)),
      ),
    ).toEqual({
      ok: false,
      error: 'Gemini returned HTTP 403',
    });
    expect(
      (
        await geminiRelevance(
          args,
          vi.fn(async () => okResponse(geminiBody('not json'))),
        )
      ).ok,
    ).toBe(false);
    const boom = vi.fn(async () => {
      throw new Error('offline');
    });
    expect(await geminiRelevance(args, boom)).toEqual({ ok: false, error: 'offline' });
  });

  it('does not call the network without a key', async () => {
    const fetchMock = vi.fn();
    expect((await geminiRelevance({ apiKey: '  ', goal: 'g', hostname: 'h', title: 't' }, fetchMock)).ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

describe('prompt', () => {
  it('truncates long inputs', () => {
    const p = buildRelevancePrompt('g'.repeat(1000), 'h'.repeat(1000), 't'.repeat(1000));
    expect(p.length).toBeLessThan(1200);
  });
});
