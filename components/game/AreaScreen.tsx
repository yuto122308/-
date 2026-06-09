"use client";

import { useEffect, useRef, useState } from "react";
import { AreaEvent, Post } from "./types";
import { BackButton } from "./SNSScreen";

// ─────────────────────────────────────────────────────────────────────────────
// AreaScreen
// 取材エリアのイベント画面（ノベルゲーム風）。
//
// フェーズ:
//   1. reading  — セリフを1件ずつ表示（「続ける」ボタンで進む）
//   2. choice   — 投稿テーマを選ぶ
//   3. preview  — 選んだテーマの投稿プレビューを確認
//   （投稿ボタン押下で onPost コールバック → 学校ホームへ戻る）
// ─────────────────────────────────────────────────────────────────────────────

type Phase = "reading" | "choice" | "preview";

type Props = {
  event:  AreaEvent;
  onPost: (post: Post, notifGain: number) => void;
  onBack: () => void;
};

export default function AreaScreen({ event, onPost, onBack }: Props) {
  const [lineIndex,      setLineIndex]      = useState(0);
  const [phase,          setPhase]          = useState<Phase>("reading");
  const [pendingChoice,  setPendingChoice]  = useState<string | null>(null);
  const [confirmedChoice, setConfirmedChoice] = useState<string | null>(null);

  const logBottomRef = useRef<HTMLDivElement>(null);

  // ログ追加時に最下部にスクロール
  useEffect(() => {
    logBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lineIndex, phase]);

  // 「続ける」を押すたびに次のセリフを表示し、
  // 全セリフを読み終えたら choice フェーズへ遷移。
  const handleNext = () => {
    const next = lineIndex + 1;
    setLineIndex(next);
    if (next >= event.lines.length) {
      setTimeout(() => setPhase("choice"), 150);
    }
  };

  // 選択肢を確定してプレビューへ
  const handleConfirm = () => {
    if (!pendingChoice) return;
    setConfirmedChoice(pendingChoice);
    setPhase("preview");
  };

  // 投稿実行
  const handlePost = () => {
    if (!confirmedChoice) return;
    const post = event.makePost(confirmedChoice);
    onPost(post, event.notifGain);
  };

  const visibleLines = event.lines.slice(0, lineIndex);
  const previewBody  = confirmedChoice ? event.makePost(confirmedChoice).body : null;
  const previewEmoji = confirmedChoice ? event.makePost(confirmedChoice).imgEmoji : null;

  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <BackButton onClick={onBack} />
        <span className="text-sm font-bold text-gray-800">
          {event.areaEmoji} {event.areaLabel}
        </span>
      </div>

      {/* 会話ログ */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {visibleLines.map((line, i) => (
          <div key={i} className="game-fade-up">
            {line.speaker ? (
              <>
                <div className="text-xs font-bold text-gray-400 mb-1">{line.speaker}</div>
                <div className="text-[15px] leading-relaxed text-gray-800">{line.text}</div>
              </>
            ) : (
              <div className="text-sm text-gray-500 italic leading-relaxed">{line.text}</div>
            )}
          </div>
        ))}

        {/* ── 選択肢フェーズ ── */}
        {phase === "choice" && (
          <div className="space-y-3 pt-2 game-fade-up">
            <div className="text-sm font-bold text-gray-700">{event.question}</div>
            {event.choices.map(c => (
              <button
                key={c.id}
                onClick={() => setPendingChoice(c.id)}
                className={`w-full text-left border-2 rounded-xl px-4 py-3 transition-all ${
                  pendingChoice === c.id
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white hover:border-gray-400"
                }`}
              >
                <div className="text-sm font-bold">{c.label}</div>
                <div className={`text-xs mt-0.5 ${pendingChoice === c.id ? "text-gray-300" : "text-gray-500"}`}>
                  {c.desc}
                </div>
              </button>
            ))}
            {pendingChoice && (
              <button
                onClick={handleConfirm}
                className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm mt-1"
              >
                これで伝える
              </button>
            )}
          </div>
        )}

        {/* ── プレビューフェーズ ── */}
        {phase === "preview" && previewBody && (
          <div className="space-y-3 pt-2 game-fade-up">
            <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">投稿プレビュー</div>
            <div className="border-2 border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base">🏫</div>
                <div>
                  <div className="text-sm font-bold text-gray-800">1年3組文化祭</div>
                  <div className="text-xs text-gray-400">プレビュー</div>
                </div>
              </div>
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-5xl">
                {previewEmoji}
              </div>
              <div className="px-4 py-3 text-sm text-gray-800 leading-relaxed">{previewBody}</div>
            </div>
          </div>
        )}

        <div ref={logBottomRef} />
      </div>

      {/* フッターボタン */}
      <div className="px-5 pb-7 pt-3 border-t border-gray-100">
        {phase === "reading" && lineIndex < event.lines.length && (
          <button
            onClick={handleNext}
            className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
          >
            続ける
          </button>
        )}
        {phase === "preview" && (
          <button
            onClick={handlePost}
            className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
          >
            投稿する
          </button>
        )}
      </div>

    </div>
  );
}
