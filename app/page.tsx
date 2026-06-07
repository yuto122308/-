"use client";

import { useState, useEffect, useCallback } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import SnsPostCard from "@/components/SnsPostCard";
import LineChat from "@/components/LineChat";
import ChoiceButton from "@/components/ChoiceButton";
import StatusBar from "@/components/StatusBar";
import ConceptImage from "@/components/ConceptImage";
import {
  Screen,
  GameState,
  OP1_MESSAGES,
  SNS_POSTS_A_CLASS,
  SNS_POSTS_OWN_CLASS,
  LINE_MESSAGES,
  CAPTIONS,
  LIKES_SEQUENCE,
  POST_REACTIONS,
  ROLE_CHOICES,
  LAST_YEAR_RANKING,
  OP2_REACTIONS,
} from "@/data/day1";

const INITIAL_STATE: GameState = {
  screen: "title",
  visitedAreas: new Set(),
  collectedMaterials: ["教室の様子"],
  selectedMaterial: null,
  selectedCaption: null,
  followers: 12,
  prPoints: 0,
  classExpectation: 0,
  likes: 0,
};

// ─── OP1: LINEグループ通知画面 ──────────────────────────────────────

function Op1LineScreen({ onNext }: { onNext: () => void }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible < OP1_MESSAGES.length) {
      const t = setTimeout(() => setVisible((n) => n + 1), 800);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const done = visible >= OP1_MESSAGES.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      {/* LINEヘッダー */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0">
          <span className="text-white text-xs font-bold">L</span>
        </div>
        <span className="text-sm font-semibold text-gray-800">クラスLINEグループ</span>
        <span className="ml-auto text-xs text-gray-400">今日</span>
      </div>

      <div className="flex-1 px-4 py-6 space-y-3">
        {OP1_MESSAGES.slice(0, visible).map((msg) => (
          <div key={msg.id} className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">
              {msg.sender.charAt(0)}
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">{msg.sender}</div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
                {msg.text}
              </div>
            </div>
          </div>
        ))}

        {done && (
          <div className="pt-4">
            <div className="bg-gray-800/80 rounded-xl px-4 py-3 text-center mx-4">
              <p className="text-sm text-white/90 leading-relaxed">
                「もう文化祭まで1週間か……」
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-6">
        <ChoiceButton onClick={onNext} disabled={!done}>
          教室へ
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── OP2: 担任の話 ──────────────────────────────────────────────────

function Op2TeacherScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-6 py-10">
      <div className="flex-1 flex flex-col justify-center">
        <ConceptImage panel="classroom_bg" className="w-full h-40 rounded-xl mb-6" />

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-4">
          <div className="text-xs text-gray-400 mb-3">担任</div>
          <p className="text-sm text-gray-800 leading-relaxed mb-3">
            「文化祭まであと7日です。」
          </p>
          <p className="text-sm text-gray-800 leading-relaxed">
            「まず去年の結果を振り返りましょう。」
          </p>
        </div>
      </div>

      <ChoiceButton onClick={onNext}>次へ</ChoiceButton>
    </div>
  );
}

// ─── OP2: 順位発表（順番に表示） ────────────────────────────────────

function Op2RankingScreen({ onNext }: { onNext: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const [showOwn, setShowOwn] = useState(false);

  useEffect(() => {
    if (revealed < LAST_YEAR_RANKING.length - 1) {
      const t = setTimeout(() => setRevealed((n) => n + 1), 450);
      return () => clearTimeout(t);
    } else if (revealed === LAST_YEAR_RANKING.length - 1) {
      const t = setTimeout(() => setShowOwn(true), 700);
      return () => clearTimeout(t);
    }
  }, [revealed]);

  const done = showOwn;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-6 py-8">
      <div className="flex-1">
        <div className="text-xs text-gray-400 tracking-widest mb-1 uppercase">Last Year</div>
        <h2 className="text-lg font-bold text-gray-900 mb-5">SNS広報ランキング</h2>

        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
          {LAST_YEAR_RANKING.slice(0, revealed).map((item) => (
            <div
              key={item.rank}
              className="flex items-center px-4 py-2.5 border-b border-gray-100 last:border-b-0"
            >
              <span
                className={`w-8 text-sm font-bold ${
                  item.rank === 1 ? "text-yellow-500" : item.rank <= 3 ? "text-amber-600" : "text-gray-400"
                }`}
              >
                {item.rank}位
              </span>
              <span className="text-sm text-gray-700 ml-2">{item.name}</span>
            </div>
          ))}

          {showOwn && (
            <div className="flex items-center px-4 py-3 bg-gray-900 border-b border-gray-100 last:border-b-0">
              <span className="w-8 text-sm font-bold text-gray-300">8位</span>
              <span className="text-sm font-bold text-white ml-2">自分たちのクラス</span>
              <span className="ml-auto text-xs text-gray-400 border border-gray-600 rounded px-1.5 py-0.5">
                自分たち
              </span>
            </div>
          )}
        </div>
      </div>

      <ChoiceButton onClick={onNext} disabled={!done}>
        {done ? "次へ" : "……"}
      </ChoiceButton>
    </div>
  );
}

// ─── OP2: クラスメイトの反応 ────────────────────────────────────────

function Op2ReactionScreen({ onNext }: { onNext: () => void }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible < OP2_REACTIONS.length) {
      const t = setTimeout(() => setVisible((n) => n + 1), 700);
      return () => clearTimeout(t);
    }
  }, [visible]);

  const done = visible >= OP2_REACTIONS.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-5 py-3">
        <span className="text-sm font-semibold text-gray-800">クラスの反応</span>
      </div>

      <div className="flex-1 px-4 py-5 space-y-3">
        {OP2_REACTIONS.slice(0, visible).map((r, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">
              {r.sender.charAt(0)}
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">{r.sender}</div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
                {r.text}
              </div>
            </div>
          </div>
        ))}

        {done && (
          <div className="pt-4 mx-2">
            <div className="bg-gray-800/80 rounded-xl px-4 py-3 text-center">
              <p className="text-sm text-white/90 leading-relaxed">
                「同じ文化祭なのに、どうしてこんな差がついたんだろう」
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-6">
        <ChoiceButton onClick={onNext} disabled={!done}>
          次へ
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── OP2: 目的表示 ──────────────────────────────────────────────────

function Op2GoalScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-6 py-10">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-xs text-gray-400 tracking-widest mb-6 uppercase">Mission</div>

        <div className="border-l-2 border-gray-900 pl-5 mb-8">
          <div className="text-xs text-gray-500 mb-1">目的</div>
          <p className="text-xl font-bold text-gray-900 leading-snug">
            去年の文化祭を<br />調べてみよう
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 border border-gray-100 space-y-2">
          <p className="text-sm text-gray-700">
            上位クラスは何が違ったのか。
          </p>
          <p className="text-sm text-gray-700">
            今年変えるために、まず知るところから始めよう。
          </p>
        </div>
      </div>

      <ChoiceButton onClick={onNext}>探索を始める</ChoiceButton>
    </div>
  );
}

// ─── タイトル画面 ────────────────────────────────────────────────────

function TitleScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-28px)] px-8 py-16 bg-white">
      <div className="text-center flex-1 flex flex-col items-center justify-center">
        <div className="mb-2 text-xs tracking-[0.3em] text-gray-400 uppercase">Day 1</div>
        <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-1">通知</h1>
        <h1 className="text-5xl font-black tracking-tight text-red-500 mb-6">99+</h1>
        <p className="text-sm text-gray-500 leading-relaxed">
          文化祭SNS広報責任者の7日間
        </p>
      </div>
      <div className="w-full">
        <ChoiceButton onClick={onNext}>はじめる</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 教室ホーム ──────────────────────────────────────────────────────

function ClassroomScreen({
  state,
  onNavigate,
  onContinue,
}: {
  state: GameState;
  onNavigate: (area: string, screen: Screen) => void;
  onContinue: () => void;
}) {
  const visited = state.visitedAreas;
  const canContinue = visited.size >= 2;

  const areas: { label: string; key: string; screen: Screen; desc: string }[] = [
    { label: "SNSを見る", key: "sns", screen: "sns", desc: "去年1位のA組は何を投稿した？" },
    { label: "クラスLINEを見る", key: "line", screen: "line_chat", desc: "みんなは何を考えてる？" },
    { label: "模擬店を見る", key: "shop", screen: "shop", desc: "準備の雰囲気は去年と違う？" },
    { label: "装飾班を見る", key: "decoration", screen: "decoration", desc: "今年の本気度は？" },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <ConceptImage panel="classroom_bg" className="w-full h-32" />

      <div className="px-5 py-4 border-b border-gray-100">
        <div className="text-xs text-gray-400 mb-1">現在地</div>
        <h2 className="text-lg font-bold text-gray-900">教室</h2>
        <p className="text-xs text-gray-500 mt-1">去年との差を探してみよう</p>
      </div>

      <div className="flex-1 px-5 py-4 space-y-2">
        {areas.map((area) => (
          <button
            key={area.key}
            onClick={() => onNavigate(area.key, area.screen)}
            className="w-full flex items-center justify-between bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-left hover:border-gray-400 transition-colors active:scale-[0.98]"
          >
            <div>
              <div className="text-sm font-medium text-gray-800">{area.label}</div>
              <div className="text-xs text-gray-400 mt-0.5">{area.desc}</div>
            </div>
            <div className="flex items-center gap-2">
              {visited.has(area.key) && (
                <span className="text-xs text-green-600 bg-green-50 rounded-full px-2 py-0.5">
                  確認済
                </span>
              )}
              <span className="text-gray-300 text-lg">›</span>
            </div>
          </button>
        ))}
      </div>

      {canContinue ? (
        <div className="px-5 pb-6">
          <div className="text-xs text-gray-400 text-center mb-3">
            {visited.size}か所確認しました
          </div>
          <ChoiceButton onClick={onContinue}>教室で続きを見る</ChoiceButton>
        </div>
      ) : (
        <div className="px-5 pb-6 text-center text-xs text-gray-400">
          あと{2 - visited.size}か所見てみよう
        </div>
      )}
    </div>
  );
}

// ─── SNS画面 ────────────────────────────────────────────────────────

function SnsScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-50">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="text-gray-500 text-sm">← 戻る</button>
        <span className="text-sm font-semibold text-gray-800">SNSを見る</span>
      </div>

      <div className="flex-1 px-4 py-4">
        {/* 動機テキスト */}
        <div className="bg-gray-800/80 rounded-xl px-4 py-3 mb-5 text-center">
          <p className="text-sm text-white/90 leading-relaxed">
            「去年1位のA組は、何を投稿していたんだろう」
          </p>
        </div>

        {/* A組 */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">A</div>
            <div>
              <div className="text-sm font-semibold text-gray-900">A組 公式アカウント</div>
              <div className="text-xs text-gray-400">去年 優勝</div>
            </div>
            <div className="ml-auto text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">1位</div>
          </div>
          {SNS_POSTS_A_CLASS.map((post) => (
            <SnsPostCard key={post.id} title={post.title} description={post.description} likes={post.likes} comments={post.comments} />
          ))}
        </div>

        {/* 自クラス */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">自</div>
            <div>
              <div className="text-sm font-semibold text-gray-700">自分たちのクラス</div>
              <div className="text-xs text-gray-400">去年 8位</div>
            </div>
          </div>
          {SNS_POSTS_OWN_CLASS.map((post) => (
            <SnsPostCard key={post.id} title={post.title} description={post.description} likes={post.likes} comments={post.comments} isOwn />
          ))}
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-700 leading-relaxed text-center italic">
            「同じ文化祭でも、見せ方でこんなに違うんだ……」
          </p>
        </div>
      </div>

      <div className="px-5 pb-6">
        <ChoiceButton onClick={onBack} variant="secondary">教室に戻る</ChoiceButton>
      </div>
    </div>
  );
}

// ─── クラスLINE画面 ─────────────────────────────────────────────────

function LineChatScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="text-gray-500 text-sm">← 戻る</button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">L</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">クラスLINEグループ</span>
        </div>
      </div>

      <div className="flex-1 py-4">
        <LineChat messages={LINE_MESSAGES} />
      </div>

      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-xs text-gray-400">
          メッセージを入力…
        </div>
        <button className="text-gray-400 text-sm">送信</button>
      </div>

      <div className="px-5 pb-6 bg-white">
        <ChoiceButton onClick={onBack} variant="secondary">教室に戻る</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 模擬店画面 ─────────────────────────────────────────────────────

function ShopScreen({ onBack, alreadyCollected }: { onBack: () => void; alreadyCollected: boolean }) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="text-gray-500 text-sm">← 戻る</button>
        <span className="text-sm font-semibold text-gray-800">模擬店</span>
      </div>

      <ConceptImage panel="shop_bg" className="w-full h-36" />

      <div className="flex-1 px-5 py-5">
        <div className="text-xs text-gray-400 mb-1">場所</div>
        <h3 className="text-base font-bold text-gray-900 mb-4">模擬店準備スペース</h3>

        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">試作品のチュロスが少し焦げている。</p>
          <p className="text-sm text-gray-700 leading-relaxed mt-2">でも、みんな笑いながらもう一度作り直している。</p>
        </div>

        <div className={`rounded-xl border-2 p-4 mb-5 ${alreadyCollected ? "border-green-200 bg-green-50" : "border-dashed border-gray-300 bg-gray-50"}`}>
          <div className="text-xs font-semibold tracking-wider text-gray-400 mb-2 uppercase">
            {alreadyCollected ? "✓ 素材を獲得しました" : "素材を獲得しました"}
          </div>
          <ConceptImage panel="post_shop" className="w-full h-28 rounded-lg mb-2" label="模擬店の試作品" />
          <div className="text-xs text-gray-500 text-center">模擬店の試作品</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 italic text-center">「失敗してるけど、なんか楽しそうだ。」</p>
        </div>
      </div>

      <div className="px-5 pb-6">
        <ChoiceButton onClick={onBack} variant="secondary">教室に戻る</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 装飾班画面 ─────────────────────────────────────────────────────

function DecorationScreen({ onBack, alreadyCollected }: { onBack: () => void; alreadyCollected: boolean }) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="text-gray-500 text-sm">← 戻る</button>
        <span className="text-sm font-semibold text-gray-800">装飾班</span>
      </div>

      <ConceptImage panel="decoration_bg" className="w-full h-36" />

      <div className="flex-1 px-5 py-5">
        <div className="text-xs text-gray-400 mb-1">場所</div>
        <h3 className="text-base font-bold text-gray-900 mb-4">教室後方 / 装飾スペース</h3>

        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">段ボール、絵の具、完成予想図。</p>
          <p className="text-sm text-gray-700 leading-relaxed mt-2">まだ完成には遠いけど、去年より本気で作っているのが伝わる。</p>
        </div>

        <div className={`rounded-xl border-2 p-4 mb-5 ${alreadyCollected ? "border-green-200 bg-green-50" : "border-dashed border-gray-300 bg-gray-50"}`}>
          <div className="text-xs font-semibold tracking-wider text-gray-400 mb-2 uppercase">
            {alreadyCollected ? "✓ 素材を獲得しました" : "素材を獲得しました"}
          </div>
          <ConceptImage panel="post_decoration" className="w-full h-28 rounded-lg mb-2" label="装飾制作風景" />
          <div className="text-xs text-gray-500 text-center">装飾制作風景</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-600 italic text-center">「今年、意外とみんな本気なのかも。」</p>
        </div>
      </div>

      <div className="px-5 pb-6">
        <ChoiceButton onClick={onBack} variant="secondary">教室に戻る</ChoiceButton>
      </div>
    </div>
  );
}

// ─── コンテスト発表 ─────────────────────────────────────────────────

function ContestAnnouncementScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-6 py-8">
      <div className="flex-1">
        <div className="text-xs text-gray-400 mb-1 tracking-wider">ANNOUNCEMENT</div>
        <div className="text-xs text-gray-500 mb-4">文化祭実行委員会より</div>

        <div className="border border-gray-200 rounded-xl p-5 mb-5">
          <h2 className="text-lg font-bold text-gray-900 mb-1">SNS広報コンテスト</h2>
          <p className="text-xs text-gray-500">今年から開催</p>
        </div>

        <div className="mb-5">
          <div className="text-xs font-semibold text-gray-500 mb-3 tracking-wider uppercase">評価基準</div>
          <div className="space-y-2">
            {["いいね", "コメント", "保存", "シェア", "投稿内容の工夫"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-700">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-900 text-white rounded-xl p-5 mb-5">
          <div className="text-xs text-gray-400 mb-1 tracking-wider uppercase">表彰</div>
          <div className="text-base font-bold">最優秀SNS広報賞</div>
          <p className="text-xs text-gray-300 mt-2 leading-relaxed">
            SNSで文化祭を一番盛り上げたクラスが表彰されます。
          </p>
        </div>
      </div>

      <ChoiceButton onClick={onNext}>担当を決める</ChoiceButton>
    </div>
  );
}

// ─── 担当決定 ────────────────────────────────────────────────────────

function RoleDecisionScreen({ onDecide }: { onDecide: () => void }) {
  const [chosen, setChosen] = useState<string | null>(null);

  const handleChoose = (id: string) => {
    setChosen(id);
    setTimeout(() => onDecide(), 1000);
  };

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-6 py-8">
      <div className="flex-1">
        <h2 className="text-lg font-bold text-gray-900 mb-2">SNS広報担当を決めよう</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          誰もすぐには手を挙げなかった。<br />少しの沈黙のあと——
        </p>

        {!chosen ? (
          <div className="space-y-3">
            {ROLE_CHOICES.map((choice) => (
              <ChoiceButton key={choice.id} variant="choice" onClick={() => handleChoose(choice.id)}>
                {choice.text}
              </ChoiceButton>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-6 text-center border border-gray-200">
            <p className="text-sm font-medium text-gray-700">
              あなたは、文化祭SNS広報責任者になった。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── アカウント確認 ─────────────────────────────────────────────────

function AccountCheckScreen({ state, onNext }: { state: GameState; onNext: () => void }) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 pt-8 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xs font-medium">ICON</span>
          </div>
          <div>
            <div className="text-base font-bold text-gray-900">公式アカウント</div>
            <div className="text-sm text-gray-500">@festival_class</div>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-100 px-5 py-4 gap-6">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{state.followers}</div>
          <div className="text-xs text-gray-500">フォロワー</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">0</div>
          <div className="text-xs text-gray-500">投稿数</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">{state.prPoints}</div>
          <div className="text-xs text-gray-500">広報ポイント</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 py-10">
        <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center mb-6 border border-dashed border-gray-300">
          <span className="text-sm text-gray-400">投稿はまだありません</span>
        </div>
        <p className="text-sm text-gray-600 text-center leading-relaxed">
          ここから、あなたのSNS広報が始まる。
        </p>
      </div>

      <div className="px-5 pb-6">
        <ChoiceButton onClick={onNext}>初投稿を作る</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 初投稿作成 ─────────────────────────────────────────────────────

function FirstPostScreen({ state, onPost }: { state: GameState; onPost: (material: string, caption: string) => void }) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption] = useState<string | null>(null);

  const materials = state.collectedMaterials;
  const canPost = selectedMaterial !== null && selectedCaption !== null;

  const panelMap: Record<string, import("@/components/ConceptImage").PanelId> = {
    "教室の様子": "post_classroom",
    "模擬店の試作品": "post_shop",
    "装飾制作風景": "post_decoration",
  };

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-base font-bold text-gray-900">初投稿を作る</h2>
        <p className="text-xs text-gray-500 mt-0.5">写真と文章を選んでください</p>
      </div>

      <div className="flex-1 px-5 py-5 overflow-y-auto">
        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-500 mb-3 tracking-wider uppercase">写真素材を選ぶ</div>
          <div className="space-y-2">
            {materials.map((m) => {
              const panel = panelMap[m] ?? "post_classroom";
              return (
                <button
                  key={m}
                  onClick={() => setSelectedMaterial(m)}
                  className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 text-left transition-colors ${
                    selectedMaterial === m ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"
                  }`}
                >
                  <ConceptImage panel={panel} className="w-12 h-12 rounded-lg flex-shrink-0" />
                  <span className="text-sm text-gray-800">{m}</span>
                  {selectedMaterial === m && <span className="ml-auto text-gray-900 font-bold text-sm">✓</span>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-500 mb-3 tracking-wider uppercase">投稿文を選ぶ</div>
          <div className="space-y-2">
            {CAPTIONS.map((caption) => (
              <button
                key={caption}
                onClick={() => setSelectedCaption(caption)}
                className={`w-full border rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                  selectedCaption === caption ? "border-gray-900 bg-gray-50 font-medium text-gray-900" : "border-gray-200 text-gray-700 hover:border-gray-400"
                }`}
              >
                {caption}
                {selectedCaption === caption && <span className="ml-2 text-gray-900">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {canPost && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-500 mb-3 tracking-wider uppercase">プレビュー</div>
            <div className="border border-gray-300 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">自</div>
                <span className="text-xs font-medium text-gray-700">@festival_class</span>
              </div>
              <SnsPostCard title={selectedCaption!} previewMaterial={selectedMaterial!} likes={0} />
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        <ChoiceButton onClick={() => canPost && onPost(selectedMaterial!, selectedCaption!)} disabled={!canPost}>
          投稿する
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 投稿結果 ────────────────────────────────────────────────────────

function PostResultScreen({ state, onEnd }: { state: GameState; onEnd: () => void }) {
  const [likesIndex, setLikesIndex] = useState(0);
  const [showReactions, setShowReactions] = useState(false);
  const [visibleReactions, setVisibleReactions] = useState(0);

  useEffect(() => {
    if (likesIndex < LIKES_SEQUENCE.length - 1) {
      const t = setTimeout(() => setLikesIndex((i) => i + 1), 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowReactions(true), 600);
      return () => clearTimeout(t);
    }
  }, [likesIndex]);

  useEffect(() => {
    if (showReactions && visibleReactions < POST_REACTIONS.length) {
      const t = setTimeout(() => setVisibleReactions((n) => n + 1), 700);
      return () => clearTimeout(t);
    }
  }, [showReactions, visibleReactions]);

  const currentLikes = LIKES_SEQUENCE[likesIndex];
  const allDone = visibleReactions >= POST_REACTIONS.length;

  const panelMap: Record<string, import("@/components/ConceptImage").PanelId> = {
    "教室の様子": "post_classroom",
    "模擬店の試作品": "post_shop",
    "装飾制作風景": "post_decoration",
  };

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-base font-bold text-gray-900">投稿しました</h2>
      </div>

      <div className="flex-1 px-5 py-5 overflow-y-auto">
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">自</div>
            <span className="text-xs font-medium text-gray-700">@festival_class</span>
          </div>
          {state.selectedMaterial && (
            <ConceptImage panel={panelMap[state.selectedMaterial] ?? "post_classroom"} className="w-full h-28" />
          )}
          <div className="p-3">
            <p className="text-sm text-gray-800">{state.selectedCaption}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-red-500 text-sm">♡</span>
              <span className="text-sm font-bold text-gray-900">{currentLikes}</span>
              {currentLikes < LIKES_SEQUENCE[LIKES_SEQUENCE.length - 1] && (
                <span className="text-xs text-gray-400 ml-1 animate-pulse">…</span>
              )}
            </div>
          </div>
        </div>

        {showReactions && (
          <div className="mb-6">
            <div className="text-xs text-gray-400 mb-3 tracking-wider">クラスLINEの反応</div>
            <div className="space-y-2.5">
              {POST_REACTIONS.slice(0, visibleReactions).map((r, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">
                    {r.sender.charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">{r.sender}</div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800">
                      {r.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {allDone && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
            <div className="text-xs font-semibold text-gray-500 mb-3 tracking-wider uppercase">ステータス更新</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">フォロワー</span>
                <span className="font-bold text-gray-900">12 → 32</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">広報ポイント</span>
                <span className="font-bold text-gray-900">0 → 12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">クラス期待度</span>
                <span className="font-bold text-green-600">少し上昇</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        <ChoiceButton onClick={onEnd} disabled={!allDone}>Day1を終える</ChoiceButton>
      </div>
    </div>
  );
}

// ─── Day1終了 ────────────────────────────────────────────────────────

function Day1EndScreen({ onTitle }: { onTitle: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-28px)] px-8 py-16 bg-white">
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full">
        <div className="text-xs text-gray-400 tracking-widest mb-4 uppercase">End of Day</div>
        <h2 className="text-3xl font-black text-gray-900 mb-2">Day 1</h2>
        <div className="text-sm text-gray-500 mb-8">終了</div>

        <div className="w-full bg-gray-50 rounded-xl p-5 border border-gray-100 mb-8">
          <div className="text-xs text-gray-500 mb-2">文化祭まであと</div>
          <div className="text-4xl font-black text-gray-900">6日</div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 w-full">
          <div className="text-xs text-gray-400 mb-2 tracking-wider uppercase">Next</div>
          <p className="text-sm text-gray-700 leading-relaxed">本格的なSNS広報が始まる。</p>
        </div>
      </div>

      <div className="w-full mt-8">
        <ChoiceButton onClick={onTitle} variant="secondary">タイトルへ戻る</ChoiceButton>
      </div>
    </div>
  );
}

// ─── Main App ────────────────────────────────────────────────────────

export default function Home() {
  const [state, setState] = useState<GameState>(() => ({
    ...INITIAL_STATE,
    visitedAreas: new Set<string>(),
  }));

  const go = useCallback((screen: Screen) => {
    setState((s) => ({ ...s, screen }));
    window.scrollTo(0, 0);
  }, []);

  const visitArea = useCallback((key: string, screen: Screen) => {
    setState((s) => {
      const next = new Set(s.visitedAreas);
      next.add(key);
      const newMaterials = [...s.collectedMaterials];
      if (key === "shop" && !newMaterials.includes("模擬店の試作品")) newMaterials.push("模擬店の試作品");
      if (key === "decoration" && !newMaterials.includes("装飾制作風景")) newMaterials.push("装飾制作風景");
      return { ...s, screen, visitedAreas: next, collectedMaterials: newMaterials };
    });
    window.scrollTo(0, 0);
  }, []);

  const handlePost = useCallback((material: string, caption: string) => {
    setState((s) => ({
      ...s,
      screen: "post_result",
      selectedMaterial: material,
      selectedCaption: caption,
      followers: 32,
      prPoints: 12,
      classExpectation: 35,
      likes: LIKES_SEQUENCE[LIKES_SEQUENCE.length - 1],
    }));
  }, []);

  const { screen } = state;

  const showStatusBar =
    screen !== "title" &&
    screen !== "op1_line" &&
    screen !== "op2_teacher" &&
    screen !== "op2_ranking" &&
    screen !== "op2_reaction" &&
    screen !== "op2_goal" &&
    screen !== "day1_end" &&
    screen !== "contest_announcement" &&
    screen !== "role_decision";

  return (
    <PhoneFrame>
      {showStatusBar && (
        <StatusBar followers={state.followers} prPoints={state.prPoints} classExpectation={state.classExpectation} />
      )}
      {screen === "title"            && <TitleScreen onNext={() => go("op1_line")} />}
      {screen === "op1_line"         && <Op1LineScreen onNext={() => go("op2_teacher")} />}
      {screen === "op2_teacher"      && <Op2TeacherScreen onNext={() => go("op2_ranking")} />}
      {screen === "op2_ranking"      && <Op2RankingScreen onNext={() => go("op2_reaction")} />}
      {screen === "op2_reaction"     && <Op2ReactionScreen onNext={() => go("op2_goal")} />}
      {screen === "op2_goal"         && <Op2GoalScreen onNext={() => go("classroom")} />}
      {screen === "classroom"        && <ClassroomScreen state={state} onNavigate={visitArea} onContinue={() => go("contest_announcement")} />}
      {screen === "sns"              && <SnsScreen onBack={() => go("classroom")} />}
      {screen === "line_chat"        && <LineChatScreen onBack={() => go("classroom")} />}
      {screen === "shop"             && <ShopScreen onBack={() => go("classroom")} alreadyCollected={state.collectedMaterials.includes("模擬店の試作品")} />}
      {screen === "decoration"       && <DecorationScreen onBack={() => go("classroom")} alreadyCollected={state.collectedMaterials.includes("装飾制作風景")} />}
      {screen === "contest_announcement" && <ContestAnnouncementScreen onNext={() => go("role_decision")} />}
      {screen === "role_decision"    && <RoleDecisionScreen onDecide={() => go("account_check")} />}
      {screen === "account_check"    && <AccountCheckScreen state={state} onNext={() => go("first_post")} />}
      {screen === "first_post"       && <FirstPostScreen state={state} onPost={handlePost} />}
      {screen === "post_result"      && <PostResultScreen state={state} onEnd={() => go("day1_end")} />}
      {screen === "day1_end"         && <Day1EndScreen onTitle={() => go("title")} />}
    </PhoneFrame>
  );
}
