"use client";

import { useState, useEffect, useCallback } from "react";
import ChoiceButton from "@/components/ChoiceButton";
import ConceptImage from "@/components/ConceptImage";
import LineChat from "@/components/LineChat";
import SnsPostCard from "@/components/SnsPostCard";
import { GameState } from "@/data/day1";
import {
  DAY2_MORNING_NOTIFICATIONS,
  DAY2_COMMENTS_INIT,
  DAY2_LINE_MORNING,
  DAY2_AREAS,
  DAY2_POST_VALUES,
  DAY2_POST_TARGETS,
  DAY2_RIVAL_CLASSES,
  getDay2PostComments,
  computeDay2Outcome,
  Day2AreaId,
  Day2ValueId,
  Day2TargetId,
} from "@/data/day2";

// ─── 共通: ステータスバー ────────────────────────────────────────────

function StatusRow({ label, value, color = "text-gray-900" }: { label: string; value: string | number; color?: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className={`font-bold ${color}`}>{value}</span>
    </div>
  );
}

// ─── 1. 朝の通知画面 ────────────────────────────────────────────────

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
        <button
          onClick={onNext}
          disabled={!showMono}
          className="w-full py-3.5 rounded-xl text-sm font-medium disabled:opacity-0 bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all"
        >
          通知を確認する
        </button>
      </div>
    </div>
  );
}

// ─── 2. コメント確認画面 ─────────────────────────────────────────────

export function Day2CommentsScreen({ state, onNext }: { state: GameState; onNext: () => void }) {
  const [visible, setVisible] = useState(0);
  const acc = state.festivalAccount;

  useEffect(() => {
    if (visible < DAY2_COMMENTS_INIT.length) {
      const t = setTimeout(() => setVisible((n) => n + 1), visible === 0 ? 600 : 700);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const done = visible >= DAY2_COMMENTS_INIT.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-5 py-3">
        <div className="text-xs text-gray-400 mb-0.5">昨日の投稿</div>
        <span className="text-sm font-semibold text-gray-800">コメントが届いています</span>
      </div>
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        {/* 投稿カード（ミニ版） */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-5">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm">
              {acc?.icon ?? "🏫"}
            </div>
            <span className="text-xs font-medium text-gray-700">{acc?.accountName ?? "1年3組文化祭公式"}</span>
          </div>
          <ConceptImage panel="post_classroom" className="w-full h-24" />
          <div className="px-3 py-2 flex items-center gap-1">
            <span className="text-red-500 text-sm">♡</span>
            <span className="text-sm font-bold text-gray-900">28</span>
          </div>
        </div>

        {/* コメント */}
        <div className="space-y-2.5">
          {DAY2_COMMENTS_INIT.slice(0, visible).map((c) => (
            <div key={c.id} className="flex items-start gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-base flex-shrink-0">
                {c.avatar}
              </div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 max-w-[260px]">
                <div className="text-xs text-gray-400 mb-0.5">{c.user}</div>
                <div className="text-sm text-gray-800">{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="px-5 pb-6 border-t border-gray-100 pt-4 bg-gray-50">
        <ChoiceButton onClick={onNext} disabled={!done}>
          {done ? "LINEを見る" : "……"}
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

  const done = visible >= DAY2_LINE_MORNING.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">L</span>
        </div>
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
        <ChoiceButton onClick={onNext} disabled={!done}>
          {done ? "今日のミッションを確認する" : "　"}
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

      {/* 現在のステータス */}
      <div className="border border-gray-200 rounded-2xl p-5 mb-5">
        <div className="text-xs font-semibold text-gray-400 tracking-wider mb-3 uppercase">Status</div>
        <div className="space-y-2.5">
          <StatusRow label="フォロワー" value={`${state.festivalAccount?.followers ?? 32}人`} />
          <StatusRow label="クラス信頼度" value={state.trust} />
          <StatusRow label="注目度" value={state.attention} />
          <StatusRow label="SNS順位" value={`${state.rank}位`} />
        </div>
      </div>

      {/* ミッションカード */}
      <div className="bg-gray-900 text-white rounded-2xl p-5 mb-5">
        <div className="text-xs text-gray-400 tracking-widest mb-2 uppercase">Today's Mission</div>
        <div className="text-base font-bold leading-snug mb-2">
          文化祭の魅力を取材して<br />フォロワー100人を目指そう
        </div>
        <div className="flex items-center gap-2 mt-3">
          <div className="flex-1 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${((state.festivalAccount?.followers ?? 32) / 100) * 100}%` }} />
          </div>
          <span className="text-xs text-gray-400">{state.festivalAccount?.followers ?? 32} / 100</span>
        </div>
      </div>

      <div className="mt-auto">
        <ChoiceButton onClick={onNext}>取材を始める</ChoiceButton>
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
        <div className="text-xs text-gray-400 mb-1 tracking-wider uppercase">Mission</div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">どこを取材する？</h2>
          <div className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${visited ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}>
            {visited ? "1 / 1 ✓" : "0 / 1"}
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">1か所取材したら投稿を作ろう</p>
      </div>

      <div className="flex-1 px-5 py-4 space-y-2.5 overflow-y-auto">
        {DAY2_AREAS.map((area) => {
          const isVisited = visited === area.id;
          return (
            <button key={area.id} onClick={() => onAreaSelect(area.id as Day2AreaId)}
              className={`w-full flex items-center gap-3 border rounded-xl px-4 py-4 text-left transition-colors active:scale-[0.98] ${isVisited ? "border-gray-300 bg-gray-50" : "border-gray-200 bg-white hover:border-gray-400"}`}>
              <span className="text-2xl flex-shrink-0">{area.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className={`text-sm font-medium ${isVisited ? "text-gray-500" : "text-gray-800"}`}>{area.label}</div>
                <div className="text-xs text-gray-400 mt-0.5 truncate">{isVisited ? "取材メモを記録しました" : area.desc}</div>
              </div>
              <div className="flex flex-wrap gap-1 max-w-[90px]">
                {!isVisited && area.tags.slice(0, 1).map((tag) => (
                  <span key={tag} className={`text-xs px-1.5 py-0.5 rounded-full ${area.hasRisk ? "bg-orange-50 text-orange-600" : "bg-gray-100 text-gray-500"}`}>
                    {tag}
                  </span>
                ))}
                {isVisited && <span className="text-green-600 text-lg">✓</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        {visited ? (
          <ChoiceButton onClick={onContinue}>投稿を作る</ChoiceButton>
        ) : (
          <div className="text-xs text-gray-400 text-center py-2">取材先を1か所選ぼう</div>
        )}
      </div>
    </div>
  );
}

// ─── 6. 取材イベント ─────────────────────────────────────────────────

export function Day2InterviewScreen({ areaId, onBack }: { areaId: Day2AreaId; onBack: () => void }) {
  const area = DAY2_AREAS.find((a) => a.id === areaId)!;

  const panelMap: Partial<Record<string, import("@/components/ConceptImage").PanelId>> = {
    shop: "shop_bg",
    decoration: "decoration_bg",
  };
  const panel = panelMap[areaId];

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="text-gray-500 text-sm">← 戻る</button>
        <span className="text-sm font-semibold text-gray-800">{area.label}</span>
      </div>

      {panel ? (
        <ConceptImage panel={panel} className="w-full h-36" />
      ) : (
        <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
          <span className="text-5xl">{area.emoji}</span>
        </div>
      )}

      <div className="flex-1 px-5 py-5">
        <div className="text-xs text-gray-400 mb-1">取材先</div>
        <h3 className="text-base font-bold text-gray-900 mb-4">{area.label}</h3>
        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">{area.detail}</p>
        </div>

        {/* 取材メモ */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{area.emoji}</span>
            <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">取材メモ</span>
          </div>
          <p className="text-sm text-amber-900 font-medium">{area.material}</p>
          <p className="text-xs text-amber-700 mt-1 leading-relaxed">{area.detail}</p>
        </div>

        {area.hasRisk && (
          <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-xs text-orange-700">
            ⚠️ 先生が映り込んでいます
          </div>
        )}
      </div>

      <div className="px-5 pb-6">
        <ChoiceButton onClick={onBack} variant="secondary">教室に戻る</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 7. 投稿作成 ─────────────────────────────────────────────────────

export function Day2PostScreen({ state, onPost }: {
  state: GameState;
  onPost: (value: Day2ValueId, target: Day2TargetId) => void;
}) {
  const [selectedValue,  setSelectedValue]  = useState<Day2ValueId | null>(null);
  const [selectedTarget, setSelectedTarget] = useState<Day2TargetId | null>(null);
  const acc   = state.festivalAccount;
  const area  = DAY2_AREAS.find((a) => a.id === state.day2Area);
  const canPost = selectedValue !== null && selectedTarget !== null;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-base font-bold text-gray-900">投稿を作る</h2>
        <p className="text-xs text-gray-500 mt-0.5">価値観とターゲットを選んでください</p>
      </div>
      <div className="flex-1 px-5 py-5 overflow-y-auto space-y-6">

        {/* 素材（固定） */}
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider uppercase">素材</div>
          <div className="border border-gray-900 bg-gray-50 rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-xl">{area?.emoji ?? "📷"}</span>
            <span className="text-sm font-medium text-gray-900">{area?.material ?? "—"}</span>
            <span className="ml-auto text-xs text-gray-400 bg-white border border-gray-200 rounded px-1.5 py-0.5">選択済</span>
          </div>
        </div>

        {/* 価値観 */}
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider uppercase">価値観</div>
          <div className="space-y-2">
            {DAY2_POST_VALUES.map((v) => (
              <button key={v.id} onClick={() => setSelectedValue(v.id as Day2ValueId)}
                className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 text-left transition-colors ${selectedValue === v.id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                <span className="text-xl">{v.emoji}</span>
                <div>
                  <div className="text-sm font-medium text-gray-800">{v.label}</div>
                  <div className="text-xs text-gray-400">{v.desc}</div>
                </div>
                {selectedValue === v.id && <span className="ml-auto font-bold text-gray-900">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ターゲット */}
        <div>
          <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider uppercase">ターゲット</div>
          <div className="flex gap-3">
            {DAY2_POST_TARGETS.map((t) => (
              <button key={t.id} onClick={() => setSelectedTarget(t.id as Day2TargetId)}
                className={`flex-1 flex flex-col items-center gap-1.5 border rounded-xl py-4 transition-colors ${selectedTarget === t.id ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                <span className="text-2xl">{t.emoji}</span>
                <span className="text-sm font-medium text-gray-800">{t.label}</span>
                {selectedTarget === t.id && <span className="text-xs text-gray-500">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* プレビュー */}
        {canPost && (
          <div>
            <div className="text-xs font-semibold text-gray-500 mb-2 tracking-wider uppercase">プレビュー</div>
            <div className="border border-gray-300 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm">{acc?.icon ?? "🏫"}</div>
                <span className="text-xs font-medium text-gray-700">{acc?.accountName ?? "1年3組文化祭公式"}</span>
              </div>
              <SnsPostCard
                title={`${area?.material} — ${DAY2_POST_VALUES.find((v) => v.id === selectedValue)?.label}な視点で`}
                likes={0}
              />
            </div>
          </div>
        )}
      </div>
      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        <ChoiceButton
          onClick={() => canPost && onPost(selectedValue!, selectedTarget!)}
          disabled={!canPost}>
          投稿する
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 8. 投稿後の通知ラッシュ ─────────────────────────────────────────

interface NotifStep {
  emoji: string;
  text: string;
  sub?: string;
  isMilestone?: boolean;
  isUnsettling?: boolean;
}

export function Day2PostResultScreen({ state, onDone }: {
  state: GameState;
  onDone: (outcome: ReturnType<typeof computeDay2Outcome>) => void;
}) {
  const area    = state.day2Area ?? "shop";
  const value   = state.day2Value ?? "popularity";
  const target  = state.day2Target ?? "students";
  const outcome = computeDay2Outcome(area, value, target);
  const comments = getDay2PostComments(area, value, target);

  const steps: NotifStep[] = [
    { emoji: "❤️", text: "いいね +5", sub: "通知が届いています" },
    { emoji: "❤️", text: "いいね +12", sub: "どんどん増えています" },
    { emoji: "💬", text: `コメント「${comments[0]?.text}」`, sub: comments[0]?.unsettling ? undefined : "コメントが届きました" },
    { emoji: "👤", text: "フォロワー +8" },
    { emoji: "💬", text: `コメント「${comments[1]?.text ?? comments[0]?.text}」`, isUnsettling: comments[1]?.unsettling },
    { emoji: "❤️", text: "いいね +30", sub: "急に増えてきた！" },
    { emoji: "🎉", text: `フォロワー ${outcome.newFollowers}人突破！`, sub: "マイルストーン達成", isMilestone: true },
    { emoji: "📊", text: `順位 ${state.rank}位 → ${outcome.newRank}位`, sub: "上昇しました" },
  ];

  const [step, setStep]       = useState(0);
  const [called, setCalled]   = useState(false);

  useEffect(() => {
    if (step < steps.length) {
      const t = setTimeout(() => setStep((n) => n + 1), step === 0 ? 600 : 900);
      return () => clearTimeout(t);
    }
  }, [step, steps.length]);

  const allDone = step >= steps.length;

  const handleDone = useCallback(() => {
    if (!called) {
      setCalled(true);
      onDone(outcome);
    }
  }, [called, onDone, outcome]);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-base font-bold text-gray-900">投稿しました</h2>
        <p className="text-xs text-gray-500 mt-0.5">通知が届いています…</p>
      </div>
      <div className="flex-1 px-5 py-5 overflow-y-auto space-y-2.5">
        {steps.slice(0, step).map((s, i) => (
          <div key={i}
            className={`flex items-start gap-3 border rounded-2xl px-4 py-3 transition-all ${
              s.isMilestone
                ? "border-yellow-300 bg-yellow-50"
                : s.isUnsettling
                  ? "border-gray-300 bg-gray-50"
                  : "border-gray-200 bg-white"
            }`}>
            <span className={`text-xl mt-0.5 ${s.isMilestone ? "animate-bounce" : ""}`}>{s.emoji}</span>
            <div>
              <div className={`text-sm font-medium ${s.isMilestone ? "text-yellow-800" : s.isUnsettling ? "text-gray-500" : "text-gray-800"}`}>
                {s.text}
              </div>
              {s.sub && <div className={`text-xs mt-0.5 ${s.isMilestone ? "text-yellow-600" : "text-gray-400"}`}>{s.sub}</div>}
            </div>
          </div>
        ))}
        {step < steps.length && (
          <div className="text-center py-3">
            <span className="text-xs text-gray-400 animate-pulse">通知が届いています…</span>
          </div>
        )}
      </div>
      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        <ChoiceButton onClick={handleDone} disabled={!allDone}>
          {allDone ? "次へ" : "　"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 9. フォロワー100人突破LINE ──────────────────────────────────────

export function Day2Line2Screen({ state, onNext }: { state: GameState; onNext: () => void }) {
  const followers = state.festivalAccount?.followers ?? 100;
  const [visible, setVisible] = useState(0);
  const [showMono, setShowMono] = useState(false);

  const messages = [
    { id: "m1", sender: "親友",   text: `${followers}人いったじゃん！`,   type: "left" as const },
    { id: "m2", sender: "親友",   text: "普通にすごくね？",               type: "left" as const },
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

  const done = visible >= messages.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">L</span>
        </div>
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
        <ChoiceButton onClick={onNext} disabled={!done}>
          {done ? "次へ" : "　"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 10. ライバルクラス確認 ──────────────────────────────────────────

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

  const done = revealed >= DAY2_RIVAL_CLASSES.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-5 py-7">
      <div className="text-xs text-gray-400 tracking-widest mb-1 uppercase">Rankings</div>
      <h2 className="text-lg font-bold text-gray-900 mb-5">ライバルクラスの状況</h2>

      {/* 自クラス */}
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
        <ChoiceButton onClick={onNext} disabled={!done}>Day2を終える</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 11. Day2終了 ────────────────────────────────────────────────────

export function Day2EndScreen({ state, onTitle }: { state: GameState; onTitle: () => void }) {
  const followers = state.festivalAccount?.followers ?? 100;

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-28px)] px-6 py-12 bg-white">
      <div className="flex-1 flex flex-col w-full">
        <div className="text-xs text-gray-400 tracking-widest mb-4 uppercase">End of Day</div>
        <h2 className="text-3xl font-black text-gray-900 mb-1">Day 2</h2>
        <div className="text-sm text-gray-500 mb-6">終了</div>

        {/* サマリー */}
        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-5">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
            <div className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Today's Result</div>
          </div>
          <div className="px-5 py-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">フォロワー</span>
              <span className="font-bold text-gray-900">32 → <span className="text-green-600">{followers}</span></span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">順位</span>
              <span className="font-bold text-gray-900">8位 → <span className="text-green-600">{state.rank}位</span></span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">クラス信頼度</span>
              <span className="font-bold text-gray-900">{state.trust}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">注目度</span>
              <span className="font-bold text-gray-900">{state.attention}</span>
            </div>
          </div>
        </div>

        {/* モノローグ */}
        <div className="bg-gray-50 rounded-xl px-5 py-4 mb-5 space-y-2">
          <p className="text-sm text-gray-700 leading-relaxed">通知が来るたびに、少しだけ期待してしまう。</p>
          <p className="text-sm text-gray-700 leading-relaxed">明日はもっと伸ばせるかもしれない。</p>
        </div>

        {/* カウントダウン */}
        <div className="w-full bg-white border border-gray-200 rounded-xl p-5 text-center">
          <div className="text-xs text-gray-500 mb-1">文化祭まであと</div>
          <div className="text-4xl font-black text-gray-900">5日</div>
        </div>
      </div>

      <div className="w-full mt-8">
        <ChoiceButton onClick={onTitle} variant="secondary">タイトルへ戻る</ChoiceButton>
      </div>
    </div>
  );
}
