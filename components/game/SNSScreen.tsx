"use client";

import { Post } from "./types";

// ─────────────────────────────────────────────────────────────────────────────
// SNSScreen
// SNS投稿一覧画面。
//
// 役割：
//   - 投稿カードを新しい順に並べる
//   - 未読（まだコメントを開いていない）投稿に NEW バッジを表示
//   - タップでコメント詳細へ移動
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  posts:       Post[];
  readPostIds: Set<string>;
  onPost:      (postId: string) => void;
  onBack:      () => void;
};

export default function SNSScreen({ posts, readPostIds, onPost, onBack }: Props) {
  return (
    <div className="flex flex-col min-h-full bg-gray-50">

      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
        <BackButton onClick={onBack} />
        <span className="text-sm font-bold text-gray-900">SNS</span>
      </div>

      {/* フィード */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {posts.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-16">まだ投稿がありません</p>
        ) : (
          [...posts].reverse().map(post => (
            <PostCard
              key={post.id}
              post={post}
              isNew={!readPostIds.has(post.id)}
              onClick={() => onPost(post.id)}
            />
          ))
        )}
      </div>

    </div>
  );
}

// ─── 投稿カード ───────────────────────────────────────────────────────────────

function PostCard({
  post,
  isNew,
  onClick,
}: {
  post:    Post;
  isNew:   boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-2xl shadow-sm overflow-hidden text-left active:scale-[0.98] transition-transform"
    >
      {/* 投稿ヘッダー */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base flex-shrink-0">
          🏫
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-gray-800">1年3組文化祭</span>
            {isNew && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                NEW
              </span>
            )}
          </div>
          <div className="text-xs text-gray-400">{post.postedAt}</div>
        </div>
      </div>

      {/* 画像プレースホルダー */}
      <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-5xl">
        {post.imgEmoji}
      </div>

      {/* 本文 */}
      <div className="px-4 py-3 text-sm text-gray-700 leading-relaxed">{post.body}</div>

      {/* いいね・コメント数 */}
      <div className="flex gap-5 px-4 pb-3 text-sm text-gray-500">
        <span>❤️ {post.likes}</span>
        <span>💬 {post.comments.length}</span>
      </div>
    </button>
  );
}

// ─── 共有バックボタン ─────────────────────────────────────────────────────────

export function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-gray-400 text-xl leading-none px-1 py-1 -ml-1 rounded hover:bg-gray-50 transition-colors"
      aria-label="戻る"
    >
      ‹
    </button>
  );
}
