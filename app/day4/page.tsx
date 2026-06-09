"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────────────────────────────────────

// 画面モード
// school-home  : 学校ホーム（取材先選択）
// area-*       : 各取材エリアのイベント
// phone-home   : スマホホーム（SNS / LINE 選択）
// sns-feed     : SNS投稿一覧
// sns-comments : コメント詳細
// line-list    : LINEトーク一覧
// line-chat    : 個別トーク
// end          : 終了画面
type Screen =
  | "school-home"
  | "area-decoration"
  | "area-dance"
  | "phone-home"
  | "sns-feed"
  | "sns-comments"
  | "line-list"
  | "line-chat"
  | "end";

type ChoiceId = "A" | "B" | "C" | null;

type Post = {
  id: string;
  imgEmoji: string;
  body: string;
  likes: number;
  comments: Comment[];
  postedAt: string;
  isNew: boolean; // まだコメントを開いていない
};

type Comment = {
  user: string;
  avatar: string;
  text: string;
};

type AreaEvent = {
  // ノベルゲーム風のセリフシーケンス
  lines: { speaker: string | null; text: string }[];
  // 投稿テーマ選択肢
  question: string;
  choices: { id: string; label: string; desc: string }[];
  // 選択後の投稿プレビュー生成
  makePost: (choice: ChoiceId) => Post;
  // 投稿完了後に増やす通知数
  notifGain: number;
};

// ─────────────────────────────────────────────────────────────────────────────
// エリアイベント定義
// ─────────────────────────────────────────────────────────────────────────────

const DECORATION_EVENT: AreaEvent = {
  lines: [
    { speaker: null,         text: "教室のすみ。装飾班が看板を作っていた。" },
    { speaker: "装飾班の子", text: "ここ、当日は机で隠れるんだけど——気になるんだよね。ここまで作り込みたくて。" },
    { speaker: "あなた",     text: "そこって…見えないよね？" },
    { speaker: "装飾班の子", text: "うん。でも、なんか気になるんだよね。誰かが気づいてくれたら嬉しいし。" },
    { speaker: null,         text: "撮影を終えた。さて、何を伝えよう。" },
  ],
  question: "あなたは何を伝えたいですか？",
  choices: [
    { id: "A", label: "見えない努力を伝える",       desc: "誰も気づかない場所まで作り込む姿を伝える" },
    { id: "B", label: "みんなで作る楽しさを伝える", desc: "笑いながら真剣に作る雰囲気を伝える" },
    { id: "C", label: "完成への期待を伝える",        desc: "まだ完成していない今だからこそのワクワク感" },
  ],
  makePost: (choice) => {
    const d = {
      A: {
        body: "誰も気づかない場所まで。装飾班の、見えない努力を記録しました。",
        likes: 34,
        comments: [
          { user: "高校生", avatar: "🧑‍🎓", text: "こういう裏側好き" },
          { user: "高校生", avatar: "🧑‍🎓", text: "見えないところまでやってるのすごい" },
          { user: "卒業生", avatar: "🎓",   text: "懐かしい。こういう人たちがいるから文化祭っていいよな" },
          { user: "保護者", avatar: "🙂",   text: "頑張ってますね。応援してます" },
          { user: "高校生", avatar: "🧑‍🎓", text: "B組ちゃんとしてる" },
          { user: "高校生", avatar: "🧑‍🎓", text: "当日絶対行く！" },
          { user: "高校生", avatar: "🧑‍🎓", text: "このクラス好きだな" },
        ],
      },
      B: {
        body: "笑いながら、でも真剣に。みんなで作る文化祭の装飾、現在進行中です。",
        likes: 41,
        comments: [
          { user: "高校生", avatar: "🧑‍🎓", text: "青春って感じ" },
          { user: "高校生", avatar: "🧑‍🎓", text: "楽しそう！" },
          { user: "卒業生", avatar: "🎓",   text: "うちの時もこんな感じだったな" },
          { user: "高校生", avatar: "🧑‍🎓", text: "B組雰囲気いいね" },
          { user: "保護者", avatar: "🙂",   text: "青春だ〜" },
          { user: "高校生", avatar: "🧑‍🎓", text: "完成したら見に行く" },
        ],
      },
      C: {
        body: "完成はまだ先。でも絶対すごいものになる。装飾班、本気の制作中。",
        likes: 28,
        comments: [
          { user: "高校生", avatar: "🧑‍🎓", text: "完成版見たい" },
          { user: "高校生", avatar: "🧑‍🎓", text: "本番気になる" },
          { user: "高校生", avatar: "🧑‍🎓", text: "これは見に行きたい" },
          { user: "保護者", avatar: "🙂",   text: "完成が楽しみです" },
          { user: "高校生", avatar: "🧑‍🎓", text: "どんな仕上がりになるんだろ" },
        ],
      },
    }[choice ?? "A"];
    return {
      id: "post-decoration",
      imgEmoji: "🎨",
      body: d.body,
      likes: d.likes,
      comments: d.comments,
      postedAt: "今日 午後2:14",
      isNew: true,
    };
  },
  notifGain: 5,
};

const DANCE_EVENT: AreaEvent = {
  lines: [
    { speaker: null,     text: "放課後。体育館の隅で、美月がひとりで踊っていた。" },
    { speaker: null,     text: "失敗。やり直し。また失敗。そして——成功。笑顔。" },
    { speaker: "美月",   text: "まだ完成してないんだけどね。" },
    { speaker: "美月",   text: "本番までには絶対仕上げたい。それだけ。" },
    { speaker: "美月",   text: "投稿？任せるよ。あなたのこと、信頼してるから。" },
    { speaker: null,     text: "撮影を終えた。今日2回目の投稿。何を伝えよう。" },
  ],
  question: "あなたは何を伝えたいですか？",
  choices: [
    { id: "A", label: "頑張っている姿を伝える",   desc: "何度も繰り返す美月の姿そのものを伝える" },
    { id: "B", label: "感情が見える瞬間を伝える", desc: "失敗して、また笑顔になった瞬間を切り取る" },
    { id: "C", label: "本番への期待を伝える",     desc: "「絶対仕上げたい」という言葉で期待感を高める" },
  ],
  makePost: (choice) => {
    const d = {
      A: {
        body: "何度も何度も繰り返す。美月の、誰にも見せない練習時間を記録しました。",
        likes: 87,
        comments: [
          { user: "高校生", avatar: "🧑‍🎓", text: "努力してるの伝わる" },
          { user: "高校生", avatar: "🧑‍🎓", text: "応援したくなる" },
          { user: "卒業生", avatar: "🎓",   text: "美月ちゃん応援してます！！" },
          { user: "高校生", avatar: "🧑‍🎓", text: "本番見に行きたい" },
          { user: "保護者", avatar: "🙂",   text: "頑張ってる姿に感動しました" },
          { user: "高校生", avatar: "🧑‍🎓", text: "絶対成功する" },
          { user: "高校生", avatar: "🧑‍🎓", text: "この投稿拡散した" },
          { user: "高校生", avatar: "🧑‍🎓", text: "泣きそう。頑張ってほしい" },
          { user: "高校生", avatar: "🧑‍🎓", text: "感動した" },
        ],
      },
      B: {
        body: "失敗して、やり直して、笑顔になった瞬間。その一瞬を切り取りました。",
        likes: 112,
        comments: [
          { user: "高校生", avatar: "🧑‍🎓", text: "めっちゃリアル" },
          { user: "高校生", avatar: "🧑‍🎓", text: "こういう裏側好き" },
          { user: "卒業生", avatar: "🎓",   text: "見に行かなきゃ！！" },
          { user: "高校生", avatar: "🧑‍🎓", text: "感情が伝わってきた" },
          { user: "高校生", avatar: "🧑‍🎓", text: "B組のダンス気になる" },
          { user: "高校生", avatar: "🧑‍🎓", text: "拡散します" },
          { user: "高校生", avatar: "🧑‍🎓", text: "絶対当日行く！" },
          { user: "保護者", avatar: "🙂",   text: "素晴らしい！" },
          { user: "高校生", avatar: "🧑‍🎓", text: "この笑顔すき" },
          { user: "高校生", avatar: "🧑‍🎓", text: "来年も文化祭来るわ" },
        ],
      },
      C: {
        body: "本番まであと3日。「絶対仕上げたい」という言葉が頭から離れません。",
        likes: 75,
        comments: [
          { user: "高校生", avatar: "🧑‍🎓", text: "完成版が楽しみ" },
          { user: "高校生", avatar: "🧑‍🎓", text: "これは本番見たい" },
          { user: "高校生", avatar: "🧑‍🎓", text: "文化祭行く理由できた" },
          { user: "卒業生", avatar: "🎓",   text: "絶対見に行く" },
          { user: "高校生", avatar: "🧑‍🎓", text: "期待してる！！" },
          { user: "保護者", avatar: "🙂",   text: "当日楽しみにしています" },
          { user: "高校生", avatar: "🧑‍🎓", text: "頑張れー！！" },
        ],
      },
    }[choice ?? "A"];
    return {
      id: "post-dance",
      imgEmoji: "💃",
      body: d.body,
      likes: d.likes,
      comments: d.comments,
      postedAt: "今日 午後4:47",
      isNew: true,
    };
  },
  notifGain: 12,
};

// ─────────────────────────────────────────────────────────────────────────────
// LINEデータ（進行状況に応じて解放）
// ─────────────────────────────────────────────────────────────────────────────

type LineThread = {
  id: string;
  name: string;
  avatar: string;
  messages: string[];
};

function getLineThreads(decorationDone: boolean, danceDone: boolean): LineThread[] {
  return [
    {
      id: "aoi",
      name: "葵（委員長）",
      avatar: "👩",
      messages: [
        "今年、本当に上位狙えるかも",
        ...(decorationDone ? ["装飾の投稿、良かった！"] : []),
        ...(danceDone ? ["今日の投稿見た", "本当にありがとう", "今年いけるかも"] : []),
      ],
    },
    {
      id: "sho",
      name: "翔（親友）",
      avatar: "😄",
      messages: [
        "最近結構伸びてるよな",
        ...(decorationDone ? ["通知来まくってるじゃん笑"] : []),
        ...(danceDone ? ["めっちゃ反応来てるな", "お前、広報向いてるんじゃね？"] : []),
      ],
    },
    ...(danceDone
      ? [{
          id: "mitsuki",
          name: "美月",
          avatar: "💃",
          messages: ["投稿ありがとう！"],
        }]
      : []),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// エリアイベント画面（ノベルゲーム風 + 選択肢 + プレビュー）
// ─────────────────────────────────────────────────────────────────────────────

function AreaScreen({
  event,
  onPost,
  onBack,
}: {
  event: AreaEvent;
  onPost: (post: Post, notifGain: number) => void;
  onBack: () => void;
}) {
  // セリフを1つずつ表示するフェーズ
  const [lineIndex, setLineIndex] = useState(0);
  const [phase, setPhase] = useState<"reading" | "choice" | "preview">("reading");
  const [pendingChoice, setPendingChoice] = useState<string | null>(null);
  const [confirmedChoice, setConfirmedChoice] = useState<ChoiceId>(null);

  const logRef = useRef<HTMLDivElement>(null);

  // 会話ログ（表示済み）
  const visibleLines = event.lines.slice(0, lineIndex);

  // 最下部スクロール
  useEffect(() => {
    logRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lineIndex, phase]);

  const handleNext = () => {
    if (lineIndex < event.lines.length) {
      setLineIndex(i => i + 1);
    }
    if (lineIndex === event.lines.length - 1) {
      // 全セリフ終わったら選択肢フェーズへ
      setTimeout(() => setPhase("choice"), 200);
    }
  };

  const handleConfirmChoice = () => {
    if (!pendingChoice) return;
    setConfirmedChoice(pendingChoice as ChoiceId);
    setPhase("preview");
  };

  const handlePost = () => {
    const post = event.makePost(confirmedChoice);
    onPost(post, event.notifGain);
  };

  const previewBody = confirmedChoice
    ? event.makePost(confirmedChoice).body
    : null;

  return (
    <div className="flex flex-col min-h-full bg-white">
      {/* ヘッダー */}
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={onBack} className="text-gray-400 text-lg leading-none">‹</button>
        <span className="text-sm font-bold text-gray-800">取材</span>
      </div>

      {/* 会話ログ */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {visibleLines.map((line, i) => (
          <div key={i}>
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

        {/* 選択肢フェーズ */}
        {phase === "choice" && (
          <div className="space-y-3 pt-2">
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
                onClick={handleConfirmChoice}
                className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
              >
                これで伝える
              </button>
            )}
          </div>
        )}

        {/* プレビューフェーズ */}
        {phase === "preview" && previewBody && (
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">投稿プレビュー</div>
            <div className="border-2 border-gray-200 rounded-2xl overflow-hidden">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">🏫</div>
                <div>
                  <div className="text-sm font-bold text-gray-800">1年3組文化祭</div>
                  <div className="text-xs text-gray-400">プレビュー</div>
                </div>
              </div>
              <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-4xl">
                {event === DECORATION_EVENT ? "🎨" : "💃"}
              </div>
              <div className="px-4 py-3 text-sm text-gray-800 leading-relaxed">{previewBody}</div>
            </div>
            <button
              onClick={handlePost}
              className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
            >
              投稿する
            </button>
          </div>
        )}

        <div ref={logRef} />
      </div>

      {/* 続けるボタン（readingフェーズのみ） */}
      {phase === "reading" && (
        <div className="px-5 pb-6 pt-3 border-t border-gray-100">
          <button
            onClick={handleNext}
            className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
          >
            {lineIndex < event.lines.length ? "続ける" : "続ける"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// コメント詳細画面
// ─────────────────────────────────────────────────────────────────────────────

function CommentsScreen({
  post,
  onBack,
}: {
  post: Post;
  onBack: () => void;
}) {
  // コメントを1つずつアニメーション表示
  const [visibleCount, setVisibleCount] = useState(0);
  const visible = post.comments.slice(0, 5);
  const hiddenCount = post.comments.length - visible.length;

  useEffect(() => {
    if (visibleCount < visible.length) {
      const t = setTimeout(() => setVisibleCount(n => n + 1), visibleCount === 0 ? 300 : 250);
      return () => clearTimeout(t);
    }
  }, [visibleCount, visible.length]);

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <button onClick={onBack} className="text-gray-400 text-lg leading-none">‹</button>
        <span className="text-sm font-bold text-gray-800">コメント</span>
      </div>

      {/* 投稿サマリー */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">{post.imgEmoji}</span>
          <span className="text-sm text-gray-500">{post.postedAt}</span>
        </div>
        <div className="text-sm text-gray-700 leading-relaxed">{post.body}</div>
        <div className="flex gap-4 mt-3 text-sm text-gray-500">
          <span>❤️ {post.likes}</span>
          <span>💬 {post.comments.length}</span>
        </div>
      </div>

      {/* コメント一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {visible.slice(0, visibleCount).map((c, i) => (
          <div
            key={i}
            className="flex gap-3 transition-all duration-300"
            style={{ opacity: 1, transform: "translateY(0)" }}
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm flex-shrink-0">
              {c.avatar}
            </div>
            <div>
              <div className="text-xs font-bold text-gray-400 mb-1">{c.user}</div>
              <div className="text-sm text-gray-800 bg-gray-50 rounded-xl px-3 py-2 inline-block">
                {c.text}
              </div>
            </div>
          </div>
        ))}
        {visibleCount >= visible.length && hiddenCount > 0 && (
          <div className="text-center text-xs text-gray-400 py-2">
            他{hiddenCount}件のコメント
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// LINEチャット画面
// ─────────────────────────────────────────────────────────────────────────────

function LineChatScreen({
  thread,
  onBack,
}: {
  thread: LineThread;
  onBack: () => void;
}) {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount < thread.messages.length) {
      const t = setTimeout(() => setVisibleCount(n => n + 1), visibleCount === 0 ? 400 : 500);
      return () => clearTimeout(t);
    }
  }, [visibleCount, thread.messages.length]);

  return (
    <div className="flex flex-col min-h-full" style={{ background: "#e8f5e9" }}>
      <div className="flex items-center gap-3 px-4 py-3 bg-green-500 text-white">
        <button onClick={onBack} className="text-white text-xl leading-none opacity-90">‹</button>
        <span className="text-sm font-bold">{thread.name}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {thread.messages.slice(0, visibleCount).map((msg, i) => (
          <div key={i} className="flex items-end gap-2">
            {i === 0 && (
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-base flex-shrink-0">
                {thread.avatar}
              </div>
            )}
            {i > 0 && <div className="w-8 flex-shrink-0" />}
            <div>
              {i === 0 && (
                <div className="text-xs text-gray-500 mb-1">{thread.name}</div>
              )}
              <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[230px] leading-relaxed">
                {msg}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// メインコンポーネント
// ─────────────────────────────────────────────────────────────────────────────

export default function Day4Page() {
  const [screen, setScreen] = useState<Screen>("school-home");
  const [notifications, setNotifications] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [readPostIds, setReadPostIds] = useState<Set<string>>(new Set());
  const [readThreadIds, setReadThreadIds] = useState<Set<string>>(new Set());

  // 進行フラグ
  const decorationDone = posts.some(p => p.id === "post-decoration");
  const danceDone      = posts.some(p => p.id === "post-dance");
  const bothDone       = decorationDone && danceDone;

  const lineThreads = getLineThreads(decorationDone, danceDone);
  const selectedPost   = posts.find(p => p.id === selectedPostId);
  const selectedThread = lineThreads.find(t => t.id === selectedThreadId);

  // 投稿完了時の処理
  const handlePost = useCallback((post: Post, notifGain: number) => {
    setPosts(prev => [...prev, post]);
    // 通知を段階的に増やす（リアルな雰囲気）
    setTimeout(() => setNotifications(n => n + Math.ceil(notifGain * 0.4)), 600);
    setTimeout(() => setNotifications(n => n + Math.floor(notifGain * 0.6)), 1800);
    setScreen("school-home");
  }, []);

  // スマホを開く（通知リセット）
  const openPhone = useCallback(() => {
    setNotifications(0);
    setScreen("phone-home");
  }, []);

  // 投稿カードを開く
  const openComments = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setReadPostIds(prev => new Set([...prev, postId]));
    setScreen("sns-comments");
  }, []);

  // LINEトークを開く
  const openLineChat = useCallback((threadId: string) => {
    setSelectedThreadId(threadId);
    setReadThreadIds(prev => new Set([...prev, threadId]));
    setScreen("line-chat");
  }, []);

  // 未読投稿数（NEW バッジ用）
  const unreadPostCount = posts.filter(p => !readPostIds.has(p.id)).length;
  // 未読LINEスレッド数
  const unreadLineCount = lineThreads.filter(t => !readThreadIds.has(t.id)).length;

  // 終了判定：両投稿完了 & LINEを1つ以上読んだ
  const canEnd = bothDone && readThreadIds.size >= 1;

  // ─── 今日の目標チェックリスト ───────────────────────────────────────────
  const goals = [
    { label: "装飾班を取材して投稿する", done: decorationDone },
    { label: "ダンス班を取材して投稿する", done: danceDone },
    { label: "投稿の反応を確認する", done: readPostIds.size > 0 },
    { label: "LINEを確認する", done: readThreadIds.size > 0 },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // 画面レンダリング
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <PhoneFrame>

      {/* ── ① 学校ホーム ──────────────────────────────────────────── */}
      {screen === "school-home" && (
        <div className="flex flex-col min-h-full bg-white">

          {/* ヘッダー */}
          <div className="px-5 pt-6 pb-4 border-b border-gray-100">
            <div className="text-xs text-gray-400 tracking-widest uppercase mb-1">Day 4 — 文化祭まであと3日</div>
            <h1 className="text-xl font-black text-gray-900">文化祭準備室</h1>
          </div>

          {/* 今日の目標チェックリスト */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="text-xs font-bold text-gray-400 tracking-widest uppercase mb-3">今日の目標</div>
            <div className="space-y-2.5">
              {goals.map(g => (
                <div key={g.label} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    g.done ? "bg-gray-900 border-gray-900" : "border-gray-300"
                  }`}>
                    {g.done && <span className="text-white text-xs">✓</span>}
                  </div>
                  <span className={`text-sm leading-snug ${g.done ? "text-gray-400 line-through" : "text-gray-700"}`}>
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

              {/* 装飾班 */}
              {!decorationDone ? (
                <button
                  onClick={() => setScreen("area-decoration")}
                  className="w-full flex items-center gap-4 bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-left hover:border-gray-400 active:bg-gray-50 transition-all"
                >
                  <span className="text-2xl">🎨</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">装飾班</div>
                    <div className="text-xs text-gray-400 mt-0.5">取材に行く</div>
                  </div>
                  <span className="text-gray-300 text-lg">›</span>
                </button>
              ) : (
                <div className="w-full flex items-center gap-4 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 opacity-50">
                  <span className="text-2xl">🎨</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500">装飾班</div>
                    <div className="text-xs text-gray-400 mt-0.5">取材済み</div>
                  </div>
                  <span className="text-green-500 text-sm font-bold">✓</span>
                </div>
              )}

              {/* ダンス班 */}
              {!danceDone ? (
                <button
                  onClick={() => setScreen("area-dance")}
                  className={`w-full flex items-center gap-4 bg-white border-2 rounded-2xl px-4 py-4 text-left transition-all ${
                    // 装飾班を先に取材してほしいが、強制はしない
                    "border-gray-200 hover:border-gray-400 active:bg-gray-50"
                  }`}
                >
                  <span className="text-2xl">💃</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-800">ダンス班（美月）</div>
                    <div className="text-xs text-gray-400 mt-0.5">体育館で練習中</div>
                  </div>
                  <span className="text-gray-300 text-lg">›</span>
                </button>
              ) : (
                <div className="w-full flex items-center gap-4 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 opacity-50">
                  <span className="text-2xl">💃</span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-gray-500">ダンス班（美月）</div>
                    <div className="text-xs text-gray-400 mt-0.5">取材済み</div>
                  </div>
                  <span className="text-green-500 text-sm font-bold">✓</span>
                </div>
              )}

              {/* スマホ */}
              <button
                onClick={openPhone}
                className="w-full flex items-center gap-4 bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-left hover:border-gray-400 active:bg-gray-50 transition-all"
              >
                <span className="text-2xl">📱</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800">スマホ</div>
                  <div className="text-xs text-gray-400 mt-0.5">SNSやLINEを確認</div>
                </div>
                {/* 通知バッジ */}
                {notifications > 0 ? (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[24px] text-center">
                    {notifications > 99 ? "99+" : notifications}
                  </span>
                ) : (
                  <span className="text-gray-300 text-lg">›</span>
                )}
              </button>

            </div>
          </div>

          {/* 終了ボタン（条件達成後のみ） */}
          {canEnd && (
            <div className="px-5 pb-6">
              <button
                onClick={() => setScreen("end")}
                className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
              >
                今日を終える
              </button>
            </div>
          )}

        </div>
      )}

      {/* ── ② 取材エリア（装飾班） ──────────────────────────────────── */}
      {screen === "area-decoration" && (
        <AreaScreen
          event={DECORATION_EVENT}
          onPost={handlePost}
          onBack={() => setScreen("school-home")}
        />
      )}

      {/* ── ③ 取材エリア（ダンス班） ─────────────────────────────────── */}
      {screen === "area-dance" && (
        <AreaScreen
          event={DANCE_EVENT}
          onPost={handlePost}
          onBack={() => setScreen("school-home")}
        />
      )}

      {/* ── ④ スマホホーム ──────────────────────────────────────────── */}
      {screen === "phone-home" && (
        <div className="flex flex-col min-h-full bg-white">

          <div className="px-5 pt-6 pb-4 border-b border-gray-100">
            <div className="text-xs text-gray-400 tracking-widest uppercase mb-1">Phone</div>
            <h1 className="text-xl font-black text-gray-900">スマホ</h1>
          </div>

          <div className="px-5 py-5 flex-1 space-y-2.5">

            {/* SNS */}
            <button
              onClick={() => setScreen("sns-feed")}
              className="w-full flex items-center gap-4 bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-left hover:border-gray-400 active:bg-gray-50 transition-all"
            >
              <span className="text-2xl">📷</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800">SNS</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {posts.length > 0 ? `投稿 ${posts.length}件` : "投稿はまだありません"}
                </div>
              </div>
              {/* 未読投稿バッジ */}
              {unreadPostCount > 0 ? (
                <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {unreadPostCount}
                </span>
              ) : (
                <span className="text-gray-300 text-lg">›</span>
              )}
            </button>

            {/* LINE */}
            <button
              onClick={() => setScreen("line-list")}
              className="w-full flex items-center gap-4 bg-white border-2 border-gray-200 rounded-2xl px-4 py-4 text-left hover:border-gray-400 active:bg-gray-50 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">L</div>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-800">LINE</div>
                <div className="text-xs text-gray-400 mt-0.5">
                  {lineThreads.length > 0 ? `${lineThreads.length}件のトーク` : "メッセージなし"}
                </div>
              </div>
              {/* 未読LINEバッジ */}
              {unreadLineCount > 0 ? (
                <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                  {unreadLineCount}
                </span>
              ) : (
                <span className="text-gray-300 text-lg">›</span>
              )}
            </button>

            {/* 学校へ戻る */}
            <button
              onClick={() => setScreen("school-home")}
              className="w-full flex items-center gap-4 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4 text-left hover:bg-gray-100 active:bg-gray-200 transition-all mt-2"
            >
              <span className="text-2xl">🏫</span>
              <div className="flex-1">
                <div className="text-sm font-semibold text-gray-600">学校へ戻る</div>
              </div>
              <span className="text-gray-300 text-lg">›</span>
            </button>

          </div>
        </div>
      )}

      {/* ── ⑤ SNS投稿一覧 ────────────────────────────────────────────── */}
      {screen === "sns-feed" && (
        <div className="flex flex-col min-h-full bg-gray-50">
          <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100 sticky top-0 z-10">
            <button onClick={() => setScreen("phone-home")} className="text-gray-400 text-lg leading-none">‹</button>
            <span className="text-sm font-bold text-gray-900">SNS</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {posts.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-16">まだ投稿がありません</p>
            ) : (
              [...posts].reverse().map(post => (
                <button
                  key={post.id}
                  onClick={() => openComments(post.id)}
                  className="w-full bg-white rounded-2xl shadow-sm overflow-hidden text-left active:scale-[0.98] transition-transform"
                >
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">🏫</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800">1年3組文化祭</span>
                        {!readPostIds.has(post.id) && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{post.postedAt}</div>
                    </div>
                  </div>
                  <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-4xl">
                    {post.imgEmoji}
                  </div>
                  <div className="px-4 py-3 text-sm text-gray-700 leading-relaxed">{post.body}</div>
                  <div className="flex gap-4 px-4 pb-3 text-sm text-gray-500">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments.length}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── ⑥ コメント詳細 ────────────────────────────────────────────── */}
      {screen === "sns-comments" && selectedPost && (
        <CommentsScreen
          post={selectedPost}
          onBack={() => setScreen("sns-feed")}
        />
      )}

      {/* ── ⑦ LINE一覧 ───────────────────────────────────────────────── */}
      {screen === "line-list" && (
        <div className="flex flex-col min-h-full bg-gray-50">
          <div className="flex items-center gap-3 px-5 py-3 bg-white border-b border-gray-100">
            <button onClick={() => setScreen("phone-home")} className="text-gray-400 text-lg leading-none">‹</button>
            <span className="text-sm font-bold text-gray-900">LINE</span>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {lineThreads.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-16">まだメッセージはありません</p>
            ) : (
              lineThreads.map(t => (
                <button
                  key={t.id}
                  onClick={() => openLineChat(t.id)}
                  className="w-full flex items-center gap-3 px-3 py-3 bg-white rounded-xl text-left hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                    {t.avatar}
                    {!readThreadIds.has(t.id) && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-bold text-gray-800">{t.name}</div>
                    <div className="text-xs text-gray-400 truncate">
                      {t.messages[t.messages.length - 1]}
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── ⑧ LINEチャット ────────────────────────────────────────────── */}
      {screen === "line-chat" && selectedThread && (
        <LineChatScreen
          thread={selectedThread}
          onBack={() => setScreen("line-list")}
        />
      )}

      {/* ── ⑨ 終了画面 ───────────────────────────────────────────────── */}
      {screen === "end" && (
        <div className="flex flex-col min-h-full px-6 py-12 bg-white">
          <div className="text-xs text-gray-400 tracking-widest uppercase mb-6">Day 4 — End</div>
          <h2 className="text-3xl font-black text-gray-900 mb-1">Day 4 終了</h2>
          <p className="text-sm text-gray-500 mb-8">文化祭まであと3日</p>

          <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
              <div className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Today's Result</div>
            </div>
            <div className="px-5 py-4 space-y-3">
              {([
                ["投稿数", `${posts.length}件`],
                ["いいね合計", `${posts.reduce((s, p) => s + p.likes, 0)}`],
                ["コメント合計", `${posts.reduce((s, p) => s + p.comments.length, 0)}件`],
              ] as [string, string][]).map(([label, val]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-bold text-gray-900">{val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl px-5 py-5 mb-8">
            <p className="text-sm text-gray-700 leading-relaxed">
              今日2回投稿した。数字が伸びた。人の反応が来た。<br /><br />
              それが嬉しかった。でも——本当に伝えたかったものは、ちゃんと届いていただろうか。
            </p>
          </div>

          <div className="mt-auto">
            <button
              onClick={() => window.location.reload()}
              className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
            >
              もう一度プレイする
            </button>
          </div>
        </div>
      )}

    </PhoneFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PhoneFrame — スマホ縦持ちレイアウトのラッパー
// ─────────────────────────────────────────────────────────────────────────────

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.3s ease forwards; }
      `}</style>
      <div className="min-h-screen bg-gray-200 flex items-start justify-center">
        <div className="w-full md:max-w-[390px] bg-white flex flex-col min-h-screen md:min-h-0 md:my-8 md:rounded-[40px] md:overflow-hidden md:shadow-2xl">
          {children}
        </div>
      </div>
    </>
  );
}
