"use client";

import { useEffect, useState } from "react";
import { Post } from "./types";
import { BackButton } from "./SNSScreen";

// ─────────────────────────────────────────────────────────────────────────────
// CommentsScreen
// コメント詳細画面。
//
// 設計思想：
//   コメントを「見ることが快感」になるよう、
//   1件ずつアニメーションで出現させる。
//   全件表示は避け「他N件」で圧縮することで適度な余韻を残す。
//
// Day6「通知99+」演出への伏線：
//   ここのコメントが増えれば増えるほど快感が上がる構造を
//   Day1 から体に染み込ませる。
// ─────────────────────────────────────────────────────────────────────────────

// 画面に表示するコメント数の上限
const MAX_VISIBLE = 5;

type Props = {
  post:   Post;
  onBack: () => void;
};

export default function CommentsScreen({ post, onBack }: Props) {
  // コメントを1件ずつフェードイン表示するためのカウンタ
  const [visibleCount, setVisibleCount] = useState(0);

  const visibleComments = post.comments.slice(0, MAX_VISIBLE);
  const hiddenCount     = post.comments.length - visibleComments.length;

  // マウント後、順番にコメントを表示
  useEffect(() => {
    setVisibleCount(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    visibleComments.forEach((_, i) => {
      timers.push(
        setTimeout(() => setVisibleCount(n => n + 1), i * 220 + 250)
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [post.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <BackButton onClick={onBack} />
        <span className="text-sm font-bold text-gray-900">コメント</span>
      </div>

      {/* 投稿サマリー */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{post.imgEmoji}</span>
          <span className="text-xs text-gray-400">{post.postedAt}</span>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{post.body}</p>
        <div className="flex gap-5 mt-3 text-sm text-gray-500">
          <span>❤️ {post.likes}</span>
          <span>💬 {post.comments.length}</span>
        </div>
      </div>

      {/* コメント一覧（アニメーション付き） */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {visibleComments.slice(0, visibleCount).map((c, i) => (
          <div
            key={i}
            className="flex gap-3 game-fade-up"
            style={{ animationDelay: "0ms" }} // タイミングは useEffect で制御済み
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
              {c.avatar}
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 mb-1">{c.user}</div>
              <div className="bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-800 inline-block leading-relaxed">
                {c.text}
              </div>
            </div>
          </div>
        ))}

        {/* 「他N件」— 全件表示しないことで余白と余韻を作る */}
        {visibleCount >= visibleComments.length && hiddenCount > 0 && (
          <div className="text-center text-xs text-gray-400 py-3">
            他{hiddenCount}件のコメント
          </div>
        )}
      </div>

    </div>
  );
}
