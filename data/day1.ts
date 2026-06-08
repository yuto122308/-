export type Screen =
  | "title"
  | "scene_set"        // 場面設定カード
  | "notify_intro"     // スマホ通知演出
  | "prologue"         // 世界観プロローグ
  | "profile_create"   // アカウント作成（名前・アイコン）
  | "profile_q1"
  | "profile_q2"
  | "profile_q3"
  | "profile_q4"
  | "profile_result"   // プロフィール完成カード
  | "op2_teacher"
  | "op2_ranking"
  | "op2_reaction"
  | "op2_goal"
  | "classroom"
  | "sns"
  | "line_chat"
  | "shop"
  | "decoration"
  | "contest_announcement"
  | "role_decision"
  | "account_check"
  | "first_post"
  | "post_result"
  | "day1_end";

export interface PlayerProfile {
  // アカウント作成
  name: string;
  nickname: string;
  comment: string;
  icon: string;
  // アンケート（raw値）
  festivalInterest: string;
  snsInterest: string;
  snsUsage: string;
  motivation: string;
  // 派生ラベル（Day2-7で利用）
  festivalLabel: string;
  snsLabel: string;
  motivationLabel: string;
}

export interface GameState {
  screen: Screen;
  playerProfile: PlayerProfile | null;
  visitedAreas: Set<string>;
  collectedMaterials: string[];
  selectedMaterial: string | null;
  selectedCaption: string | null;
  followers: number;
  prPoints: number;
  classExpectation: number;
  likes: number;
}

// ─── アイコン選択肢 ────────────────────────────────────────────────

export const ICON_OPTIONS = ["📸", "🎨", "🍟", "🎵", "🎭", "📚", "⭐", "🙂"];

// ─── アンケート質問 ────────────────────────────────────────────────

export const SURVEY_QUESTIONS = [
  {
    id: "q1",
    text: "文化祭で一番気になるのは？",
    options: [
      { value: "together", label: "みんなで盛り上がること" },
      { value: "plan",     label: "出し物や企画" },
      { value: "sns",      label: "SNSや広報" },
      { value: "memory",   label: "友達との思い出" },
      { value: "none",     label: "正直あまり興味ない" },
    ],
  },
  {
    id: "q2",
    text: "SNSでよく見るのは？",
    options: [
      { value: "funny",   label: "面白い投稿" },
      { value: "useful",  label: "役立つ情報" },
      { value: "friends", label: "友達の日常" },
      { value: "fandom",  label: "推しや趣味" },
      { value: "rarely",  label: "あまり見ない" },
    ],
  },
  {
    id: "q3",
    text: "SNSとの距離感は？",
    options: [
      { value: "post_often", label: "よく投稿する" },
      { value: "post_some",  label: "時々投稿する" },
      { value: "view_only",  label: "ほとんど見るだけ" },
    ],
  },
  {
    id: "q4",
    text: "文化祭への熱量は？",
    options: [
      { value: "high",   label: "めちゃくちゃ楽しみ" },
      { value: "mid",    label: "まあ楽しみ" },
      { value: "normal", label: "普通" },
      { value: "low",    label: "面倒くさい" },
    ],
  },
] as const;

// ─── ラベル変換 ────────────────────────────────────────────────────

const FESTIVAL_LABEL: Record<string, string> = {
  together: "盛り上がり重視型",
  plan:     "企画派",
  sns:      "SNS広報型",
  memory:   "思い出重視型",
  none:     "クールな傍観者",
};

const SNS_LABEL: Record<string, string> = {
  post_often: "発信タイプ",
  post_some:  "バランス型",
  view_only:  "閲覧中心",
};

const MOTIVATION_LABEL: Record<string, string> = {
  high:   "高め",
  mid:    "まあまあ",
  normal: "普通",
  low:    "低め",
};

export function buildProfile(
  base: { name: string; nickname: string; comment: string; icon: string },
  answers: { q1: string; q2: string; q3: string; q4: string }
): PlayerProfile {
  return {
    name:     base.name     || "名無し",
    nickname: base.nickname || base.name || "名無し",
    comment:  base.comment  || "",
    icon:     base.icon     || "🙂",
    festivalInterest: answers.q1,
    snsInterest:      answers.q2,
    snsUsage:         answers.q3,
    motivation:       answers.q4,
    festivalLabel:   FESTIVAL_LABEL[answers.q1]   ?? "—",
    snsLabel:        SNS_LABEL[answers.q3]         ?? "—",
    motivationLabel: MOTIVATION_LABEL[answers.q4]  ?? "—",
  };
}

// ─── ゲームデータ ──────────────────────────────────────────────────

// スマホ通知演出
export const NOTIFY_INTRO = [
  { id: "n1", app: "1年3組 文化祭", sender: "委員長",      text: "文化祭まであと7日！" },
  { id: "n2", app: "LINE",          sender: "親友",         text: "去年8位だったらしい" },
  { id: "n3", app: "LINE",          sender: "ムードメーカー", text: "今年は勝つぞ笑" },
];

// プロローグテキスト（段落ごと）
export const PROLOGUE_LINES = [
  "あなたは高校1年生。",
  "来週、学校最大のイベントである文化祭が開催される。",
  "クラスでは模擬店や装飾の準備が進んでいる。",
  "去年の文化祭は楽しかった。\nでも、SNS広報ランキングでは8位だった。",
  "そして今年。\n新しく「SNS広報コンテスト」が始まる。",
  "SNSで文化祭を最も盛り上げたクラスが表彰される。",
  "まだこの時のあなたは知らない。\nこの7日間が、クラスを大きく変えることになることを。",
];

export const OP1_MESSAGES = [
  { id: "m1", sender: "委員長",      text: "去年の結果見た？" },
  { id: "m2", sender: "親友",         text: "8位かー" },
  { id: "m3", sender: "ムードメーカー", text: "今年こそ勝ちたい笑" },
];

export const SNS_POSTS_A_CLASS = [
  { id: "a1", title: "A組文化祭PV",   description: "1週間の準備を30秒にまとめた動画", likes: 824, comments: 91 },
  { id: "a2", title: "ダンス部練習風景", description: "今年も全力で踊ります",           likes: 532, comments: 47 },
  { id: "a3", title: "先生インタビュー", description: "文化祭への想いを聞いてみた",       likes: 301, comments: 25 },
];

export const SNS_POSTS_OWN_CLASS = [
  { id: "o1", title: "文化祭まであと3日", description: "", likes: 21, comments: 2 },
  { id: "o2", title: "準備中",           description: "", likes: 15, comments: 1 },
  { id: "o3", title: "文化祭スタート",   description: "", likes: 34, comments: 3 },
];

export const LINE_MESSAGES = [
  { id: "l1", sender: "委員長",      text: "今日放課後、残れる人いますか？", type: "left" as const },
  { id: "l2", sender: "ムードメーカー", text: "眠すぎる",                   type: "left" as const },
  { id: "l3", sender: "親友",         text: "まだ装飾終わってないんだけど",   type: "left" as const },
  { id: "l4", sender: "クラスメイトA", text: "去年、人あんまり来なかったよな", type: "left" as const },
  { id: "l5", sender: "ムードメーカー", text: "今年は勝とうぜ笑",            type: "left" as const },
  { id: "l6", sender: "親友",         text: "見る専門です",                  type: "left" as const },
];

export const CAPTIONS = [
  "文化祭準備、始まりました！",
  "今年こそ上位を目指します！",
  "まだ何も完成してないけど頑張ります笑",
];

export const LIKES_SEQUENCE = [1, 4, 9, 17, 28];

export const POST_REACTIONS = [
  { sender: "親友",        text: "見た" },
  { sender: "委員長",      text: "ちゃんとしてる！" },
  { sender: "ムードメーカー", text: "いいじゃん笑" },
  { sender: "クラスメイト",  text: "明日から頼むわ" },
];

export const ROLE_CHOICES = [
  { id: "a", text: "やってみる" },
  { id: "b", text: "不安だけどやる" },
  { id: "c", text: "まあ、やるか" },
];

export const LAST_YEAR_RANKING = [
  { rank: 1, name: "A組" },
  { rank: 2, name: "C組" },
  { rank: 3, name: "D組" },
  { rank: 4, name: "F組" },
  { rank: 5, name: "B組" },
  { rank: 6, name: "G組" },
  { rank: 7, name: "E組" },
  { rank: 8, name: "自分たちのクラス", isOwn: true },
];

export const OP2_REACTIONS = [
  { sender: "親友",        text: "頑張ったのにな" },
  { sender: "クラスメイト",  text: "全然人来なかったよな" },
  { sender: "ムードメーカー", text: "今年は上狙いたい" },
];
