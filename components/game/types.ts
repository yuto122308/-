// ─────────────────────────────────────────────────────────────────────────────
// 通知99+ 共有型定義
// Day1〜Day7 を通じて使われる型をここに集約する。
// ─────────────────────────────────────────────────────────────────────────────

// ── 画面モード ─────────────────────────────────────────────────────────────
// 学校側とスマホ側を明確に分けた 2 軸構造。
// "school-*" が現実世界、"phone-*" がデジタル世界。
export type SchoolScreen =
  | "school-home"    // 学校ホーム（行き先選択）
  | "school-area";   // 取材エリアイベント（ノベル風）

export type PhoneScreen =
  | "phone-home"     // スマホホーム（SNS / LINE 選択）
  | "phone-sns"      // SNS投稿一覧
  | "phone-comments" // コメント詳細
  | "phone-line"     // LINEトーク一覧
  | "phone-chat";    // 個別トーク

export type GameScreen = SchoolScreen | PhoneScreen | "end";

// ── SNS投稿 ───────────────────────────────────────────────────────────────
export type Post = {
  id:          string;
  imgEmoji:    string;
  body:        string;
  likes:       number;
  comments:    Comment[];
  postedAt:    string;
};

export type Comment = {
  user:   string;
  avatar: string;
  text:   string;
};

// ── LINEトーク ────────────────────────────────────────────────────────────
export type LineThread = {
  id:       string;
  name:     string;
  avatar:   string;
  messages: string[];
};

// ── 取材エリアイベント ────────────────────────────────────────────────────
// 各 Day・各エリアで再利用できる汎用イベント型。
export type AreaEvent = {
  areaId:    string;
  areaLabel: string;
  areaEmoji: string;
  // ノベル風セリフシーケンス
  lines:     { speaker: string | null; text: string }[];
  // 投稿テーマ選択
  question:  string;
  choices:   { id: string; label: string; desc: string }[];
  // 選択後の投稿生成関数
  makePost:  (choice: string) => Post;
  // 投稿完了時の通知増加数
  notifGain: number;
};

// ── 今日の目標チェックリスト ──────────────────────────────────────────────
export type DailyGoal = {
  label: string;
  done:  boolean;
};

// ── 行き先定義（学校ホームに表示するナビゲーション項目） ─────────────────
export type Destination = {
  id:       string;
  emoji:    string;
  label:    string;
  sublabel: string;
  disabled: boolean;
  done:     boolean;        // 完了済みフラグ（グレーアウト用）
  isPhone:  boolean;        // スマホボタンかどうか（バッジ表示制御用）
};
