"use client";

import { useCallback, useState } from "react";
import SchoolHome     from "@/components/game/SchoolHome";
import PhoneHome      from "@/components/game/PhoneHome";
import SNSScreen      from "@/components/game/SNSScreen";
import CommentsScreen from "@/components/game/CommentsScreen";
import { LineListScreen, LineChatScreen } from "@/components/game/LineScreen";
import {
  Post, LineThread, DailyGoal, Destination, Comment,
} from "@/components/game/types";
import { GameState } from "@/data/day1";

// ─────────────────────────────────────────────────────────────────────────────
// Day5Game
// Day5「期待が義務に変わる日」のゲームフロー全体を担うコンポーネント。
// ─────────────────────────────────────────────────────────────────────────────

type Day5Screen =
  | "morning"        // 朝の期待セリフ
  | "school-home"    // 学校ホーム
  | "area-theater"   // 演劇班取材
  | "pre-post1"      // 投稿前コメント確認①（演劇班）
  | "post1-select"   // 投稿テーマ選択①
  | "post1-waiting"  // 投稿中...
  | "sho-dialogue"   // 翔の違和感
  | "area-festival"  // 文化祭全体取材
  | "pre-post2"      // 投稿前コメント確認②（美月）
  | "post2-select"   // 投稿テーマ選択②
  | "post2-waiting"  // 投稿中...
  | "phone-home"     // スマホホーム
  | "phone-sns"      // SNS一覧
  | "phone-comments" // コメント詳細
  | "phone-line"     // LINE一覧
  | "phone-chat"     // 個別トーク
  | "end";           // 終了

export type Day5Result = {
  followerGain: number;
  trustGain:    number;
  newRank:      number;
};

type Props = {
  state:      GameState;
  onComplete: (result: Day5Result) => void;
  onTitle:    () => void;
};

// ─────────────────────────────────────────────────────────────────────────────
// 投稿前コメント（プレイヤーが投稿前に見る）
// ─────────────────────────────────────────────────────────────────────────────

const PRE_POST1_COMMENTS: Comment[] = [
  { user: "葵（委員長）", avatar: "👩", text: "今日も投稿よろしく。A組に負けてられない" },
  { user: "クラスメイト",  avatar: "🧑‍🎓", text: "今日も期待してるよ！" },
  { user: "ムードメーカー", avatar: "😄", text: "はやく投稿してくれ笑" },
];

const PRE_POST2_COMMENTS: Comment[] = [
  { user: "葵（委員長）", avatar: "👩", text: "美月の写真、絶対バズるから丁寧に頼む" },
  { user: "クラスメイト",  avatar: "🧑‍🎓", text: "今日2投稿目も期待してる！" },
  { user: "フォロワー",   avatar: "🧑‍🎓", text: "次の投稿も楽しみにしてます" },
  { user: "翔",          avatar: "😄", text: "ちゃんとやれよな（プレッシャーかけてくるな笑）" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 演劇班取材データ
// ─────────────────────────────────────────────────────────────────────────────

type PostChoice = { id: string; label: string; desc: string };

const THEATER_CHOICES: PostChoice[] = [
  { id: "A", label: "みんなの努力を届ける",    desc: "セリフ合わせを繰り返す班の真剣さを伝える" },
  { id: "B", label: "一人の情熱にフォーカス", desc: "主役の子の眼差しを切り取る" },
  { id: "C", label: "完成への期待を高める",    desc: "「まだ途中」だからこそのワクワク感" },
];

function makeTheaterPost(choice: string): Post {
  const d: Record<string, { body: string; emoji: string; likes: number; comments: Comment[] }> = {
    A: {
      emoji: "🎭",
      body: "何度も何度もセリフを合わせる。演劇班の、全員での準備が続いています。",
      likes: 62,
      comments: [
        { user: "高校生",  avatar: "🧑‍🎓", text: "全員で作り上げてるの伝わる" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "絶対見に行く" },
        { user: "卒業生",  avatar: "🎓",   text: "懐かしい感じ。応援してます" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "B組ちゃんとしてる" },
        { user: "保護者",  avatar: "🙂",   text: "頑張ってますね" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "本番楽しみ！" },
      ],
    },
    B: {
      emoji: "🎭",
      body: "主役の目線。文化祭まであと2日、彼女の眼差しに全てが込められている気がした。",
      likes: 81,
      comments: [
        { user: "高校生",  avatar: "🧑‍🎓", text: "この子すごい" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "主役感ある。応援したい" },
        { user: "卒業生",  avatar: "🎓",   text: "こういう写真好き" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "B組の演劇絶対行く" },
        { user: "保護者",  avatar: "🙂",   text: "感動しました" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "これは観客泣かせにくる" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "期待しかない" },
      ],
    },
    C: {
      emoji: "🎭",
      body: "まだ完成していない。でも、それが今の全力。演劇班、ラストスパート中。",
      likes: 54,
      comments: [
        { user: "高校生",  avatar: "🧑‍🎓", text: "完成版見たい" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "本番どうなるか楽しみ" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "行くわ" },
        { user: "保護者",  avatar: "🙂",   text: "応援してます！" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "全力感伝わる" },
      ],
    },
  };
  const c = d[choice] ?? d["A"];
  return { id: "post-theater", imgEmoji: c.emoji, body: c.body, likes: c.likes, comments: c.comments, postedAt: "今日 午後1:22" };
}

// ─────────────────────────────────────────────────────────────────────────────
// 美月取材データ（Day5 2投稿目）
// ─────────────────────────────────────────────────────────────────────────────

const FESTIVAL_CHOICES: PostChoice[] = [
  { id: "A", label: "美月を全面に出す",         desc: "美月の頑張りと笑顔を中心に伝える" },
  { id: "B", label: "全体の盛り上がりを伝える", desc: "クラス全員で作る文化祭の雰囲気" },
  { id: "C", label: "美月の言葉をそのまま届ける", desc: "「本番で全部出す」という言葉で期待を高める" },
];

function makeFestivalPost(choice: string): Post {
  const d: Record<string, { body: string; emoji: string; likes: number; comments: Comment[] }> = {
    A: {
      emoji: "💃",
      body: "美月、文化祭まであと2日。「全部ここに置いていく」という顔をしていた。",
      likes: 134,
      comments: [
        { user: "高校生",  avatar: "🧑‍🎓", text: "美月ちゃん応援してる！" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "絶対見に行く" },
        { user: "卒業生",  avatar: "🎓",   text: "泣きそう。頑張ってほしい" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "この写真好きすぎる" },
        { user: "保護者",  avatar: "🙂",   text: "感動しました" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "B組のダンス見ないと後悔する" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "来週全部ここだね" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "楽しみすぎる" },
        // 不穏コメント（最後に1つ）
        { user: "匿名",    avatar: "👤",   text: "本人はこれでいいの？" },
      ],
    },
    B: {
      emoji: "🎉",
      body: "文化祭まであと2日。クラス全員の気合いが、じわじわ高まってきた。",
      likes: 89,
      comments: [
        { user: "高校生",  avatar: "🧑‍🎓", text: "雰囲気いいな" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "B組好き" },
        { user: "卒業生",  avatar: "🎓",   text: "楽しそう！" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "このクラス好きだな" },
        { user: "保護者",  avatar: "🙂",   text: "楽しんでください" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "当日行く！" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "青春だ" },
        // 不穏コメント
        { user: "匿名",    avatar: "👤",   text: "ちょっと切り取りすぎじゃない？" },
      ],
    },
    C: {
      emoji: "💃",
      body: "「本番で全部出す」——美月のその言葉が、頭から離れない。",
      likes: 108,
      comments: [
        { user: "高校生",  avatar: "🧑‍🎓", text: "この一言で行きたくなった" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "絶対見に行く" },
        { user: "卒業生",  avatar: "🎓",   text: "応援してます！！" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "美月ちゃん推せる" },
        { user: "保護者",  avatar: "🙂",   text: "楽しみです" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "当日こそ全部見せてくれ" },
        { user: "高校生",  avatar: "🧑‍🎓", text: "B組いちばん楽しみになってきた" },
        // 不穏コメント
        { user: "匿名",    avatar: "👤",   text: "本人はこれでいいの？" },
      ],
    },
  };
  const c = d[choice] ?? d["A"];
  return { id: "post-festival", imgEmoji: c.emoji, body: c.body, likes: c.likes, comments: c.comments, postedAt: "今日 午後4:38" };
}

// ─────────────────────────────────────────────────────────────────────────────
// LINEスレッド
// ─────────────────────────────────────────────────────────────────────────────

function buildLineThreads(post1Done: boolean, post2Done: boolean): LineThread[] {
  return [
    {
      id: "aoi", name: "葵（委員長）", avatar: "👩",
      messages: [
        "今日もよろしくね",
        ...(post1Done  ? ["演劇の投稿良かった！"] : []),
        ...(post2Done  ? ["今日も最高だった", "ランキング上がりそう"] : []),
      ],
    },
    {
      id: "sho", name: "翔（親友）", avatar: "😄",
      messages: [
        "最近毎日投稿してるな",
        ...(post1Done  ? ["またバズってるじゃん"] : []),
        ...(post2Done  ? ["お前すごいな", "でも…大丈夫？"] : []),
      ],
    },
    ...(post2Done ? [{
      id: "mitsuki", name: "美月", avatar: "💃",
      messages: [
        "投稿みた",
        "ありがとう",
        "…でも、あの写真選んだんだね",
      ],
    }] : []),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// 翔の違和感セリフ
// ─────────────────────────────────────────────────────────────────────────────

const SHO_LINES = [
  "演劇班のやつ、バズってたな。",
  "……でも、なんか気になった。",
  "取材された子、本当に全部出してほしかったのかな。",
  "お前が選んだから、そうなったわけだよな。",
  "まあ、いいんだけど。",
];

// ─────────────────────────────────────────────────────────────────────────────
// Morning / Area ノベル描画用ヘルパー
// ─────────────────────────────────────────────────────────────────────────────

type NovLine = { speaker: string | null; text: string };

function NovelScreen({
  lines,
  lineIndex,
  onNext,
  title,
}: {
  lines: NovLine[];
  lineIndex: number;
  onNext: () => void;
  title: string;
}) {
  const visible = lines.slice(0, lineIndex);
  const hasMore = lineIndex < lines.length;
  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <span className="text-sm font-bold text-gray-800">{title}</span>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        {visible.map((line, i) => (
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
      </div>
      <div className="px-5 pb-7 pt-3 border-t border-gray-100">
        {hasMore && (
          <button onClick={onNext} className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm">
            続ける
          </button>
        )}
        {!hasMore && (
          <button onClick={onNext} className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm">
            次へ
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 投稿前コメント確認画面
// ─────────────────────────────────────────────────────────────────────────────

function PrePostScreen({
  title,
  subtitle,
  comments,
  onNext,
}: {
  title: string;
  subtitle: string;
  comments: Comment[];
  onNext: () => void;
}) {
  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="text-sm font-bold text-gray-800">{title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
        <div className="text-xs font-semibold text-gray-400 tracking-widest uppercase mb-2">投稿前のコメント</div>
        {comments.map((c, i) => (
          <div key={i} className="flex gap-3 game-fade-up">
            <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-lg shrink-0">
              {c.avatar}
            </div>
            <div>
              <div className="text-xs font-bold text-gray-500 mb-0.5">{c.user}</div>
              <div className="text-sm text-gray-800 leading-relaxed">{c.text}</div>
            </div>
          </div>
        ))}
        <div className="pt-4 text-sm text-gray-500 italic">
          みんなが待っている。何を優先する？
        </div>
      </div>
      <div className="px-5 pb-7 pt-3 border-t border-gray-100">
        <button onClick={onNext} className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm">
          投稿テーマを選ぶ
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// 投稿テーマ選択画面
// ─────────────────────────────────────────────────────────────────────────────

function PostSelectScreen({
  title,
  subtitle,
  choices,
  previewEmoji,
  makePreviewBody,
  onPost,
}: {
  title: string;
  subtitle: string;
  choices: PostChoice[];
  previewEmoji: string;
  makePreviewBody: (id: string) => string;
  onPost: (choice: string) => void;
}) {
  const [selected,  setSelected]  = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string | null>(null);

  if (confirmed) {
    return (
      <div className="flex flex-col min-h-full bg-white">
        <div className="px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
          <div className="text-sm font-bold text-gray-800">{title}</div>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
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
            <div className="px-4 py-3 text-sm text-gray-800 leading-relaxed">
              {makePreviewBody(confirmed)}
            </div>
          </div>
        </div>
        <div className="px-5 pb-7 pt-3 border-t border-gray-100">
          <button onClick={() => onPost(confirmed)} className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm">
            投稿する
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-full bg-white">
      <div className="px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
        <div className="text-sm font-bold text-gray-800">{title}</div>
        <div className="text-xs text-gray-400 mt-0.5">{subtitle}</div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-3">
        <div className="text-sm font-bold text-gray-700 mb-2">何を優先する？</div>
        {choices.map(c => (
          <button
            key={c.id}
            onClick={() => setSelected(c.id)}
            className={`w-full text-left border-2 rounded-xl px-4 py-3 transition-all ${
              selected === c.id
                ? "border-gray-900 bg-gray-900 text-white"
                : "border-gray-200 bg-white hover:border-gray-400"
            }`}
          >
            <div className="text-sm font-bold">{c.label}</div>
            <div className={`text-xs mt-0.5 ${selected === c.id ? "text-gray-300" : "text-gray-500"}`}>
              {c.desc}
            </div>
          </button>
        ))}
        {selected && (
          <button
            onClick={() => setConfirmed(selected)}
            className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm mt-1"
          >
            これで伝える
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Day5Game 本体
// ─────────────────────────────────────────────────────────────────────────────

export default function Day5Game({ state, onComplete, onTitle }: Props) {
  const [subScreen,        setSubScreen]      = useState<Day5Screen>("morning");
  const [morningIdx,       setMorningIdx]     = useState(1);
  const [theaterIdx,       setTheaterIdx]     = useState(1);
  const [festivalIdx,      setFestivalIdx]    = useState(1);
  const [shoIdx,           setShoIdx]         = useState(1);
  const [notifications,    setNotifications]  = useState(0);
  const [posts,            setPosts]          = useState<Post[]>([]);
  const [readPostIds,      setReadPostIds]    = useState<Set<string>>(new Set());
  const [readThreadIds,    setReadThreadIds]  = useState<Set<string>>(new Set());
  const [selectedPostId,   setSelectedPost]   = useState<string | null>(null);
  const [selectedThreadId, setSelectedThread] = useState<string | null>(null);

  const post1Done = posts.some(p => p.id === "post-theater");
  const post2Done = posts.some(p => p.id === "post-festival");
  const bothDone  = post1Done && post2Done;
  const canEnd    = bothDone && readThreadIds.size >= 1;

  const lineThreads    = buildLineThreads(post1Done, post2Done);
  const selectedPost   = posts.find(p => p.id === selectedPostId);
  const selectedThread = lineThreads.find(t => t.id === selectedThreadId);
  const unreadPostCount   = posts.filter(p => !readPostIds.has(p.id)).length;
  const unreadThreadCount = lineThreads.filter(t => !readThreadIds.has(t.id)).length;

  const currentFollowers = state.festivalAccount?.followers ?? 100;

  const go = (s: Day5Screen) => {
    setSubScreen(s);
    window.scrollTo(0, 0);
  };

  const handlePost1 = useCallback((choice: string) => {
    const post = makeTheaterPost(choice);
    setPosts(prev => [...prev, post]);
    const gain = 8;
    setTimeout(() => setNotifications(n => n + Math.ceil(gain * 0.4)), 700);
    setTimeout(() => setNotifications(n => n + Math.floor(gain * 0.6)), 1900);
    // 投稿完了後 → 翔の違和感へ
    go("post1-waiting");
  }, []);

  const handlePost2 = useCallback((choice: string) => {
    const post = makeFestivalPost(choice);
    setPosts(prev => [...prev, post]);
    const gain = 15;
    setTimeout(() => setNotifications(n => n + Math.ceil(gain * 0.4)), 700);
    setTimeout(() => setNotifications(n => n + Math.floor(gain * 0.6)), 1900);
    go("post2-waiting");
  }, []);

  const handleOpenPhone = useCallback(() => {
    setNotifications(0);
    go("phone-home");
  }, []);

  const handleOpenComments = useCallback((postId: string) => {
    setSelectedPost(postId);
    setReadPostIds(prev => new Set([...prev, postId]));
    go("phone-comments");
  }, []);

  const handleOpenChat = useCallback((threadId: string) => {
    setSelectedThread(threadId);
    setReadThreadIds(prev => new Set([...prev, threadId]));
    go("phone-chat");
  }, []);

  const handleEnd = useCallback(() => {
    const followerGain = posts.reduce((s, p) => s + p.likes, 0);
    onComplete({ followerGain, trustGain: 6, newRank: Math.max(1, (state.rank ?? 4) - 1) });
  }, [posts, onComplete, state.rank]);

  // ── 学校ホームのデータ ─────────────────────────────────────────────────────

  const goals: DailyGoal[] = [
    { label: "演劇班を取材して投稿する",        done: post1Done },
    { label: "美月（文化祭全体）を取材して投稿", done: post2Done },
    { label: "投稿の反応を確認する",            done: readPostIds.size > 0 },
    { label: "LINEを確認する",                done: readThreadIds.size > 0 },
  ];

  const destinations: Destination[] = [
    { id: "theater",  emoji: "🎭", label: "演劇班",     sublabel: "教室で稽古中",
      disabled: false, done: post1Done, isPhone: false },
    { id: "festival", emoji: "💃", label: "美月（ダンス）", sublabel: "体育館で最終調整",
      disabled: !post1Done, done: post2Done, isPhone: false },
    { id: "phone",    emoji: "📱", label: "スマホ",      sublabel: "SNSやLINEを確認",
      disabled: false, done: false, isPhone: true },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // 朝のセリフ
  // ─────────────────────────────────────────────────────────────────────────
  const MORNING_LINES: NovLine[] = [
    { speaker: null,   text: "文化祭まであと2日。朝からクラスメイトに声をかけられた。" },
    { speaker: "葵",   text: "今日も投稿よろしくね。A組に追いついてきたかも。" },
    { speaker: "クラスメイト", text: "昨日の投稿めっちゃよかった！今日も期待してる！" },
    { speaker: "ムードメーカー", text: "お前がいてくれてよかったわ笑" },
    { speaker: null,   text: "嬉しい。でも——なんだろう、少し重い気もした。" },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // 演劇班取材セリフ
  // ─────────────────────────────────────────────────────────────────────────
  const THEATER_LINES: NovLine[] = [
    { speaker: null,        text: "教室。演劇班が本番前最後の通し稽古をしていた。" },
    { speaker: "演劇班（主役）", text: "あの……投稿、してもらえますか。" },
    { speaker: "あなた",    text: "もちろん。どんなふうに映したい？" },
    { speaker: "演劇班（主役）", text: "…うーん、正直よくわからなくて。任せます。" },
    { speaker: null,        text: "撮影を終えた。班全員の真剣な目線が印象的だった。" },
    { speaker: null,        text: "さて——何を優先する？" },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // 文化祭全体（美月）取材セリフ
  // ─────────────────────────────────────────────────────────────────────────
  const FESTIVAL_LINES: NovLine[] = [
    { speaker: null,   text: "体育館。美月が最後の調整をしていた。" },
    { speaker: "美月", text: "来てくれたんだ。今日は本当に最後の調整。" },
    { speaker: "美月", text: "本番で全部出す。それだけ考えてる。" },
    { speaker: "あなた", text: "投稿、していい？" },
    { speaker: "美月", text: "…うん。任せる。" },
    { speaker: null,   text: "撮影した。昨日と同じ言葉。でも、今日は少し違う顔をしていた気がした。" },
    { speaker: null,   text: "何を優先する？" },
  ];

  // ─────────────────────────────────────────────────────────────────────────
  // 終了画面
  // ─────────────────────────────────────────────────────────────────────────
  if (subScreen === "end") {
    const totalLikes    = posts.reduce((s, p) => s + p.likes, 0);
    const totalComments = posts.reduce((s, p) => s + p.comments.length, 0);
    return (
      <div className="flex flex-col min-h-[calc(100svh-28px)] px-6 py-12 bg-white">
        <div className="text-xs text-gray-400 tracking-widest uppercase mb-6">Day 5 — End</div>
        <h2 className="text-3xl font-black text-gray-900 mb-1">Day 5 終了</h2>
        <p className="text-sm text-gray-500 mb-8">文化祭まであと1日</p>
        <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6">
          <div className="bg-gray-50 px-5 py-3 border-b border-gray-100">
            <div className="text-xs font-semibold text-gray-400 tracking-wider uppercase">Today's Result</div>
          </div>
          <div className="px-5 py-4 space-y-3">
            {([
              ["フォロワー",   `${currentFollowers}人 → ${currentFollowers + totalLikes}人`],
              ["今日の投稿",   `${posts.length}件`],
              ["いいね合計",   String(totalLikes)],
              ["コメント合計", `${totalComments}件`],
            ] as [string, string][]).map(([label, val]) => (
              <div key={label} className="flex justify-between text-sm">
                <span className="text-gray-500">{label}</span>
                <span className="font-bold text-gray-900">{val}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-50 rounded-xl px-5 py-5 mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">
            今日も数字は伸びた。みんなが喜んでくれた。<br /><br />
            でも——誰かのコメントが、頭から離れない。<br />
            「本人はこれでいいの？」
          </p>
        </div>
        <div className="w-full bg-white border border-gray-200 rounded-xl p-5 text-center mb-8">
          <div className="text-xs text-gray-500 mb-1">文化祭まであと</div>
          <div className="text-4xl font-black text-gray-900">1日</div>
        </div>
        <div className="mt-auto space-y-3">
          <button onClick={handleEnd} className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm">
            Day6へ進む
          </button>
          <button onClick={onTitle} className="w-full bg-white border border-gray-200 text-gray-600 rounded-xl py-4 font-semibold text-sm">
            タイトルへ戻る
          </button>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // サブスクリーン描画
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      {/* 朝のセリフ */}
      {subScreen === "morning" && (
        <NovelScreen
          title="Day 5 — 朝"
          lines={MORNING_LINES}
          lineIndex={morningIdx}
          onNext={() => {
            if (morningIdx < MORNING_LINES.length) {
              setMorningIdx(i => i + 1);
            } else {
              go("school-home");
            }
          }}
        />
      )}

      {/* 学校ホーム */}
      {subScreen === "school-home" && (
        <SchoolHome
          dayLabel="Day 5 — 文化祭まであと2日"
          roomLabel="文化祭準備室"
          goals={goals}
          destinations={destinations}
          notifications={notifications}
          onDestination={(id) => {
            if (id === "phone") { handleOpenPhone(); return; }
            if (id === "theater") { go("area-theater"); return; }
            if (id === "festival") { go("area-festival"); return; }
          }}
          canEnd={canEnd}
          onEnd={() => go("end")}
        />
      )}

      {/* 演劇班取材 */}
      {subScreen === "area-theater" && (
        <NovelScreen
          title="🎭 演劇班"
          lines={THEATER_LINES}
          lineIndex={theaterIdx}
          onNext={() => {
            if (theaterIdx < THEATER_LINES.length) {
              setTheaterIdx(i => i + 1);
            } else {
              go("pre-post1");
            }
          }}
        />
      )}

      {/* 投稿前コメント確認① */}
      {subScreen === "pre-post1" && (
        <PrePostScreen
          title="投稿前の確認"
          subtitle="演劇班について投稿する前に"
          comments={PRE_POST1_COMMENTS}
          onNext={() => go("post1-select")}
        />
      )}

      {/* 投稿テーマ選択① */}
      {subScreen === "post1-select" && (
        <PostSelectScreen
          title="演劇班について投稿する"
          subtitle="何を優先する？"
          choices={THEATER_CHOICES}
          previewEmoji="🎭"
          makePreviewBody={(id) => makeTheaterPost(id).body}
          onPost={handlePost1}
        />
      )}

      {/* 投稿後 → 翔の違和感へ */}
      {subScreen === "post1-waiting" && (
        <div className="flex flex-col min-h-full bg-white items-center justify-center px-6">
          <div className="text-4xl mb-4">🎭</div>
          <div className="text-sm font-bold text-gray-700 mb-2">投稿しました</div>
          <div className="text-xs text-gray-400 mb-8">反応が来ています...</div>
          <button
            onClick={() => { setShoIdx(1); go("sho-dialogue"); }}
            className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
          >
            続ける
          </button>
        </div>
      )}

      {/* 翔の違和感 */}
      {subScreen === "sho-dialogue" && (
        <NovelScreen
          title="翔（親友）"
          lines={SHO_LINES.map(t => ({ speaker: "翔", text: t }))}
          lineIndex={shoIdx}
          onNext={() => {
            if (shoIdx < SHO_LINES.length) {
              setShoIdx(i => i + 1);
            } else {
              go("school-home");
            }
          }}
        />
      )}

      {/* 文化祭全体（美月）取材 */}
      {subScreen === "area-festival" && (
        <NovelScreen
          title="💃 美月（ダンス）"
          lines={FESTIVAL_LINES}
          lineIndex={festivalIdx}
          onNext={() => {
            if (festivalIdx < FESTIVAL_LINES.length) {
              setFestivalIdx(i => i + 1);
            } else {
              go("pre-post2");
            }
          }}
        />
      )}

      {/* 投稿前コメント確認② */}
      {subScreen === "pre-post2" && (
        <PrePostScreen
          title="投稿前の確認"
          subtitle="美月について投稿する前に"
          comments={PRE_POST2_COMMENTS}
          onNext={() => go("post2-select")}
        />
      )}

      {/* 投稿テーマ選択② */}
      {subScreen === "post2-select" && (
        <PostSelectScreen
          title="美月について投稿する"
          subtitle="何を優先する？"
          choices={FESTIVAL_CHOICES}
          previewEmoji="💃"
          makePreviewBody={(id) => makeFestivalPost(id).body}
          onPost={handlePost2}
        />
      )}

      {/* 投稿後 → 学校ホームへ */}
      {subScreen === "post2-waiting" && (
        <div className="flex flex-col min-h-full bg-white items-center justify-center px-6">
          <div className="text-4xl mb-4">💃</div>
          <div className="text-sm font-bold text-gray-700 mb-2">投稿しました</div>
          <div className="text-xs text-gray-400 mb-8">反応が来ています...</div>
          <button
            onClick={() => go("school-home")}
            className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
          >
            続ける
          </button>
        </div>
      )}

      {/* スマホホーム */}
      {subScreen === "phone-home" && (
        <PhoneHome
          unreadSns={unreadPostCount}
          unreadLine={unreadThreadCount}
          snsPostCount={posts.length}
          lineCount={lineThreads.length}
          onSns={() => go("phone-sns")}
          onLine={() => go("phone-line")}
          onSchool={() => go("school-home")}
        />
      )}

      {/* SNS一覧 */}
      {subScreen === "phone-sns" && (
        <SNSScreen
          posts={posts}
          readPostIds={readPostIds}
          onPost={handleOpenComments}
          onBack={() => go("phone-home")}
        />
      )}

      {/* コメント詳細 */}
      {subScreen === "phone-comments" && selectedPost && (
        <CommentsScreen
          post={selectedPost}
          onBack={() => go("phone-sns")}
        />
      )}

      {/* LINE一覧 */}
      {subScreen === "phone-line" && (
        <LineListScreen
          threads={lineThreads}
          readThreadIds={readThreadIds}
          onThread={handleOpenChat}
          onBack={() => go("phone-home")}
        />
      )}

      {/* 個別トーク */}
      {subScreen === "phone-chat" && selectedThread && (
        <LineChatScreen
          thread={selectedThread}
          onBack={() => go("phone-line")}
        />
      )}
    </>
  );
}
