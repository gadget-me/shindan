// =====================================================================
//  診断の中身（質問・答え）はすべてこのファイルに書く
//  ★ 書き足していくのはこのファイルと models.js だけ！
// =====================================================================
//
//  スマホ診断は「機種ごと」に結果を出す（候補は models.js の全機種）。
//  答えには、次のような「効果」を書ける。1つの答えに何個書いてもOK。
//
//   scores: { iphone: 2 }          → そのメーカーの機種すべてに 2 点
//   budget: { min: 0, max: 50000 } → この価格帯以外の機種を外す（消去法）
//   only:   { jack: true }         → この条件に合わない機種を外す（消去法）
//   exclude:{ size: "fold" }       → この条件に合う機種を外す（消去法）
//   match:  { size: "small" }, points: 3 → 条件に合う機種に 3 点
//   bonus:  [{ when: { light: true }, points: 1.5 }] → 条件に合う機種に追加で点数（いくつでも書ける）
//   attr:   "camera"               → 機種のカメラ評価（0〜10点、scoring.js が計算）× ATTR_WEIGHT 点
//
//  複数選べる質問は、質問に multi: true を書く。「特になし」には none: true をつける。
//
//  全部答えたら、残った機種の中で点数がいちばん高いものが結果になる。
//  同点なら総合評価が高いほう、それも同じなら安いほうが勝つ。
//  前の答えで機種が1つも残らなくなる選択肢は、自動で表示されなくなる。
//
//  ノートPC診断は前のまま「メーカー（候補）ごと」の方式：
//   { label: "…", scores: { sample_a: 1 } } → 候補 sample_a に 1 点

// 「一番重視したいのは？」で、評価（0〜10点）に掛ける倍率。大きくするほど重視したことが効く
const ATTR_WEIGHT = 1.2;

// 重視した項目の「最低ライン」
//  条件に合う機種に ★PRIORITY_GOOD_STARS 以上があれば、それ未満は結果に出さない
//  なければ ★PRIORITY_MIN_STARS 以上だけを出す（それもなければ例外的に出す）
const PRIORITY_MIN_STARS = 2;
//  ★PRIORITY_GOOD_STARS 以上の機種には PRIORITY_GOOD_BONUS 点も足す
const PRIORITY_GOOD_STARS = 3;
const PRIORITY_GOOD_BONUS = 4;

// 結果画面に「ほかの候補」として何機種出すか
const RUNNER_UPS = 2;

const DIAGNOSES = {

  // ------------------------------------------------------------
  //  スマホ診断（機種ごと）
  // ------------------------------------------------------------
  smartphone: {
    genreLabel: "📱 スマホを診断する",
    models: MODELS,   // models.js の機種データを使う

    makers: MAKERS,   // メーカーの説明は makers.js に書く
    link: "https://note.com/gadget_me",

    // 質問の順番：先に「候補を消す質問」、あとで「好みで点数をつける質問」
    questions: [
      // ---- 候補をしぼる質問 ----
      {
        text: "予算の上限は？",
        // 上限より高い機種と、ひとつ下の価格帯よりさらに安い機種は外す
        answers: [
          { label: "〜5万円",   budget: { min: 0,      max: 50000 } },
          { label: "〜10万円",  budget: { min: 0,      max: 100000 } },
          { label: "〜15万円",  budget: { min: 50001,  max: 150000 } },
          { label: "〜20万円",  budget: { min: 100001, max: 200000 } },
          { label: "20万円以上でもOK", budget: { min: 150001, max: Infinity } },
        ],
      },
      {
        text: "絶対に必要な機能は？（いくつでも選べます）",
        multi: true,
        answers: [
          { label: "おサイフケータイ（Suica・iD・QUICPayなど）", only: { felica: true } },
          { label: "イヤホンジャック（有線イヤホン）", only: { jack: true } },
          { label: "防水・防塵（IP68）", only: { ip: "IP68" } },
          { label: "特になし", none: true },
        ],
      },
      {
        text: "画面の大きさは？",
        answers: [
          { label: "片手で持てる小さめ（6.3インチくらいまで）", match: { size: "small" }, points: 3, exclude: { size: "fold" },
            bonus: [{ when: { light: true }, points: 1.5 }] },   // 小さめが好きな人は軽さも大事
          { label: "大きい画面", match: { size: "large" }, points: 3, exclude: { size: "fold" } },
          { label: "折りたたみに興味あり", only: { size: "fold" } },
          { label: "こだわらない" },
        ],
      },
      {
        text: "メーカーの国にこだわりはある？",
        answers: [
          { label: "日本のメーカーだと安心", bonus: [{ when: { japan: true }, points: 3 }] },
          { label: "中国メーカーは避けたい", exclude: { chinese: true } },   // makers.js の country が "CN" のメーカーを外す
          { label: "こだわらない" },
        ],
      },

      // ---- 好みで点数をつける質問 ----
      {
        text: "今使っているスマホは？",
        answers: [
          { label: "iPhone", scores: { iphone: 2 } },
          { label: "Android", bonus: [{ when: { android: true }, points: 1 }] },
          { label: "スマホは初めて" },
        ],
      },
      {
        text: "ほかに持っている機器は？",
        answers: [
          { label: "Apple製品（Mac・iPad・Apple Watch）", scores: { iphone: 3 } },
          { label: "Galaxy製品（Galaxy Tab・Watch・Buds）", scores: { galaxy: 3 } },
          { label: "Pixel製品（Pixel Watch・Buds）", scores: { pixel: 3 } },
          { label: "特にない" },
        ],
      },
      {
        // いちばん大事な質問なので最後に。ここで残った候補の順位が決まる
        text: "一番重視したいのは？",
        answers: [
          { label: "写真をきれいに撮りたい", attr: "camera" },
          { label: "動画をきれいに撮りたい", attr: "video" },
          { label: "処理性能・ゲーム", attr: "performance" },
          { label: "バッテリー", attr: "battery" },
          { label: "AI機能", attr: "ai" },
          { label: "特にない（バランス重視）", attr: "overall" },
        ],
      },
    ],
  },

  // ------------------------------------------------------------
  //  ノートPC診断
  // ------------------------------------------------------------
  pc: {
    hidden: true,   // 作りかけなので公開ページには出さない。完成したらこの行を消す
    genreLabel: "💻 ノートPCを診断する",

    candidates: {
      // TODO: 候補を考えて書こう。例のかたち：
      sample_a: {
        name: "（候補A の名前）",
        description: "（どんな人に向いているか）",
        link: "https://note.com/gadget_me",
      },
      sample_b: {
        name: "（候補B の名前）",
        description: "（どんな人に向いているか）",
        link: "https://note.com/gadget_me",
      },
    },

    questions: [
      {
        text: "（質問の例）主な使いみちは？",
        answers: [
          { label: "レポートや調べもの", scores: { sample_a: 1 } },
          { label: "プログラミング", scores: { sample_b: 1 } },
        ],
      },
      // TODO: 質問を足していこう！
    ],
  },
};
