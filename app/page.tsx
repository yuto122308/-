"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import PhoneFrame from "@/components/PhoneFrame";
import SnsPostCard from "@/components/SnsPostCard";
import LineChat from "@/components/LineChat";
import ChoiceButton from "@/components/ChoiceButton";
import ConceptImage from "@/components/ConceptImage";
import {
  Day2MorningScreen, Day2CommentsScreen, Day2LineScreen,
  Day2MissionScreen, Day2ClassroomScreen, Day2InterviewScreen,
  Day2PostScreen, Day2PostWaitingScreen, Day2PostResultScreen,
  Day2RankEventScreen, Day2Line2Screen, Day2RivalsScreen, Day2EndScreen,
} from "@/components/Day2Screens";
import { Day2AreaId, computeDay2Outcome } from "@/data/day2";
import {
  Day3MorningScreen, Day3RankingScreen, Day3MeetupIntroScreen,
  Day3MeetupScreen, Day3MeetupReflectScreen, Day3ClassroomScreen,
  Day3InterviewScreen, Day3PostScreen, Day3PostWaitingScreen,
  Day3PostResultScreen, Day3ResultScreen, Day3EndScreen,
} from "@/components/Day3Screens";
import { computeDay3Outcome } from "@/data/day3";
import Day4Game, { Day4Result } from "@/components/Day4Game";
import Day5Game, { Day5Result } from "@/components/Day5Game";
import {
  Screen, GameState, PlayerProfile, FestivalAccount,
  PLAYER_ICONS, FESTIVAL_ICONS,
  PLAYER_QUESTIONS, buildPlayerProfile,
  ACCOUNT_NAME_OPTIONS, ACCOUNT_PROFILE_OPTIONS,
  NOTIFY_INTRO, PROLOGUE_LINES,
  SNS_POSTS_A_CLASS, SNS_POSTS_OWN_CLASS,
  LINE_MESSAGES, CAPTIONS, LIKES_SEQUENCE, POST_REACTIONS,
  ROLE_CHOICES, LAST_YEAR_RANKING, OP2_REACTIONS, INTERVIEW_MEMOS,
} from "@/data/day1";

const INITIAL_STATE: GameState = {
  screen: "title",
  playerProfile: null,
  festivalAccount: null,
  visitedAreas: new Set(),
  collectedMaterials: ["教室の様子"],
  selectedMaterial: null,
  selectedCaption: null,
  likes: 0,
  trust: 10,
  attention: 8,
  rank: 8,
  flameRisk: 0,
  day2Area: null,
  day2Angle: null,
  day3MeetupIndex: 0,
  day3Area: null,
  day3PostTheme: null,
  day4FollowerGain: 0,
  day5FollowerGain: 0,
};

const PANEL_MAP: Record<string, import("@/components/ConceptImage").PanelId> = {
  "教室の様子":     "post_classroom",
  "模擬店の試作品":  "post_shop",
  "装飾制作風景":   "post_decoration",
};

// ─── タイトル ────────────────────────────────────────────────────────

const DEV_DUMMY_STATE: Partial<GameState> = {
  playerProfile: {
    name: "テスト太郎", nickname: "たろう", icon: "🙂", comment: "テスト中",
    festivalInterest: "sns", snsDistance: "post_often", motivation: "high",
    festivalLabel: "SNS広報型", snsLabel: "発信タイプ", motivationLabel: "高め",
  },
  festivalAccount: {
    accountName: "1年3組文化祭", profileText: "文化祭まであと7日！",
    icon: "🏫", followers: 32, posts: 1, points: 12,
  },
  collectedMaterials: ["教室の様子"],
  trust: 10, attention: 8, rank: 8, flameRisk: 0,
  day2Area: null, day2Angle: null,
  day3MeetupIndex: 0, day3Area: null, day3PostTheme: null,
  day4FollowerGain: 0,
  day5FollowerGain: 0,
};

const DEV_DAYS: { label: string; screen: Screen }[] = [
  { label: "Day 1",   screen: "scene_set" },
  { label: "Day 2",   screen: "day2_start" },
  { label: "Day 3",   screen: "day3_morning" },
  { label: "Day 4",   screen: "day4_home" },
  { label: "Day 5",   screen: "day5_home" },
  { label: "Day 6",   screen: "day2_start" },
  { label: "Day 7",   screen: "day2_start" },
];

function TitleScreen({ onNext, onDevJump }: { onNext: () => void; onDevJump: (screen: Screen, extra?: Partial<GameState>) => void }) {
  const [devMode, setDevMode] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-28px)] px-8 py-16 bg-white">
      <div className="text-center flex-1 flex flex-col items-center justify-center">
        <div className="mb-2 text-xs tracking-[0.3em] text-gray-400 uppercase">Day 1</div>
        <h1 className="text-5xl font-black tracking-tight text-gray-900 mb-1">通知</h1>
        <h1 className="text-5xl font-black tracking-tight text-red-500 mb-6">99+</h1>
        <p className="text-sm text-gray-500 leading-relaxed">文化祭SNS広報責任者の7日間</p>
      </div>
      <div className="w-full space-y-3">
        <ChoiceButton onClick={onNext}>はじめる</ChoiceButton>
        {!devMode ? (
          <button onClick={() => setDevMode(true)} className="w-full text-xs text-gray-300 py-2">dev</button>
        ) : (
          <div className="border border-dashed border-gray-300 rounded-xl p-3 space-y-2">
            <div className="text-xs text-gray-400 text-center mb-1">開発者ジャンプ</div>
            <div className="grid grid-cols-4 gap-1.5">
              {DEV_DAYS.map((d) => (
                <button key={d.label} onClick={() => onDevJump(d.screen, d.label !== "Day 1" ? DEV_DUMMY_STATE : undefined)}
                  className="text-xs border border-gray-200 rounded-lg py-2 text-gray-600 hover:bg-gray-50 active:bg-gray-100">
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── 場面設定 ────────────────────────────────────────────────────────

function SceneSetScreen({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < 3) {
      const t = setTimeout(() => setStep((n) => n + 1), step === 0 ? 400 : 800);
      return () => clearTimeout(t);
    }
  }, [step]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100svh-28px)] bg-white px-8">
      <div className="w-full max-w-xs space-y-5 text-center">
        {step >= 1 && (
          <div className="space-y-1">
            <div className="text-xs text-gray-400 tracking-widest uppercase">Scene</div>
            <div className="text-sm text-gray-500">○○高校　1年3組</div>
          </div>
        )}
        {step >= 2 && (
          <div className="border-t border-b border-gray-100 py-5">
            <div className="text-3xl font-black text-gray-900 mb-1">文化祭まで</div>
            <div className="text-5xl font-black text-gray-900">あと7日</div>
          </div>
        )}
        {step >= 3 && (
          <div className="text-sm text-gray-600 leading-relaxed">
            あなたは高校1年生。<br />クラスの文化祭準備が始まっている。
          </div>
        )}
      </div>
      <div className="absolute bottom-8 left-0 right-0 px-8">
        <ChoiceButton onClick={onNext} disabled={step < 3}>
          {step < 3 ? "　" : "つづきを見る"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── スマホ通知演出 ──────────────────────────────────────────────────

function NotifyIntroScreen({ onNext }: { onNext: () => void }) {
  const [visible, setVisible] = useState(0);
  const [showMono, setShowMono] = useState(false);

  useEffect(() => {
    if (visible < NOTIFY_INTRO.length) {
      const t = setTimeout(() => setVisible((n) => n + 1), 900);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowMono(true), 400);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-950">
      <div className="flex justify-between items-center px-5 pt-4 pb-2 text-xs text-gray-400">
        <span>9:41</span><span>●●●</span>
      </div>
      <div className="flex-1 px-4 pt-4 space-y-3">
        {NOTIFY_INTRO.slice(0, visible).map((n) => (
          <div key={n.id} className="bg-white/10 backdrop-blur rounded-2xl px-4 py-3 border border-white/10">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-sm bg-green-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold leading-none">L</span>
              </div>
              <span className="text-xs text-gray-300 font-medium">{n.app}</span>
            </div>
            <div className="text-xs text-gray-400 mb-0.5">{n.sender}</div>
            <div className="text-sm text-white font-medium">{n.text}</div>
          </div>
        ))}
        {showMono && (
          <div className="pt-6 text-center px-4">
            <p className="text-base text-gray-300 leading-relaxed">「文化祭まであと1週間か……」</p>
          </div>
        )}
      </div>
      <div className="px-5 pb-8 pt-4">
        <button
          onClick={onNext}
          disabled={!showMono}
          className="w-full py-3.5 rounded-xl text-sm font-medium disabled:opacity-0 bg-white/10 text-white border border-white/20 hover:bg-white/20 active:scale-[0.98] transition-all"
        >
          次へ
        </button>
      </div>
    </div>
  );
}

// ─── プロローグ ──────────────────────────────────────────────────────

function PrologueScreen({ onNext }: { onNext: () => void }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (lineIndex < PROLOGUE_LINES.length) {
      const t = setTimeout(() => {
        if (lineIndex === PROLOGUE_LINES.length - 1) setDone(true);
        setLineIndex((n) => n + 1);
      }, lineIndex === 0 ? 600 : 1400);
      return () => clearTimeout(t);
    }
  }, [lineIndex]);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <ConceptImage panel="classroom_bg" className="w-full h-full" />
        <div className="absolute inset-0 bg-white/85" />
      </div>
      <div className="relative flex-1 flex flex-col justify-center px-7 py-12 space-y-5">
        <div className="mb-4">
          <div className="text-xs text-gray-400 tracking-widest mb-1 uppercase">Prologue</div>
          <h2 className="text-xl font-bold text-gray-900">文化祭まであと7日</h2>
        </div>
        {PROLOGUE_LINES.slice(0, lineIndex).map((line, i) => (
          <p key={i} className={`text-sm text-gray-700 leading-relaxed whitespace-pre-line ${i === PROLOGUE_LINES.length - 1 ? "font-medium text-gray-900" : ""}`}>
            {line}
          </p>
        ))}
      </div>
      <div className="relative px-5 pb-8 pt-2">
        <ChoiceButton onClick={onNext} disabled={!done}>
          {done ? "プロフィールを作る" : "　"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── プレイヤー作成（高校生としての自分） ────────────────────────────

function PlayerCreateScreen({ onNext }: { onNext: (base: { name: string; nickname: string; icon: string; comment: string }) => void }) {
  const [name, setName]         = useState("");
  const [nickname, setNickname] = useState("");
  const [icon, setIcon]         = useState(PLAYER_ICONS[7]);
  const [comment, setComment]   = useState("");

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 pt-7 pb-5 border-b border-gray-100">
        <div className="text-xs text-gray-400 mb-1">1年3組</div>
        <h2 className="text-lg font-bold text-gray-900">まずはあなたについて<br />教えてください</h2>
      </div>
      <div className="flex-1 px-5 py-6 space-y-6 overflow-y-auto">
        <div>
          <div className="text-xs text-gray-500 mb-3">アイコン</div>
          <div className="flex flex-wrap gap-3">
            {PLAYER_ICONS.map((ic) => (
              <button key={ic} onClick={() => setIcon(ic)}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all ${icon === ic ? "bg-gray-900 ring-2 ring-gray-900 ring-offset-2" : "bg-gray-100 hover:bg-gray-200"}`}>
                {ic}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-2">名前</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder="例：山田太郎" maxLength={20}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-500" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-2">呼ばれ方（ニックネーム）</label>
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}
            placeholder="例：たろう" maxLength={10}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-500" />
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-2">一言コメント</label>
          <input type="text" value={comment} onChange={(e) => setComment(e.target.value)}
            placeholder="例：文化祭楽しみ" maxLength={30}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-gray-500" />
        </div>
      </div>
      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        <ChoiceButton onClick={() => onNext({ name: name.trim(), nickname: nickname.trim() || name.trim(), icon, comment: comment.trim() })} disabled={!name.trim()}>
          次へ
        </ChoiceButton>
        {!name.trim() && <p className="text-xs text-gray-400 text-center mt-2">名前を入力してください</p>}
      </div>
    </div>
  );
}

// ─── プレイヤーアンケート ────────────────────────────────────────────

function PlayerQuestionScreen({ questionIndex, onAnswer }: { questionIndex: number; onAnswer: (value: string) => void }) {
  const q = PLAYER_QUESTIONS[questionIndex];
  const total = PLAYER_QUESTIONS.length;
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 pt-6 pb-4 border-b border-gray-100">
        <div className="text-xs text-gray-400 mb-2">{questionIndex + 1} / {total}</div>
        <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gray-400 rounded-full transition-all duration-300" style={{ width: `${((questionIndex + 1) / total) * 100}%` }} />
        </div>
      </div>
      <div className="flex-1 px-5 py-8 flex flex-col">
        <h2 className="text-base font-bold text-gray-900 mb-6 leading-snug">{q.text}</h2>
        <div className="space-y-2.5">
          {q.options.map((opt) => (
            <button key={opt.value} onClick={() => onAnswer(opt.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-left text-sm text-gray-800 hover:border-gray-500 hover:bg-gray-50 transition-colors active:scale-[0.98]">
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── プレイヤープロフィール完成（高校生カード） ──────────────────────

function PlayerResultScreen({ profile, onNext }: { profile: PlayerProfile; onNext: () => void }) {
  const [show, setShow] = useState(false);
  useEffect(() => { const t = setTimeout(() => setShow(true), 500); return () => clearTimeout(t); }, []);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-5 py-8">
      <div className="text-xs text-gray-400 tracking-widest mb-5 uppercase">Profile</div>

      {/* 高校生カード（SNSアカウントではなく学校の生徒として） */}
      <div className="border border-gray-200 rounded-2xl overflow-hidden mb-6 shadow-sm">
        <div className="bg-gray-50 px-5 py-5 flex items-center gap-4 border-b border-gray-100">
          <div className="w-14 h-14 rounded-full bg-white border border-gray-200 flex items-center justify-center text-3xl flex-shrink-0">
            {profile.icon}
          </div>
          <div className="min-w-0">
            <div className="text-base font-bold text-gray-900 truncate">{profile.name}</div>
            {profile.nickname !== profile.name && (
              <div className="text-xs text-gray-500">「{profile.nickname}」</div>
            )}
            <div className="text-xs text-gray-400">○○高校 1年3組</div>
            {profile.comment && <div className="text-xs text-gray-600 mt-1 truncate">{profile.comment}</div>}
          </div>
        </div>
        <div className="px-5 py-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">文化祭タイプ</span>
            <span className="font-medium text-gray-800">{profile.festivalLabel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">SNSスタイル</span>
            <span className="font-medium text-gray-800">{profile.snsLabel}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">文化祭熱量</span>
            <span className="font-medium text-gray-800">{profile.motivationLabel}</span>
          </div>
        </div>
      </div>

      {show && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl px-5 py-4 mb-6">
          <p className="text-sm text-gray-700 leading-relaxed">「文化祭まであと1週間か。」</p>
        </div>
      )}

      <div className="mt-auto">
        <ChoiceButton onClick={onNext} disabled={!show}>アカウントを作る</ChoiceButton>
      </div>
    </div>
  );
}

// ─── OP2: 担任 ───────────────────────────────────────────────────────

function Op2TeacherScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-6 py-10">
      <div className="flex-1 flex flex-col justify-center">
        <ConceptImage panel="classroom_bg" className="w-full h-40 rounded-xl mb-6" />
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
          <div className="text-xs text-gray-400 mb-3">担任</div>
          <p className="text-sm text-gray-800 leading-relaxed mb-3">「文化祭まであと7日です。」</p>
          <p className="text-sm text-gray-800 leading-relaxed">「まず去年の結果を振り返りましょう。」</p>
        </div>
      </div>
      <ChoiceButton onClick={onNext}>次へ</ChoiceButton>
    </div>
  );
}

// ─── OP2: 順位発表 ───────────────────────────────────────────────────

function Op2RankingScreen({ onNext }: { onNext: () => void }) {
  const [revealed, setRevealed] = useState(0);
  const [showOwn, setShowOwn]   = useState(false);

  useEffect(() => {
    if (revealed < LAST_YEAR_RANKING.length - 1) {
      const t = setTimeout(() => setRevealed((n) => n + 1), 450);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setShowOwn(true), 700);
      return () => clearTimeout(t);
    }
  }, [revealed]);

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white px-6 py-8">
      <div className="flex-1">
        <div className="text-xs text-gray-400 tracking-widest mb-1 uppercase">Last Year</div>
        <h2 className="text-lg font-bold text-gray-900 mb-5">SNS広報ランキング</h2>
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
          {LAST_YEAR_RANKING.slice(0, revealed).map((item) => (
            <div key={item.rank} className="flex items-center px-4 py-2.5 border-b border-gray-100 last:border-b-0">
              <span className={`w-8 text-sm font-bold ${item.rank === 1 ? "text-yellow-500" : item.rank <= 3 ? "text-amber-600" : "text-gray-400"}`}>{item.rank}位</span>
              <span className="text-sm text-gray-700 ml-2">{item.name}</span>
            </div>
          ))}
          {showOwn && (
            <div className="flex items-center px-4 py-3 bg-gray-900">
              <span className="w-8 text-sm font-bold text-gray-300">8位</span>
              <span className="text-sm font-bold text-white ml-2">自分たちのクラス</span>
              <span className="ml-auto text-xs text-gray-400 border border-gray-600 rounded px-1.5 py-0.5">自分たち</span>
            </div>
          )}
        </div>
      </div>
      <ChoiceButton onClick={onNext} disabled={!showOwn}>{showOwn ? "次へ" : "……"}</ChoiceButton>
    </div>
  );
}

// ─── OP2: クラスの反応 ───────────────────────────────────────────────

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
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs text-gray-600 font-medium flex-shrink-0">{r.sender.charAt(0)}</div>
            <div>
              <div className="text-xs text-gray-500 mb-1">{r.sender}</div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">{r.text}</div>
            </div>
          </div>
        ))}
        {done && (
          <div className="pt-4 mx-2 space-y-3">
            <div className="bg-gray-800/80 rounded-xl px-4 py-3 text-center">
              <p className="text-sm text-white/90 leading-relaxed">「去年は頑張ったはずなのに。何が足りなかったんだろう」</p>
            </div>
          </div>
        )}
      </div>
      <div className="px-5 pb-6">
        <ChoiceButton onClick={onNext} disabled={!done}>次へ</ChoiceButton>
      </div>
    </div>
  );
}

// ─── OP2: A組のSNSを見る（必須ナラティブ） ──────────────────────────

function Op2SnsScreen({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < SNS_POSTS_A_CLASS.length) {
      const t = setTimeout(() => setStep((n) => n + 1), step === 0 ? 500 : 800);
      return () => clearTimeout(t);
    }
  }, [step]);

  const allLoaded = step >= SNS_POSTS_A_CLASS.length;

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-5 py-3">
        <div className="text-xs text-gray-400 mb-0.5">確認する</div>
        <span className="text-sm font-semibold text-gray-800">去年1位 A組のSNS</span>
      </div>
      <div className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="bg-white/80 rounded-xl px-4 py-3 mb-4 text-center border border-gray-100">
          <p className="text-sm text-gray-600 leading-relaxed">「去年1位のA組は、何を投稿していたんだろう……」</p>
        </div>
        <div className="flex items-center gap-2 mb-3 px-1">
          <div className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-white">A</div>
          <div>
            <div className="text-sm font-semibold text-gray-900">A組 公式アカウント</div>
            <div className="text-xs text-gray-400 flex items-center gap-1"><span className="text-yellow-500">★</span>去年 1位</div>
          </div>
        </div>
        <div className="space-y-0">
          {SNS_POSTS_A_CLASS.slice(0, step).map((post) => (
            <SnsPostCard key={post.id} title={post.title} description={post.description} likes={post.likes} comments={post.comments} />
          ))}
        </div>
        {allLoaded && (
          <div className="mt-4 bg-gray-900 rounded-xl px-4 py-4 text-center">
            <p className="text-sm text-white leading-relaxed">「同じ文化祭なのに……<br />全然違う。」</p>
          </div>
        )}
      </div>
      <div className="px-5 pb-6 pt-3 bg-gray-50 border-t border-gray-200">
        <ChoiceButton onClick={onNext} disabled={!allLoaded}>
          {allLoaded ? "次へ" : "……"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── OP2: 委員長との会話・ミッション発生 ─────────────────────────────

function Op2GoalScreen({ onNext }: { onNext: () => void }) {
  const [step, setStep] = useState(0);

  const advance = () => setStep((n) => Math.min(n + 1, 3));

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">委</div>
        <span className="text-sm font-semibold text-gray-800">委員長</span>
      </div>
      <div className="flex-1 px-4 py-5 space-y-3 overflow-y-auto">
        {/* 委員長メッセージ1 */}
        {step >= 0 && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium flex-shrink-0">委</div>
            <div>
              <div className="text-xs text-gray-500 mb-1">委員長</div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
                今年はSNSコンテストもあるし、本気で上位を狙いたいんだ
              </div>
            </div>
          </div>
        )}
        {/* 委員長メッセージ2 */}
        {step >= 1 && (
          <div className="flex items-end gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium flex-shrink-0">委</div>
            <div>
              <div className="text-xs text-gray-500 mb-1">委員長</div>
              <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
                でもまずは、自分たちの文化祭の魅力を知らないと始まらないよね
              </div>
            </div>
          </div>
        )}
        {/* ミッションカード */}
        {step >= 2 && (
          <div className="mx-2 mt-2 bg-gray-900 text-white rounded-2xl p-5">
            <div className="text-xs text-gray-400 mb-2 tracking-widest uppercase">Mission</div>
            <div className="text-base font-bold mb-3">文化祭の魅力を<br />3つ見つけよう</div>
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[0,1,2].map((i) => (
                  <div key={i} className="w-3 h-3 rounded-full border border-gray-500 bg-gray-800" />
                ))}
              </div>
              <span className="text-xs text-gray-400">0 / 3</span>
            </div>
          </div>
        )}
        {/* タップ促進 */}
        {step < 2 && (
          <button onClick={advance} className="w-full text-center text-xs text-gray-400 py-3 active:opacity-60">
            タップして続きを読む
          </button>
        )}
      </div>
      <div className="px-5 pb-6 border-t border-gray-200 bg-gray-100 pt-4">
        <ChoiceButton onClick={onNext} disabled={step < 2}>
          {step >= 2 ? "取材を始める" : "　"}
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 教室ホーム ──────────────────────────────────────────────────────

function ClassroomScreen({ state, onNavigate, onContinue }: {
  state: GameState;
  onNavigate: (area: string, screen: Screen) => void;
  onContinue: () => void;
}) {
  const visited = state.visitedAreas;
  const REQUIRED = ["shop", "decoration", "line_chat"] as const;
  const doneCount = REQUIRED.filter((k) => visited.has(k)).length;
  const canContinue = doneCount >= 3;

  const areas: { label: string; key: string; screen: Screen; desc: string }[] = [
    { label: "模擬店を取材する",  key: "shop",       screen: "shop",      desc: "試作品の様子を見てみよう" },
    { label: "装飾班を取材する",  key: "decoration", screen: "decoration", desc: "今年の気合いを感じてみよう" },
    { label: "クラスLINEを見る",  key: "line_chat",  screen: "line_chat", desc: "みんなの本音はどこにある？" },
  ];

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <ConceptImage panel="classroom_bg" className="w-full h-28" />
      {/* ミッションヘッダー */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="text-xs text-gray-400 mb-1 tracking-wider uppercase">Mission</div>
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-gray-900">文化祭の魅力を3つ見つけよう</h2>
          <div className="flex items-center gap-1.5 bg-gray-900 text-white text-xs font-bold px-3 py-1.5 rounded-full">
            <span>{doneCount}</span><span className="text-gray-400">/</span><span>3</span>
          </div>
        </div>
        {/* 進捗ドット */}
        <div className="flex gap-2 mt-3">
          {REQUIRED.map((k) => (
            <div key={k} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${visited.has(k) ? "bg-gray-900" : "bg-gray-200"}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 py-4 space-y-2.5">
        {areas.map((area) => {
          const done = visited.has(area.key);
          return (
            <button key={area.key} onClick={() => onNavigate(area.key, area.screen)}
              className={`w-full flex items-center justify-between border rounded-xl px-4 py-4 text-left transition-colors active:scale-[0.98] ${done ? "border-gray-300 bg-gray-50" : "border-gray-200 bg-white hover:border-gray-400"}`}>
              <div>
                <div className={`text-sm font-medium ${done ? "text-gray-500" : "text-gray-800"}`}>{area.label}</div>
                <div className="text-xs text-gray-400 mt-0.5">{done ? "取材メモを記録しました" : area.desc}</div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                {done
                  ? <span className="text-green-600 text-lg">✓</span>
                  : <span className="text-gray-300 text-lg">›</span>}
              </div>
            </button>
          );
        })}
      </div>

      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        {canContinue ? (
          <>
            <div className="text-xs text-gray-500 text-center mb-3">取材メモが3つ集まりました！</div>
            <ChoiceButton onClick={onContinue}>次に進む</ChoiceButton>
          </>
        ) : (
          <div className="text-xs text-gray-400 text-center py-2">あと{3 - doneCount}か所取材しよう</div>
        )}
      </div>
    </div>
  );
}

// ─── SNS（自由探索版は削除・OP専用になったため不使用） ──────────────

// ─── クラスLINE ─────────────────────────────────────────────────────

function LineChatScreen({ onBack }: { onBack: () => void }) {
  const memo = INTERVIEW_MEMOS["line_chat"];
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      <div className="sticky top-0 bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-3 z-10">
        <button onClick={onBack} className="text-gray-500 text-sm">← 戻る</button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><span className="text-white text-xs font-bold">L</span></div>
          <span className="text-sm font-semibold text-gray-800">クラスLINEグループ</span>
        </div>
      </div>
      <div className="flex-1 py-4 overflow-y-auto">
        <LineChat messages={LINE_MESSAGES} />
        <div className="mx-4 mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{memo.emoji}</span>
            <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">取材メモ</span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line">{memo.text}</p>
        </div>
      </div>
      <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-2">
        <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-xs text-gray-400">メッセージを入力…</div>
        <button className="text-gray-400 text-sm">送信</button>
      </div>
      <div className="px-5 pb-6 bg-white">
        <ChoiceButton onClick={onBack} variant="secondary">教室に戻る</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 模擬店 ─────────────────────────────────────────────────────────

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
          <div className="text-xs font-semibold tracking-wider text-gray-400 mb-2 uppercase">{alreadyCollected ? "✓ 素材を獲得しました" : "素材を獲得しました"}</div>
          <ConceptImage panel="post_shop" className="w-full h-28 rounded-lg mb-2" label="模擬店の試作品" />
          <div className="text-xs text-gray-500 text-center">模擬店の試作品</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{INTERVIEW_MEMOS["shop"].emoji}</span>
            <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">取材メモ</span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line">{INTERVIEW_MEMOS["shop"].text}</p>
        </div>
      </div>
      <div className="px-5 pb-6">
        <ChoiceButton onClick={onBack} variant="secondary">教室に戻る</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 装飾班 ─────────────────────────────────────────────────────────

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
          <div className="text-xs font-semibold tracking-wider text-gray-400 mb-2 uppercase">{alreadyCollected ? "✓ 素材を獲得しました" : "素材を獲得しました"}</div>
          <ConceptImage panel="post_decoration" className="w-full h-28 rounded-lg mb-2" label="装飾制作風景" />
          <div className="text-xs text-gray-500 text-center">装飾制作風景</div>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">{INTERVIEW_MEMOS["decoration"].emoji}</span>
            <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">取材メモ</span>
          </div>
          <p className="text-sm text-amber-900 leading-relaxed whitespace-pre-line">{INTERVIEW_MEMOS["decoration"].text}</p>
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
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />{item}
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-900 text-white rounded-xl p-5">
          <div className="text-xs text-gray-400 mb-1 tracking-wider uppercase">表彰</div>
          <div className="text-base font-bold">最優秀SNS広報賞</div>
          <p className="text-xs text-gray-300 mt-2 leading-relaxed">SNSで文化祭を一番盛り上げたクラスが表彰されます。</p>
        </div>
      </div>
      <div className="mt-6">
        <ChoiceButton onClick={onNext}>担当を決める</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 広報担当決定 ────────────────────────────────────────────────────

function RoleDecisionScreen({ playerName, onDecide }: { playerName: string; onDecide: () => void }) {
  const [chosen, setChosen] = useState<string | null>(null);

  const handleChoose = (id: string) => {
    setChosen(id);
    setTimeout(() => onDecide(), 1200);
  };

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-gray-100">
      {/* LINE風の場面 */}
      <div className="bg-white border-b border-gray-200 px-5 py-3 flex items-center gap-2">
        <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center"><span className="text-white text-xs font-bold">L</span></div>
        <span className="text-sm font-semibold text-gray-800">1年3組 文化祭グループ</span>
      </div>

      <div className="flex-1 px-4 py-5 space-y-3">
        <div className="flex items-end gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium flex-shrink-0">委</div>
          <div>
            <div className="text-xs text-gray-500 mb-1">委員長</div>
            <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
              SNS広報担当、誰かやってくれる人いますか？
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-gray-400 py-2">…しばらく誰も反応しなかった</div>

        {!chosen ? (
          <div className="pt-4">
            <div className="text-xs text-gray-500 text-center mb-3">あなたはどうする？</div>
            <div className="space-y-2.5">
              {ROLE_CHOICES.map((choice) => (
                <ChoiceButton key={choice.id} variant="choice" onClick={() => handleChoose(choice.id)}>
                  {choice.text}
                </ChoiceButton>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="flex justify-end">
              <div className="bg-yellow-300 rounded-2xl rounded-tr-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
                {ROLE_CHOICES.find((c) => c.id === chosen)?.text}
              </div>
            </div>
            <div className="flex items-end gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium flex-shrink-0">委</div>
              <div>
                <div className="text-xs text-gray-500 mb-1">委員長</div>
                <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800 max-w-[240px]">
                  ありがとう！じゃあアカウント任せるね
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── 文化祭公式アカウント引継ぎ ──────────────────────────────────────

function AccountHandoverScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 pt-8 pb-4 border-b border-gray-100">
        <div className="text-xs text-gray-400 mb-2 tracking-wider uppercase">Account Handover</div>
        <h2 className="text-base font-bold text-gray-900">文化祭公式アカウントを受け取った</h2>
      </div>

      {/* 既存アカウントのプレビュー */}
      <div className="px-5 pt-6">
        <div className="border border-gray-200 rounded-2xl overflow-hidden">
          <div className="bg-gray-50 px-5 py-5 flex items-center gap-4 border-b border-gray-100">
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl flex-shrink-0">🏫</div>
            <div>
              <div className="text-base font-bold text-gray-900">1年3組文化祭公式</div>
              <div className="text-xs text-gray-500">@festival_class</div>
            </div>
          </div>
          <div className="flex border-b border-gray-100">
            <div className="flex-1 text-center py-3 border-r border-gray-100">
              <div className="text-sm font-bold text-gray-900">12</div>
              <div className="text-xs text-gray-400">フォロワー</div>
            </div>
            <div className="flex-1 text-center py-3 border-r border-gray-100">
              <div className="text-sm font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-400">投稿</div>
            </div>
            <div className="flex-1 text-center py-3">
              <div className="text-sm font-bold text-gray-900">0</div>
              <div className="text-xs text-gray-400">広報Pt</div>
            </div>
          </div>
          <div className="px-5 py-4">
            <div className="h-24 bg-gray-100 rounded-xl flex items-center justify-center">
              <span className="text-xs text-gray-400">投稿はまだありません</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-5 pt-5">
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-sm text-gray-700 leading-relaxed">
            このアカウントを使って文化祭を盛り上げよう。
          </p>
          <p className="text-sm text-gray-500 leading-relaxed mt-2">
            まず、アカウントを自分たちらしくしよう。
          </p>
        </div>
      </div>

      <div className="px-5 pb-6 mt-4">
        <ChoiceButton onClick={onNext}>アカウントを設定する</ChoiceButton>
      </div>
    </div>
  );
}

// ─── 文化祭アカウント設定 ────────────────────────────────────────────

function FestivalAccountSetupScreen({ onComplete }: { onComplete: (account: FestivalAccount) => void }) {
  const [accountName, setAccountName] = useState("");
  const [profileText, setProfileText] = useState("");
  const [icon, setIcon]               = useState(FESTIVAL_ICONS[0]);

  const canComplete = accountName !== "" && profileText !== "";

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 pt-7 pb-5 border-b border-gray-100">
        <div className="text-xs text-gray-400 mb-1">文化祭公式アカウント</div>
        <h2 className="text-lg font-bold text-gray-900">アカウントを設定しよう</h2>
      </div>

      <div className="flex-1 px-5 py-6 space-y-6 overflow-y-auto">
        {/* アイコン */}
        <div>
          <div className="text-xs text-gray-500 mb-3">アカウントアイコン</div>
          <div className="flex gap-3">
            {FESTIVAL_ICONS.map((ic) => (
              <button key={ic} onClick={() => setIcon(ic)}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl transition-all ${icon === ic ? "bg-gray-900 ring-2 ring-gray-900 ring-offset-2" : "bg-gray-100 hover:bg-gray-200"}`}>
                {ic}
              </button>
            ))}
          </div>
        </div>

        {/* アカウント名 */}
        <div>
          <div className="text-xs text-gray-500 mb-3">アカウント名を選ぶ</div>
          <div className="space-y-2">
            {ACCOUNT_NAME_OPTIONS.map((name) => (
              <button key={name} onClick={() => setAccountName(name)}
                className={`w-full border rounded-xl px-4 py-3 text-left text-sm transition-colors ${accountName === name ? "border-gray-900 bg-gray-50 font-medium text-gray-900" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}>
                {name}
                {accountName === name && <span className="ml-2">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* プロフィール文 */}
        <div>
          <div className="text-xs text-gray-500 mb-3">プロフィール文を選ぶ</div>
          <div className="space-y-2">
            {ACCOUNT_PROFILE_OPTIONS.map((text) => (
              <button key={text} onClick={() => setProfileText(text)}
                className={`w-full border rounded-xl px-4 py-3 text-left text-sm transition-colors ${profileText === text ? "border-gray-900 bg-gray-50 font-medium text-gray-900" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}>
                {text}
                {profileText === text && <span className="ml-2">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* バナープレースホルダー */}
        <div>
          <div className="text-xs text-gray-500 mb-3">バナー画像</div>
          <div className="h-24 bg-gray-100 rounded-xl border border-dashed border-gray-300 flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs text-gray-400">[ PLACEHOLDER ]</div>
              <div className="text-xs text-gray-400 mt-0.5">後から画像を設定</div>
            </div>
          </div>
        </div>

        {/* プレビュー */}
        {canComplete && (
          <div>
            <div className="text-xs text-gray-500 mb-3">プレビュー</div>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <div className="bg-gray-50 px-4 py-4 flex items-center gap-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xl">{icon}</div>
                <div>
                  <div className="text-sm font-bold text-gray-900">{accountName}</div>
                  <div className="text-xs text-gray-500">{profileText}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pb-6 border-t border-gray-100 pt-4">
        <ChoiceButton
          onClick={() => canComplete && onComplete({ accountName, profileText, icon, followers: 12, posts: 0, points: 0 })}
          disabled={!canComplete}>
          設定完了　初投稿を作る
        </ChoiceButton>
      </div>
    </div>
  );
}

// ─── 初投稿作成 ─────────────────────────────────────────────────────

function FirstPostScreen({ state, onPost }: { state: GameState; onPost: (material: string, caption: string) => void }) {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedCaption, setSelectedCaption]   = useState<string | null>(null);
  const canPost = selectedMaterial !== null && selectedCaption !== null;
  const acc = state.festivalAccount;

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
            {state.collectedMaterials.map((m) => (
              <button key={m} onClick={() => setSelectedMaterial(m)}
                className={`w-full flex items-center gap-3 border rounded-xl px-4 py-3 text-left transition-colors ${selectedMaterial === m ? "border-gray-900 bg-gray-50" : "border-gray-200 hover:border-gray-400"}`}>
                <ConceptImage panel={PANEL_MAP[m] ?? "post_classroom"} className="w-12 h-12 rounded-lg flex-shrink-0" />
                <span className="text-sm text-gray-800">{m}</span>
                {selectedMaterial === m && <span className="ml-auto text-gray-900 font-bold text-sm">✓</span>}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-6">
          <div className="text-xs font-semibold text-gray-500 mb-3 tracking-wider uppercase">投稿文を選ぶ</div>
          <div className="space-y-2">
            {CAPTIONS.map((caption) => (
              <button key={caption} onClick={() => setSelectedCaption(caption)}
                className={`w-full border rounded-xl px-4 py-3 text-left text-sm transition-colors ${selectedCaption === caption ? "border-gray-900 bg-gray-50 font-medium" : "border-gray-200 text-gray-700 hover:border-gray-400"}`}>
                {caption}{selectedCaption === caption && <span className="ml-2">✓</span>}
              </button>
            ))}
          </div>
        </div>
        {canPost && (
          <div className="mb-4">
            <div className="text-xs font-semibold text-gray-500 mb-3 tracking-wider uppercase">プレビュー</div>
            <div className="border border-gray-300 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
                <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm">{acc?.icon ?? "🏫"}</div>
                <span className="text-xs font-medium text-gray-700">{acc?.accountName ?? "1年3組文化祭公式"}</span>
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
  const [likesIndex, setLikesIndex]               = useState(0);
  const [showReactions, setShowReactions]         = useState(false);
  const [visibleReactions, setVisibleReactions]   = useState(0);
  const acc = state.festivalAccount;

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

  return (
    <div className="flex flex-col min-h-[calc(100svh-28px)] bg-white">
      <div className="px-5 py-4 border-b border-gray-200">
        <h2 className="text-base font-bold text-gray-900">投稿しました</h2>
      </div>
      <div className="flex-1 px-5 py-5 overflow-y-auto">
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6">
          <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
            <div className="w-6 h-6 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-sm">{acc?.icon ?? "🏫"}</div>
            <span className="text-xs font-medium text-gray-700">{acc?.accountName ?? "1年3組文化祭公式"}</span>
          </div>
          {state.selectedMaterial && <ConceptImage panel={PANEL_MAP[state.selectedMaterial] ?? "post_classroom"} className="w-full h-28" />}
          <div className="p-3">
            <p className="text-sm text-gray-800">{state.selectedCaption}</p>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-red-500 text-sm">♡</span>
              <span className="text-sm font-bold text-gray-900">{currentLikes}</span>
              {currentLikes < LIKES_SEQUENCE[LIKES_SEQUENCE.length - 1] && <span className="text-xs text-gray-400 ml-1 animate-pulse">…</span>}
            </div>
          </div>
        </div>

        {showReactions && (
          <div className="mb-6">
            <div className="text-xs text-gray-400 mb-3 tracking-wider">クラスLINEの反応</div>
            <div className="space-y-2.5">
              {POST_REACTIONS.slice(0, visibleReactions).map((r, i) => (
                <div key={i} className="flex items-end gap-2">
                  <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 flex-shrink-0">{r.sender.charAt(0)}</div>
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">{r.sender}</div>
                    <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2 text-sm text-gray-800">{r.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {allDone && (
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
            <div className="text-xs font-semibold text-gray-500 mb-3 tracking-wider uppercase">アカウントの変化</div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-gray-600">フォロワー</span><span className="font-bold text-gray-900">12 → 32</span></div>
              <div className="flex justify-between"><span className="text-gray-600">広報ポイント</span><span className="font-bold text-gray-900">0 → 12</span></div>
              <div className="flex justify-between"><span className="text-gray-600">クラス期待度</span><span className="font-bold text-green-600">少し上昇</span></div>
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

function Day1EndScreen({ onDay2, onTitle }: { onDay2: () => void; onTitle: () => void }) {
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
      <div className="w-full mt-8 space-y-3">
        <ChoiceButton onClick={onDay2}>Day 2 へ進む</ChoiceButton>
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

  const baseRef    = useRef<{ name: string; nickname: string; icon: string; comment: string } | null>(null);
  const answersRef = useRef<Record<string, string>>({});

  const go = useCallback((screen: Screen) => {
    setState((s) => ({ ...s, screen }));
    window.scrollTo(0, 0);
  }, []);

  const visitArea = useCallback((key: string, screen: Screen) => {
    setState((s) => {
      const next = new Set(s.visitedAreas);
      next.add(key);
      const mats = [...s.collectedMaterials];
      if (key === "shop"       && !mats.includes("模擬店の試作品")) mats.push("模擬店の試作品");
      if (key === "decoration" && !mats.includes("装飾制作風景"))   mats.push("装飾制作風景");
      return { ...s, screen, visitedAreas: next, collectedMaterials: mats };
    });
    window.scrollTo(0, 0);
  }, []);

  const handleBaseCreated = useCallback((base: { name: string; nickname: string; icon: string; comment: string }) => {
    baseRef.current = base;
    go("player_q1");
  }, [go]);

  const handleSurveyAnswer = useCallback((qKey: string, value: string) => {
    answersRef.current[qKey] = value;
    if (qKey === "q3") {
      const profile = buildPlayerProfile(
        baseRef.current ?? { name: "名無し", nickname: "名無し", icon: "🙂", comment: "" },
        { q1: answersRef.current.q1 ?? "none", q2: answersRef.current.q2 ?? "view_only", q3: value }
      );
      setState((s) => ({ ...s, playerProfile: profile, screen: "player_result" }));
      window.scrollTo(0, 0);
    } else {
      go(qKey === "q1" ? "player_q2" : "player_q3");
    }
  }, [go]);

  const handleAccountComplete = useCallback((account: FestivalAccount) => {
    setState((s) => ({ ...s, festivalAccount: account, screen: "op2_teacher" }));
    window.scrollTo(0, 0);
  }, []);

  // ── Day2 ──────────────────────────────────────────────────────────

  const handleDay2AreaSelect = useCallback((area: Day2AreaId) => {
    setState((s) => ({ ...s, day2Area: area, screen: "day2_interview" }));
    window.scrollTo(0, 0);
  }, []);

  const handleDay2Angle = useCallback((angle: string) => {
    setState((s) => ({ ...s, day2Angle: angle, screen: "day2_post_waiting" }));
    window.scrollTo(0, 0);
  }, []);

  const handleDay2PostDone = useCallback((outcome: ReturnType<typeof computeDay2Outcome>) => {
    setState((s) => ({
      ...s,
      festivalAccount: s.festivalAccount
        ? { ...s.festivalAccount, followers: outcome.newFollowers }
        : null,
      trust:      s.trust + outcome.trustGain,
      attention:  s.attention + outcome.attentionGain,
      flameRisk:  s.flameRisk + outcome.flameRiskGain,
      rank:       outcome.newRank,
      screen:     "day2_rank_event",
    }));
    window.scrollTo(0, 0);
  }, []);

  // ── Day3 ──────────────────────────────────────────────────────────

  const handleDay3MeetupNext = useCallback((rivalId: string) => {
    setState((s) => {
      const nextIndex = s.day3MeetupIndex + 1;
      if (nextIndex >= 3) {
        return { ...s, day3MeetupIndex: nextIndex, screen: "day3_meetup_reflect" };
      }
      return { ...s, day3MeetupIndex: nextIndex, screen: "day3_meetup" };
    });
    window.scrollTo(0, 0);
  }, []);

  const handleDay3AreaSelect = useCallback((areaId: string) => {
    setState((s) => ({ ...s, day3Area: areaId, screen: "day3_interview" }));
    window.scrollTo(0, 0);
  }, []);

  const handleDay3PostTheme = useCallback((themeId: string) => {
    setState((s) => ({ ...s, day3PostTheme: themeId, screen: "day3_post_waiting" }));
    window.scrollTo(0, 0);
  }, []);

  const handleDay3PostDone = useCallback((outcome: ReturnType<typeof computeDay3Outcome>) => {
    setState((s) => ({
      ...s,
      festivalAccount: s.festivalAccount
        ? { ...s.festivalAccount, followers: s.festivalAccount.followers + outcome.followerGain }
        : null,
      trust:     s.trust + outcome.trustGain,
      attention: s.attention + outcome.attentionGain,
      flameRisk: s.flameRisk + outcome.flameRiskGain,
      rank:      outcome.newRank,
      screen:    "day3_result",
    }));
    window.scrollTo(0, 0);
  }, []);

  // ── Day1 投稿 ──────────────────────────────────────────────────────

  const handlePost = useCallback((material: string, caption: string) => {
    setState((s) => ({
      ...s,
      screen: "post_result",
      selectedMaterial: material,
      selectedCaption: caption,
      festivalAccount: s.festivalAccount ? { ...s.festivalAccount, followers: 32, points: 12 } : null,
      likes: LIKES_SEQUENCE[LIKES_SEQUENCE.length - 1],
    }));
  }, []);

  const { screen } = state;

  return (
    <PhoneFrame>
      {screen === "title"       && <TitleScreen onNext={() => go("scene_set")} onDevJump={(s, extra) => { setState((cur) => ({ ...cur, ...extra, screen: s })); window.scrollTo(0,0); }} />}
      {screen === "scene_set"   && <SceneSetScreen onNext={() => go("notify_intro")} />}
      {screen === "notify_intro" && <NotifyIntroScreen onNext={() => go("prologue")} />}
      {screen === "prologue"    && <PrologueScreen onNext={() => go("player_create")} />}

      {/* プレイヤー（高校生）プロフィール */}
      {screen === "player_create" && <PlayerCreateScreen onNext={handleBaseCreated} />}
      {screen === "player_q1"    && <PlayerQuestionScreen questionIndex={0} onAnswer={(v) => handleSurveyAnswer("q1", v)} />}
      {screen === "player_q2"    && <PlayerQuestionScreen questionIndex={1} onAnswer={(v) => handleSurveyAnswer("q2", v)} />}
      {screen === "player_q3"    && <PlayerQuestionScreen questionIndex={2} onAnswer={(v) => handleSurveyAnswer("q3", v)} />}
      {screen === "player_result" && state.playerProfile && (
        <PlayerResultScreen profile={state.playerProfile} onNext={() => go("account_handover")} />
      )}

      {/* OP / 自由探索 */}
      {screen === "op2_teacher"  && <Op2TeacherScreen  onNext={() => go("op2_ranking")} />}
      {screen === "op2_ranking"  && <Op2RankingScreen  onNext={() => go("op2_reaction")} />}
      {screen === "op2_reaction" && <Op2ReactionScreen onNext={() => go("op2_sns")} />}
      {screen === "op2_sns"      && <Op2SnsScreen      onNext={() => go("op2_goal")} />}
      {screen === "op2_goal"     && <Op2GoalScreen     onNext={() => go("classroom")} />}
      {screen === "classroom"    && <ClassroomScreen state={state} onNavigate={visitArea} onContinue={() => go("contest_announcement")} />}
      {screen === "line_chat"    && <LineChatScreen onBack={() => go("classroom")} />}
      {screen === "shop"         && <ShopScreen onBack={() => go("classroom")} alreadyCollected={state.collectedMaterials.includes("模擬店の試作品")} />}
      {screen === "decoration"   && <DecorationScreen onBack={() => go("classroom")} alreadyCollected={state.collectedMaterials.includes("装飾制作風景")} />}

      {/* SNS広報担当〜アカウント設定 */}
      {screen === "account_handover"     && <AccountHandoverScreen onNext={() => go("festival_account_setup")} />}
      {screen === "festival_account_setup" && <FestivalAccountSetupScreen onComplete={handleAccountComplete} />}
      {screen === "contest_announcement" && <ContestAnnouncementScreen onNext={() => go("first_post")} />}

      {/* 投稿 */}
      {screen === "first_post"  && <FirstPostScreen state={state} onPost={handlePost} />}
      {screen === "post_result" && <PostResultScreen state={state} onEnd={() => go("day1_end")} />}
      {screen === "day1_end"    && <Day1EndScreen onDay2={() => go("day2_start")} onTitle={() => go("title")} />}

      {/* ── Day2 ── */}
      {screen === "day2_start"        && <Day2MorningScreen   onNext={() => go("day2_comments")} />}
      {screen === "day2_comments"     && <Day2CommentsScreen  state={state} onNext={() => go("day2_line")} />}
      {screen === "day2_line"         && <Day2LineScreen      onNext={() => go("day2_mission")} />}
      {screen === "day2_mission"      && <Day2MissionScreen   state={state} onNext={() => go("day2_classroom")} />}
      {screen === "day2_classroom"    && (
        <Day2ClassroomScreen state={state} onAreaSelect={handleDay2AreaSelect} onContinue={() => go("day2_post")} />
      )}
      {screen === "day2_interview"    && state.day2Area && (
        <Day2InterviewScreen areaId={state.day2Area as Day2AreaId} onBack={() => go("day2_classroom")} />
      )}
      {screen === "day2_post"         && <Day2PostScreen        state={state} onPost={handleDay2Angle} />}
      {screen === "day2_post_waiting" && <Day2PostWaitingScreen onNext={() => go("day2_post_result")} />}
      {screen === "day2_post_result"  && <Day2PostResultScreen  state={state} onDone={handleDay2PostDone} />}
      {screen === "day2_rank_event"   && <Day2RankEventScreen   state={state} onNext={() => go("day2_line2")} />}
      {screen === "day2_line2"        && <Day2Line2Screen       state={state} onNext={() => go("day2_rivals")} />}
      {screen === "day2_rivals"       && <Day2RivalsScreen      state={state} onNext={() => go("day2_end")} />}
      {screen === "day2_end"          && <Day2EndScreen         state={state} onDay3={() => go("day3_morning")} onTitle={() => go("title")} />}

      {/* ── Day3 ───────────────────────────────────────────────── */}
      {screen === "day3_morning"        && <Day3MorningScreen      onNext={() => go("day3_ranking")} />}
      {screen === "day3_ranking"        && <Day3RankingScreen      state={state} onNext={() => go("day3_meetup_intro")} />}
      {screen === "day3_meetup_intro"   && <Day3MeetupIntroScreen  onNext={() => { setState((s) => ({ ...s, day3MeetupIndex: 0, screen: "day3_meetup" })); window.scrollTo(0, 0); }} />}
      {screen === "day3_meetup"         && (
        <Day3MeetupScreen rivalIndex={state.day3MeetupIndex} onNext={handleDay3MeetupNext} />
      )}
      {screen === "day3_meetup_reflect" && (
        <Day3MeetupReflectScreen
          lastRivalId={["seto","mizuno","kurosaki"][Math.min(state.day3MeetupIndex - 1, 2)]}
          onNext={() => go("day3_classroom")}
        />
      )}
      {screen === "day3_classroom"      && <Day3ClassroomScreen   onArea={handleDay3AreaSelect} />}
      {screen === "day3_interview"      && state.day3Area && (
        <Day3InterviewScreen areaId={state.day3Area} onDone={() => go("day3_post")} />
      )}
      {screen === "day3_post"           && <Day3PostScreen         state={state} onPost={handleDay3PostTheme} />}
      {screen === "day3_post_waiting"   && <Day3PostWaitingScreen  onNext={() => go("day3_post_result")} />}
      {screen === "day3_post_result"    && <Day3PostResultScreen   state={state} onNext={handleDay3PostDone} />}
      {screen === "day3_result"         && <Day3ResultScreen       state={state} onNext={() => go("day3_end")} />}
      {screen === "day3_end"            && <Day3EndScreen          state={state} onDay4={() => go("day4_home")} onTitle={() => go("title")} />}

      {/* ── Day4 ───────────────────────────────────────────────── */}
      {screen === "day4_home" && (
        <Day4Game
          state={state}
          onComplete={(result: Day4Result) => {
            setState(s => ({
              ...s,
              festivalAccount: s.festivalAccount
                ? { ...s.festivalAccount, followers: s.festivalAccount.followers + result.followerGain }
                : null,
              trust:            s.trust + result.trustGain,
              rank:             result.newRank,
              day4FollowerGain: result.followerGain,
              screen:           "day5_home",
            }));
            window.scrollTo(0, 0);
          }}
          onTitle={() => go("title")}
        />
      )}

      {/* ── Day5 ───────────────────────────────────────────────── */}
      {screen === "day5_home" && (
        <Day5Game
          state={state}
          onComplete={(result: Day5Result) => {
            setState(s => ({
              ...s,
              festivalAccount: s.festivalAccount
                ? { ...s.festivalAccount, followers: s.festivalAccount.followers + result.followerGain }
                : null,
              trust:            s.trust + result.trustGain,
              rank:             result.newRank,
              day5FollowerGain: result.followerGain,
              screen:           "title",
            }));
            window.scrollTo(0, 0);
          }}
          onTitle={() => go("title")}
        />
      )}
    </PhoneFrame>
  );
}
