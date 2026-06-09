"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────────────────────────────────────

type ScreenMode = "school" | "phone" | "sns" | "comments" | "line" | "line-chat";

type Post = {
  id: string;
  title: string;
  body: string;
  imgEmoji: string;
  likes: number;
  commentsCount: number;
  comments: Comment[];
  isNew: boolean;
  postedAt: string;
};

type Comment = {
  user: string;
  avatar: string;
  text: string;
};

type LineThread = {
  from: "葵" | "翔" | "美月";
  avatar: string;
  messages: string[];
  unread: boolean;
};

type Choice = {
  id: string;
  label: string;
  desc: string;
};

// choice1 / choice2 の選択結果型
type ChoiceKey = "A" | "B" | "C" | null;

// ─────────────────────────────────────────────────────────────────────────────
// シーン定義
// ─────────────────────────────────────────────────────────────────────────────

type SceneType =
  | { kind: "narration"; text: string }
  | { kind: "dialogue"; speaker: string; text: string }
  | { kind: "choice"; stateKey: "choice1" | "choice2"; question: string; choices: Choice[] }
  | { kind: "post"; postKey: "post1" | "post2" }
  | { kind: "phone-hint"; text: string; btnLabel: string }
  | { kind: "end" };

const SCENES: SceneType[] = [
  // 朝
  { kind: "narration",  text: "朝のホームルームが終わった。" },
  { kind: "dialogue",   speaker: "葵（委員長）", text: "今年、本当に上位狙えるかも。このまま伸ばしていこう。" },
  { kind: "dialogue",   speaker: "翔（親友）",   text: "最近結構伸びてるよな。今日も何か出せそう？" },
  { kind: "narration",  text: "さっそく取材に向かうことにした。" },

  // 取材①：装飾班
  { kind: "narration",  text: "教室のすみ。装飾班が看板を作っていた。" },
  { kind: "dialogue",   speaker: "装飾班の子", text: "ここ、当日は机で隠れるんだけど——気になるんだよね。ここまで作り込みたくて。" },
  { kind: "dialogue",   speaker: "あなた",     text: "そこって…見えないよね？" },
  { kind: "dialogue",   speaker: "装飾班の子", text: "うん。でも、なんか気になるんだよね。誰かが気づいてくれたら嬉しいし。" },
  { kind: "narration",  text: "撮影を終えた。さて、何を伝えよう。" },

  // 選択肢①
  {
    kind: "choice",
    stateKey: "choice1",
    question: "あなたは何を伝えたいですか？",
    choices: [
      { id: "A", label: "見えない努力を伝える",       desc: "誰も気づかない場所まで作り込む姿を伝える" },
      { id: "B", label: "みんなで作る楽しさを伝える", desc: "笑いながら真剣に作る雰囲気を伝える" },
      { id: "C", label: "完成への期待を伝える",        desc: "まだ完成していない今だからこそのワクワク感を伝える" },
    ],
  },

  // 投稿①
  { kind: "post", postKey: "post1" },

  // 投稿①後の会話
  { kind: "narration",  text: "投稿した。授業が始まった。" },
  { kind: "dialogue",   speaker: "翔（親友）",   text: "（小声で）投稿したの？こっちから見えた笑" },
  { kind: "narration",  text: "先生の声が遠い。スマホが気になる。" },
  { kind: "dialogue",   speaker: "翔（親友）",   text: "（小声で）なんか来てるっぽくない？" },
  {
    kind: "phone-hint",
    text: "右上の 📱 を押してスマホを確認できます。コメントが届いているかもしれません。",
    btnLabel: "授業が終わった。次の取材へ",
  },

  // 取材②：ダンス班（美月）
  { kind: "narration",  text: "放課後。体育館の隅で、美月がひとりで踊っていた。" },
  { kind: "narration",  text: "失敗。やり直し。また失敗。そして——成功。笑顔。" },
  { kind: "dialogue",   speaker: "美月", text: "まだ完成してないんだけどね。" },
  { kind: "dialogue",   speaker: "美月", text: "本番までには絶対仕上げたい。それだけ。" },
  { kind: "dialogue",   speaker: "美月", text: "投稿？任せるよ。あなたのこと、信頼してるから。" },
  { kind: "narration",  text: "撮影を終えた。今日2回目の投稿。何を伝えよう。" },

  // 選択肢②
  {
    kind: "choice",
    stateKey: "choice2",
    question: "あなたは何を伝えたいですか？",
    choices: [
      { id: "A", label: "頑張っている姿を伝える",   desc: "何度も繰り返す美月の姿そのものを伝える" },
      { id: "B", label: "感情が見える瞬間を伝える", desc: "失敗して、また笑顔になった瞬間を切り取る" },
      { id: "C", label: "本番への期待を伝える",     desc: "「絶対仕上げたい」という言葉と共に期待感を高める" },
    ],
  },

  // 投稿②
  { kind: "post", postKey: "post2" },

  // 投稿②後
  { kind: "narration",  text: "投稿した。" },
  { kind: "narration",  text: "スマホが震える。また震える。また。" },
  {
    kind: "phone-hint",
    text: "大きな反応が来ています。スマホを確認してみましょう。LINEにもメッセージが届いているかも。",
    btnLabel: "LINEも確認した。今日を終える",
  },

  { kind: "end" },
];

// ─────────────────────────────────────────────────────────────────────────────
// 投稿データ生成
// ─────────────────────────────────────────────────────────────────────────────

function makePost1(choice: ChoiceKey): Post {
  const content = {
    A: {
      body: "誰も気づかない場所まで。装飾班の、見えない努力を記録しました。",
      comments: [
        { user: "高校生", avatar: "🧑‍🎓", text: "こういう裏側好き" },
        { user: "高校生", avatar: "🧑‍🎓", text: "見えないところまでやってるのすごい" },
        { user: "卒業生", avatar: "🎓",   text: "懐かしい。こういう人たちがいるから文化祭っていいんだよな" },
        { user: "保護者", avatar: "🙂",   text: "頑張ってますね。応援してます" },
        { user: "高校生", avatar: "🧑‍🎓", text: "B組ちゃんとしてる" },
        { user: "高校生", avatar: "🧑‍🎓", text: "当日絶対行く！" },
      ],
      likes: 34,
    },
    B: {
      body: "笑いながら、でも真剣に。みんなで作る文化祭の装飾、現在進行中です。",
      comments: [
        { user: "高校生", avatar: "🧑‍🎓", text: "青春って感じ" },
        { user: "高校生", avatar: "🧑‍🎓", text: "楽しそう！" },
        { user: "卒業生", avatar: "🎓",   text: "うちの時もこんな感じだったな" },
        { user: "高校生", avatar: "🧑‍🎓", text: "B組雰囲気いいね" },
        { user: "保護者", avatar: "🙂",   text: "青春だ〜" },
        { user: "高校生", avatar: "🧑‍🎓", text: "完成したら見に行く" },
      ],
      likes: 41,
    },
    C: {
      body: "完成はまだ先。でも絶対すごいものになる。装飾班、本気の制作中。",
      comments: [
        { user: "高校生", avatar: "🧑‍🎓", text: "完成版見たい" },
        { user: "高校生", avatar: "🧑‍🎓", text: "本番気になる" },
        { user: "高校生", avatar: "🧑‍🎓", text: "これは見に行きたい" },
        { user: "保護者", avatar: "🙂",   text: "完成が楽しみです" },
        { user: "高校生", avatar: "🧑‍🎓", text: "どんな仕上がりになるんだろ" },
      ],
      likes: 28,
    },
  }[choice ?? "A"];

  return {
    id: "post1",
    title: "装飾班の取材",
    body: content.body,
    imgEmoji: "🎨",
    likes: content.likes,
    commentsCount: content.comments.length,
    comments: content.comments,
    isNew: true,
    postedAt: "今日 午後2:14",
  };
}

function makePost2(choice: ChoiceKey): Post {
  const content = {
    A: {
      body: "何度も何度も繰り返す。美月の、誰にも見せない練習時間を記録しました。",
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
      likes: 87,
    },
    B: {
      body: "失敗して、やり直して、笑顔になった瞬間。その一瞬を切り取りました。",
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
      likes: 112,
    },
    C: {
      body: "本番まであと3日。「絶対仕上げたい」という言葉が頭から離れません。",
      comments: [
        { user: "高校生", avatar: "🧑‍🎓", text: "完成版が楽しみ" },
        { user: "高校生", avatar: "🧑‍🎓", text: "これは本番見たい" },
        { user: "高校生", avatar: "🧑‍🎓", text: "文化祭行く理由できた" },
        { user: "卒業生", avatar: "🎓",   text: "絶対見に行く" },
        { user: "高校生", avatar: "🧑‍🎓", text: "期待してる！！" },
        { user: "保護者", avatar: "🙂",   text: "当日楽しみにしています" },
        { user: "高校生", avatar: "🧑‍🎓", text: "頑張れー！！" },
      ],
      likes: 75,
    },
  }[choice ?? "A"];

  return {
    id: "post2",
    title: "美月の練習",
    body: content.body,
    imgEmoji: "💃",
    likes: content.likes,
    commentsCount: content.comments.length,
    comments: content.comments,
    isNew: true,
    postedAt: "今日 午後4:47",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// LINE データ
// ─────────────────────────────────────────────────────────────────────────────

function makeLineThreads(post1Done: boolean, post2Done: boolean): LineThread[] {
  return [
    {
      from: "葵",
      avatar: "👩",
      unread: post2Done,
      messages: [
        "今年、本当に上位狙えるかも",
        ...(post1Done ? ["装飾の投稿、良かった！"] : []),
        ...(post2Done ? ["今日の投稿見た", "本当にありがとう", "今年いけるかも"] : []),
      ],
    },
    {
      from: "翔",
      avatar: "😄",
      unread: post2Done,
      messages: [
        "最近結構伸びてるよな",
        ...(post1Done ? ["通知来まくってるじゃん笑"] : []),
        ...(post2Done ? ["めっちゃ反応来てるな", "お前、広報向いてるんじゃね？"] : []),
      ],
    },
    {
      from: "美月",
      avatar: "💃",
      unread: post2Done,
      messages: [
        ...(post2Done ? ["投稿ありがとう！"] : []),
      ],
    },
  ].filter(t => t.messages.length > 0) as LineThread[];
}

// ─────────────────────────────────────────────────────────────────────────────
// 投稿プレビュー文
// ─────────────────────────────────────────────────────────────────────────────

const POST_PREVIEW_BODIES: Record<string, Record<string, string>> = {
  post1: {
    A: "誰も気づかない場所まで。装飾班の、見えない努力を記録しました。",
    B: "笑いながら、でも真剣に。みんなで作る文化祭の装飾、現在進行中です。",
    C: "完成はまだ先。でも絶対すごいものになる。装飾班、本気の制作中。",
  },
  post2: {
    A: "何度も何度も繰り返す。美月の、誰にも見せない練習時間を記録しました。",
    B: "失敗して、やり直して、笑顔になった瞬間。その一瞬を切り取りました。",
    C: "本番まであと3日。「絶対仕上げたい」という言葉が頭から離れません。",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// メインコンポーネント
// ─────────────────────────────────────────────────────────────────────────────

export default function Day4Page() {
  // ── 状態 ────────────────────────────────────────────────────────────────────
  const [screenMode, setScreenMode] = useState<ScreenMode>("school");
  const [sceneIndex, setSceneIndex] = useState(0);
  const [notifications, setNotifications] = useState(0);
  const [posts, setPosts] = useState<Post[]>([]);
  const [lineMessages] = useState<LineThread[]>([]);  // 表示は都度計算
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [selectedLineSender, setSelectedLineSender] = useState<string | null>(null);

  // 選択肢の結果
  const [choice1, setChoice1] = useState<ChoiceKey>(null);
  const [choice2, setChoice2] = useState<ChoiceKey>(null);

  // 現在の選択肢画面で何を選んだか（確定前）
  const [pendingChoice, setPendingChoice] = useState<string | null>(null);

  // 投稿プレビュー表示中か
  const [showPreview, setShowPreview] = useState(false);

  // 会話ログ（表示済みのメッセージ一覧）
  const [log, setLog] = useState<{ speaker: string | null; text: string }[]>([]);

  // 終了画面
  const [isEnd, setIsEnd] = useState(false);

  // スクロール基点
  const logBottomRef = useRef<HTMLDivElement>(null);

  // ── 進行フラグ ───────────────────────────────────────────────────────────────
  const post1Done = posts.some(p => p.id === "post1");
  const post2Done = posts.some(p => p.id === "post2");

  const currentScene = SCENES[sceneIndex];

  // ── ログ追加 & スクロール ────────────────────────────────────────────────────
  const appendLog = useCallback((speaker: string | null, text: string) => {
    setLog(prev => [...prev, { speaker, text }]);
  }, []);

  useEffect(() => {
    logBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [log]);

  // ── シーン自動進行（narration / dialogue は表示してボタン待ち） ────────────────
  useEffect(() => {
    if (!currentScene) return;
    if (currentScene.kind === "narration") {
      appendLog(null, currentScene.text);
    } else if (currentScene.kind === "dialogue") {
      appendLog(currentScene.speaker, currentScene.text);
    }
    // それ以外はユーザー操作待ち
  }, [sceneIndex]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── advance: 次のシーンへ進む ──────────────────────────────────────────────
  const advance = useCallback(() => {
    setPendingChoice(null);
    setShowPreview(false);
    setSceneIndex(i => i + 1);
  }, []);

  // ── 選択肢を確定して投稿プレビュー表示 ────────────────────────────────────────
  const confirmChoice = useCallback(() => {
    if (!pendingChoice) return;
    const scene = currentScene;
    if (scene.kind !== "choice") return;

    const choiceLabel = scene.choices.find(c => c.id === pendingChoice)?.label ?? "";
    appendLog("あなた（心の中）", choiceLabel + "——それを伝えよう。");

    if (scene.stateKey === "choice1") setChoice1(pendingChoice as ChoiceKey);
    else setChoice2(pendingChoice as ChoiceKey);

    setShowPreview(true);
  }, [pendingChoice, currentScene, appendLog]);

  // ── 投稿実行 ──────────────────────────────────────────────────────────────────
  const doPost = useCallback(() => {
    if (!currentScene || currentScene.kind !== "post") return;

    if (currentScene.postKey === "post1") {
      const post = makePost1(choice1);
      setPosts(prev => [...prev, post]);
      appendLog("システム", "📤 投稿が完了しました！");
      // 少し遅れて通知を積み上げる
      setTimeout(() => setNotifications(n => n + 2), 800);
      setTimeout(() => setNotifications(n => n + 2), 1800);
      setTimeout(() => setNotifications(n => n + 1), 3000);
    } else {
      const post = makePost2(choice2);
      setPosts(prev => [...prev, post]);
      appendLog("システム", "📤 投稿が完了しました！");
      setTimeout(() => setNotifications(n => n + 4), 600);
      setTimeout(() => setNotifications(n => n + 4), 1500);
      setTimeout(() => setNotifications(n => n + 4), 2600);
    }

    advance();
  }, [currentScene, choice1, choice2, appendLog, advance]);

  // ── スマホ開閉 ───────────────────────────────────────────────────────────────
  const openPhone = useCallback(() => {
    setNotifications(0);  // バッジをクリア
    setScreenMode("phone");
  }, []);

  const closePhone = useCallback(() => {
    setScreenMode("school");
  }, []);

  // ── コメント画面 ─────────────────────────────────────────────────────────────
  const openComments = useCallback((postId: string) => {
    // 既読にする
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, isNew: false } : p));
    setSelectedPostId(postId);
    setScreenMode("comments");
  }, []);

  // ── LINEチャット ─────────────────────────────────────────────────────────────
  const openLineChat = useCallback((sender: string) => {
    setSelectedLineSender(sender);
    setScreenMode("line-chat");
  }, []);

  // ── 終了判定 ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (currentScene?.kind === "end") setIsEnd(true);
  }, [currentScene]);

  // ── 今のボタンラベル ─────────────────────────────────────────────────────────
  const nextBtnLabel = (() => {
    if (!currentScene) return "続ける";
    if (currentScene.kind === "phone-hint") return currentScene.btnLabel;
    return "続ける";
  })();

  // ── 続けるボタンを表示するか ─────────────────────────────────────────────────
  const showNextBtn = currentScene?.kind === "narration" || currentScene?.kind === "dialogue" || currentScene?.kind === "phone-hint";

  // ── 選択肢を表示するか ───────────────────────────────────────────────────────
  const showChoices = currentScene?.kind === "choice" && !showPreview;

  // ── 投稿ボタンを表示するか ───────────────────────────────────────────────────
  const showPostBtn = currentScene?.kind === "post";

  // ─────────────────────────────────────────────────────────────────────────────
  // LINE データ取得（post1Done / post2Done に応じて変わる）
  // ─────────────────────────────────────────────────────────────────────────────
  const lineThreads = makeLineThreads(post1Done, post2Done);
  const selectedThread = lineThreads.find(t => t.from === selectedLineSender);

  // ─────────────────────────────────────────────────────────────────────────────
  // 現在選択中の投稿（コメント画面用）
  // ─────────────────────────────────────────────────────────────────────────────
  const selectedPost = posts.find(p => p.id === selectedPostId);

  // ─────────────────────────────────────────────────────────────────────────────
  // プレビュー表示中の postKey を取得
  // ─────────────────────────────────────────────────────────────────────────────
  const previewPostKey = (() => {
    if (currentScene?.kind !== "choice") return null;
    return currentScene.stateKey === "choice1" ? "post1" : "post2";
  })();
  const previewChoice = currentScene?.kind === "choice"
    ? (currentScene.stateKey === "choice1" ? choice1 : choice2)
    : null;
  const previewBody = previewPostKey && previewChoice
    ? POST_PREVIEW_BODIES[previewPostKey][previewChoice]
    : null;

  // ─────────────────────────────────────────────────────────────────────────────
  // 終了画面
  // ─────────────────────────────────────────────────────────────────────────────
  if (isEnd) {
    const totalLikes    = posts.reduce((s, p) => s + p.likes, 0);
    const totalComments = posts.reduce((s, p) => s + p.commentsCount, 0);

    const endMsg = (() => {
      if (choice1 === "A" && choice2 === "A")
        return "人の頑張りを伝えることを選んだ。コメント欄には「応援してる」という言葉が並んでいた。\n\n数字も大事だけど、あなたが伝えたかったものは——何だろう。";
      if (choice2 === "B")
        return "感情が見える瞬間を伝えることを選んだ。いいねが伸び、たくさんのコメントが届いた。\n\n人は感情に反応する——そのことを少し実感した日だった。";
      return "今日2回投稿した。数字が伸びた。人の反応が来た。\n\nそれが嬉しかった。でも——本当に伝えたかったものは、ちゃんと届いていただろうか。";
    })();

    return (
      <PhoneFrame>
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
                ["今日の投稿", "2件"],
                ["いいね合計", String(totalLikes)],
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
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{endMsg}</p>
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
      </PhoneFrame>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 各画面のレンダリング
  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <PhoneFrame>

      {/* ── 学校パート ─────────────────────────────────────────────────── */}
      {screenMode === "school" && (
        <div className="flex flex-col min-h-full bg-white">

          {/* ヘッダー */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
            <div className="text-xs font-bold text-gray-400 tracking-widest uppercase">Day 4 — 文化祭まであと3日</div>
            {/* スマホボタン。通知があるときは赤バッジ */}
            <button
              onClick={openPhone}
              className="relative text-2xl p-1 rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="スマホを開く"
            >
              📱
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 leading-none">
                  {notifications > 99 ? "99+" : notifications}
                </span>
              )}
            </button>
          </div>

          {/* 会話ログ */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
            {log.map((entry, i) => (
              <div key={i} className="animate-fade-in">
                {entry.speaker ? (
                  <div>
                    <div className="text-xs font-bold text-gray-400 mb-1">{entry.speaker}</div>
                    <div className="text-[15px] leading-relaxed text-gray-800">{entry.text}</div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-500 italic leading-relaxed">{entry.text}</div>
                )}
              </div>
            ))}

            {/* 選択肢 */}
            {showChoices && currentScene.kind === "choice" && (
              <div className="space-y-3 pt-2">
                <div className="text-sm font-bold text-gray-700 mb-1">{currentScene.question}</div>
                {currentScene.choices.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setPendingChoice(c.id)}
                    className={`w-full text-left border-2 rounded-xl px-4 py-3 transition-all ${
                      pendingChoice === c.id
                        ? "border-gray-900 bg-gray-900 text-white"
                        : "border-gray-200 hover:border-gray-400 bg-white"
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
                    onClick={confirmChoice}
                    className="w-full bg-gray-900 text-white rounded-xl py-3.5 font-semibold text-sm mt-1"
                  >
                    これで伝える
                  </button>
                )}
              </div>
            )}

            {/* 投稿プレビュー（選択確定後） */}
            {showPreview && previewBody && (
              <div className="border-2 border-gray-200 rounded-2xl overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base">🏫</div>
                  <div>
                    <div className="text-sm font-bold text-gray-800">1年3組文化祭</div>
                    <div className="text-xs text-gray-400">プレビュー</div>
                  </div>
                </div>
                <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-4xl">
                  {previewPostKey === "post1" ? "🎨" : "💃"}
                </div>
                <div className="px-4 py-3 text-sm text-gray-800 leading-relaxed">{previewBody}</div>
              </div>
            )}

            {/* 投稿ボタン（post シーン） */}
            {showPostBtn && !showPreview && (
              <div className="pt-2">
                {(() => {
                  const scene = currentScene as Extract<SceneType, { kind: "post" }>;
                  const c = scene.postKey === "post1" ? choice1 : choice2;
                  const body = c ? POST_PREVIEW_BODIES[scene.postKey][c] : null;
                  const emoji = scene.postKey === "post1" ? "🎨" : "💃";
                  if (!body) {
                    // 選択肢を選んでいない場合は前のシーンに戻す（通常ここには来ない）
                    return null;
                  }
                  return (
                    <>
                      <div className="border-2 border-gray-200 rounded-2xl overflow-hidden mb-3">
                        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base">🏫</div>
                          <div>
                            <div className="text-sm font-bold text-gray-800">1年3組文化祭</div>
                            <div className="text-xs text-gray-400">投稿プレビュー</div>
                          </div>
                        </div>
                        <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-4xl">{emoji}</div>
                        <div className="px-4 py-3 text-sm text-gray-800 leading-relaxed">{body}</div>
                      </div>
                      <button
                        onClick={doPost}
                        className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
                      >
                        投稿する
                      </button>
                    </>
                  );
                })()}
              </div>
            )}

            <div ref={logBottomRef} />
          </div>

          {/* 続けるボタン */}
          {(showNextBtn || (showPreview && currentScene?.kind === "choice")) && (
            <div className="px-5 pb-6 pt-3 border-t border-gray-100">
              {showPreview && currentScene?.kind === "choice" ? (
                <button
                  onClick={advance}
                  className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
                >
                  次の取材へ向かう
                </button>
              ) : (
                <button
                  onClick={advance}
                  className="w-full bg-gray-900 text-white rounded-xl py-4 font-semibold text-sm"
                >
                  {nextBtnLabel}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── スマホ画面（SNS / LINE タブ） ─────────────────────────────── */}
      {screenMode === "phone" && (
        <div className="flex flex-col min-h-full bg-gray-50">
          <div className="flex items-center px-5 py-3 bg-white border-b border-gray-100">
            <button onClick={closePhone} className="text-xl text-gray-600 mr-3">‹</button>
            <span className="text-sm font-bold text-gray-900">スマホ</span>
          </div>

          {/* タブ */}
          <div className="flex bg-white border-b border-gray-200">
            <button
              onClick={() => setScreenMode("sns")}
              className="flex-1 py-3 text-sm font-semibold text-gray-400 border-b-2 border-transparent hover:text-gray-800 transition-colors"
            >
              SNS
            </button>
            <button
              onClick={() => setScreenMode("line")}
              className="flex-1 py-3 text-sm font-semibold text-gray-400 border-b-2 border-transparent hover:text-gray-800 transition-colors"
            >
              LINE
            </button>
          </div>

          {/* SNS投稿フィード（簡易表示） */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {posts.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-12">まだ投稿がありません</p>
            ) : (
              [...posts].reverse().map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => openComments(post.id)}
                >
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-base">🏫</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800">1年3組文化祭</span>
                        {post.isNew && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{post.postedAt}</div>
                    </div>
                  </div>
                  <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-4xl">{post.imgEmoji}</div>
                  <div className="px-4 py-3 text-sm text-gray-700 leading-relaxed">{post.body}</div>
                  <div className="flex gap-4 px-4 pb-3 text-sm text-gray-500">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.commentsCount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── SNS投稿一覧（タブから） ─────────────────────────────────────── */}
      {screenMode === "sns" && (
        <div className="flex flex-col min-h-full bg-gray-50">
          <div className="flex items-center px-5 py-3 bg-white border-b border-gray-100">
            <button onClick={() => setScreenMode("phone")} className="text-xl text-gray-600 mr-3">‹</button>
            <span className="text-sm font-bold text-gray-900">SNS</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {posts.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-12">まだ投稿がありません</p>
            ) : (
              [...posts].reverse().map(post => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                  onClick={() => openComments(post.id)}
                >
                  <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">🏫</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-gray-800">1年3組文化祭</span>
                        {post.isNew && (
                          <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">NEW</span>
                        )}
                      </div>
                      <div className="text-xs text-gray-400">{post.postedAt}</div>
                    </div>
                  </div>
                  <div className="w-full aspect-video bg-gray-100 flex items-center justify-center text-4xl">{post.imgEmoji}</div>
                  <div className="px-4 py-3 text-sm text-gray-700 leading-relaxed">{post.body}</div>
                  <div className="flex gap-4 px-4 pb-3 text-sm text-gray-500">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.commentsCount}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ── コメント画面 ────────────────────────────────────────────────── */}
      {screenMode === "comments" && selectedPost && (
        <div className="flex flex-col min-h-full bg-white">
          <div className="flex items-center px-5 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
            <button
              onClick={() => setScreenMode(posts.length > 0 ? "sns" : "phone")}
              className="text-xl text-gray-600 mr-3"
            >
              ‹
            </button>
            <span className="text-sm font-bold text-gray-900">コメント</span>
          </div>

          {/* 投稿サマリー */}
          <div className="px-5 py-4 border-b border-gray-100">
            <div className="text-sm text-gray-700 leading-relaxed">{selectedPost.body}</div>
            <div className="flex gap-4 mt-2 text-sm text-gray-500">
              <span>❤️ {selectedPost.likes}</span>
              <span>💬 {selectedPost.commentsCount}</span>
            </div>
          </div>

          {/* コメント一覧（最大5件 + 「他N件」） */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
            {selectedPost.comments.slice(0, 5).map((c, i) => (
              <div key={i} className="flex gap-3">
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
            {selectedPost.comments.length > 5 && (
              <div className="text-center text-xs text-gray-400 py-2">
                他{selectedPost.comments.length - 5}件のコメント
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── LINE一覧 ────────────────────────────────────────────────────── */}
      {screenMode === "line" && (
        <div className="flex flex-col min-h-full bg-gray-50">
          <div className="flex items-center px-5 py-3 bg-white border-b border-gray-100">
            <button onClick={() => setScreenMode("phone")} className="text-xl text-gray-600 mr-3">‹</button>
            <span className="text-sm font-bold text-gray-900">LINE</span>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-1">
            {lineThreads.length === 0 ? (
              <p className="text-center text-gray-400 text-sm py-12">まだメッセージがありません</p>
            ) : (
              lineThreads.map(t => (
                <button
                  key={t.from}
                  onClick={() => openLineChat(t.from)}
                  className="w-full flex items-center gap-3 px-3 py-3 bg-white rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="relative w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center text-xl flex-shrink-0">
                    {t.avatar}
                    {t.unread && (
                      <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="text-sm font-bold text-gray-800">{t.from}</div>
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

      {/* ── LINEチャット ────────────────────────────────────────────────── */}
      {screenMode === "line-chat" && selectedThread && (
        <div className="flex flex-col min-h-full" style={{ background: "#e8f5e9" }}>
          <div className="flex items-center px-4 py-3 bg-green-500 text-white">
            <button onClick={() => setScreenMode("line")} className="text-xl mr-3 opacity-90">‹</button>
            <span className="text-sm font-bold">{selectedThread.from}</span>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {selectedThread.messages.map((msg, i) => (
              <div key={i} className="flex items-end gap-2">
                {i === 0 && (
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-base flex-shrink-0">
                    {selectedThread.avatar}
                  </div>
                )}
                {i > 0 && <div className="w-8 flex-shrink-0" />}
                <div>
                  {i === 0 && (
                    <div className="text-xs text-gray-500 mb-1">{selectedThread.from}</div>
                  )}
                  <div className="bg-white rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[230px] leading-relaxed">
                    {msg}
                  </div>
                </div>
              </div>
            ))}
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
    <div className="min-h-screen bg-gray-200 flex items-start justify-center py-0 md:py-8">
      <div
        className="relative w-full md:max-w-[390px] bg-white flex flex-col"
        style={{
          minHeight: "100svh",
          // デスクトップではフォン枠風に
        }}
      >
        <style>{`
          @media (min-width: 768px) {
            .phone-inner {
              min-height: calc(100vh - 64px);
              border-radius: 40px;
              box-shadow: 0 24px 80px rgba(0,0,0,0.22);
              overflow: hidden;
            }
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(5px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.3s ease forwards;
          }
        `}</style>
        <div className="phone-inner flex flex-col flex-1">{children}</div>
      </div>
    </div>
  );
}
