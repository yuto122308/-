// ─── Day2 データ定義 ────────────────────────────────────────────────

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
  { id: "c3", user: "高校生", avatar: "🧑‍🎓", text: "チュロス気になる 🍟" },
  { id: "c4", user: "高校生", avatar: "🧑‍🎓", text: "去年より楽しそう" },
];

export const DAY2_LINE_MORNING = [
  { id: "l1", sender: "委員長", text: "昨日の投稿よかった！",                 type: "left"  as const },
  { id: "l2", sender: "委員長", text: "思ったより見られてるね",               type: "left"  as const },
  { id: "l3", sender: "委員長", text: "今日も何か出せたらいいかも",           type: "left"  as const },
  { id: "l4", sender: "親友",   text: "意外と伸びてるじゃん笑",               type: "left"  as const },
  { id: "l5", sender: "親友",   text: "ちょっとSNS担当っぽくなってきたな",   type: "left"  as const },
];

export const DAY2_AREAS = [
  {
    id: "dance",
    label: "ダンス班",
    emoji: "💃",
    desc: "放課後の練習を見てみよう",
    material: "ダンス班の練習風景",
    detail: "放課後の練習。まだ完璧ではないが、みんな楽しそう。先生も少しだけ踊りに参加している。",
    tags: ["高校生に刺さりやすい", "先生が映る"],
    hasRisk: true,
  },
  {
    id: "shop",
    label: "模擬店",
    emoji: "🍟",
    desc: "チュロスの試作品を見に行こう",
    material: "チュロス試作品",
    detail: "チュロスの試作品づくり。少し失敗したが、みんなで笑っている。",
    tags: ["保護者に刺さりやすい", "信頼が上がる"],
    hasRisk: false,
  },
  {
    id: "decoration",
    label: "装飾班",
    emoji: "🎨",
    desc: "巨大看板の制作現場へ",
    material: "巨大装飾制作中",
    detail: "巨大看板を制作中。まだ途中だが、完成するとかなり映えそう。",
    tags: ["信頼が上がる", "安定している"],
    hasRisk: false,
  },
  {
    id: "brass",
    label: "吹奏楽部",
    emoji: "🎺",
    desc: "ステージ練習の様子を聴こう",
    material: "吹奏楽部の練習",
    detail: "文化祭ステージに向けて練習中。音だけ聞こえてきて、雰囲気が良い。",
    tags: ["保護者・卒業生に人気", "信頼が上がる"],
    hasRisk: false,
  },
] as const;

export type Day2AreaId = (typeof DAY2_AREAS)[number]["id"];

export const DAY2_POST_VALUES = [
  { id: "popularity", label: "人気",  emoji: "🔥", desc: "フォロワーが増えやすい" },
  { id: "trust",      label: "信頼",  emoji: "💙", desc: "温かいコメントが増える" },
  { id: "attention",  label: "注目",  emoji: "⚡", desc: "拡散されやすい" },
] as const;

export type Day2ValueId = (typeof DAY2_POST_VALUES)[number]["id"];

export const DAY2_POST_TARGETS = [
  { id: "students", label: "高校生", emoji: "🧑‍🎓" },
  { id: "parents",  label: "保護者", emoji: "🙂" },
] as const;

export type Day2TargetId = (typeof DAY2_POST_TARGETS)[number]["id"];

export const DAY2_RIVAL_CLASSES = [
  { name: "A組", followers: 3200, badge: "去年1位",  note: "動画投稿が強い" },
  { name: "C組", followers: 850,  badge: "コメント◎", note: "コメント欄の雰囲気が良い" },
  { name: "D組", followers: 1500, badge: "話題性◎",  note: "話題性のある投稿が多い" },
];

// ─── コメント生成 ────────────────────────────────────────────────────

export function getDay2PostComments(
  area: string,
  value: string,
  target: string
): { text: string; unsettling?: boolean }[] {
  const hasUnsettling = value === "attention" || area === "dance";

  type C = { text: string; unsettling?: boolean };
  if (target === "students") {
    const base: C[] = [
      { text: "楽しそう！" },
      { text: "行きたい！" },
      { text: "今年の文化祭いい感じじゃん" },
    ];
    if (hasUnsettling) {
      const comment: C = area === "dance"
        ? { text: "先生これ載せていいの？笑", unsettling: true }
        : { text: "背景に映ってる子って誰？", unsettling: true };
      base.splice(2, 0, comment);
    }
    return base;
  } else {
    const base: C[] = [
      { text: "準備頑張っていますね" },
      { text: "当日が楽しみです" },
      { text: "生徒さんたちの雰囲気が良いですね" },
    ];
    if (hasUnsettling) {
      base.splice(1, 0, { text: "背景に映ってる子って誰？", unsettling: true });
    }
    return base;
  }
}

// ─── 投稿結果計算 ────────────────────────────────────────────────────

export function computeDay2Outcome(area: string, value: string, _target: string) {
  let followerGain = 68; // 32 + 68 = 100（最低保証）
  let trustGain    = 5;
  let attentionGain = 5;
  let flameRiskGain = 2;

  if (value === "popularity") {
    followerGain  += 12;
    trustGain     -= 2;
    attentionGain += 4;
  } else if (value === "trust") {
    trustGain     += 8;
    attentionGain -= 2;
  } else if (value === "attention") {
    followerGain  += 8;
    attentionGain += 12;
    flameRiskGain += 8;
  }

  if (area === "dance") {
    flameRiskGain += 3;
  }

  const newFollowers = 32 + followerGain;
  const newRank = value === "popularity" || value === "attention" ? 6 : 7;

  return { followerGain, newFollowers, trustGain, attentionGain, flameRiskGain, newRank };
}
