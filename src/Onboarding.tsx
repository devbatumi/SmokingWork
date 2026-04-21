import { useState } from 'react';
import type { Persist } from './types';

type Props = { onDone: (p: Persist) => void };

const PRESETS: { label: string; ms: number }[] = [
  { label: 'Только что',     ms: 0 },
  { label: '1 час назад',    ms: 1 * 3600_000 },
  { label: '3 часа назад',   ms: 3 * 3600_000 },
  { label: 'Сегодня утром',  ms: 8 * 3600_000 },
  { label: 'Вчера',          ms: 24 * 3600_000 },
  { label: '2 дня назад',    ms: 2 * 24 * 3600_000 },
  { label: '3 дня назад',    ms: 3 * 24 * 3600_000 },
  { label: 'Неделю назад',   ms: 7 * 24 * 3600_000 },
  { label: '2 недели назад', ms: 14 * 24 * 3600_000 },
  { label: 'Месяц назад',    ms: 30 * 24 * 3600_000 },
];

function fmtAgo(ms: number) {
  if (ms < 60_000) return 'только что';
  if (ms < 3600_000) return `${Math.round(ms / 60_000)} мин назад`;
  if (ms < 24 * 3600_000) return `${Math.round(ms / 3600_000)} ч назад`;
  const d = ms / (24 * 3600_000);
  if (d < 30) return `${d.toFixed(d < 10 ? 1 : 0)} дн назад`;
  return `${(d / 30).toFixed(1)} мес назад`;
}

const SUGGESTED_REASONS = [
  'Хочу дышать легко',
  'Экономия денег',
  'Для своих близких',
  'Чтобы бегать / заниматься спортом',
  'Страх болезни',
  'Вонь и зависимость бесят',
  'Хочу контролировать свою жизнь',
];

export function Onboarding({ onDone }: Props) {
  const [step, setStep] = useState(1);
  const [perDay, setPerDay] = useState(20);
  const [agoMs, setAgoMs] = useState(0);
  const [customMode, setCustomMode] = useState(false);
  const [customDays, setCustomDays] = useState(0);
  const [customHours, setCustomHours] = useState(0);
  const [price, setPrice] = useState(250);
  const [reasons, setReasons] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState('');
  const [letter, setLetter] = useState('');

  const effectiveAgoMs = customMode
    ? (customDays * 24 + customHours) * 3600_000
    : agoMs;

  const toggleReason = (r: string) => {
    setReasons((cur) => (cur.includes(r) ? cur.filter((x) => x !== r) : [...cur, r]));
  };
  const addCustom = () => {
    const t = customReason.trim();
    if (!t) return;
    if (!reasons.includes(t)) setReasons((cur) => [...cur, t]);
    setCustomReason('');
  };

  const submit = () => {
    if (perDay < 1 || perDay > 100) return;
    const nowSubmit = Date.now();
    const maxAgo = 365 * 24 * 3600_000;
    const ago = Math.max(0, Math.min(effectiveAgoMs, maxAgo));
    const lastCigaretteAt = nowSubmit - ago;
    onDone({
      onboarded: true,
      startedAt: lastCigaretteAt,
      lastCigaretteAt,
      perDay,
      pricePerPack: price,
      relapses: 0,
      status: 'building',
      bonusBricks: 0,
      cooldowns: {},
      journal: [],
      reasons,
      letterToSelf: letter.trim(),
    });
  };

  return (
    <div className="onboarding">
      <div className="step-counter">Шаг {step} / 3</div>

      {step === 1 && (
        <>
          <h2>Базовые настройки</h2>
          <p className="lead">
            Пара цифр, чтобы рассчитать ритм. Интервал между «досками» = 24 часа ÷ твоя норма.
          </p>
          <div className="field">
            <label>Сколько сигарет в день ты курил?</label>
            <input
              type="number"
              min={1}
              max={100}
              value={perDay}
              onChange={(e) => setPerDay(parseInt(e.target.value || '0', 10))}
            />
          </div>
          <div className="field">
            <label>Когда была последняя сигарета?</label>
            <p className="tiny" style={{ margin: '-4px 0 10px' }}>
              Выбери ближайший вариант. Если бросил давно — жми «другое».
            </p>
            <div className="preset-chips">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  className={`chip${!customMode && agoMs === p.ms ? ' on' : ''}`}
                  onClick={() => { setCustomMode(false); setAgoMs(p.ms); }}
                >
                  {p.label}
                </button>
              ))}
              <button
                type="button"
                className={`chip${customMode ? ' on' : ''}`}
                onClick={() => setCustomMode(true)}
              >
                Другое…
              </button>
            </div>
            {customMode && (
              <div className="custom-ago">
                <div className="ca-inp">
                  <input
                    type="number"
                    min={0}
                    max={365}
                    value={customDays}
                    onChange={(e) => setCustomDays(Math.max(0, parseInt(e.target.value || '0', 10)))}
                  />
                  <span>дней</span>
                </div>
                <div className="ca-inp">
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={customHours}
                    onChange={(e) => setCustomHours(Math.max(0, Math.min(23, parseInt(e.target.value || '0', 10))))}
                  />
                  <span>часов назад</span>
                </div>
              </div>
            )}
            <div className="ago-preview">
              Последняя сигарета: <b>{fmtAgo(effectiveAgoMs)}</b>
            </div>
          </div>
          <div className="field">
            <label>Цена пачки (₽)</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => setPrice(parseInt(e.target.value || '0', 10))}
            />
          </div>
          <div className="actions">
            <button className="primary" onClick={() => setStep(2)}>Дальше</button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h2>Зачем ты бросаешь?</h2>
          <p className="lead">
            Это важно. В момент тяги мозг забудет, что когда-то ты этого очень хотел.
            Когда станет тяжело — ты увидишь этот список и вспомнишь.
          </p>
          <div className="chips">
            {SUGGESTED_REASONS.map((r) => (
              <button
                key={r}
                className={`chip${reasons.includes(r) ? ' on' : ''}`}
                onClick={() => toggleReason(r)}
                type="button"
              >
                {r}
              </button>
            ))}
          </div>
          <div className="field" style={{ marginTop: 10 }}>
            <label>Добавь свою причину</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                type="text"
                value={customReason}
                placeholder="например: чтобы дочка росла с живым отцом"
                onChange={(e) => setCustomReason(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') addCustom(); }}
              />
              <button onClick={addCustom}>+</button>
            </div>
          </div>
          {reasons.length > 0 && (
            <div className="tiny" style={{ marginTop: 8 }}>
              Выбрано: {reasons.length}
            </div>
          )}
          <div className="actions">
            <button className="ghost" onClick={() => setStep(1)}>Назад</button>
            <button className="primary" onClick={() => setStep(3)}>Дальше</button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2>Письмо себе</h2>
          <p className="lead">
            Одно-два предложения себе же, от сегодняшнего. Будущий-ты в момент слабости
            откроет и прочтёт. Как напоминание, почему ты это начал.
          </p>
          <div className="field">
            <label>Что хочешь сказать себе в трудный момент?</label>
            <textarea
              value={letter}
              onChange={(e) => setLetter(e.target.value)}
              placeholder="Ты помнишь, как задыхался на третьем этаже. Ты помнишь запах куртки. Ты можешь."
              rows={5}
            />
          </div>
          <div className="actions">
            <button className="ghost" onClick={() => setStep(2)}>Назад</button>
            <button className="primary" onClick={submit}>Поднять паруса</button>
          </div>
          <p className="tiny" style={{ marginTop: 16 }}>
            Данные хранятся только в твоём браузере. Ты можешь экспортировать их кнопкой «Экспорт»
            на главном экране.
          </p>
        </>
      )}
    </div>
  );
}
