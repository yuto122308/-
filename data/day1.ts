export type Screen =
  | "title"
  | "scene_set"
  | "notify_intro"
  | "prologue"
  // ── プレイヤー自身のプロフィール ──
  | "player_create"
  | "player_q1"
  | "player_q2"
  | "player_q3"
  | "player_result"
  // ── OP / 自由探索 ──
  | "op2_teacher"
  | "op2_ranking"
  | "op2_reaction"
  | "op2_sns"
  | "op2_goal"
  | "classroom"
  | "line_chat"
  | "shop"
  | "decoration"
  // ── SNS広報担当〜アカウント設定 ──
  | "contest_announcement"
  | "role_decision"
  | "account_handover"
  | "festival_account_setup"
  // ── Day2 ──
  | "day2_start"
  | "day2_comments"
  | "day2_line"
  | "day2_mission"
  | "day2_classroom"
  | "day2_interview"
  | "day2_post"
  | "day2_post_waiting"
  | "day2_post_result"
  | "day2_rank_event"
  | "day2_line2"
  | "day2_rivals"
  | "day2_end"
  // ── Day3 ──
  | "day3_morning"
  | "day3_ranking"
  | "day3_meetup_intro"
  | "day3_meetup"
  | "day3_meetup_reflect"
  | "day3_classroom"
  | "day3_interview"
  | "day3_post"
  | "day3_post_waiting"
  | "day3_post_result"
  | "day3_result"
  | "day3_end"
  // ── Day4 ──
  | "day4_home"
  // ── 投稿 ──
  | "first_post"
  | "post_result"
  | "day1_end";

// ─── プレイヤー（高校生としての自分） ────────────────────────────────

export interface PlayerProfile {
  name: string;
  nickname: string;
  icon: string;
  comment: string;
  // アンケート raw
  festivalInterest: string;
  snsDistance: string;
  motivation: string;
  // 派生ラベル（Day2-7 で利用）
  festivalLabel: string;
  snsLabel: string;
  motivationLabel: string;
}

// ─── 文化祭公式アカウント ─────────────────────────────────────────────

export interface FestivalAccount {
  accountName: string;
  profileText: string;
  icon: string;        // 絵文字プレースホルダー
  followers: number;
  posts: number;
  points: number;
}

// ─── ゲーム全体の状態 ────────────────────────────────────────────────

export interface GameState {
  screen: Screen;
  playerProfile: PlayerProfile | null;
  festivalAccount: FestivalAccount | null;
  visitedAreas: Set<string>;
  collectedMaterials: string[];
  selectedMaterial: string | null;
  selectedCaption: string | null;
  likes: number;
  // ── Day2以降の共有ステータス ──
  trust: number;
  attention: number;
  rank: number;
  flameRisk: number;          // 非表示
  day2Area: string | null;
  day2Angle: string | null;
  // ── Day3 ──
  day3MeetupIndex: number;
  day3Area: string | null;
  day3PostTheme: string | null;
  // ── Day4 ──
  day4FollowerGain: number;
}

// ─── アイコン選択肢 ───────────────────────────────────────────────────

export const PLAYER_ICONS   = ["📸", "🎨", "🍟", "🎵", "🎭", "📚", "⭐", "🙂"];
export const FESTIVAL_ICONS = ["🏫", "🎪", "🎉", "🌟"];

// ─── プレイヤーアンケート ─────────────────────────────────────────────

export const PLAYER_QUESTIONS = [
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
    text: "SNSとの距離感は？",
    options: [
      { value: "post_often", label: "よく投稿する" },
      { value: "post_some",  label: "時々投稿する" },
      { value: "view_only",  label: "ほとんど見るだけ" },
    ],
  },
  {
    id: "q3",
    text: "文化祭への熱量は？",
    options: [
      { value: "high",   label: "めちゃくちゃ楽しみ" },
      { value: "mid",    label: "まあ楽しみ" },
      { value: "normal", label: "普通" },
      { value: "low",    label: "面倒くさい" },
    ],
  },
] as const;

// ─── 文化祭アカウント設定選択肢 ──────────────────────────────────────

export const ACCOUNT_NAME_OPTIONS = [
  "1年3組文化祭",
  "1-3 Festival",
  "Festival_13",
];

export const ACCOUNT_PROFILE_OPTIONS = [
  "文化祭まであと7日！",
  "1年3組公式アカウントです！",
  "今年は上位を目指します！",
];

// ─── ラベル変換 ───────────────────────────────────────────────────────

const FESTIVAL_LABEL_MAP: Record<string, string> = {
  together: "盛り上がり重視型",
  plan:     "企画派",
  sns:      "SNS広報型",
  memory:   "思い出重視型",
  none:     "クールな傍観者",
};

const SNS_LABEL_MAP: Record<string, string> = {
  post_often: "発信タイプ",
  post_some:  "バランス型",
  view_only:  "閲覧中心",
};

const MOTIVATION_LABEL_MAP: Record<string, string> = {
  high:   "高め",
  mid:    "まあまあ",
  normal: "普通",
  low:    "低め",
};

export function buildPlayerProfile(
  base: { name: string; nickname: string; icon: string; comment: string },
  answers: { q1: string; q2: string; q3: string }
): PlayerProfile {
  return {
    name:     base.name     || "名無し",
    nickname: base.nickname || base.name || "名無し",
    icon:     base.icon     || "🙂",
    comment:  base.comment  || "",
    festivalInterest: answers.q1,
    snsDistance:      answers.q2,
    motivation:       answers.q3,
    festivalLabel:   FESTIVAL_LABEL_MAP[answers.q1]  ?? "—",
    snsLabel:        SNS_LABEL_MAP[answers.q2]        ?? "—",
    motivationLabel: MOTIVATION_LABEL_MAP[answers.q3] ?? "—",
  };
}

// ─── ゲームデータ定数 ─────────────────────────────────────────────────

export const NOTIFY_INTRO = [
  { id: "n1", app: "1年3組 文化祭", sender: "委員長",      text: "文化祭まであと7日！" },
  { id: "n2", app: "LINE",          sender: "親友",         text: "去年8位だったらしい" },
  { id: "n3", app: "LINE",          sender: "ムードメーカー", text: "今年は勝つぞ笑" },
];

export const PROLOGUE_LINES = [
  "あなたは高校1年生。",
  "来週、学校最大のイベントである文化祭が開催される。",
  "クラスでは模擬店や装飾の準備が進んでいる。",
  "去年の文化祭は楽しかった。\nでも、SNS広報ランキングでは8位だった。",
  "そして今年。\n新しく「SNS広報コンテスト」が始まる。",
  "SNSで文化祭を最も盛り上げたクラスが表彰される。",
  "まだこの時のあなたは知らない。\nこの7日間が、クラスを大きく変えることになることを。",
];

export const SNS_POSTS_A_CLASS = [
  { id: "a1", title: "A組文化祭PV",    description: "1週間の準備を30秒にまとめた動画", likes: 824, comments: 91 },
  { id: "a2", title: "ダンス部練習風景", description: "今年も全力で踊ります",           likes: 532, comments: 47 },
  { id: "a3", title: "先生インタビュー", description: "文化祭への想いを聞いてみた",       likes: 301, comments: 25 },
];

export const SNS_POSTS_OWN_CLASS = [
  { id: "o1", title: "文化祭まであと3日", description: "", likes: 21, comments: 2 },
  { id: "o2", title: "準備中",           description: "", likes: 15, comments: 1 },
  { id: "o3", title: "文化祭スタート",   description: "", likes: 34, comments: 3 },
];

export const LINE_MESSAGES = [
  { id: "l1", sender: "委員長",       text: "今日放課後、残れる人いますか？", type: "left" as const },
  { id: "l2", sender: "ムードメーカー", text: "眠すぎる",                    type: "left" as const },
  { id: "l3", sender: "親友",          text: "まだ装飾終わってないんだけど",   type: "left" as const },
  { id: "l4", sender: "クラスメイトA",  text: "去年、人あんまり来なかったよな", type: "left" as const },
  { id: "l5", sender: "ムードメーカー", text: "今年は勝とうぜ笑",             type: "left" as const },
  { id: "l6", sender: "親友",          text: "見る専門です",                  type: "left" as const },
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

export const INTERVIEW_MEMOS: Record<string, { emoji: string; text: string }> = {
  shop:       { emoji: "🍟", text: "チュロスの試作品ができた！\n焦げてるけど、みんな笑いながらやり直してた" },
  decoration: { emoji: "🎨", text: "巨大装飾、去年より本気で作ってる\nまだ完成には遠いけど気合いが違う" },
  line_chat:  { emoji: "💬", text: "クラスのみんな、実は文化祭を楽しみにしてる\nLINEで見えてなかった本音が見えた気がした" },
};

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
