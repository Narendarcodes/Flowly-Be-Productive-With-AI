import {
  cloneDefaultModel,
  DEFAULT_SCORING_CONFIG,
  GEMINI_MODEL,
  KEYS,
  modelTrust,
  normalizeDomainList,
  sanitizeModel,
  sanitizeSettings,
} from '@extension/core';
import {
  Button,
  Card,
  SectionTitle,
  sendToBackground,
  TextArea,
  TextInput,
  Toggle,
  useChromeStorage,
} from '@extension/ui';
import { useEffect, useState } from 'react';
import type { AiProvider, FocusLabel, Settings } from '@extension/core';

const toLines = (list: string[]) => list.join('\n');
const fromLines = (text: string) => normalizeDomainList(text.split(/[\n,]/));

const useNanoAvailability = () => {
  const [state, setState] = useState('checking');
  useEffect(() => {
    const api = (globalThis as unknown as { LanguageModel?: { availability(): Promise<string> } }).LanguageModel;
    if (!api) {
      setState('unavailable');
      return;
    }
    api
      .availability()
      .then(setState)
      .catch(() => setState('unavailable'));
  }, []);
  return state;
};

const PROVIDERS: { value: AiProvider; label: string; hint: string }[] = [
  { value: 'none', label: 'Off', hint: 'Fully on-device. Rules and the local model decide.' },
  {
    value: 'nano',
    label: 'Chrome built-in AI (Gemini Nano)',
    hint: 'Runs on this device when your Chrome supports the Prompt API.',
  },
  {
    value: 'gemini',
    label: `Gemini API (${GEMINI_MODEL}) with your own key`,
    hint: 'Only for unclear tabs: sends your goal, the site name and tab title to Google.',
  },
];

const Options = () => {
  const [raw, loaded] = useChromeStorage<unknown>(KEYS.settings);
  const [rawModel] = useChromeStorage<unknown>(KEYS.model);
  const [labels] = useChromeStorage<FocusLabel[]>(KEYS.labels);
  const [draft, setDraft] = useState<Settings | null>(null);
  const [blockText, setBlockText] = useState('');
  const [allowText, setAllowText] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const nano = useNanoAvailability();

  useEffect(() => {
    if (!loaded) return;
    const s = sanitizeSettings(raw);
    setDraft(s);
    setBlockText(toLines(s.blocklist));
    setAllowText(toLines(s.allowlist));
  }, [loaded, raw]);

  if (!draft) return null;

  const model = rawModel ? sanitizeModel(rawModel) : cloneDefaultModel();
  const trust = Math.round(modelTrust(model, DEFAULT_SCORING_CONFIG) * 100);
  const update = (patch: Partial<Settings>) => {
    setSaved(false);
    setDraft({ ...draft, ...patch });
  };

  const save = async () => {
    const next = sanitizeSettings({ ...draft, blocklist: fromLines(blockText), allowlist: fromLines(allowText) });
    await chrome.storage.local.set({ [KEYS.settings]: next });
    setBlockText(toLines(next.blocklist));
    setAllowText(toLines(next.allowlist));
    setSaved(true);
  };

  const reset = async () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    await sendToBackground({ type: 'RESET_DATA' });
    setConfirmReset(false);
  };

  return (
    <main className="mx-auto flex max-w-2xl flex-col gap-5 px-6 py-10">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-zinc-900">Settings</h1>
        <p className="mt-1 text-sm text-zinc-500">Everything is stored locally in this browser profile.</p>
      </header>

      <Card>
        <SectionTitle>Focus sessions</SectionTitle>
        <div className="mt-3 flex items-center justify-between gap-4">
          <label htmlFor="session-minutes" className="text-sm font-medium text-zinc-900">
            Default session length (minutes, 0 = open-ended)
          </label>
          <TextInput
            id="session-minutes"
            type="number"
            min={0}
            max={480}
            className="w-24"
            value={draft.sessionMinutes}
            onChange={e => update({ sessionMinutes: Number(e.target.value) })}
          />
        </div>
        <Toggle
          id="strict-mode"
          label="Strict mode"
          description="Also block sites the relevance check marks as off-goal, not just your blocklist."
          checked={draft.strictMode}
          onChange={strictMode => update({ strictMode })}
        />
      </Card>

      <Card>
        <SectionTitle>Sites</SectionTitle>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="blocklist" className="text-sm font-medium text-zinc-900">
              Blocklist
            </label>
            <p className="mb-2 text-xs text-zinc-500">Blocked during focus sessions. One domain per line.</p>
            <TextArea
              id="blocklist"
              rows={8}
              className="font-mono text-xs"
              value={blockText}
              onChange={e => {
                setSaved(false);
                setBlockText(e.target.value);
              }}
            />
          </div>
          <div>
            <label htmlFor="allowlist" className="text-sm font-medium text-zinc-900">
              Allowlist
            </label>
            <p className="mb-2 text-xs text-zinc-500">Always treated as on-goal. Wins over the blocklist.</p>
            <TextArea
              id="allowlist"
              rows={8}
              className="font-mono text-xs"
              value={allowText}
              onChange={e => {
                setSaved(false);
                setAllowText(e.target.value);
              }}
            />
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle>Privacy</SectionTitle>
        <div className="mt-2 divide-y divide-zinc-100">
          <Toggle
            id="privacy-activity"
            label="Count activity on pages"
            description="Counts key presses and pointer movement (numbers only, never which keys) to estimate focus."
            checked={draft.privacy.activityCounting}
            onChange={activityCounting => update({ privacy: { ...draft.privacy, activityCounting } })}
          />
          <Toggle
            id="privacy-embeddings"
            label="On-device relevance model"
            description="Uses all-MiniLM-L6-v2 in your browser to compare tab titles with your goal. Downloads ~23 MB of model weights from Hugging Face once; no text leaves the device. Off = keyword matching."
            checked={draft.privacy.embeddings}
            onChange={embeddings => update({ privacy: { ...draft.privacy, embeddings } })}
          />
          <Toggle
            id="privacy-notifications"
            label="Notifications"
            description="Session end, the focus check-in and occasional nudges."
            checked={draft.privacy.notifications}
            onChange={notifications => update({ privacy: { ...draft.privacy, notifications } })}
          />
        </div>
      </Card>

      <Card>
        <SectionTitle>Optional AI tiebreak</SectionTitle>
        <p className="mt-1 text-xs text-zinc-500">
          Used only when the on-device check can’t tell whether a tab fits your goal. At most one request every 20
          seconds.
        </p>
        <fieldset className="mt-3 flex flex-col gap-2">
          <legend className="sr-only">AI provider</legend>
          {PROVIDERS.map(p => (
            <div key={p.value} className="flex items-start gap-2 text-sm">
              <input
                id={`ai-${p.value}`}
                type="radio"
                name="ai-provider"
                value={p.value}
                className="mt-1 accent-[#0f766e]"
                checked={draft.ai.provider === p.value}
                onChange={() => update({ ai: { ...draft.ai, provider: p.value } })}
              />
              <div>
                <label htmlFor={`ai-${p.value}`} className="cursor-pointer font-medium text-zinc-900">
                  {p.label}
                </label>
                <p className="text-xs text-zinc-500">
                  {p.hint}
                  {p.value === 'nano' ? ` Status: ${nano}.` : ''}
                </p>
              </div>
            </div>
          ))}
        </fieldset>
        {draft.ai.provider === 'gemini' ? (
          <div className="mt-3">
            <label htmlFor="gemini-key" className="text-sm font-medium text-zinc-900">
              Gemini API key
            </label>
            <div className="mt-1 flex gap-2">
              <TextInput
                id="gemini-key"
                type={showKey ? 'text' : 'password'}
                autoComplete="off"
                spellCheck={false}
                placeholder="Paste a key from Google AI Studio"
                value={draft.ai.geminiApiKey}
                onChange={e => update({ ai: { ...draft.ai, geminiApiKey: e.target.value } })}
              />
              <Button variant="secondary" onClick={() => setShowKey(!showKey)}>
                {showKey ? 'Hide' : 'Show'}
              </Button>
            </div>
            <p className="mt-1 text-xs text-zinc-500">
              Stored only in this browser (chrome.storage.local). It is never bundled or synced.
            </p>
          </div>
        ) : null}
      </Card>

      <div className="flex items-center gap-3">
        <Button onClick={save} data-testid="options-save">
          Save settings
        </Button>
        {saved ? (
          <span className="text-accent text-sm" role="status" data-testid="options-saved">
            Saved
          </span>
        ) : null}
      </div>

      <Card>
        <SectionTitle>Your data</SectionTitle>
        <p className="mt-2 text-sm text-zinc-700">
          Personal model trained on {labels?.length ?? 0} check-ins · {trust}% of the score comes from it.
        </p>
        <div className="mt-3 flex items-center gap-3">
          <Button variant="danger" onClick={reset} data-testid="options-reset">
            {confirmReset ? 'Click again to erase everything' : 'Reset all data'}
          </Button>
          {confirmReset ? (
            <Button variant="ghost" onClick={() => setConfirmReset(false)}>
              Cancel
            </Button>
          ) : null}
        </div>
      </Card>
    </main>
  );
};

export default Options;
