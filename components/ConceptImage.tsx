/**
 * 原案画像（3列×2行スプライト）から各パネルを切り出して表示するコンポーネント
 *
 * パネル配置：
 *   ① 教室背景         ② 模擬店準備スペース  ③ 装飾班スペース
 *   ④ 投稿素材・教室   ⑤ 投稿素材・模擬店   ⑥ 投稿素材・装飾
 */

export type PanelId =
  | "classroom_bg"    // ① 教室背景
  | "shop_bg"         // ② 模擬店準備スペース
  | "decoration_bg"   // ③ 装飾班スペース
  | "post_classroom"  // ④ 投稿素材・教室の様子
  | "post_shop"       // ⑤ 投稿素材・模擬店試作品
  | "post_decoration"; // ⑥ 投稿素材・装飾制作風景

// background-position for background-size: 300% 200%
const PANEL_POSITIONS: Record<PanelId, string> = {
  classroom_bg:    "0% 0%",
  shop_bg:         "50% 0%",
  decoration_bg:   "100% 0%",
  post_classroom:  "0% 100%",
  post_shop:       "50% 100%",
  post_decoration: "100% 100%",
};

interface ConceptImageProps {
  panel: PanelId;
  className?: string;
  label?: string;
}

export default function ConceptImage({ panel, className = "", label }: ConceptImageProps) {
  const pos = PANEL_POSITIONS[panel];
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{
        backgroundImage: "url('/images/concept.png')",
        backgroundSize: "300% 200%",
        backgroundPosition: pos,
        backgroundRepeat: "no-repeat",
      }}
    >
      {label && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 text-white text-xs px-2 py-1 text-center">
          {label}
        </div>
      )}
    </div>
  );
}
