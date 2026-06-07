export type Screen =
  | "title"
  | "op1_line"       // OPシーン1: LINE通知
  | "op2_teacher"    // OPシーン2: 担任の話
  | "op2_ranking"    // OPシーン2: 去年の順位発表（アニメーション）
  | "op2_reaction"   // OPシーン2: クラスメイトの反応
  | "op2_goal"       // OPシーン2: 目的表示
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

export interface GameState {
  screen: Screen;
  visitedAreas: Set<string>;
  collectedMaterials: string[];
  selectedMaterial: string | null;
  selectedCaption: string | null;
  followers: number;
  prPoints: number;
  classExpectation: number;
  likes: number;
}

export const OP1_MESSAGES = [
  { id: "m1", sender: "委員長", text: "去年の結果見た？" },
  { id: "m2", sender: "親友", text: "8位かー" },
  { id: "m3", sender: "ムードメーカー", text: "今年こそ勝ちたい笑" },
];

export const SNS_POSTS_A_CLASS = [
  {
    id: "a1",
    title: "A組文化祭PV",
    description: "1週間の準備を30秒にまとめた動画",
    likes: 824,
    comments: 91,
  },
  {
    id: "a2",
    title: "ダンス部練習風景",
    description: "今年も全力で踊ります",
    likes: 532,
    comments: 47,
  },
  {
    id: "a3",
    title: "先生インタビュー",
    description: "文化祭への想いを聞いてみた",
    likes: 301,
    comments: 25,
  },
];

export const SNS_POSTS_OWN_CLASS = [
  { id: "o1", title: "文化祭まであと3日", description: "", likes: 21, comments: 2 },
  { id: "o2", title: "準備中", description: "", likes: 15, comments: 1 },
  { id: "o3", title: "文化祭スタート", description: "", likes: 34, comments: 3 },
];

export const LINE_MESSAGES = [
  { id: "l1", sender: "委員長", text: "今日放課後、残れる人いますか？", type: "left" as const },
  { id: "l2", sender: "ムードメーカー", text: "眠すぎる", type: "left" as const },
  { id: "l3", sender: "親友", text: "まだ装飾終わってないんだけど", type: "left" as const },
  { id: "l4", sender: "クラスメイトA", text: "去年、人あんまり来なかったよな", type: "left" as const },
  { id: "l5", sender: "ムードメーカー", text: "今年は勝とうぜ笑", type: "left" as const },
  { id: "l6", sender: "親友", text: "見る専門です", type: "left" as const },
];

export const CAPTIONS = [
  "文化祭準備、始まりました！",
  "今年こそ上位を目指します！",
  "まだ何も完成してないけど頑張ります笑",
];

export const LIKES_SEQUENCE = [1, 4, 9, 17, 28];

export const POST_REACTIONS = [
  { sender: "親友", text: "見た" },
  { sender: "委員長", text: "ちゃんとしてる！" },
  { sender: "ムードメーカー", text: "いいじゃん笑" },
  { sender: "クラスメイト", text: "明日から頼むわ" },
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
  { sender: "親友", text: "頑張ったのにな" },
  { sender: "クラスメイト", text: "全然人来なかったよな" },
  { sender: "ムードメーカー", text: "今年は上狙いたい" },
];
