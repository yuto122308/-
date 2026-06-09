"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PhoneHome
// スマホ側のホーム画面。
//
// 役割：
//   - SNS / LINE への入口を提供する
//   - 各アプリの未読件数をバッジで表示する
//   - 「学校へ戻る」ボタンで現実世界に引き戻す
//
// Day1 チュートリアルでは翔が
//   「通知来たらここで見れるぞ」「クラスの連絡はこっちな」
// と自然にガイドする想定。
// そのセリフは tutorialBanner スロットに差し込む。
// ─────────────────────────────────────────────────────────────────────────────

type Props = {
  unreadSns:     number;  // SNS の未読投稿数（バッジ）
  unreadLine:    number;  // LINE の未読スレッド数（バッジ）
  snsPostCount:  number;  // 投稿総数（サブラベル表示用）
  lineCount:     number;  // トーク数（サブラベル表示用）
  onSns:         () => void;
  onLine:        () => void;
  onSchool:      () => void;
  // チュートリアルセリフ差し込みスロット
  tutorialBanner?: React.ReactNode;
};

export default function PhoneHome({
  unreadSns,
  unreadLine,
  snsPostCount,
  lineCount,
  onSns,
  onLine,
  onSchool,
  tutorialBanner,
}: Props) {
  return (
    <div className="flex flex-col min-h-full bg-white">

      {/* ヘッダー */}
      <div className="px-5 pt-6 pb-4 border-b border-gray-100">
        <div className="text-xs text-gray-400 tracking-widest uppercase mb-1">Phone</div>
        <h1 className="text-xl font-black text-gray-900">スマホ</h1>
      </div>

      {/* チュートリアルバナー（Day1 用） */}
      {tutorialBanner && (
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
          {tutorialBanner}
        </div>
      )}

      {/* アプリ一覧 */}
      <div className="px-5 py-5 flex-1 space-y-2.5">

        {/* SNS */}
        <AppButton
          emoji="📷"
          label="SNS"
          sublabel={snsPostCount > 0 ? `投稿 ${snsPostCount}件` : "投稿はまだありません"}
          badge={unreadSns}
          onClick={onSns}
        />

        {/* LINE */}
        <AppButton
          customIcon={
            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              L
            </div>
          }
          label="LINE"
          sublabel={lineCount > 0 ? `${lineCount}件のトーク` : "メッセージなし"}
          badge={unreadLine}
          onClick={onLine}
        />

        {/* 区切り */}
        <div className="pt-2" />

        {/* 学校へ戻る */}
        <button
          onClick={onSchool}
          className="w-full flex items-center gap-4 bg-gray-50 border-2 border-gray-100 rounded-2xl px-4 py-4
                     text-left hover:bg-gray-100 active:bg-gray-200 transition-all"
        >
          <span className="text-2xl">🏫</span>
          <div className="flex-1">
            <div className="text-sm font-semibold text-gray-600">学校へ戻る</div>
            <div className="text-xs text-gray-400 mt-0.5">現実世界</div>
          </div>
          <span className="text-gray-300 text-lg flex-shrink-0">›</span>
        </button>

      </div>
    </div>
  );
}

// ─── アプリボタン ─────────────────────────────────────────────────────────────

function AppButton({
  emoji,
  customIcon,
  label,
  sublabel,
  badge,
  onClick,
}: {
  emoji?:      string;
  customIcon?: React.ReactNode;
  label:       string;
  sublabel:    string;
  badge:       number;
  onClick:     () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-4 bg-white border-2 border-gray-200 rounded-2xl px-4 py-4
                 text-left hover:border-gray-400 active:bg-gray-50 transition-all"
    >
      {customIcon ?? <span className="text-2xl">{emoji}</span>}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-800">{label}</div>
        <div className="text-xs text-gray-400 mt-0.5">{sublabel}</div>
      </div>
      {badge > 0 ? (
        <span className="bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0">
          {badge > 9 ? "9+" : badge}
        </span>
      ) : (
        <span className="text-gray-300 text-lg flex-shrink-0">›</span>
      )}
    </button>
  );
}
