"use client";

import { useState, useEffect, useCallback } from "react";
import ChoiceButton from "@/components/ChoiceButton";
import ConceptImage from "@/components/ConceptImage";
import LineChat from "@/components/LineChat";
import { GameState } from "@/data/day1";
import {
  DAY2_MORNING_NOTIFICATIONS,
  DAY2_COMMENTS_INIT,
  DAY2_LINE_MORNING,
  DAY2_AREAS,
  DAY2_CHARACTERS,
  DAY2_POST_ANGLES,
  DAY2_AREA_REACTIONS,
  DAY2_RANK_EVENT_LINES,
  DAY2_RIVAL_CLASSES,
  computeDay2Outcome,
  Day2AreaId,
} from "@/data/day2";

// ─── 1. 朝の通知 ─────────────────────────────────────────────────────

export function Day2MorningScreen({ onNext }: { onNext: () => void }) {
  const [visible, setVisible] = useState(0);
  const [showMono, setShowMono] = useState(false);

  useEffect(() => {
    if (visible < DAY2_MORNING_NOTIFICATIONS.length) {
      const t = setTimeout(() => setVisible((n) => n + 1), visible === 0 ? 500 : 750);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowMono(true), 500);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-950">
      <div className="flex justify-between items-center px-5 pt-4 pb-2 text-xs text-gray-400">
        <span>7:32</span>
        <span className="text-xs text-gray-500 tracking-wider">Day 2</span>
        <span>●●●</span>
      </div>
      <div className="flex-1 px-4 pt-2 space-y-2.5 overflow-y-auto">
        {DAY2_MORNING_NOTIFICATIONS.slice(0, visible).map((n) => (
          <div key={n.id} className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 border border-white/10 flex items-start gap-3">
            <span className="text-xl mt-0.5">{n.emoji}</span>
            <div>
              <div className="text-sm text-white font-medium leading-snug">{n.title}</div>
              <div className="text-xs text-gray-400 mt-0.5">{n.sub}</div>
            </div>
          </div>
        ))}
        {showMono && (
          <div className="pt-5 pb-2 text-center px-4">
            <p className="text-base text-gray-300 leading-relaxed">「通知が来るだけで、ちょっと嬉しいな」</p>
          </div>
        )}
      </div>
      <div className="px-5 pb-8 pt-4">
        <button onClick={onNext} disabled={!showMono}
          className="w-full py-3.5 rounded-xl text-sm font-medium disabled:opacity-0 bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all">
          通知を確認する
        </button>
      </div>
    </div>
  );
}

// ─── 2. コメント確認 ─────────────────────────────────────────────────

export function Day2CommentsScreen({ state, onNext }: { state: GameState; onNext: () => void }) {
  const [visible, setVisible] = useState(0);
  const acc = state.festivalAccount;

  useEffect(() => {
    if (visible < DAY2_COMMENTS_INIT.length) {
      const t = setTimeout(() => setVisible((n) => n + 1), visible === 0 ? 600 : 700);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-5 py-3">
        <div className="text-xs text-gray-400 mb-0.5">昨日の投稿</div>
        <span className="text-sm font-semibold text-gray-800">コメントが届いています</span>
      </div>
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm">{acc?.icon ?? "🏫"}</div>
            <span className="text-xs font-medium text-gray-700">{acc?.accountName ?? "1年3組文化祭公式"}</span>
          </div>
          <ConceptImage panel="post_classroom" className="w-full h-24" />
          <div className="px-3 py-2 flex items-center gap-1">
            <span className="text-red-500 text-sm">♡</span>
            <span className="text-sm font-bold text-gray-900">28</span>
          </div>
        </div>
        <div className="space-y-2.5">
          {DAY2_COMMENTS_INIT.slice(0, visible).map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-base flex-shrink-0">{c.avatar}</div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[260px]">
                <div className="text-xs text-gray-400 mb-0.5">{c.user}</div>
                <div className="text-sm text-gray-800">{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 pb-6 border-t border-gray-100 pt-4 bg-gray-50">
        <ChoiceButton onClick={onNext} disabled={visible < DAY2_COMMENTS_INIT.length}>
          {visible < DAY2_COMMENTS_INIT.length ? "……" : "LINEを見る"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 3. 朝のLINE ────────────────────────────────────────────────────

export function Day2LineScreen({ onNext }: { onNext: () => void }) {
  const [visible, setVisible] = useState(0);
  const [showMono, setShowMono] = useState(false);

  useEffect(() => {
    if (visible < DAY2_LINE_MORNING.length) {
      const t = setTimeout(() => setVisible((n) => n + 1), visible === 0 ? 500 : 700);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowMono(true), 400);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><span className="text-white text-xs font-bold">L</span></div>
        <span className="text-sm font-semibold text-gray-800">1年3組 文化祭グループ</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <LineChat messages={DAY2_LINE_MORNING.slice(0, visible)} />
        {showMono && (
          <div className="mx-4 mt-3 mb-4 bg-gray-800/80 rounded-xl px-4 py-3 text-center">
            <p className="text-sm text-white/90 leading-relaxed">「通知が来るたびに、少しだけ期待してしまう」</p>
          </div>
        )}
      </div>
      <div className="px-5 pb-6 bg-gray-100 border-t border-gray-200 pt-4">
        <ChoiceButton onClick={onNext} disabled={visible < DAY2_LINE_MORNING.length}>
          {visible < DAY2_LINE_MORNING.length ? "　" : "今日のミッションを確認する"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 4. ミッション確認 ───────────────────────────────────────────────

export function Day2MissionScreen({ state, onNext }: { state: GameState; onNext: () => void }) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-5 py-7">
      <div className="text-xs text-gray-400 tracking-widest mb-5 uppercase">Day 2</div>
      <div className="border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="text-xs font-semibold text-gray-400 tracking-wider mb-3 uppercase">Status</div>
        <div className="space-y-2.5">
          {[
            ["フォロワー", `${state.festivalAccount?.followers ?? 32}人`],
            ["クラス信頼度", state.trust],
            ["注目度", state.attention],
            ["SNS順位", `${state.rank}位`],
          ].map(([label, value]) => (
            <div key={String(label)} className="flex justify-between text-sm">
              <span className="text-gray-500">{label}</span>
              <span className="font-bold text-gray-900">{value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-gray-900 text-white rounded-2xl p-5 mb-5">
        <div className="text-xs text-gray-400 tracking-widest mb-2 uppercase">Today's Mission</div>
        <div className="text-base font-bold leading-snug mb-2">文化祭の仲間と話して<br />フォロワー100人を目指そう</div>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${Math.min(((state.festivalAccount?.followers ?? 32) / 100) * 100, 100)}%` }} />
          </div>
          <span className="text-xs text-gray-400">{state.festivalAccount?.followers ?? 32} / 100</span>
        </div>
      </div>
      <div className="mt-auto">
        <ChoiceButton onClick={onNext}>誰かに会いに行く</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 5. 教室（取材先選択） ───────────────────────────────────────────

export function Day2ClassroomScreen({ state, onAreaSelect, onContinue }: {
  state: GameState;
  onAreaSelect: (area: Day2AreaId) => void;
  onContinue: () => void;
}) {
  const visited = state.day2Area;
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <ConceptImage panel="classroom_bg" className="w-full h-28" />
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="text-xs text-gray-400 mb-1">教室</div>
        <h2 className="text-base font-bold text-gray-900">誰に話しかけよう？</h2>
        <p className="text-xs text-gray-400 mt-1">1人と話したら投稿を作ろう</p>
      </div>
      <div className="flex-1 px-5 py-4 space-y-2.5 overflow-y-auto">
        {DAY2_AREAS.map((area) => {
          const char    = DAY2_CHARACTERS[area.id];
          const isVisited = visited === area.id;
          return (
            <button key={area.id} onClick={() => onAreaSelect(area.id as Day2AreaId)}
              className={`w-full flex items-center gap-3 border rounded-xl px-4 py-4 text-left transition-colors active:scale-[0.98] ${isVisited ? "border-gray-300 bg-gray-50" : "border-gray-200 bg-white hover:border-gray-400"}`}>
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">{area.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${isVisited ? "text-gray-500" : "text-gray-800"}`}>{char.name}</div>
                <div className="text-xs text-gray-400 mt-0.5">{isVisited ? "話を聞きました" : char.role}</div>
              </div>
              {isVisited
                ? <span className="text-green-600 text-lg">✓</span>
                : <span className="text-gray-300 text-lg">›</span>}
            </button>
          );
        })}
      </div>
      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        {visited
          ? <ChoiceButton onClick={onContinue}>投稿を作る</ChoiceButton>
          : <div className="text-xs text-gray-400 text-center py-2">誰かに話しかけよう</div>}
      </div>
    </div>
  );
}

// ─── 6. 取材イベント（会話） ─────────────────────────────────────────

export function Day2InterviewScreen({ areaId, onBack }: { areaId: Day2AreaId; onBack: () => void }) {
  const char = DAY2_CHARACTERS[areaId];

  const [lineIndex,    setLineIndex]    = useState(0);
  const [chosenId,     setChosenId]     = useState<string | null>(null);
  const [respIndex,    setRespIndex]    = useState(0);
  const [showMaterial, setShowMaterial] = useState(false);

  // 最初のセリフを順に表示
  useEffect(() => {
    if (chosenId === null && lineIndex < char.initialLines.length) {
      const t = setTimeout(() => setLineIndex((n) => n + 1), lineIndex === 0 ? 600 : 900);
      return () => clearTimeout(t);
    }
  }, [lineIndex, chosenId, char.initialLines.length]);

  // 選択後のレスポンスを順に表示
  useEffect(() => {
    if (!chosenId) return;
    const resps = char.responses[chosenId] ?? [];
    if (respIndex < resps.length) {
      const t = setTimeout(() => setRespIndex((n) => n + 1), respIndex === 0 ? 700 : 900);
      return () => clearTimeout(t);
    } else if (respIndex >= resps.length && !showMaterial) {
      const t = setTimeout(() => setShowMaterial(true), 500);
      return () => clearTimeout(t);
    }
  }, [chosenId, respIndex, char.responses, showMaterial]);

  const handleChoose = (id: string) => {
    setChosenId(id);
    setRespIndex(0);
  };

  const showChoices = lineIndex >= char.initialLines.length && chosenId === null;
  const resps       = chosenId ? (char.responses[chosenId] ?? []) : [];

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3">
        <button onClick={onBack} className="text-gray-500 text-sm">← 戻る</button>
        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm">{char.emoji}</div>
        <div>
          <div className="text-sm font-semibold text-gray-800">{char.name}</div>
          <div className="text-xs text-gray-400">{char.role}</div>
        </div>
      </div>

      <div className="flex-1 px-4 py-5 space-y-3 overflow-y-auto">
        {/* キャラクターの最初のセリフ */}
        {char.initialLines.slice(0, lineIndex).map((line, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm flex-shrink-0">{char.emoji}</div>
            <div>
              {i === 0 && <div className="text-xs text-gray-500 mb-1">{char.name}</div>}
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">{line}</div>
            </div>
          </div>
        ))}

        {/* 選択肢 */}
        {showChoices && (
          <div className="pt-3 space-y-2.5">
            <div className="text-xs text-gray-400 text-center">なんて答える？</div>
            {char.choices.map((c) => (
              <ChoiceButton key={c.id} variant="choice" onClick={() => handleChoose(c.id)}>
                {c.label}
              </ChoiceButton>
            ))}
          </div>
        )}

        {/* プレイヤーの返答 */}
        {chosenId && (
          <div className="flex justify-end">
            <div className="bg-yellow-300 rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
              {char.choices.find((c) => c.id === chosenId)?.label}
            </div>
          </div>
        )}

        {/* キャラクターの返答 */}
        {resps.slice(0, respIndex).map((line, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm flex-shrink-0">{char.emoji}</div>
            <div>
              {i === 0 && <div className="text-xs text-gray-500 mb-1">{char.name}</div>}
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">{line}</div>
            </div>
          </div>
        ))}

        {/* 取材メモ */}
        {showMaterial && (
          <div className="mx-1 mt-2 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{char.emoji}</span>
              <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">取材メモ</span>
            </div>
            <p className="text-sm text-amber-900 font-medium">{char.material}</p>
          </div>
        )}
      </div>

      <div className="px-5 pb-6 border-t border-gray-200 bg-gray-100 pt-4">
        <ChoiceButton onClick={onBack} variant="secondary" disabled={!showMaterial}>
          {showMaterial ? "教室に戻る" : "　"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 7. 投稿作成（切り口を選ぶ） ─────────────────────────────────────

export function Day2PostScreen({ state, onPost }: {
  state: GameState;
  onPost: (angle: string) => void;
}) {
  const [selected, setSelected] = useState<string | null>(null);
  const areaId  = state.day2Area ?? "dance";
  const char    = DAY2_CHARACTERS[areaId];
  const angles  = DAY2_POST_ANGLES[areaId] ?? [];
  const acc     = state.festivalAccount;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-base font-bold text-gray-900">どう伝える？</h2>
        <p className="text-xs text-gray-500 mt-0.5">切り口を1つ選んでください</p>
      </div>
      <div className="flex-1 px-5 py-5 overflow-y-auto space-y-5">

        {/* 素材情報 */}
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{char.emoji}</span>
            <span className="text-xs font-semibold text-gray-500 tracking-wider uppercase">素材</span>
          </div>
          <div className="text-sm font-medium text-gray-900">{char.material}</div>
          <div className="text-xs text-gray-400 mt-1">{char.name}と話して集めた</div>
        </div>

        {/* 切り口選択 */}
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-3 tracking-wider uppercase">何を伝える？</div>
          <div className="space-y-2.5">
            {angles.map((angle) => (
              <button key={angle.id} onClick={() => setSelected(angle.id)}
                className={`w-full border rounded-xl px-4 py-4 text-left transition-colors active:scale-[0.98] ${selected === angle.id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className={`text-sm font-bold mb-1 ${selected === angle.id ? "text-gray-900" : "text-gray-800"}`}>
                      {angle.label}
                      {angle.hasRisk && <span className="ml-2 text-xs text-orange-500 font-normal">先生が映る</span>}
                    </div>
                    <div className="text-xs text-gray-500 leading-relaxed">{angle.desc}</div>
                  </div>
                  {selected === angle.id && <span className="text-gray-900 font-bold flex-shrink-0">✓</span>}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* プレビュー */}
        {selected && (
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider uppercase">プレビュー</div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm">{acc?.icon ?? "🏫"}</div>
                <span className="text-xs font-medium text-gray-700">{acc?.accountName ?? "1年3組文化祭公式"}</span>
              </div>
              <div className="bg-gray-100 h-20 flex items-center justify-center">
                <span className="text-2xl">{char.emoji}</span>
              </div>
              <div className="p-3">
                <p className="text-sm text-gray-800">{char.material} — {angles.find((a) => a.id === selected)?.label}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        <ChoiceButton onClick={() => selected && onPost(selected)} disabled={!selected}>
          投稿する
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 8. 投稿後の待機（授業 → スマホが震える） ────────────────────────

export function Day2PostWaitingScreen({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  const lines = [
    "投稿した。",
    "授業が始まった。",
    "隣の席の親友が「出したんだ」と小さく言った。",
    "……",
    "スマホが震えた。",
  ];

  useEffect(() => {
    if (step < lines.length - 1) {
      const delays = [800, 1000, 1200, 1400];
      const t = setTimeout(() => setStep((n) => n + 1), delays[step] ?? 1000);
      return () => clearTimeout(t);
    }
  }, [step, lines.length]);

  const allDone = step >= lines.length - 1;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white justify-center px-8">
      <div className="space-y-6 mb-16">
        {lines.slice(0, step + 1).map((line, i) => (
          <p key={i} className={`text-sm leading-relaxed transition-opacity ${
            i === step ? "text-gray-700 opacity-100" : "text-gray-400 opacity-70"
          } ${line === "……" ? "text-center text-gray-300 text-2xl tracking-widest" : ""}
          ${line === "スマホが震えた。" ? "text-gray-900 font-bold text-base text-center" : ""}`}>
            {line}
          </p>
        ))}
      </div>
      {allDone && (
        <div className="fixed bottom-8 left-0 right-0 px-8">
          <ChoiceButton onClick={onNext}>通知を見る</ChoiceButton>
        </div>
      )}
    </div>
  );
}

// ─── 9. 投稿後の通知（人中心） ──────────────────────────────────────

interface PeopleNotif {
  type: "person" | "number" | "milestone" | "unsettling";
  name?: string;
  text: string;
  sub?: string;
  emoji: string;
}

export function Day2PostResultScreen({ state, onDone }: {
  state: GameState;
  onDone: (outcome: ReturnType<typeof computeDay2Outcome>) => void;
}) {
  const area    = state.day2Area ?? "dance";
  const angle   = state.day2Angle ?? "youth";
  const outcome = computeDay2Outcome(area, angle);
  const char    = DAY2_CHARACTERS[area];
  const reaction = DAY2_AREA_REACTIONS[area]?.[angle] ?? "見たよ、ありがとう";

  const hasRisk  = (area === "dance" && angle === "teacher") || angle === "fail";

  const steps: PeopleNotif[] = [
    { type: "person",    name: char.name,  text: reaction,                         emoji: char.emoji },
    { type: "number",    text: "❤️ +15",   sub: "いいねが届いています",             emoji: "❤️" },
    { type: "person",    name: "高校生",    text: "本番見に行きたい！",               emoji: "🧑‍🎓" },
    { type: "number",    text: "👤 +8",    sub: "フォロワーが増えています",          emoji: "👤" },
    ...(hasRisk
      ? [{ type: "unsettling" as const, name: "誰か", text: "背景に映ってる子って誰？", emoji: "❓" }]
      : [{ type: "person" as const, name: "親友", text: "結構伸びてるぞ",           emoji: "🙂" }]),
    { type: "number",    text: "❤️ +30",   sub: "どんどん増えています",             emoji: "❤️" },
    { type: "person",    name: "委員長",    text: "順位変動してるかも、LINE見て！", emoji: "👑" },
    { type: "milestone", text: `🎉 フォロワー ${outcome.newFollowers}人突破！`,     emoji: "🎉" },
  ];

  const [step, setStep]     = useState(0);
  const [called, setCalled] = useState(false);
  const allDone = step >= steps.length;

  useEffect(() => {
    if (step < steps.length) {
      const t = setTimeout(() => setStep((n) => n + 1), step === 0 ? 700 : 950);
      return () => clearTimeout(t);
    }
  }, [step, steps.length]);

  const handleNext = useCallback(() => {
    if (!called) { setCalled(true); onDone(outcome); }
  }, [called, onDone, outcome]);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-base font-bold text-gray-900">反応が届いています</h2>
        {!allDone && <p className="text-xs text-gray-400 animate-pulse mt-0.5">通知が来ています…</p>}
      </div>
      <div className="flex-1 px-5 py-5 overflow-y-auto space-y-2.5">
        {steps.slice(0, step).map((s, i) => (
          <div key={i} className={`flex items-start gap-3 rounded-2xl px-4 py-3 border ${
            s.type === "milestone"   ? "border-yellow-300 bg-yellow-50"   :
            s.type === "unsettling"  ? "border-gray-200 bg-gray-50 opacity-75" :
            s.type === "person"      ? "border-gray-200 bg-white"          :
                                       "border-gray-100 bg-gray-50"
          }`}>
            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${
              s.type === "person"   ? "bg-gray-100" :
              s.type === "milestone" ? "bg-yellow-100" : "bg-gray-100"
            }`}>
              {s.emoji}
            </div>
            <div className="flex-1 min-w-0">
              {s.name && <div className={`text-xs font-medium mb-0.5 ${s.type === "unsettling" ? "text-gray-400" : "text-gray-500"}`}>{s.name}</div>}
              <div className={`text-sm leading-snug ${
                s.type === "milestone"  ? "text-yellow-800 font-bold" :
                s.type === "unsettling" ? "text-gray-500 italic"      :
                s.type === "person"     ? "text-gray-800 font-medium"  :
                                          "text-gray-600"
              }`}>{s.text}</div>
              {s.sub && <div className="text-xs text-gray-400 mt-0.5">{s.sub}</div>}
            </div>
          </div>
        ))}
        {!allDone && (
          <div className="text-center py-4 text-xs text-gray-400 animate-pulse">通知が届いています…</div>
        )}
      </div>
      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        <ChoiceButton onClick={handleNext} disabled={!allDone}>
          {allDone ? "LINEを見る" : "　"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 10. 順位発表イベント ────────────────────────────────────────────

export function Day2RankEventScreen({ state, onNext }: { state: GameState; onNext: () => void }) {
  const lines = DAY2_RANK_EVENT_LINES(state.rank);
  const [step, setStep]     = useState(0);
  const [showRank, setShowRank] = useState(false);
  const [showLines, setShowLines] = useState(false);

  useEffect(() => {
    // 最初の2行まで自動表示
    if (!showRank && step < 2) {
      const t = setTimeout(() => setStep((n) => n + 1), step === 0 ? 600 : 800);
      return () => clearTimeout(t);
    }
    if (!showRank && step >= 2) {
      const t = setTimeout(() => setShowRank(true), 700);
      return () => clearTimeout(t);
    }
  }, [step, showRank]);

  useEffect(() => {
    if (showRank && !showLines) {
      const t = setTimeout(() => setShowLines(true), 900);
      return () => clearTimeout(t);
    }
  }, [showRank, showLines]);

  const [lineStep, setLineStep] = useState(0);

  useEffect(() => {
    if (!showLines) return;
    if (lineStep < lines.length - 2) {
      const t = setTimeout(() => setLineStep((n) => n + 1), 700);
      return () => clearTimeout(t);
    }
  }, [showLines, lineStep, lines.length]);

  const allDone = showLines && lineStep >= lines.length - 3;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><span className="text-white text-xs font-bold">L</span></div>
        <span className="text-sm font-semibold text-gray-800">1年3組 文化祭グループ</span>
      </div>
      <div className="flex-1 px-4 py-5 space-y-3 overflow-y-auto">
        {/* 最初の2行（委員長の発表） */}
        {lines.slice(0, step).map((l, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium flex-shrink-0">{l.sender.charAt(0)}</div>
            <div>
              {i === 0 && <div className="text-xs text-gray-500 mb-1">{l.sender}</div>}
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">{l.text}</div>
            </div>
          </div>
        ))}

        {/* 順位カード */}
        {showRank && (
          <div className="bg-gray-900 text-white rounded-2xl p-5 mx-1">
            <div className="text-xs text-gray-400 mb-3 tracking-wider uppercase">中間ランキング</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-gray-400 mb-1">自分たちのクラス</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">{state.rank}位</span>
                  <span className="text-sm text-green-400">↑ 上昇</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-400">フォロワー</div>
                <div className="text-lg font-bold">{state.festivalAccount?.followers ?? 100}人</div>
              </div>
            </div>
          </div>
        )}

        {/* みんなの反応 */}
        {showLines && lines.slice(2, 2 + lineStep + 1).map((l, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium flex-shrink-0">{l.sender.charAt(0)}</div>
            <div>
              <div className="text-xs text-gray-500 mb-1">{l.sender}</div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">{l.text}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="px-5 pb-6 border-t border-gray-200 bg-gray-100 pt-4">
        <ChoiceButton onClick={onNext} disabled={!allDone}>
          {allDone ? "次へ" : "　"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 11. フォロワー突破 LINE ─────────────────────────────────────────

export function Day2Line2Screen({ state, onNext }: { state: GameState; onNext: () => void }) {
  const followers = state.festivalAccount?.followers ?? 100;
  const [visible, setVisible]   = useState(0);
  const [showMono, setShowMono] = useState(false);

  const messages = [
    { id: "m1", sender: "親友",   text: `${followers}人いったじゃん！`, type: "left" as const },
    { id: "m2", sender: "親友",   text: "普通にすごくね？",             type: "left" as const },
    { id: "m3", sender: "委員長", text: "この調子なら、今年は本当に上を狙えるかも", type: "left" as const },
  ];

  useEffect(() => {
    if (visible < messages.length) {
      const t = setTimeout(() => setVisible((n) => n + 1), visible === 0 ? 500 : 750);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowMono(true), 400);
      return () => clearTimeout(t);
    }
  }, [visible, messages.length]);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><span className="text-white text-xs font-bold">L</span></div>
        <span className="text-sm font-semibold text-gray-800">1年3組 文化祭グループ</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <LineChat messages={messages.slice(0, visible)} />
        {showMono && (
          <div className="mx-4 mt-3 mb-4 bg-gray-800/80 rounded-xl px-4 py-3 text-center">
            <p className="text-sm text-white/90 leading-relaxed">「通知が来るたびに、少しだけ期待してしまう」</p>
          </div>
        )}
      </div>
      <div className="px-5 pb-6 bg-gray-100 border-t border-gray-200 pt-4">
        <ChoiceButton onClick={onNext} disabled={visible < messages.length}>
          {visible < messages.length ? "　" : "次へ"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 12. ライバルクラス ──────────────────────────────────────────────

export function Day2RivalsScreen({ state, onNext }: { state: GameState; onNext: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const [showMono, setShowMono] = useState(false);

  useEffect(() => {
    if (revealed < DAY2_RIVAL_CLASSES.length) {
      const t = setTimeout(() => setRevealed((n) => n + 1), revealed === 0 ? 500 : 650);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowMono(true), 400);
      return () => clearTimeout(t);
    }
  }, [revealed]);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-5 py-7">
      <div className="text-xs text-gray-400 tracking-widest mb-1 uppercase">Rankings</div>
      <h2 className="text-lg font-bold text-gray-900 mb-5">ライバルクラスの状況</h2>
      <div className="border-2 border-gray-900 rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400">自分たちのクラス</span>
          <div className="text-sm font-bold text-gray-900 mt-0.5">フォロワー {state.festivalAccount?.followers ?? 100}人</div>
        </div>
        <span className="text-sm font-bold text-gray-900">{state.rank}位</span>
      </div>
      <div className="space-y-2.5 mb-5">
        {DAY2_RIVAL_CLASSES.slice(0, revealed).map((r) => (
          <div key={r.name} className="border border-gray-200 rounded-xl px-4 py-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-800">{r.name}</span>
                <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{r.badge}</span>
              </div>
              <div className="text-xs text-gray-400 mt-0.5">{r.note}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-gray-700">{r.followers.toLocaleString()}</div>
              <div className="text-xs text-gray-400">フォロワー</div>
            </div>
          </div>
        ))}
      </div>
      {showMono && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-4 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">「100人で喜んでたけど、上には上がいるんだな……」</p>
        </div>
      )}
      <div className="mt-auto">
        <ChoiceButton onClick={onNext} disabled={!showMono}>Day2を終える</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 13. Day2終了 ────────────────────────────────────────────────────

export function Day2EndScreen({ state, onDay3, onTitle }: { state: GameState; onDay3: () => void; onTitle: () => void }) {
  const followers = state.festivalAccount?.followers ?? 100;
  const char = DAY2_CHARACTERS[state.day2Area ?? "dance"];

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] px-6 py-12 bg-white">
      <div className="flex-1 flex flex-col w-full">
        <div className="text-xs text-gray-400 tracking-widest mb-4 uppercase">End of Day</div>
        <h2 className="text-3xl font-black text-gray-900 mb-1">Day 2</h2>
        <div className="text-sm text-gray-500 mb-6">終了</div>
        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-5">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
            <div className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Today's Result</div>
          </div>
          <div className="px-5 py-4 space-y-3">
            {[
              ["フォロワー",    `32 → ${followers}`],
              ["順位",          `8位 → ${state.rank}位`],
              ["クラス信頼度",  state.trust],
              ["注目度",        state.attention],
            ].map(([label, value]) => (
              <div key={String(label)} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-bold text-gray-900">{value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl px-5 py-4 mb-5 space-y-3">
          <p className="text-sm text-gray-700 leading-relaxed">
            {char.name}が喜んでくれた。
          </p>
          <p className="text-sm text-gray-700 leading-relaxed">
            委員長も、クラスのみんなも嬉しそうだった。
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            通知が来るたびに、少しだけ期待してしまう。<br />明日はもっと伸ばせるかもしれない。
          </p>
        </div>
        <div className="w-full bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div className="text-xs text-gray-500 mb-1">文化祭まであと</div>
          <div className="text-4xl font-black text-gray-900">5日</div>
        </div>
      </div>
      <div className="w-full mt-8 space-y-3">
        <ChoiceButton onClick={onDay3}>Day3へ進む</ChoiceButton>
        <ChoiceButton onClick={onTitle} variant="secondary">タイトルへ戻る</ChoiceButton>
      </div>
    </div>
  );
}
