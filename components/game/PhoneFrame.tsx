"use client";

// ─────────────────────────────────────────────────────────────────────────────
// PhoneFrame
// スマホ縦持ちレイアウトのラッパー。
// PC では中央寄せのフォン枠、スマホでは全画面表示。
// Day1〜Day7 のすべての画面を包む最外層コンポーネント。
// ─────────────────────────────────────────────────────────────────────────────

export default function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .game-fade-up {
          animation: fadeUp 0.28s ease forwards;
        }
      `}</style>

      {/* 外側背景（PC 表示時のみ見える） */}
      <div className="min-h-screen bg-zinc-300 flex items-start justify-center">

        {/* フォン本体 */}
        <div
          className="
            w-full bg-white flex flex-col
            min-h-screen
            md:max-w-[390px] md:min-h-0 md:my-8
            md:rounded-[40px] md:overflow-hidden
            md:shadow-[0_24px_80px_rgba(0,0,0,0.25)]
          "
        >
          {children}
        </div>

      </div>
    </>
  );
}
