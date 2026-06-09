"use client";

import { useEffect, useState } from "react";
import { LineThread } from "./types";
import { BackButton } from "./SNSScreen";

// ─────────────────────────────────────────────────────────────────────────────
// LineListScreen
// LINEトーク一覧画面。
// ─────────────────────────────────────────────────────────────────────────────

type ListProps = {
  threads:       LineThread[];
  readThreadIds: Set<string>;
  onThread:      (threadId: string) => void;
  onBack:        () => void;
};

export function LineListScreen({ threads, readThreadIds, onThread, onBack }: ListProps) {
  return (
    <div className="flex flex-col min-h-full bg-gray-50">

      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
        <BackButton onClick={onBack} />
        <span className="text-sm font-bold text-gray-900">LINE</span>
      </div>

      {/* トーク一覧 */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {threads.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-16">まだメッセージはありません</p>
        ) : (
          threads.map(t => (
            <ThreadRow
              key={t.id}
              thread={t}
              unread={!readThreadIds.has(t.id)}
              onClick={() => onThread(t.id)}
            />
          ))
        )}
      </div>

    </div>
  );
}

// ─── スレッド行 ───────────────────────────────────────────────────────────────

function ThreadRow({
  thread,
  unread,
  onClick,
}: {
  thread:  LineThread;
  unread:  boolean;
  onClick: () => void;
}) {
  const lastMessage = thread.messages[thread.messages.length - 1] ?? "";

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-3 py-3 bg-white rounded-xl text-left hover:bg-gray-50 transition-colors"
    >
      {/* アバター（未読ドット付き） */}
      <div className="relative w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
        {thread.avatar}
        {unread && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
        )}
      </div>

      {/* 名前・最後のメッセージ */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-bold text-gray-800">{thread.name}</div>
        <div className="text-xs text-gray-400 truncate">{lastMessage}</div>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LineChatScreen
// 個別トーク画面。
// メッセージを1件ずつアニメーション表示。
// ─────────────────────────────────────────────────────────────────────────────

type ChatProps = {
  thread: LineThread;
  onBack: () => void;
};

export function LineChatScreen({ thread, onBack }: ChatProps) {
  const [visibleCount, setVisibleCount] = useState(0);

  // マウント時にメッセージを順番に表示
  useEffect(() => {
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    thread.messages.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleCount(n => n + 1), i * 450 + 350)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [thread.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col min-h-full" style={{ background: "#e8f5e9" }}>

      {/* LINEらしい緑ヘッダー */}
      <div className="flex items-center gap-3 px-4 py-3 bg-green-500">
        <button
          onClick={onBack}
          className="text-white text-xl leading-none opacity-80 hover:opacity-100"
          aria-label="戻る"
        >
          ‹
        </button>
        <span className="text-sm font-bold text-white">{thread.name}</span>
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {thread.messages.slice(0, visibleCount).map((msg, i) => (
          <div key={i} className="flex items-end gap-2 game-fade-up">
            {/* 先頭メッセージのみアバター表示 */}
            {i === 0 ? (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-base flex-shrink-0">
                {thread.avatar}
              </div>
            ) : (
              <div className="w-8 flex-shrink-0" />
            )}

            <div>
              {i === 0 && (
                <div className="text-xs text-gray-500 mb-1">{thread.name}</div>
              )}
              <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[230px] leading-relaxed shadow-sm">
                {msg}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
