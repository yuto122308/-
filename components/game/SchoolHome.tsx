"use client";

import { DailyGoal, Destination } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// SchoolHome
// 現実世界側のホーム画面。
//
// 役割：
//   - 今日の目標チェックリストを常に表示（迷わない擬似自由探索）
//   - 行き先ボタンで取材エリアまたはスマホへ移動
//   - スマホボタンに通知バッジを表示（「気になる」を演出する）
//
// Day1 チュートリアルでは翔が「スマホ見てみろよ」と促す想定。
// そのセリフは上部のイベントバナーとして差し込める設計にしてある。
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  dayLabel:      string;           // 例: "Day 4 — 文化祭まであと3日"
  roomLabel:     string;           // 例: "文化祭準備室"
  goals:         DailyGoal[];      // チェックリスト
  destinations:  Destination[];    // 行き先一覧
  notifications: number;           // 未読通知数（スマホバッジ）
  onDestination: (id: string) => void;
  canEnd:        boolean;
  onEnd:         () => void;
  // Day1 チュートリアル用：上部にキャラのセリフを差し込めるスロット
  eventBanner?:  React.ReactNode;
};

export default function SchoolHome({
  dayLabel,
  roomLabel,
  goals,
  destinations,
  notifications,
  onDestination,
  canEnd,
  onEnd,
  eventBanner,
}: Props) {
  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* ヘッダー */}
      <div className="px-5 pt-6 pb-4 border-b border-gray-100">
        <div className="text-xs text-gray-400 tracking-widest uppercase mb-1">{dayLabel}</div>
        <h1 className="text-xl font-black text-gray-900">{roomLabel}</h1>
      </div>

      {/* イベントバナー（チュートリアルセリフなど）— 存在するときだけ表示 */}
      {eventBanner && (
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          {eventBanner}
        </div>
      )}

      {/* 今日の目標チェックリスト */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">今日の目標</div>
        <div className="space-y-2.5">
          {goals.map((g, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                g.done ? "bg-gray-900 border-gray-900" : "border-gray-300"
              }`}>
                {g.done && <span className="text-white text-[10px] font-bold">✓</span>}
              </div>
              <span className={`text-sm leading-snug transition-colors ${
                g.done ? "text-gray-400 line-through" : "text-gray-700"
              }`}>
                {g.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 行き先ボタン */}
      <div className="px-5 py-5 flex-1">
        <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">行き先</div>
        <div className="space-y-2.5">
          {destinations.map(dest => (
            <DestinationButton
              key={dest.id}
              dest={dest}
              notifications={dest.isPhone ? notifications : 0}
              onClick={() => onDestination(dest.id)}
            />
          ))}
        </div>
      </div>

      {/* 「今日を終える」ボタン — 全目標達成後のみ表示 */}
      {canEnd && (
        <div className="px-5 pb-8">
          <button
            onClick={onEnd}
            className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
          >
            今日を終える
          </button>
        </div>
      )}

    </div>
  );
}

// ─── 行き先ボタン ─────────────────────────────────────────────────────────────

function DestinationButton({
  dest,
  notifications,
  onClick,
}: {
  dest:          Destination;
  notifications: number;
  onClick:       () => void;
}) {
  // 完了済み → グレーアウト表示（タップ不可）
  if (dest.done) {
    return (
      <div className="w-full flex items-center gap-4 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 opacity-50">
        <span className="text-2xl">{dest.emoji}</span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-gray-500">{dest.label}</div>
          <div className="text-xs text-gray-400 mt-0.5">取材済み</div>
        </div>
        <span className="text-green-500 text-sm font-bold">✓</span>
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={dest.disabled}
      className="w-full flex items-center gap-4 bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-left
                 hover:border-gray-400 active:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed
                 transition-all"
    >
      <span className="text-2xl">{dest.emoji}</span>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800">{dest.label}</div>
        <div className="text-xs text-gray-400 mt-0.5">{dest.sublabel}</div>
      </div>

      {/* スマホボタンの通知バッジ */}
      {dest.isPhone && notifications > 0 ? (
        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[26px] text-center animate-pulse">
          {notifications > 99 ? "99+" : notifications}
        </span>
      ) : (
        <span className="text-gray-300 text-lg flex-shrink-0">›</span>
      )}
    </button>
  );
}
