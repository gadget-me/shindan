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
//   attrs:  { battery: 0.5 }        → 機種のバッテリー評価 × 0.5 × ATTR_WEIGHT 点（使いみちなど、いくつでも）
//   reason: "…"                    → only の条件に合ったとき、「選んだ理由」に出す文（bonus にも書ける）
//   needOffice: true               → Office が付いていない機種に「Office込みなら約○○円」を出す（PC診断）

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
  //  PC診断（機種ごと）
  // ------------------------------------------------------------
  pc: {
    genreLabel: "💻 パソコンを診断する",
    models: PC_MODELS,     // pc_models.js の機種データを使う
    makers: PC_MAKERS,     // pc_makers.js
    link: "https://note.com/gadget_me",
    specLines: pcSpecLines,     // 結果画面のスペック表（pc_scoring.js）
    priceNote: pcPriceNote,     // 「Office込みなら約○○円」
    notices: pcNotices,         // BTO・別売品の注意書き

    questions: [
      // ---- 候補をしぼる質問 ----
      {
        text: "パソコンを持ち運びますか？",
        answers: [
          { label: "毎日持ち歩く（学校・職場など）", exclude: { desktop: true }, attrs: { portability: 0.8, battery: 0.6 } },
          { label: "ときどき持ち出す", exclude: { desktop: true }, attrs: { portability: 0.4, battery: 0.3 } },
          { label: "家や職場に置いて使う", attrs: { screen: 0.3 } },
        ],
      },
      {
        text: "どんな形がいい？",
        answers: [
          { label: "普通のノートパソコン", only: { form: "note" } },
          { label: "タブレットにもなる 2in1（Surface など）", only: { form: "2in1" } },
          { label: "画面が大きいノート（15インチ以上）", only: { big: true } },
          { label: "デスクトップ（一体型・小型・タワー）", only: { desktop: true } },
          { label: "こだわらない" },
        ],
      },
      {
        text: "OS（Windows か Mac か）は？",
        answers: [
          { label: "Windows", only: { os: "win" } },
          { label: "Mac", only: { os: "mac" } },
          { label: "こだわらない" },
        ],
      },
      {
        text: "主な使いみちは？（いくつでも選べます）",
        multi: true,
        answers: [
          { label: "レポート・ネット・動画を見る", attrs: { value: 0.4, battery: 0.3 } },
          { label: "プログラミング", attrs: { performance: 0.5 },
            bonus: [{ when: { ram32: true }, points: 1, reason: "メモリが32GBあり、開発ツールを同時に動かしやすい" }] },
          { label: "写真・動画の編集", attrs: { performance: 0.5, graphics: 0.4 },
            bonus: [{ when: { ram32: true }, points: 1, reason: "メモリが32GBあり、編集ソフトが快適" }] },
          { label: "ゲーム", only: { dgpu: true }, attrs: { graphics: 0.8 }, reason: "グラフィックボード搭載でゲーム向き" },
          { label: "仕事・資料作り", attrs: { battery: 0.3, portability: 0.2 },
            bonus: [{ when: { office: true }, points: 1.5, reason: "仕事で使う Word・Excel が付いている" }] },
          { label: "特に決まっていない", none: true },
        ],
      },
      {
        text: "絶対に必要な端子は？（いくつでも選べます）",
        multi: true,
        answers: [
          { label: "HDMI（テレビ・モニター・プロジェクターにつなぐ）", only: { hdmi: true }, reason: "HDMI出力あり" },
          { label: "USB-A（昔ながらのUSB・USBメモリ）", only: { usbA: true }, reason: "USB-Aあり" },
          { label: "有線LAN", only: { lan: true }, reason: "有線LANあり" },
          { label: "SDカード（カメラの写真を取り込む）", only: { sd: true }, reason: "SDカードスロットあり" },
          { label: "特になし", none: true },
        ],
      },
      {
        text: "Office（Word・Excel）は必要？",
        answers: [
          { label: "必要", needOffice: true,
            bonus: [{ when: { office: true }, points: 2, reason: "Word・Excel が最初から付いている" }] },
          { label: "必要ない・持っている" },
        ],
      },
      {
        text: "予算の上限は？",
        // 上限より高い機種と、ひとつ下の価格帯よりさらに安い機種は外す
        answers: [
          { label: "〜15万円", budget: { min: 0,      max: 150000 } },
          { label: "〜20万円", budget: { min: 0,      max: 200000 } },
          { label: "〜30万円", budget: { min: 150001, max: 300000 } },
          { label: "〜40万円", budget: { min: 200001, max: 400000 } },
          { label: "40万円以上でもOK", budget: { min: 300001, max: Infinity } },
        ],
      },

      // ---- 好みで点数をつける質問 ----
      {
        text: "ほかに持っている機器は？",
        answers: [
          { label: "iPhone・iPad", scores: { apple: 3 } },
          { label: "Android スマホ", bonus: [{ when: { os: "win" }, points: 1, reason: "Android スマホと連携しやすい（スマートフォン連携）" }] },
          { label: "特にない" },
        ],
      },
      {
        // いちばん大事な質問なので最後に。ここで残った候補の順位が決まる
        text: "一番重視したいのは？",
        answers: [
          { label: "処理性能（サクサク動く）", attr: "performance" },
          { label: "軽さ・持ち運びやすさ", attr: "portability" },
          { label: "バッテリーの持ち", attr: "battery" },
          { label: "画面の見やすさ（大きさ）", attr: "screen" },
          { label: "値段の安さ", attr: "value" },
          { label: "特にない（バランス重視）", attr: "overall" },
        ],
      },
    ],
  },
};
