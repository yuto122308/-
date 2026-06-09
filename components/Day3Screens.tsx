"use client";

import { useState, useEffect, useCallback } from "react";
import ChoiceButton from "@/components/ChoiceButton";
import LineChat from "@/components/LineChat";
import { GameState } from "@/data/day1";
import {
  DAY3_MORNING_LINE,
  DAY3_RANKING,
  DAY3_MEETUP_RIVALS,
  DAY3_MEETUP_REFLECTS,
  DAY3_AREAS,
  DAY3_CHARACTERS,
  DAY3_POST_THEMES,
  DAY3_AREA_REACTIONS,
  DAY3_END_MONOLOGUE,
  DAY3_END_LINE,
  computeDay3Outcome,
  MeetupRival,
} from "@/data/day3";

// ─── 1. 朝のLINE ─────────────────────────────────────────────────────

export function Day3MorningScreen({ onNext }: { onNext: () => void }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible < DAY3_MORNING_LINE.length) {
      const t = setTimeout(() => setVisible((n) => n + 1), visible === 0 ? 600 : 800);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const allDone = visible >= DAY3_MORNING_LINE.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">L</span>
        </div>
        <span className="text-sm font-semibold text-gray-800">1年3組 文化祭グループ</span>
      </div>
      <div className="px-3 pt-4 mb-3">
        <div className="bg-white rounded-xl px-4 py-3 text-center border border-gray-100">
          <div className="text-xs text-gray-400 tracking-widest uppercase mb-1">Day 3</div>
          <div className="text-sm font-semibold text-gray-800">価値観と出会う日</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <LineChat messages={DAY3_MORNING_LINE.slice(0, visible)} />
      </div>
      <div className="px-5 pb-6 bg-gray-100 border-t border-gray-200 pt-4">
        <ChoiceButton onClick={onNext} disabled={!allDone}>
          {allDone ? "次へ" : "　"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 2. 中間順位 ─────────────────────────────────────────────────────

export function Day3RankingScreen({ state, onNext }: { state: GameState; onNext: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const [showNote, setShowNote] = useState(false);

  useEffect(() => {
    if (revealed < DAY3_RANKING.length) {
      const t = setTimeout(() => setRevealed((n) => n + 1), revealed === 0 ? 500 : 300);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowNote(true), 500);
      return () => clearTimeout(t);
    }
  }, [revealed]);

  const myFollowers = state.festivalAccount?.followers ?? 100;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-5 py-7">
      <div className="text-xs text-gray-400 tracking-widest mb-1 uppercase">Day 3</div>
      <h2 className="text-lg font-bold text-gray-900 mb-5">現在の中間順位</h2>
      <div className="space-y-2 mb-5">
        {DAY3_RANKING.slice(0, revealed).map((r) => (
          <div
            key={r.rank}
            className={`rounded-xl px-4 py-3 flex items-center justify-between ${
              r.isOwn ? "bg-gray-900 text-white" : "bg-gray-50 border border-gray-100"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold w-6 ${r.isOwn ? "text-gray-300" : "text-gray-400"}`}>{r.rank}</span>
              <span className={`text-sm font-semibold ${r.isOwn ? "text-white" : r.isRival ? "text-gray-800" : "text-gray-600"}`}>
                {r.name}
              </span>
              {r.isRival && !r.isOwn && (
                <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded">ライバル</span>
              )}
            </div>
            <div className={`text-sm font-bold ${r.isOwn ? "text-gray-300" : "text-gray-600"}`}>
              {r.isOwn ? `${myFollowers}人` : `${r.followers.toLocaleString()}人`}
            </div>
          </div>
        ))}
      </div>
      {showNote && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            上位3クラスは遥か先にいる。<br />
            でも、じわじわと差は縮まっている気がした。
          </p>
        </div>
      )}
      <div className="mt-auto">
        <ChoiceButton onClick={onNext} disabled={!showNote}>
          今日の交流会へ
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 3. 交流会イントロ ───────────────────────────────────────────────

export function Day3MeetupIntroScreen({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  const lines = [
    "放課後、体育館の前廊下に人が集まっていた",
    "「SNS広報交流会」——各クラスの担当が集まる会",
    "A組、C組、D組……それぞれの顔が見えた",
    "3人と、ちゃんと話してみることにした",
  ];

  useEffect(() => {
    if (step < lines.length) {
      const t = setTimeout(() => setStep((n) => n + 1), step === 0 ? 700 : 900);
      return () => clearTimeout(t);
    }
  }, [step, lines.length]);

  const done = step >= lines.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-6 py-12">
      <div className="flex-1 flex flex-col justify-center space-y-5">
        {lines.slice(0, step).map((line, i) => (
          <p key={i} className={`text-base text-gray-800 leading-relaxed ${i === 0 ? "text-sm text-gray-500" : ""}`}>
            {line}
          </p>
        ))}
      </div>
      <ChoiceButton onClick={onNext} disabled={!done}>
        {done ? "交流会へ" : "　"}
      </ChoiceButton>
    </div>
  );
}

// ─── 4. 交流会（1人ずつ会話） ────────────────────────────────────────

interface MeetupScreenProps {
  rivalIndex: number;
  onNext: (rivalId: string) => void;
}

export function Day3MeetupScreen({ rivalIndex, onNext }: MeetupScreenProps) {
  const rival = DAY3_MEETUP_RIVALS[rivalIndex];
  const [lineStep, setLineStep]     = useState(0);
  const [phase, setPhase]           = useState<"lines" | "choices" | "response" | "done">("lines");
  const [choiceId, setChoiceId]     = useState<string | null>(null);
  const [responseStep, setResponseStep] = useState(0);

  useEffect(() => {
    if (phase !== "lines") return;
    if (lineStep < rival.lines.length) {
      const t = setTimeout(() => setLineStep((n) => n + 1), lineStep === 0 ? 600 : 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("choices"), 400);
      return () => clearTimeout(t);
    }
  }, [phase, lineStep, rival.lines.length]);

  useEffect(() => {
    if (phase !== "response" || !choiceId) return;
    const resp = rival.responses[choiceId] ?? [];
    if (responseStep < resp.length) {
      const t = setTimeout(() => setResponseStep((n) => n + 1), 800);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("done"), 600);
      return () => clearTimeout(t);
    }
  }, [phase, choiceId, responseStep, rival.responses]);

  const handleChoice = useCallback((id: string) => {
    setChoiceId(id);
    setPhase("response");
  }, []);

  const resp = choiceId ? (rival.responses[choiceId] ?? []) : [];

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
            {rival.emoji}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">{rival.name}</div>
            <div className="text-xs text-gray-500">{rival.className} SNS担当</div>
          </div>
          <div className="ml-auto bg-gray-50 border border-gray-100 rounded-lg px-3 py-1.5 max-w-[160px]">
            <div className="text-xs text-gray-500 italic text-right leading-snug">{rival.philosophy}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {/* キャラのセリフ */}
        {rival.lines.slice(0, lineStep).map((line, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-base">
              {rival.emoji}
            </div>
            <div>
              {i === 0 && <div className="text-xs text-gray-500 mb-0.5">{rival.name}</div>}
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
                {line}
              </div>
            </div>
          </div>
        ))}

        {/* プレイヤーの選択 */}
        {choiceId && (
          <div className="flex justify-end">
            <div className="bg-yellow-300 rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-gray-800 max-w-[220px]">
              {rival.choices.find((c) => c.id === choiceId)?.label}
            </div>
          </div>
        )}

        {/* キャラの返答 */}
        {resp.slice(0, responseStep).map((line, i) => (
          <div key={`resp-${i}`} className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-base">
              {rival.emoji}
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
              {line}
            </div>
          </div>
        ))}

        {/* 別れ際 */}
        {phase === "done" && (
          <div className="flex items-end gap-2 opacity-70">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-base">
              {rival.emoji}
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-500 italic max-w-[240px]">
              {rival.closing}
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        {phase === "choices" && (
          <div className="space-y-2">
            {rival.choices.map((c) => (
              <ChoiceButton key={c.id} onClick={() => handleChoice(c.id)} variant="secondary">
                {c.label}
              </ChoiceButton>
            ))}
          </div>
        )}
        {phase === "done" && (
          <ChoiceButton onClick={() => onNext(rival.id)}>
            {rivalIndex < DAY3_MEETUP_RIVALS.length - 1 ? "次の人と話す" : "交流会を終える"}
          </ChoiceButton>
        )}
        {(phase === "lines" || phase === "response") && (
          <ChoiceButton onClick={() => {}} disabled>　</ChoiceButton>
        )}
      </div>
    </div>
  );
}

// ─── 5. 交流会後のひとりごと ─────────────────────────────────────────

export function Day3MeetupReflectScreen({
  lastRivalId,
  onNext,
}: {
  lastRivalId: string;
  onNext: () => void;
}) {
  const lines = DAY3_MEETUP_REFLECTS[lastRivalId] ?? DAY3_MEETUP_REFLECTS["mizuno"];
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < lines.length) {
      const t = setTimeout(() => setStep((n) => n + 1), step === 0 ? 700 : 1000);
      return () => clearTimeout(t);
    }
  }, [step, lines.length]);

  const done = step >= lines.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-6 py-12">
      <div className="flex-1 flex flex-col justify-center">
        <div className="space-y-6">
          {lines.slice(0, step).map((line, i) => (
            <p
              key={i}
              className={`text-base leading-relaxed ${
                i === 1 ? "text-gray-400 italic text-sm pl-3 border-l-2 border-gray-200" : "text-gray-800"
              }`}
            >
              {line}
            </p>
          ))}
        </div>
      </div>
      <ChoiceButton onClick={onNext} disabled={!done}>
        {done ? "取材へ向かう" : "　"}
      </ChoiceButton>
    </div>
  );
}

// ─── 6. 取材エリア選択 ──────────────────────────────────────────────

export function Day3ClassroomScreen({
  onArea,
}: {
  onArea: (areaId: string) => void;
}) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-5 py-7">
      <div className="text-xs text-gray-400 tracking-widest mb-1 uppercase">Day 3</div>
      <h2 className="text-lg font-bold text-gray-900 mb-2">どこを取材する？</h2>
      <p className="text-sm text-gray-500 mb-6">交流会の言葉を頭に置きながら、1ヶ所選ぼう</p>
      <div className="space-y-3">
        {DAY3_AREAS.map((area) => (
          <button
            key={area.id}
            onClick={() => onArea(area.id)}
            className="w-full border border-gray-200 rounded-2xl px-4 py-4 flex items-center gap-4 text-left hover:bg-gray-50 active:bg-gray-100 transition-colors"
          >
            <div className="text-2xl w-10 h-10 flex items-center justify-center bg-gray-50 rounded-xl">
              {area.emoji}
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-800">{area.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{area.desc}</div>
            </div>
            <span className="text-gray-300 text-lg">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── 7. 取材（キャラクター会話） ────────────────────────────────────

export function Day3InterviewScreen({
  areaId,
  onDone,
}: {
  areaId: string;
  onDone: (material: string) => void;
}) {
  const char = DAY3_CHARACTERS[areaId];
  const [lineStep, setLineStep]         = useState(0);
  const [phase, setPhase]               = useState<"lines" | "choices" | "response" | "material">("lines");
  const [choiceId, setChoiceId]         = useState<string | null>(null);
  const [responseStep, setResponseStep] = useState(0);

  useEffect(() => {
    if (phase !== "lines") return;
    if (lineStep < char.initialLines.length) {
      const t = setTimeout(() => setLineStep((n) => n + 1), lineStep === 0 ? 600 : 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("choices"), 400);
      return () => clearTimeout(t);
    }
  }, [phase, lineStep, char.initialLines.length]);

  useEffect(() => {
    if (phase !== "response" || !choiceId) return;
    const resp = char.responses[choiceId] ?? [];
    if (responseStep < resp.length) {
      const t = setTimeout(() => setResponseStep((n) => n + 1), 800);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("material"), 600);
      return () => clearTimeout(t);
    }
  }, [phase, choiceId, responseStep, char.responses]);

  const handleChoice = useCallback((id: string) => {
    setChoiceId(id);
    setPhase("response");
  }, []);

  const resp = choiceId ? (char.responses[choiceId] ?? []) : [];

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="bg-white border-b border-gray-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
            {char.emoji}
          </div>
          <div>
            <div className="text-sm font-bold text-gray-900">{char.name}</div>
            <div className="text-xs text-gray-500">{char.role}</div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3">
        {char.initialLines.slice(0, lineStep).map((line, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-base">
              {char.emoji}
            </div>
            <div>
              {i === 0 && <div className="text-xs text-gray-500 mb-0.5">{char.name}</div>}
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
                {line}
              </div>
            </div>
          </div>
        ))}

        {choiceId && (
          <div className="flex justify-end">
            <div className="bg-yellow-300 rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-gray-800 max-w-[220px]">
              {char.choices.find((c) => c.id === choiceId)?.label}
            </div>
          </div>
        )}

        {resp.slice(0, responseStep).map((line, i) => (
          <div key={`resp-${i}`} className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex-shrink-0 flex items-center justify-center text-base">
              {char.emoji}
            </div>
            <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
              {line}
            </div>
          </div>
        ))}

        {phase === "material" && (
          <div className="mx-1 mt-2 bg-gray-900 rounded-2xl p-4 text-white">
            <div className="text-xs text-gray-400 mb-2 tracking-wider uppercase">取材メモ</div>
            <div className="text-2xl mb-2">{char.emoji}</div>
            <div className="text-sm font-semibold leading-snug">{char.material}</div>
          </div>
        )}
      </div>

      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        {phase === "choices" && (
          <div className="space-y-2">
            {char.choices.map((c) => (
              <ChoiceButton key={c.id} onClick={() => handleChoice(c.id)} variant="secondary">
                {c.label}
              </ChoiceButton>
            ))}
          </div>
        )}
        {phase === "material" && (
          <ChoiceButton onClick={() => onDone(char.material)}>
            投稿を考える
          </ChoiceButton>
        )}
        {(phase === "lines" || phase === "response") && (
          <ChoiceButton onClick={() => {}} disabled>　</ChoiceButton>
        )}
      </div>
    </div>
  );
}

// ─── 8. 投稿テーマ選択 ──────────────────────────────────────────────

export function Day3PostScreen({
  state,
  onPost,
}: {
  state: GameState;
  onPost: (themeId: string) => void;
}) {
  const areaId  = state.day3Area ?? "dance";
  const themes  = DAY3_POST_THEMES[areaId] ?? [];
  const char    = DAY3_CHARACTERS[areaId];
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-5 py-7">
      <div className="text-xs text-gray-400 tracking-widest mb-1 uppercase">Day 3</div>
      <h2 className="text-lg font-bold text-gray-900 mb-1">どう伝える？</h2>
      <p className="text-sm text-gray-500 mb-4">取材した内容から、切り口を選ぼう</p>

      <div className="bg-gray-50 rounded-xl px-4 py-3 mb-5 flex items-center gap-3">
        <span className="text-2xl">{char.emoji}</span>
        <div>
          <div className="text-xs text-gray-400 mb-0.5">取材メモ</div>
          <div className="text-sm font-semibold text-gray-800">{char.material}</div>
        </div>
      </div>

      <div className="space-y-3 mb-5">
        {themes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setSelected(theme.id)}
            className={`w-full rounded-2xl border-2 px-4 py-4 text-left transition-all ${
              selected === theme.id
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 hover:border-gray-400"
            }`}
          >
            <div className={`text-sm font-bold mb-1 ${selected === theme.id ? "text-white" : "text-gray-800"}`}>
              {theme.label}
            </div>
            <div className={`text-xs mb-2 ${selected === theme.id ? "text-gray-300" : "text-gray-500"}`}>
              {theme.desc}
            </div>
            <div className={`text-xs px-2 py-1 rounded inline-block ${
              selected === theme.id ? "bg-white/10 text-gray-200" : "bg-gray-50 text-gray-500"
            }`}>
              {theme.preview}
            </div>
          </button>
        ))}
      </div>

      <div className="mt-auto">
        <ChoiceButton onClick={() => selected && onPost(selected)} disabled={!selected}>
          投稿する
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 9. 投稿待ち（授業中の時間） ────────────────────────────────────

export function Day3PostWaitingScreen({ onNext }: { onNext: () => void }) {
  const scenes = [
    "投稿した",
    "5時間目が始まった",
    "黒板の文字が頭に入ってこない",
    "翔が隣でこっちを見てくる",
    "「伸びてる？」って目で言ってる気がする",
    "……スマホが震えた",
  ];
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < scenes.length) {
      const t = setTimeout(() => setStep((n) => n + 1), step === 0 ? 800 : step === scenes.length - 1 ? 1400 : 950);
      return () => clearTimeout(t);
    }
  }, [step, scenes.length]);

  const done = step >= scenes.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-6 py-14">
      <div className="flex-1 flex flex-col justify-center space-y-6">
        {scenes.slice(0, step).map((scene, i) => (
          <p
            key={i}
            className={`text-base leading-relaxed ${
              i === scenes.length - 1 ? "text-gray-900 font-semibold" : "text-gray-600"
            }`}
          >
            {scene}
          </p>
        ))}
      </div>
      {done && (
        <ChoiceButton onClick={onNext}>通知を確認する</ChoiceButton>
      )}
    </div>
  );
}

// ─── 10. 投稿結果 ────────────────────────────────────────────────────

export function Day3PostResultScreen({
  state,
  onNext,
}: {
  state: GameState;
  onNext: (outcome: ReturnType<typeof computeDay3Outcome>) => void;
}) {
  const area  = state.day3Area  ?? "dance";
  const theme = state.day3PostTheme ?? "effort";
  const outcome = computeDay3Outcome(area, theme);
  const reactionText = DAY3_AREA_REACTIONS[area]?.[theme] ?? "";
  const char = DAY3_CHARACTERS[area];

  type Step = {
    type: "person" | "like" | "comment" | "follower" | "milestone";
    emoji: string;
    name?: string;
    text: string;
    sub?: string;
  };

  const steps: Step[] = [
    { type: "person",    emoji: char.emoji, name: char.name, text: reactionText },
    { type: "like",      emoji: "❤️",       text: `いいね +${Math.floor(outcome.followerGain / 2)}` },
    { type: "comment",   emoji: "💬",        text: "「応援してます」「見に行く！」" },
    { type: "follower",  emoji: "👤",        text: `フォロワー +${outcome.followerGain}人` },
    { type: "milestone", emoji: "⭐",        text: `フォロワー ${(state.festivalAccount?.followers ?? 100) + outcome.followerGain}人達成！` },
  ];

  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible < steps.length) {
      const t = setTimeout(() => setVisible((n) => n + 1), visible === 0 ? 700 : 900);
      return () => clearTimeout(t);
    }
  }, [visible, steps.length]);

  const allDone = visible >= steps.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 pt-7 pb-3 border-b border-gray-100">
        <div className="text-xs text-gray-400 tracking-widest uppercase mb-1">Day 3</div>
        <h2 className="text-base font-bold text-gray-900">投稿の反応</h2>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        {steps.slice(0, visible).map((s, i) => (
          <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${
            s.type === "person"    ? "bg-gray-50 border border-gray-100" :
            s.type === "milestone" ? "bg-yellow-50 border border-yellow-100" : "bg-white border border-gray-100"
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
              s.type === "milestone" ? "bg-yellow-100" : "bg-gray-100"
            }`}>
              {s.emoji}
            </div>
            <div className="flex-1 min-w-0">
              {s.name && <div className="text-xs font-medium text-gray-500 mb-0.5">{s.name}</div>}
              <div className={`text-sm leading-snug ${
                s.type === "milestone" ? "text-yellow-800 font-bold" :
                s.type === "person"    ? "text-gray-800 font-medium"  : "text-gray-600"
              }`}>{s.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        <ChoiceButton onClick={() => onNext(outcome)} disabled={!allDone}>
          {allDone ? "今日の結果を見る" : "　"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 11. Day3 リザルト ────────────────────────────────────────────────

export function Day3ResultScreen({
  state,
  onNext,
}: {
  state: GameState;
  onNext: () => void;
}) {
  const area  = state.day3Area  ?? "dance";
  const theme = state.day3PostTheme ?? "effort";
  const outcome = computeDay3Outcome(area, theme);
  const followers = state.festivalAccount?.followers ?? 100;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] px-6 py-10 bg-white">
      <div className="text-xs text-gray-400 tracking-widest mb-4 uppercase">Day 3 — Result</div>
      <div className="border border-gray-200 rounded-2xl overflow-hidden mb-5">
        <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
          <div className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Today's Result</div>
        </div>
        <div className="px-5 py-4 space-y-3">
          {[
            ["フォロワー増加",  `+${outcome.followerGain}人`],
            ["フォロワー合計",  `${followers + outcome.followerGain}人`],
            ["順位",            `${state.rank}位 → ${outcome.newRank}位`],
            ["クラス信頼度",    `${state.trust} → ${state.trust + outcome.trustGain}`],
            ["注目度",          `${state.attention} → ${state.attention + outcome.attentionGain}`],
          ].map(([label, value]) => (
            <div key={String(label)} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-bold text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto">
        <ChoiceButton onClick={onNext}>Day3を終える</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 12. Day3 終了 ────────────────────────────────────────────────────

export function Day3EndScreen({
  state,
  onDay4,
  onTitle,
}: {
  state: GameState;
  onDay4: () => void;
  onTitle: () => void;
}) {
  const [monoStep, setMonoStep] = useState(0);
  const [showLine, setShowLine] = useState(false);
  const [lineVisible, setLineVisible] = useState(0);

  useEffect(() => {
    if (monoStep < DAY3_END_MONOLOGUE.length) {
      const t = setTimeout(() => setMonoStep((n) => n + 1), monoStep === 0 ? 700 : 1100);
      return () => clearTimeout(t);
    } else if (!showLine) {
      const t = setTimeout(() => setShowLine(true), 600);
      return () => clearTimeout(t);
    }
  }, [monoStep, showLine]);

  useEffect(() => {
    if (!showLine) return;
    if (lineVisible < DAY3_END_LINE.length) {
      const t = setTimeout(() => setLineVisible((n) => n + 1), lineVisible === 0 ? 500 : 700);
      return () => clearTimeout(t);
    }
  }, [showLine, lineVisible]);

  const allDone = showLine && lineVisible >= DAY3_END_LINE.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-6 py-12">
      <div className="text-xs text-gray-400 tracking-widest mb-8 uppercase">End of Day 3</div>
      <div className="flex-1 space-y-5">
        {/* モノローグ */}
        {DAY3_END_MONOLOGUE.slice(0, monoStep).map((line, i) => (
          <p
            key={i}
            className={`text-base leading-relaxed ${
              i === DAY3_END_MONOLOGUE.length - 1 ? "text-gray-400 text-sm" : "text-gray-800"
            }`}
          >
            {line}
          </p>
        ))}

        {/* LINE */}
        {showLine && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-gray-100">
            <div className="bg-green-50 px-4 py-2 flex items-center gap-2 border-b border-gray-100">
              <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">L</span>
              </div>
              <span className="text-xs font-semibold text-gray-600">1年3組 文化祭グループ</span>
            </div>
            <div className="bg-gray-50 px-3 py-3">
              <LineChat messages={DAY3_END_LINE.slice(0, lineVisible)} />
            </div>
          </div>
        )}
      </div>

      {allDone && (
        <div className="mt-8 space-y-3">
          <div className="w-full bg-gray-50 border border-gray-100 rounded-xl p-5 text-center mb-2">
            <div className="text-xs text-gray-500 mb-1">文化祭まであと</div>
            <div className="text-4xl font-black text-gray-900">4日</div>
          </div>
          <ChoiceButton onClick={onDay4}>Day4へ進む</ChoiceButton>
          <ChoiceButton onClick={onTitle} variant="secondary">タイトルへ戻る</ChoiceButton>
        </div>
      )}
    </div>
  );
}
