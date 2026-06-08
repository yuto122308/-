"use client";

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="ja">
      <body>
        <div style={{ padding: "2rem", textAlign: "center" }}>
          <p>エラーが発生しました。</p>
          <button onClick={reset}>もう一度試す</button>
        </div>
      </body>
    </html>
  );
}
