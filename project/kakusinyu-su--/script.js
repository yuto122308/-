// script.js
// ----------------------
// データ定義
// ----------------------
const MAX_TURNS = 15;

const newsPool = [
  "「学校スマホ禁止」案がトレンド入り",
  "「AIに宿題やらせた」動画がバズる",
  "「制服廃止」アンケートが物議を醸す",
  "「SNS年齢制限」強化のニュースが話題",
  "人気VTuberの発言が炎上中",
  "「校則おかしくない？」タグが急上昇",
  "「テスト廃止」署名が拡散される",
  "迷惑動画投稿者が謝罪配信を開始",
  "「AI先生」導入のニュースに賛否両論",
  "有名インフルエンサーの不適切発言が拡散中",
];

const postTypes = [
  {
    id: "calm",
    label: "冷静分析",
    sub: "「データ的には〜」",
    preview:
      "データや事例を見ても、もう少し落ち着いて議論した方が良さそう。",
    effects: {
      followers: [80, 140],
      trust: [4, 9],
      heat: [-2, 2],
      division: [-4, 1],
      conspiracy: [-4, 0],
      humor: [-1, 2],
    },
    weight: {
      calm: 3,
      hype: 0.5,
      flame: 0.5,
      conspiracy: 0.3,
      meme: 1,
    },
  },
  {
    id: "emotional",
    label: "感情煽り",
    sub: "「もう終わりだろこれ」",
    preview: "正直これ、もう終わってるだろ…。",
    effects: {
      followers: [200, 420],
      trust: [-4, 1],
      heat: [6, 14],
      division: [6, 12],
      conspiracy: [0, 4],
      humor: [0, 3],
    },
    weight: {
      calm: 0.4,
      hype: 3,
      flame: 2.5,
      conspiracy: 1.2,
      meme: 1.4,
    },
  },
  {
    id: "meme",
    label: "ネタ化",
    sub: "「先生もスマホ禁止にしろｗ」",
    preview: "先生もスマホ禁止にしたら世界平和くるってマジ？ｗ",
    effects: {
      followers: [160, 360],
      trust: [-2, 3],
      heat: [0, 6],
      division: [0, 5],
      conspiracy: [-2, 2],
      humor: [6, 12],
    },
    weight: {
      calm: 0.7,
      hype: 1.8,
      flame: 1.4,
      conspiracy: 0.8,
      meme: 3,
    },
  },
  {
    id: "flame",
    label: "煽り投稿",
    sub: "「これ擁護してるやつ全員やばい」",
    preview: "これ擁護してるやつ、全員やばいだろ普通に。",
    effects: {
      followers: [220, 480],
      trust: [-6, 0],
      heat: [10, 20],
      division: [10, 18],
      conspiracy: [2, 6],
      humor: [0, 4],
    },
    weight: {
      calm: 0.3,
      hype: 3.2,
      flame: 3.5,
      conspiracy: 1.6,
      meme: 1.2,
    },
  },
  {
    id: "empathy",
    label: "共感投稿",
    sub: "「しんどい人多そう」",
    preview: "これでしんどくなってる人、めちゃくちゃ多そうだな…。",
    effects: {
      followers: [120, 260],
      trust: [2, 7],
      heat: [-2, 4],
      division: [-2, 3],
      conspiracy: [-3, 1],
      humor: [1, 4],
    },
    weight: {
      calm: 2,
      hype: 1.2,
      flame: 0.8,
      conspiracy: 0.5,
      meme: 1.5,
    },
  },
  {
    id: "conspiracy",
    label: "陰謀論",
    sub: "「裏で企業が操ってる」",
    preview: "どうせ裏で企業が全部コントロールしてるだけでしょ。",
    effects: {
      followers: [140, 420],
      trust: [-10, -4],
      heat: [4, 12],
      division: [4, 10],
      conspiracy: [10, 18],
      humor: [0, 3],
    },
    weight: {
      calm: 0.2,
      hype: 1.6,
      flame: 1.8,
      conspiracy: 3.5,
      meme: 0.9,
    },
  },
];

// コメントテンプレ
const commentTemplates = {
  positive: [
    "これはガチで正論。",
    "よく言ってくれた…！",
    "それなすぎる。",
    "こういう視点ありがたい。",
    "フォローしました。",
  ],
  negative: [
    "さすがに言い過ぎでは？",
    "これはちょっと危ない。",
    "またバズり狙いかよ。",
    "情報ソースどこ？",
    "炎上しそうなこと言うなｗ",
  ],
  neutral: [
    "なるほどね〜。",
    "たしかに一理ある。",
    "コメント欄カオスで草。",
    "この話題むずいな。",
    "とりあえず様子見。",
  ],
  hype: [
    "これバズるわｗｗｗ",
    "タイムラインこれだらけで草",
    "通知止まらんやろこれ",
    "アルゴに完全に刺さってる",
  ],
  flame: [
    "地獄のコメント欄始まったな",
    "これは燃えるやつ",
    "逆張り合戦スタート",
    "タイムラインが火事で草",
  ],
  conspiracy: [
    "やっぱり裏あるよな…",
    "これ前から言われてたよ",
    "気づいてる人少なすぎる",
    "真実に近づきすぎてる",
  ],
  meme: [
    "ネタにするなｗｗｗ",
    "スタンプ職人湧いてて草",
    "切り抜き待ってます",
    "音源化されそう",
  ],
};

// ----------------------
// 状態
// ----------------------
let state;

function initState() {
  state = {
    turn: 1,
    followers: 120,
    trust: 50,
    heat: 0,
    division: 10,
    conspiracy: 5,
    humor: 10,
    // おすすめアルゴリズム傾向
    algo: {
      calm: 1,
      hype: 1,
      flame: 1,
      conspiracy: 1,
      meme: 1,
    },
    currentNews: "",
    lastPostType: null,
  };
}

// ----------------------
// ユーティリティ
// ----------------------
function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function pickRandom(arr) {
  return arr[randInt(0, arr.length - 1)];
}

// ----------------------
// DOM取得
// ----------------------
const titleScreen = document.getElementById("title-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");

const startBtn = document.getElementById("start-btn");
const replayBtn = document.getElementById("replay-btn");

const followersEl = document.getElementById("followers");
const trustEl = document.getElementById("trust");
const heatEl = document.getElementById("heat");
const turnEl = document.getElementById("turn");

const newsTextEl = document.getElementById("news-text");
const postButtonsEl = document.getElementById("post-buttons");
const resultPanelEl = document.getElementById("result-panel");
const resultTitleEl = document.getElementById("result-title");
const resultDetailEl = document.getElementById("result-detail");

const trendTagsEl = document.getElementById("trend-tags");
const postStyleLabelEl = document.getElementById("post-style-label");
const postPreviewTextEl = document.getElementById("post-preview-text");
const likeCountEl = document.getElementById("like-count");
const repostCountEl = document.getElementById("repost-count");
const commentCountEl = document.getElementById("comment-count");
const commentListEl = document.getElementById("comment-list");
const notifIconEl = document.getElementById("notif-icon");

const finalFollowersEl = document.getElementById("final-followers");
const finalTrustEl = document.getElementById("final-trust");
const finalHeatEl = document.getElementById("final-heat");
const worldLabelEl = document.getElementById("world-label");
const worldDescEl = document.getElementById("world-desc");

const seBuzz = document.getElementById("se-buzz");
const seFire = document.getElementById("se-fire");
const seNotif = document.getElementById("se-notif");

// ----------------------
// 画面切り替え
// ----------------------
function showScreen(screen) {
  [titleScreen, gameScreen, resultScreen].forEach((s) =>
    s.classList.remove("active")
  );
  screen.classList.add("active");
}

// ----------------------
// UI更新
// ----------------------
function updateStatsUI() {
  followersEl.textContent = Math.round(state.followers).toLocaleString();
  trustEl.textContent = Math.round(state.trust);
  heatEl.textContent = Math.round(state.heat);
  turnEl.textContent = state.turn;

  [followersEl, trustEl, heatEl].forEach((el) => {
    el.classList.remove("pop-number");
    void el.offsetWidth;
    el.classList.add("pop-number");
  });
}

function updateNews() {
  state.currentNews = pickRandom(newsPool);
  newsTextEl.textContent = state.currentNews;
}

function buildPostButtons() {
  postButtonsEl.innerHTML = "";
  postTypes.forEach((pt) => {
    const btn = document.createElement("button");
    btn.className = "post-btn";
    btn.innerHTML = `
      <div class="post-btn-main">${pt.label}</div>
      <div class="post-btn-sub">${pt.sub}</div>
    `;
    btn.addEventListener("click", () => handlePost(pt));
    postButtonsEl.appendChild(btn);
  });
}

function updateTrends() {
  trendTagsEl.innerHTML = "";

  const scores = [
    { key: "calm", label: "#冷静に話そう" },
    { key: "hype", label: "#もう終わりだろ" },
    { key: "flame", label: "#大炎上中" },
    { key: "conspiracy", label: "#裏で繋がってる説" },
    { key: "meme", label: "#とりあえずネタにする" },
  ];

  scores.forEach((s) => {
    let base = 1;
    if (s.key === "calm") base = state.trust;
    if (s.key === "hype") base = state.heat + state.division;
    if (s.key === "flame") base = state.heat * 1.2;
    if (s.key === "conspiracy") base = state.conspiracy * 1.4;
    if (s.key === "meme") base = state.humor * 1.3;

    s.score = base * state.algo[s.key];
  });

  scores.sort((a, b) => b.score - a.score);

  scores.slice(0, 4).forEach((s, i) => {
    const tag = document.createElement("span");
    tag.className = "trend-tag";
    if (i === 0 || s.score > 60) tag.classList.add("hot");
    tag.textContent = s.label;
    trendTagsEl.appendChild(tag);
  });
}

function pushComments(postType, stats) {
  const list = [];

  const { followersGain, heatGain, trustGain, divisionGain, conspiracyGain } =
    stats;

  if (followersGain > 200) {
    list.push(pickRandom(commentTemplates.hype));
  }
  if (heatGain > 8 || state.heat > 40) {
    list.push(pickRandom(commentTemplates.flame));
  }
  if (conspiracyGain > 6 || state.conspiracy > 40) {
    list.push(pickRandom(commentTemplates.conspiracy));
  }
  if (postType.id === "meme" || state.humor > 40) {
    list.push(pickRandom(commentTemplates.meme));
  }

  if (trustGain > 3) {
    list.push(pickRandom(commentTemplates.positive));
  } else if (trustGain < -4) {
    list.push(pickRandom(commentTemplates.negative));
  } else {
    list.push(pickRandom(commentTemplates.neutral));
  }

  while (list.length < 4) {
    list.push(pickRandom(commentTemplates.neutral));
  }

  const existing = Array.from(commentListEl.children).slice(0, 20);
  commentListEl.innerHTML = "";
  existing.forEach((el) => commentListEl.appendChild(el));

  list.forEach((text) => {
    const div = document.createElement("div");
    div.className = "comment neutral";
    if (text.includes("正論") || text.includes("ありがたい")) {
      div.classList.add("positive");
    } else if (text.includes("危ない") || text.includes("燃える")) {
      div.classList.add("negative");
    }
    div.textContent = text;
    commentListEl.appendChild(div);
  });
}

function playSE(audioEl) {
  if (!audioEl) return;
  audioEl.currentTime = 0;
  audioEl.play().catch(() => {});
}

// ----------------------
// 投稿処理
// ----------------------
function handlePost(postType) {
  state.lastPostType = postType.id;

  const eff = postType.effects;
  const followersGain = randInt(eff.followers[0], eff.followers[1]);
  const trustGain = randInt(eff.trust[0], eff.trust[1]);
  const heatGain = randInt(eff.heat[0], eff.heat[1]);
  const divisionGain = randInt(eff.division[0], eff.division[1]);
  const conspiracyGain = randInt(eff.conspiracy[0], eff.conspiracy[1]);
  const humorGain = randInt(eff.humor[0], eff.humor[1]);

  state.followers = Math.max(0, state.followers + followersGain);
  state.trust = clamp(state.trust + trustGain, 0, 100);
  state.heat = clamp(state.heat + heatGain, 0, 100);
  state.division = clamp(state.division + divisionGain, 0, 100);
  state.conspiracy = clamp(state.conspiracy + conspiracyGain, 0, 100);
  state.humor = clamp(state.humor + humorGain, 0, 100);

  // アルゴリズム傾向更新
  Object.keys(state.algo).forEach((k) => {
    state.algo[k] *= 0.98;
  });
  Object.entries(postType.weight).forEach(([k, v]) => {
    state.algo[k] *= v;
  });

  // プレビュー更新
  postStyleLabelEl.textContent = `投稿スタイル：${postType.label}`;
  postPreviewTextEl.textContent = postType.preview;

  const likeBase = followersGain * (1 + state.heat / 120);
  const repostBase = followersGain * (0.3 + state.division / 200);
  const commentBase = followersGain * (0.2 + state.conspiracy / 250);

  const likes = Math.round(likeBase);
  const reposts = Math.round(repostBase);
  const comments = Math.round(commentBase);

  likeCountEl.textContent = likes.toLocaleString();
  repostCountEl.textContent = reposts.toLocaleString();
  commentCountEl.textContent = comments.toLocaleString();

  [likeCountEl, repostCountEl, commentCountEl].forEach((el) => {
    el.classList.remove("pop-number");
    void el.offsetWidth;
    el.classList.add("pop-number");
  });

  // 結果テキスト
  let title;
  if (likes > 800) {
    title = "超バズり！";
  } else if (likes > 400) {
    title = "バズった！";
  } else if (likes > 150) {
    title = "そこそこ伸びた";
  } else {
    title = "静かなタイムライン";
  }

  if (state.heat > 60 || heatGain > 12) {
    title += "（炎上気味）";
  }

  const detailParts = [];
  detailParts.push(`フォロワー +${followersGain.toLocaleString()}`);
  if (trustGain !== 0) {
    detailParts.push(
      `信頼度 ${trustGain > 0 ? "+" : ""}${trustGain.toFixed(0)}`
    );
  }
  if (heatGain !== 0) {
    detailParts.push(`炎上度 ${heatGain > 0 ? "+" : ""}${heatGain.toFixed(0)}`);
  }

  resultTitleEl.textContent = title;
  resultDetailEl.textContent = detailParts.join(" / ");

  resultPanelEl.classList.remove("hidden");
  void resultPanelEl.offsetWidth;
  resultPanelEl.classList.add("show");

  // コメント
  pushComments(postType, {
    followersGain,
    trustGain,
    heatGain,
    divisionGain,
    conspiracyGain,
  });

  // 通知演出
  notifIconEl.classList.remove("ping");
  void notifIconEl.offsetWidth;
  notifIconEl.classList.add("ping");

  const phoneFrame = document.querySelector(".phone-frame");
  phoneFrame.classList.remove("burst");
  void phoneFrame.offsetWidth;
  phoneFrame.classList.add("burst");

  // SE
  if (heatGain > 10 || state.heat > 60) {
    playSE(seFire);
  } else {
    playSE(seBuzz);
  }
  playSE(seNotif);

  updateStatsUI();
  updateTrends();

  // 次ターンへ
  setTimeout(() => {
    nextTurn();
  }, 900);
}

function nextTurn() {
  if (state.turn >= MAX_TURNS) {
    endGame();
    return;
  }
  state.turn += 1;
  updateStatsUI();
  updateNews();
}

// ----------------------
// 結果判定
// ----------------------
function endGame() {
  showScreen(resultScreen);

  finalFollowersEl.textContent = Math.round(state.followers).toLocaleString();
  finalTrustEl.textContent = Math.round(state.trust);
  finalHeatEl.textContent = Math.round(state.heat);

  let label = "";
  let desc = "";

  if (state.conspiracy > 60 && state.heat > 40) {
    label = "陰謀論タイムライン";
    desc =
      "裏話と“真実”っぽい話で埋め尽くされた世界。フォロワーは増えたけど、もう何が本当かは誰も気にしてない。";
  } else if (state.heat > 70 && state.division > 60) {
    label = "炎上バトルSNS";
    desc =
      "常に誰かが燃えている世界。あなたの通知も止まらない。でも、落ち着いた話はどこかに消えた。";
  } else if (state.humor > 60 && state.trust < 40) {
    label = "全部ネタ化SNS";
    desc =
      "どんなニュースもネタにされて一瞬で流れていく世界。重い話も軽い話も、全部“おもしろいかどうか”だけ。";
  } else if (state.trust > 70 && state.heat < 40 && state.division < 40) {
    label = "そこそこ平和なSNS";
    desc =
      "ちゃんと話せる人も多いし、たまにバズもある。ギリギリ心が壊れないくらいの、ちょうどいいカオス。";
  } else if (state.division > 60) {
    label = "分断されたタイムライン";
    desc =
      "同じニュースなのに、見えている世界が全然違う人たちが増えた。あなたの投稿も、その一部になっている。";
  } else {
    label = "いつものSNS";
    desc =
      "バズも炎上も、陰謀もネタも、全部ちょっとずつ混ざった世界。今日も誰かが「もう終わりだろこれ」と言いながら、タイムラインをスクロールしている。";
  }

  worldLabelEl.textContent = label;
  worldDescEl.textContent = desc;
}

// ----------------------
// ゲーム開始
// ----------------------
function startGame() {
  initState();
  showScreen(gameScreen);
  updateStatsUI();
  updateNews();
  buildPostButtons();
  updateTrends();
  resultPanelEl.classList.add("hidden");
}

// ----------------------
// イベント
// ----------------------
startBtn.addEventListener("click", () => {
  startGame();
});

replayBtn.addEventListener("click", () => {
  startGame();
});

// 初期表示
showScreen(titleScreen);
