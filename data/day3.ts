// ─── Day3 データ定義（価値観と出会う日） ────────────────────────────────

export const DAY3_MORNING_LINE = [
  { id: "l1", sender: "翔（親友）",   text: "今日、SNS広報交流会あるらしいよ",         type: "left"  as const },
  { id: "l2", sender: "翔（親友）",   text: "他のクラスの担当と話す機会だって",           type: "left"  as const },
  { id: "l3", sender: "葵（委員長）", text: "今日の交流会、ちゃんと話せそう？",           type: "left"  as const },
  { id: "l4", sender: "葵（委員長）", text: "A組の人とか来るんだって。どう向き合うか考えておいて", type: "left" as const },
];

// ─── 中間順位 ────────────────────────────────────────────────────────────

export const DAY3_RANKING = [
  { rank: 1, name: "A組",      followers: 3200, isRival: true },
  { rank: 2, name: "D組",      followers: 1500, isRival: true },
  { rank: 3, name: "C組",      followers: 850,  isRival: true },
  { rank: 4, name: "E組",      followers: 610,  isRival: false },
  { rank: 5, name: "F組",      followers: 480,  isRival: false },
  { rank: 6, name: "B組",      followers: 390,  isRival: false },
  { rank: 7, name: "自分たち", followers: 0,    isOwn: true },
  { rank: 8, name: "G組",      followers: 210,  isRival: false },
];

// ─── SNS広報交流会 ──────────────────────────────────────────────────────

export interface MeetupRival {
  id:         string;
  name:       string;
  className:  string;
  emoji:      string;
  philosophy: string;     // 一言フィロソフィー（表示）
  lines:      string[];   // 最初のセリフ（順番に表示）
  choices:    { id: string; label: string }[];
  responses:  Record<string, string[]>;
  closing:    string;     // 別れ際の一言
}

export const DAY3_MEETUP_RIVALS: MeetupRival[] = [
  {
    id:         "seto",
    name:       "瀬戸翔太",
    className:  "A組",
    emoji:      "🔥",
    philosophy: "「見られなきゃ伝わらない」",
    lines: [
      "あ、3組の広報担当？",
      "昨日の投稿、見たよ",
      "正直に言うと……もったいないと思った",
      "内容はいいんだけど、もっとバーンと目を引かないと誰も止まらない",
    ],
    choices: [
      { id: "agree",     label: "そうかも、どうすれば？" },
      { id: "question",  label: "目を引くって具体的には？" },
      { id: "disagree",  label: "でも伝わる人に伝わればいい" },
    ],
    responses: {
      agree:    ["サムネが全てだよ。最初の0.5秒。そこで負けたら終わり", "うちのアカウント参考にしてみて"],
      question: ["インパクトのある一枚目、キャッチーな文字入れ、音楽。全部計算してる", "センスだけじゃなくて戦略ね"],
      disagree: ["……まぁ、それも一つの考え方だよね", "でも結果は数字に出るから。ふふ"],
    },
    closing: "負けないけどね",
  },
  {
    id:         "mizuno",
    name:       "水野澪",
    className:  "C組",
    emoji:      "🌿",
    philosophy: "「伝わることと伸びることは違う」",
    lines: [
      "こんにちは。3組の人だよね",
      "あなたの投稿、コメント読んだよ",
      "数字より、コメントの内容がすごくよかった",
      "「応援したくなった」ってコメント——あれ、本物だと思う",
    ],
    choices: [
      { id: "curious",  label: "どういう意識で投稿してるの？" },
      { id: "thanks",   label: "ありがとう。嬉しい" },
      { id: "honest",   label: "正直、数字も気になる" },
    ],
    responses: {
      curious:  ["見てる人が「自分のことみたい」って思えるかを考えてる", "共感って、フォローより強いと思うから"],
      thanks:   ["コメント欄が温かいアカウントって、長く続くんだよね", "あなたの投稿、そういう雰囲気がある"],
      honest:   ["気になるよね、わかる笑", "でも数字を追いすぎると、だんだん無理してくる自分に気づくんだ"],
    },
    closing: "お互い、自分らしい投稿ができるといいね",
  },
  {
    id:         "kurosaki",
    name:       "黒崎蓮",
    className:  "D組",
    emoji:      "⚡",
    philosophy: "「普通じゃ誰も止まらない」",
    lines: [
      "お、3組の広報じゃん",
      "俺、あなたの投稿けっこう分析したんだよね",
      "悪くはない。でも「普通すぎる」んだよな",
      "文化祭なんてどこでもやってる。だから普通じゃ誰も止まらない",
    ],
    choices: [
      { id: "curious",   label: "じゃあどうすれば？" },
      { id: "pushback",  label: "普通の良さもあると思う" },
      { id: "neutral",   label: "考え方の違いかも" },
    ],
    responses: {
      curious:  ["サプライズ、禁断感、ドラマ性。見た人が「え！？」ってなる瞬間を作ること", "リスクは取らないと目立てない"],
      pushback: ["……そう思うなら、それでいいんじゃない", "ただ、上位狙うなら考え直したほうがいいかもよ"],
      neutral:  ["まぁな。俺は俺の戦略でやる", "あなたはあなたでやればいい。どっちが正しいか、結果で出る"],
    },
    closing: "まぁ、楽しもうぜ",
  },
];

// ─── 交流会後のひとりごと ────────────────────────────────────────────────

export const DAY3_MEETUP_REFLECTS: Record<string, string[]> = {
  seto: [
    "瀬戸くんの言葉が頭に残る",
    "「見られなきゃ伝わらない」",
    "……そうなのかな。でも、なんか違う気もする",
  ],
  mizuno: [
    "水野さんの言葉が、なんかしっくりきた",
    "「伝わることと伸びることは違う」",
    "……正直、そういう投稿ができてるか自信ないけど",
  ],
  kurosaki: [
    "黒崎くんの言葉は刺さった",
    "「普通じゃ誰も止まらない」",
    "……俺たちの投稿って、普通なのかな",
  ],
};

// ─── Day3 取材キャラクター ────────────────────────────────────────────────

export interface Day3Character {
  areaId:       string;
  name:         string;
  role:         string;
  emoji:        string;
  initialLines: string[];
  choices:      { id: string; label: string }[];
  responses:    Record<string, string[]>;
  material:     string;
}

export const DAY3_CHARACTERS: Record<string, Day3Character> = {
  dance: {
    areaId: "dance",
    name:   "美月（ダンス班長）",
    role:   "ダンス班 班長",
    emoji:  "💃",
    initialLines: [
      "昨日の投稿、クラス内でめっちゃ話題になったよ！",
      "先輩にも見せたら「いいね」もらえて",
      "今日は通し練習するんだ。良かったら全部見ていって",
    ],
    choices: [
      { id: "cheer",   label: "絶対うまくいく！" },
      { id: "curious", label: "通し練習って？" },
      { id: "join",    label: "一緒に盛り上げたい" },
    ],
    responses: {
      cheer:   ["ありがとう……！そういう言葉、すごく力になる", "今日の練習、全部見せるね"],
      curious: ["本番と同じ流れで最初から最後まで。失敗しても止まらない", "緊張するけど、やってみる。撮っといてよ"],
      join:    ["うれしい！じゃあ練習の空気感ごと伝えてよ", "みんなの必死な顔、絶対いい絵になると思う"],
    },
    material: "ダンス通し練習の全力の姿",
  },
  shop: {
    areaId: "shop",
    name:   "模擬店リーダー",
    role:   "模擬店 リーダー",
    emoji:  "🍟",
    initialLines: [
      "見て！チュロス、ようやく形になってきた！",
      "昨日のコメントで「食べたい」って来てて、めちゃくちゃモチベ上がった",
      "今日は試食会もやるんだ",
    ],
    choices: [
      { id: "excited",  label: "食べたい！！" },
      { id: "capture",  label: "その瞬間撮りたい" },
      { id: "question", label: "何回失敗したの？" },
    ],
    responses: {
      excited:  ["絶対食べさせる笑 でも先に撮って！もったいなくて食べれなくなるから笑"],
      capture:  ["そう！みんなの顔が一番いい瞬間だと思う", "試食の瞬間、絶対撮ってよ"],
      question: ["17回笑", "でもその分、自信ある！今日の試食、撮りながら見てて"],
    },
    material: "試食会の笑顔と達成感",
  },
  decoration: {
    areaId: "decoration",
    name:   "装飾班長",
    role:   "装飾班 班長",
    emoji:  "🎨",
    initialLines: [
      "昨日コメントで「完成楽しみ」って来てたの、見た？",
      "班のみんながすごく喜んでて",
      "今日、メインの看板の色塗りをするんだけど……やっぱり不安で",
    ],
    choices: [
      { id: "encourage", label: "絶対大丈夫" },
      { id: "empathize", label: "緊張するよね" },
      { id: "capture",   label: "その不安も撮っていい？" },
    ],
    responses: {
      encourage: ["ありがとう。…やる！今日の色塗り、全部見ててよ"],
      empathize: ["うん……でも、コメントもらって少し楽になった", "一緒に見ててよ、色塗り"],
      capture:   ["え笑 ……いいよ、ありのまま撮って", "完成した時との差が出たら面白いかも"],
    },
    material: "看板に色が入っていく瞬間",
  },
  brass: {
    areaId: "brass",
    name:   "吹奏楽部部長",
    role:   "吹奏楽部 部長",
    emoji:  "🎺",
    initialLines: [
      "昨日の投稿見て、部員みんなで読んだよ",
      "「応援してます」のコメント……泣きそうになった",
      "今日、初めて通し演奏するんだ",
    ],
    choices: [
      { id: "moved",   label: "そのコメント、俺も嬉しかった" },
      { id: "nervous", label: "通し、緊張する？" },
      { id: "capture", label: "その瞬間を伝えたい" },
    ],
    responses: {
      moved:   ["本当に？……ありがとう", "当日来てくれる人のために演奏したい。それだけ"],
      nervous: ["めちゃくちゃ緊張する笑", "でも、ここまで練習してきたから。聴いてく？"],
      capture: ["うん。音だけじゃなくて、みんなの表情も全部、伝えてほしい"],
    },
    material: "初の通し演奏、緊張と解放",
  },
};

// ─── Day3 取材先エリア情報 ────────────────────────────────────────────────

export const DAY3_AREAS = [
  { id: "dance",      label: "ダンス班",   emoji: "💃", desc: "通し練習をするみたい" },
  { id: "shop",       label: "模擬店",     emoji: "🍟", desc: "試食会があるらしい" },
  { id: "decoration", label: "装飾班",     emoji: "🎨", desc: "色塗りが始まるみたい" },
  { id: "brass",      label: "吹奏楽部",   emoji: "🎺", desc: "初の通し演奏がある" },
] as const;

export type Day3AreaId = (typeof DAY3_AREAS)[number]["id"];

// ─── 投稿テーマ（切り口） ─────────────────────────────────────────────────

export interface Day3PostTheme {
  id:      string;
  label:   string;
  desc:    string;
  preview: string;
}

export const DAY3_POST_THEMES: Record<string, Day3PostTheme[]> = {
  dance: [
    { id: "effort",  label: "全力の姿を伝える",  desc: "一生懸命さが伝わる切り口。見た人が応援したくなる",    preview: "「練習、ずっと止まらなかった」" },
    { id: "fun",     label: "楽しさを前面に",    desc: "楽しい空気が伝わる。一緒に楽しみたい気持ちを呼ぶ",  preview: "「笑いながら全力でやってた」" },
    { id: "drama",   label: "ドラマ性を演出",    desc: "失敗→立ち直りのストーリー。見ごたえが出る",         preview: "「ミスしても、すぐ立ち上がった」" },
  ],
  shop: [
    { id: "effort",  label: "17回の失敗を伝える", desc: "苦労が伝わる。応援コメントが来やすい",              preview: "「17回失敗して、ようやく」" },
    { id: "fun",     label: "試食の笑顔を届ける", desc: "楽しい雰囲気が伝わる。来たい気持ちを引き出す",      preview: "「みんなの顔が最高だった」" },
    { id: "drama",   label: "完成の感動を演出",   desc: "達成感のストーリー。感情移入しやすい",              preview: "「できた！って声が聞こえた瞬間」" },
  ],
  decoration: [
    { id: "effort",  label: "作業の大変さを見せる", desc: "細かい作業や苦労が伝わる。信頼感が上がる",         preview: "「細部まで妥協なし」" },
    { id: "fun",     label: "色が入る楽しさを伝える", desc: "変化の楽しさが伝わる。ワクワク感を共有",         preview: "「色が入るたびに歓声が上がった」" },
    { id: "drama",   label: "完成への期待を高める",  desc: "まだ完成していないことが武器になる演出",          preview: "「あと少し。続きは当日に」" },
  ],
  brass: [
    { id: "effort",  label: "練習の積み重ねを伝える", desc: "ここまでの努力が伝わる。感動コメントが来やすい", preview: "「何度も繰り返した音が重なった」" },
    { id: "fun",     label: "音楽の楽しさを届ける",   desc: "聴きに来たい気持ちを引き出す。期待感を高める",  preview: "「楽しそうな音が廊下まで届いた」" },
    { id: "drama",   label: "緊張と解放を演出",       desc: "感情の波が伝わる。共感を呼びやすい",            preview: "「緊張していた顔が、弾けた」" },
  ],
};

// ─── 投稿後キャラクター反応 ──────────────────────────────────────────────

export const DAY3_AREA_REACTIONS: Record<string, Record<string, string>> = {
  dance: {
    effort: "「必死な顔、ちゃんと伝わった」って美月が言ってた",
    fun:    "「あの笑顔の写真、みんなに見せた」って美月から連絡来た",
    drama:  "「ミスのシーン使ってくれたんだ」って美月は最初照れてたけど、コメントが来て喜んでた",
  },
  shop: {
    effort: "「17回って書いてくれたのが一番刺さった」ってリーダーが言ってた",
    fun:    "「試食の写真、食べたいコメントすごい来てる」ってリーダーが興奮してた",
    drama:  "「完成の瞬間の動画、もう一回見た」ってリーダーが笑いながら言ってた",
  },
  decoration: {
    effort: "「大変さ伝わったって言ってもらえた」って班長が嬉しそうにしてた",
    fun:    "「色塗りの動画、クラス内で回ってる」って班長から連絡来た",
    drama:  "「続きは当日に、ってコメント来た。プレッシャーだけど嬉しい」って班長が言ってた",
  },
  brass: {
    effort: "「練習してきた意味が伝わった気がした」って部長が静かに言ってた",
    fun:    "「聴きに行きますのコメント、読んで泣きそうになった」って部長が言ってた",
    drama:  "「緊張してる顔が映ってたの恥ずかしかったけど、みんなが共感してくれた」って部長が言ってた",
  },
};

// ─── 投稿結果計算 ─────────────────────────────────────────────────────────

export function computeDay3Outcome(area: string, theme: string) {
  let followerGain  = 55;
  let trustGain     = 4;
  let attentionGain = 4;
  let flameRiskGain = 1;

  if (theme === "effort") {
    trustGain     += 10;
    attentionGain += 2;
  } else if (theme === "fun") {
    followerGain  += 12;
    attentionGain += 8;
    flameRiskGain += 1;
  } else if (theme === "drama") {
    followerGain  += 8;
    attentionGain += 10;
    flameRiskGain += 3;
  }

  const newRank = theme === "effort" ? 6 : 5;

  return { followerGain, trustGain, attentionGain, flameRiskGain, newRank };
}

// ─── Day3 終了モノローグ ──────────────────────────────────────────────────

export const DAY3_END_MONOLOGUE = [
  "今日、3人と話した",
  "みんな同じ「文化祭を盛り上げたい」って気持ちなのに、全然違うことを言ってた",
  "誰が正しいのかは、まだわからない",
  "でも、俺はどうしたいんだろう",
  "…………あと4日",
];

// ─── Day3 終了後LINE ─────────────────────────────────────────────────────

export const DAY3_END_LINE = [
  { id: "e1", sender: "翔（親友）",   text: "今日の交流会どうだった？",             type: "left"  as const },
  { id: "e2", sender: "翔（親友）",   text: "なんか顔してるじゃん笑",               type: "left"  as const },
  { id: "e3", sender: "葵（委員長）", text: "投稿見た。コメントすごく温かかった",   type: "left"  as const },
  { id: "e4", sender: "葵（委員長）", text: "あなたの投稿、クラスのみんなが誇りに思ってると思う", type: "left" as const },
];
