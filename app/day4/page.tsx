"use client";

import { useCallback, useState } from "react";

// ── 共有コンポーネント（Day1〜Day7 で使い回す土台） ─────────────────────────
import PhoneFrame      from "@/components/game/PhoneFrame";
import SchoolHome      from "@/components/game/SchoolHome";
import PhoneHome       from "@/components/game/PhoneHome";
import SNSScreen       from "@/components/game/SNSScreen";
import CommentsScreen  from "@/components/game/CommentsScreen";
import AreaScreen      from "@/components/game/AreaScreen";
import { LineListScreen, LineChatScreen } from "@/components/game/LineScreen";

// ── 型 ──────────────────────────────────────────────────────────────────────
import {
  GameScreen, Post, LineThread, AreaEvent, DailyGoal, Destination,
} from "@/components/game/types";

// ─────────────────────────────────────────────────────────────────────────────
// Day4 固有データ
// ─────────────────────────────────────────────────────────────────────────────

const DECORATION_EVENT: AreaEvent = {
  areaId:    "decoration",
  areaLabel: "装飾班",
  areaEmoji: "🎨",
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
    }[choice] ?? { body: "", likes: 0, comments: [] };
    return { id: "post-decoration", imgEmoji: "🎨", body: d.body, likes: d.likes, comments: d.comments, postedAt: "今日 午後2:14" };
  },
  notifGain: 5,
};

const DANCE_EVENT: AreaEvent = {
  areaId:    "dance",
  areaLabel: "ダンス班（美月）",
  areaEmoji: "💃",
  lines: [
    { speaker: null,   text: "放課後。体育館の隅で、美月がひとりで踊っていた。" },
    { speaker: null,   text: "失敗。やり直し。また失敗。そして——成功。笑顔。" },
    { speaker: "美月", text: "まだ完成してないんだけどね。" },
    { speaker: "美月", text: "本番までには絶対仕上げたい。それだけ。" },
    { speaker: "美月", text: "投稿？任せるよ。あなたのこと、信頼してるから。" },
    { speaker: null,   text: "撮影を終えた。今日2回目の投稿。何を伝えよう。" },
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
    }[choice] ?? { body: "", likes: 0, comments: [] };
    return { id: "post-dance", imgEmoji: "💃", body: d.body, likes: d.likes, comments: d.comments, postedAt: "今日 午後4:47" };
  },
  notifGain: 12,
};

// ─────────────────────────────────────────────────────────────────────────────
// LINE スレッド生成（進行状況に応じて解放）
// ─────────────────────────────────────────────────────────────────────────────

function buildLineThreads(decorationDone: boolean, danceDone: boolean): LineThread[] {
  return [
    {
      id: "aoi", name: "葵（委員長）", avatar: "👩",
      messages: [
        "今年、本当に上位狙えるかも",
        ...(decorationDone ? ["装飾の投稿、良かった！"] : []),
        ...(danceDone      ? ["今日の投稿見た", "本当にありがとう", "今年いけるかも"] : []),
      ],
    },
    {
      id: "sho", name: "翔（親友）", avatar: "😄",
      messages: [
        "最近結構伸びてるよな",
        ...(decorationDone ? ["通知来まくってるじゃん笑"] : []),
        ...(danceDone      ? ["めっちゃ反応来てるな", "お前、広報向いてるんじゃね？"] : []),
      ],
    },
    ...(danceDone ? [{
      id: "mitsuki", name: "美月", avatar: "💃",
      messages: ["投稿ありがとう！"],
    }] : []),
  ];
}

// ─────────────────────────────────────────────────────────────────────────────
// メインコンポーネント
// ─────────────────────────────────────────────────────────────────────────────

export default function Day4Page() {
  // ── 画面状態 ──────────────────────────────────────────────────────────────
  const [screen,          setScreen]         = useState<GameScreen>("school-home");
  const [activeArea,      setActiveArea]     = useState<"decoration" | "dance" | null>(null);

  // ── ゲームデータ ──────────────────────────────────────────────────────────
  const [notifications,   setNotifications]  = useState(0);
  const [posts,           setPosts]          = useState<Post[]>([]);
  const [readPostIds,     setReadPostIds]    = useState<Set<string>>(new Set());
  const [readThreadIds,   setReadThreadIds]  = useState<Set<string>>(new Set());
  const [selectedPostId,  setSelectedPostId] = useState<string | null>(null);
  const [selectedThreadId,setSelectedThread] = useState<string | null>(null);

  // ── 進行フラグ ────────────────────────────────────────────────────────────
  const decorationDone = posts.some(p => p.id === "post-decoration");
  const danceDone      = posts.some(p => p.id === "post-dance");
  const bothDone       = decorationDone && danceDone;

  const lineThreads    = buildLineThreads(decorationDone, danceDone);
  const selectedPost   = posts.find(p => p.id === selectedPostId);
  const selectedThread = lineThreads.find(t => t.id === selectedThreadId);

  // 未読数
  const unreadPostCount   = posts.filter(p => !readPostIds.has(p.id)).length;
  const unreadThreadCount = lineThreads.filter(t => !readThreadIds.has(t.id)).length;

  // ── ハンドラ ───────────────────────────────────────────────────────────────

  // 投稿完了 → 通知を段階的に追加して学校ホームへ戻る
  const handlePost = useCallback((post: Post, notifGain: number) => {
    setPosts(prev => [...prev, post]);
    const gain1 = Math.ceil(notifGain * 0.4);
    const gain2 = notifGain - gain1;
    setTimeout(() => setNotifications(n => n + gain1), 700);
    setTimeout(() => setNotifications(n => n + gain2), 1900);
    setScreen("school-home");
    setActiveArea(null);
  }, []);

  // スマホを開く → 通知クリア
  const handleOpenPhone = useCallback(() => {
    setNotifications(0);
    setScreen("phone-home");
  }, []);

  // 投稿のコメントを開く
  const handleOpenComments = useCallback((postId: string) => {
    setSelectedPostId(postId);
    setReadPostIds(prev => new Set([...prev, postId]));
    setScreen("phone-comments");
  }, []);

  // LINEトークを開く
  const handleOpenChat = useCallback((threadId: string) => {
    setSelectedThread(threadId);
    setReadThreadIds(prev => new Set([...prev, threadId]));
    setScreen("phone-chat");
  }, []);

  // ── 学校ホームのデータ構築 ─────────────────────────────────────────────────

  const goals: DailyGoal[] = [
    { label: "装飾班を取材して投稿する",   done: decorationDone },
    { label: "ダンス班を取材して投稿する",  done: danceDone },
    { label: "投稿の反応を確認する",        done: readPostIds.size > 0 },
    { label: "LINEを確認する",             done: readThreadIds.size > 0 },
  ];

  const destinations: Destination[] = [
    {
      id: "decoration", emoji: "🎨", label: "装飾班",
      sublabel: decorationDone ? "取材済み" : "取材に行く",
      disabled: false, done: decorationDone, isPhone: false,
    },
    {
      id: "dance", emoji: "💃", label: "ダンス班（美月）",
      sublabel: danceDone ? "取材済み" : "体育館で練習中",
      disabled: false, done: danceDone, isPhone: false,
    },
    {
      id: "phone", emoji: "📱", label: "スマホ",
      sublabel: "SNSやLINEを確認",
      disabled: false, done: false, isPhone: true,
    },
  ];

  // 全目標達成 + LINE 1件以上読んだら終了可能
  const canEnd = bothDone && readThreadIds.size >= 1;

  // ── 終了画面 ──────────────────────────────────────────────────────────────
  if (screen === "end") {
    return (
      <PhoneFrame>
        <EndScreen posts={posts} />
      </PhoneFrame>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  // レンダリング
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <PhoneFrame>

      {/* ① 学校ホーム */}
      {screen === "school-home" && (
        <SchoolHome
          dayLabel="Day 4 — 文化祭まであと3日"
          roomLabel="文化祭準備室"
          goals={goals}
          destinations={destinations}
          notifications={notifications}
          onDestination={(id) => {
            if (id === "phone") { handleOpenPhone(); return; }
            setActiveArea(id as "decoration" | "dance");
            setScreen("school-area");
          }}
          canEnd={canEnd}
          onEnd={() => setScreen("end")}
        />
      )}

      {/* ② 取材エリア */}
      {screen === "school-area" && activeArea && (
        <AreaScreen
          event={activeArea === "decoration" ? DECORATION_EVENT : DANCE_EVENT}
          onPost={handlePost}
          onBack={() => { setScreen("school-home"); setActiveArea(null); }}
        />
      )}

      {/* ③ スマホホーム */}
      {screen === "phone-home" && (
        <PhoneHome
          unreadSns={unreadPostCount}
          unreadLine={unreadThreadCount}
          snsPostCount={posts.length}
          lineCount={lineThreads.length}
          onSns={() => setScreen("phone-sns")}
          onLine={() => setScreen("phone-line")}
          onSchool={() => setScreen("school-home")}
        />
      )}

      {/* ④ SNS投稿一覧 */}
      {screen === "phone-sns" && (
        <SNSScreen
          posts={posts}
          readPostIds={readPostIds}
          onPost={handleOpenComments}
          onBack={() => setScreen("phone-home")}
        />
      )}

      {/* ⑤ コメント詳細 */}
      {screen === "phone-comments" && selectedPost && (
        <CommentsScreen
          post={selectedPost}
          onBack={() => setScreen("phone-sns")}
        />
      )}

      {/* ⑥ LINE一覧 */}
      {screen === "phone-line" && (
        <LineListScreen
          threads={lineThreads}
          readThreadIds={readThreadIds}
          onThread={handleOpenChat}
          onBack={() => setScreen("phone-home")}
        />
      )}

      {/* ⑦ LINEチャット */}
      {screen === "phone-chat" && selectedThread && (
        <LineChatScreen
          thread={selectedThread}
          onBack={() => setScreen("phone-line")}
        />
      )}

    </PhoneFrame>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EndScreen — Day4 終了画面
// ─────────────────────────────────────────────────────────────────────────────

function EndScreen({ posts }: { posts: Post[] }) {
  const totalLikes    = posts.reduce((s, p) => s + p.likes, 0);
  const totalComments = posts.reduce((s, p) => s + p.comments.length, 0);

  return (
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
            ["今日の投稿", `${posts.length}件`],
            ["いいね合計",  String(totalLikes)],
            ["コメント合計", `${totalComments}件`],
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
  );
}
