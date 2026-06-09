// ─── Day2 データ定義（人間関係ドラマ版） ─────────────────────────────

export const DAY2_MORNING_NOTIFICATIONS = [
  { id: "n1", emoji: "❤️", title: "いいねが増えています",       sub: "昨日の投稿に +28" },
  { id: "n2", emoji: "💬", title: "コメントが3件届いています",  sub: "「懐かしい、今年も文化祭あるんだ」" },
  { id: "n3", emoji: "👤", title: "新しいフォロワーがいます",   sub: "フォロワー数が増えています" },
  { id: "n4", emoji: "📱", title: "委員長からLINE",              sub: "昨日の投稿よかった！" },
  { id: "n5", emoji: "📱", title: "親友からLINE",                sub: "意外と伸びてるじゃん笑" },
];

export const DAY2_COMMENTS_INIT = [
  { id: "c1", user: "卒業生", avatar: "🎓", text: "懐かしい、今年も文化祭あるんだ" },
  { id: "c2", user: "保護者", avatar: "🙂", text: "準備頑張ってください" },
  { id: "c3", user: "高校生", avatar: "🧑‍🎓", text: "チュロス気になる🍟" },
  { id: "c4", user: "高校生", avatar: "🧑‍🎓", text: "去年より楽しそう" },
];

export const DAY2_LINE_MORNING = [
  { id: "l1", sender: "委員長", text: "昨日の投稿よかった！",               type: "left"  as const },
  { id: "l2", sender: "委員長", text: "思ったより見られてるね",             type: "left"  as const },
  { id: "l3", sender: "委員長", text: "今日も何か出せたらいいかも",         type: "left"  as const },
  { id: "l4", sender: "親友",   text: "意外と伸びてるじゃん笑",             type: "left"  as const },
  { id: "l5", sender: "親友",   text: "ちょっとSNS担当っぽくなってきたな", type: "left"  as const },
];

// ─── 取材キャラクター（会話イベント） ────────────────────────────────

export interface Day2Character {
  areaId:        string;
  name:          string;
  role:          string;
  emoji:         string;
  initialLines:  string[];
  choices:       { id: string; label: string }[];
  responses:     Record<string, string[]>;
  material:      string;
}

export const DAY2_CHARACTERS: Record<string, Day2Character> = {
  dance: {
    areaId: "dance",
    name:   "ダンス班長",
    role:   "ダンス班 班長",
    emoji:  "💃",
    initialLines: [
      "昨日の投稿、見たよ",
      "実は……A組の動画見て、ちょっと焦ってる",
      "でも今年は絶対成功させたいんだ",
    ],
    choices: [
      { id: "encourage", label: "励ます" },
      { id: "empathize", label: "共感する" },
      { id: "joke",      label: "冗談を言う" },
    ],
    responses: {
      encourage: ["ありがとう。じゃあ練習見てく？ちょっとだけ見せるよ"],
      empathize: ["だよな……でもやるしかないし。見ていく？"],
      joke:      ["笑 まぁそうだな。せっかくだから見ていきなよ"],
    },
    material: "ダンス班の練習風景",
  },
  shop: {
    areaId: "shop",
    name:   "模擬店リーダー",
    role:   "模擬店 リーダー",
    emoji:  "🍟",
    initialLines: [
      "あ、昨日の投稿見たよ！",
      "チュロス映ってたし、お客さん来てくれるかな",
      "今日も試作してるんだけど、また失敗しちゃって笑",
    ],
    choices: [
      { id: "encourage", label: "大丈夫だよ" },
      { id: "empathize", label: "失敗も面白い" },
      { id: "joke",      label: "食べてみたい" },
    ],
    responses: {
      encourage: ["ありがとう！じゃあ取材してく？失敗シーンも撮っていいよ笑"],
      empathize: ["そう！！じゃあそういう感じで撮ってよ〜"],
      joke:      ["笑 じゃあ完成したらあげる！取材もしてって"],
    },
    material: "チュロス試作品",
  },
  decoration: {
    areaId: "decoration",
    name:   "装飾班長",
    role:   "装飾班 班長",
    emoji:  "🎨",
    initialLines: [
      "ちょうどよかった、相談したかったんだ",
      "看板、思ったより大きくなってて……あと3日で完成するか不安で",
      "去年はこんな規模じゃなかったから",
    ],
    choices: [
      { id: "encourage", label: "きっと完成する" },
      { id: "empathize", label: "手伝えることある？" },
      { id: "joke",      label: "めちゃくちゃ楽しみ" },
    ],
    responses: {
      encourage: ["ありがとう。じゃあ制作中の様子、撮ってく？"],
      empathize: ["本当に？じゃあ撮影お願いしてもいい？"],
      joke:      ["笑 そう言ってもらえると力出る。撮ってってよ"],
    },
    material: "巨大装飾制作中",
  },
  brass: {
    areaId: "brass",
    name:   "吹奏楽部部長",
    role:   "吹奏楽部 部長",
    emoji:  "🎺",
    initialLines: [
      "あ、SNS担当の人だ",
      "文化祭のステージ……正直すごく緊張してて",
      "去年より良い演奏したいって思ってて",
    ],
    choices: [
      { id: "encourage", label: "絶対大丈夫" },
      { id: "empathize", label: "どんな曲やるの？" },
      { id: "joke",      label: "楽しみにしてる" },
    ],
    responses: {
      encourage: ["ありがとう、少し気が楽になった。練習、少し聴いてく？"],
      empathize: ["えっと……まだ言えないけど笑 でも聴いてほしいな"],
      joke:      ["本当？じゃあ練習の様子、少し撮ってってよ"],
    },
    material: "吹奏楽部の練習",
  },
};

// ─── 投稿の切り口（角度） ─────────────────────────────────────────────

export interface Day2Angle {
  id:     string;
  label:  string;
  desc:   string;
  detail: string;
  hasRisk?: boolean;
}

export const DAY2_POST_ANGLES: Record<string, Day2Angle[]> = {
  dance: [
    { id: "youth",   label: "青春を伝える",       desc: "真剣だけど楽しそう。その両方が伝わる切り口", detail: "練習の一生懸命さと笑顔を届ける" },
    { id: "teacher", label: "先生のサプライズ",    desc: "先生が踊るシーンを前面に。意外性で拡散を狙う", detail: "先生が踊るシーンを使う", hasRisk: true },
    { id: "fail",    label: "失敗を笑いに変える",  desc: "ミスをポジティブに見せる。共感を集めやすい", detail: "ハプニングシーンをポジティブに演出" },
  ],
  shop: [
    { id: "effort",  label: "頑張りを伝える",       desc: "何度も作り直す姿勢に共感してもらう", detail: "試行錯誤する様子を届ける" },
    { id: "food",    label: "おいしそうに見せる",    desc: "食べたい！と思わせる演出を前面に", detail: "完成品と笑顔を中心に構成" },
    { id: "fail",    label: "失敗を笑いに変える",   desc: "ハプニングをポジティブに。親近感を生む", detail: "失敗シーンをあえてポジティブに見せる" },
  ],
  decoration: [
    { id: "anticipation", label: "完成を楽しみにさせる", desc: "まだ完成していない今だからこそのワクワク感", detail: "制作途中の迫力と完成予想を伝える" },
    { id: "effort",       label: "制作の大変さを見せる", desc: "頑張っている姿に共感。信頼が上がりやすい", detail: "細かい作業や大変さを正直に届ける" },
    { id: "detail",       label: "こだわりを深掘り",     desc: "細部の工夫をクローズアップ。見ごたえが出る", detail: "職人的なこだわりを掘り下げる" },
  ],
  brass: [
    { id: "atmosphere", label: "音楽の雰囲気を伝える",  desc: "聴きに来たくなる。期待感を高める切り口", detail: "練習の音や雰囲気を届ける" },
    { id: "feeling",    label: "部員の想いを届ける",    desc: "緊張と期待に共感してもらう。温かいコメントが来やすい", detail: "部員の緊張や想いに寄り添った切り口" },
    { id: "hype",       label: "ステージへの期待を煽る", desc: "文化祭当日への期待感を最大化する演出", detail: "本番への期待感を高める演出" },
  ],
};

// ─── 取材先エリア情報 ─────────────────────────────────────────────────

export const DAY2_AREAS = [
  { id: "dance",      label: "ダンス班",   emoji: "💃", desc: "班長と話してみよう" },
  { id: "shop",       label: "模擬店",     emoji: "🍟", desc: "リーダーが声をかけてきそう" },
  { id: "decoration", label: "装飾班",     emoji: "🎨", desc: "班長に相談されそう" },
  { id: "brass",      label: "吹奏楽部",   emoji: "🎺", desc: "部長に声をかけてみよう" },
] as const;

export type Day2AreaId = (typeof DAY2_AREAS)[number]["id"];

// ─── 投稿後キャラクター反応 ──────────────────────────────────────────

export const DAY2_AREA_REACTIONS: Record<string, Record<string, string>> = {
  dance: {
    youth:   "投稿見たよ。みんなの頑張り、ちゃんと伝わってた",
    teacher: "先生の動画……恥ずかしかったけど、反応よくてよかった笑",
    fail:    "失敗シーン使ってくれたんだ笑 でもなんかいい感じだった",
  },
  shop: {
    effort:  "見てくれた人から「応援したい」ってコメント来てた",
    food:    "「食べたい！」ってコメントめっちゃ来てる笑",
    fail:    "失敗シーンで「かわいい」ってコメントついてた笑",
  },
  decoration: {
    anticipation: "「完成が楽しみ」ってコメントが来てた。励みになる",
    effort:       "「大変そうだけど頑張れ」って声が届いてうれしい",
    detail:       "こだわり伝わったみたい。ありがとう",
  },
  brass: {
    atmosphere: "「聴きに行きます」ってコメントが来てた。緊張するな笑",
    feeling:    "「応援してます」って言葉がうれしかった",
    hype:       "期待のコメントたくさんで、プレッシャーだけど嬉しい",
  },
};

// ─── 順位発表イベントLINE ─────────────────────────────────────────────

export const DAY2_RANK_EVENT_LINES = (rank: number) => [
  { sender: "委員長", text: "中間順位、発表されたよ！" },
  { sender: "委員長", text: `自分たち……${rank}位になってる！` },
  { sender: "親友",   text: "マジで！？上がってるじゃん！！" },
  { sender: "ダンス班長", text: "やったーーー！！" },
  { sender: "委員長", text: "このまま頑張ろう！" },
];

// ─── ライバルクラス ───────────────────────────────────────────────────

export const DAY2_RIVAL_CLASSES = [
  { name: "A組", followers: 3200, badge: "去年1位",   note: "動画投稿が強い" },
  { name: "C組", followers: 850,  badge: "コメント◎", note: "コメント欄の雰囲気が良い" },
  { name: "D組", followers: 1500, badge: "話題性◎",   note: "話題性のある投稿が多い" },
];

// ─── 投稿結果計算 ─────────────────────────────────────────────────────

export function computeDay2Outcome(area: string, angle: string) {
  let followerGain  = 68;
  let trustGain     = 5;
  let attentionGain = 5;
  let flameRiskGain = 2;

  const highAttention = ["teacher", "fail", "hype"];
  const highTrust     = ["effort", "feeling", "youth", "anticipation", "detail", "atmosphere"];

  if (highAttention.includes(angle)) {
    followerGain  += 10;
    attentionGain += 12;
    flameRiskGain += 6;
    if (area === "dance" && angle === "teacher") flameRiskGain += 4;
  } else if (highTrust.includes(angle)) {
    trustGain     += 8;
    attentionGain -= 1;
  } else {
    // food / hype
    followerGain  += 8;
    attentionGain += 6;
  }

  const newFollowers = 32 + followerGain;
  const newRank = highAttention.includes(angle) ? 6 : 7;

  return { followerGain, newFollowers, trustGain, attentionGain, flameRiskGain, newRank };
}
