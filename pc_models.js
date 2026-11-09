// =====================================================================
//  PCの機種データ（2026年11月9日時点）
//  ★ 機種を足すときは、ここに1行足すだけ。評価（★の数）は pc_scoring.js が自動で計算する
// =====================================================================
//
//  maker   : pc_makers.js のキー
//  form    : "note"（ノート）/ "2in1"（タブレットにもなる）/ "aio"（画面一体型デスクトップ）
//            / "mini"（小型デスクトップ）/ "tower"（タワー型デスクトップ）
//  price   : 価格（円・税込）。メーカー直販の定価があればそれ、なければ価格.comの最安値
//  cpu/gpu : pc_parts.js の名前
//  ram/ssd : メモリ・SSD（GB）。1つの機種でいちばん選ばれやすい「標準的な構成」
//  inch    : 画面サイズ（画面がないデスクトップは null）
//  weight  : 重さ（kg）
//  battery : バッテリー駆動時間（時間・動画再生。日本のメーカーは JEITA 3.0、海外メーカーは各社の公称値）
//            デスクトップは null
//  hdmi/usbA/lan/sd : HDMI出力・USB-A・有線LAN・SDカード（microSD含む）があるか
//  office  : Word・Excel が最初から付いているか（Microsoft 365 Personal 24か月版を含む）
//  drive   : DVD・ブルーレイのドライブがあるか
//  verified: false なら、まだ3つの情報源で照合していない（結果画面に注意書きが出る）
//  note    : 照合の記録

const PC_MODELS = [
  // ---------------- Apple ----------------
  { maker: "apple", name: "MacBook Neo",            form: "note",  price: 119800, cpu: "A18 Pro", gpu: "Apple A18 Pro 5コアGPU", ram: 8,  ssd: 256,  inch: 13.0, weight: 1.23, battery: 16, hdmi: false, usbA: false, lan: false, sd: false, office: false, os: "mac", note: "Apple公式・価格.com・gori.meで一致。2026年夏の値上げ後の価格" },
  { maker: "apple", name: "MacBook Air 13インチ（M5）", form: "note", price: 224800, cpu: "M5", gpu: "Apple M5 8コアGPU", ram: 16, ssd: 512, inch: 13.6, weight: 1.23, battery: 18, hdmi: false, usbA: false, lan: false, sd: false, office: false, os: "mac", note: "Apple公式・価格.com・selectraで一致" },
  { maker: "apple", name: "MacBook Air 15インチ（M5）", form: "note", price: 264800, cpu: "M5", gpu: "Apple M5 10コアGPU", ram: 16, ssd: 512, inch: 15.3, weight: 1.51, battery: 18, hdmi: false, usbA: false, lan: false, sd: false, office: false, os: "mac", note: "Apple公式・価格.com・GIGAZINEで一致" },
  { maker: "apple", name: "MacBook Pro 14インチ（M6）", form: "note", price: 339800, cpu: "M6", gpu: "Apple M6 12コアGPU", ram: 16, ssd: 1024, inch: 14.2, weight: 1.55, battery: 24, hdmi: true, usbA: false, lan: false, sd: true, office: false, os: "mac", note: "Apple公式・価格.com・selectraで一致。電池はM5モデルの公称値（M6は未掲載）" },
  { maker: "apple", name: "MacBook Pro 16インチ（M5 Pro）", form: "note", price: 519800, cpu: "M5 Pro（18コア）", gpu: "Apple M5 Pro 20コアGPU", ram: 24, ssd: 1024, inch: 16.2, weight: 2.14, battery: 24, hdmi: true, usbA: false, lan: false, sd: true, office: false, os: "mac", note: "Apple公式・価格.com・TechNaveで一致" },
  { maker: "apple", name: "iMac（M6）",             form: "aio",   price: 249800, cpu: "M6", gpu: "Apple M6 10コアGPU", ram: 16, ssd: 256, inch: 24, weight: 4.42, battery: null, hdmi: false, usbA: false, lan: false, sd: false, office: false, os: "mac", note: "Apple公式・価格.com・selectraで一致。2ポートのモデル（有線LANはオプション）" },
  { maker: "apple", name: "Mac mini（M6）",         form: "mini",  price: 149800, cpu: "M6", gpu: "Apple M6 12コアGPU", ram: 16, ssd: 256, inch: null, weight: 0.7, battery: null, hdmi: true, usbA: false, lan: true, sd: false, office: false, os: "mac", note: "Apple公式・価格.com・Business Insiderで一致。重さは目安" },
  { maker: "apple", name: "Mac Studio（M5 Max）",   form: "mini",  price: 419800, cpu: "M5 Max", gpu: "Apple M5 Max 32コアGPU", ram: 36, ssd: 512, inch: null, weight: 2.7, battery: null, hdmi: true, usbA: true, lan: true, sd: true, office: false, os: "mac", note: "Apple公式・価格.com・Business Insiderで一致。重さは目安" },

  // ---------------- Microsoft ----------------
  { maker: "microsoft", name: "Surface Pro 12インチ", form: "2in1", price: 149800, cpu: "Snapdragon X Plus", gpu: "Adreno X1-45", ram: 16, ssd: 256, inch: 12, weight: 0.686, battery: 16, hdmi: false, usbA: false, lan: false, sd: false, office: true, os: "win", note: "価格.com・Windows Central・PC Watchで一致。キーボードは別売。Microsoft Storeの価格は2026年に値上がりしているので、価格.comの最安値" },
  { maker: "microsoft", name: "Surface Pro 13インチ（第12世代）", form: "2in1", price: 227000, cpu: "Snapdragon X2 Plus（10コア）", gpu: "Adreno X2-45", ram: 16, ssd: 512, inch: 13, weight: 0.895, battery: 15.5, hdmi: false, usbA: false, lan: false, sd: false, office: true, os: "win", note: "価格.com・ライフハッカー・ITmediaで一致。キーボードは別売。Microsoft Storeは291,280円〜（価格.comの最安値を採用）" },
  { maker: "microsoft", name: "Surface Laptop 13インチ", form: "note", price: 139999, cpu: "Snapdragon X Plus", gpu: "Adreno X1-45", ram: 16, ssd: 1024, inch: 13, weight: 1.22, battery: 23, hdmi: false, usbA: true, lan: false, sd: false, office: true, os: "win", note: "価格.com・PC Watch・週刊アスキーで一致" },
  { maker: "microsoft", name: "Surface Laptop 13.8インチ（第8世代）", form: "note", price: 232452, cpu: "Snapdragon X2 Plus（10コア）", gpu: "Adreno X2-45", ram: 16, ssd: 512, inch: 13.8, weight: 1.36, battery: 20, hdmi: false, usbA: true, lan: false, sd: false, office: true, os: "win", note: "価格.com・ライフハッカー・ITmediaで一致。Microsoft Storeは291,280円〜（価格.comの最安値を採用）" },

  // ---------------- NEC ----------------
  { maker: "nec", name: "LAVIE N16（N1655/MA）",   form: "note", price: 236778, cpu: "Ryzen 5 230", gpu: "Radeon 760M", ram: 16, ssd: 256, inch: 16, weight: 2.0, battery: 7.9, hdmi: true, usbA: true, lan: true, sd: true, office: true, drive: true, os: "win", note: "NEC公式・価格.com・PC Watchで一致（2026年夏モデル）" },
  { maker: "nec", name: "LAVIE N13（N1355/NA）",   form: "note", price: 257202, cpu: "Core 5 320", gpu: "Intel Graphics（Wildcat Lake）", ram: 16, ssd: 256, inch: 13.3, weight: 1.177, battery: 15.9, hdmi: true, usbA: true, lan: false, sd: true, office: true, os: "win", note: "NEC公式・価格.com・PC Watchで一致（2026年秋冬モデル）" },
  { maker: "nec", name: "LAVIE S13（S1355/NA）",   form: "note", price: 304798, cpu: "Core Ultra 5 322", gpu: "Intel Graphics（Panther Lake 2コア）", ram: 16, ssd: 512, inch: 13.3, weight: 1.088, battery: 22.9, hdmi: false, usbA: false, lan: false, sd: false, office: true, os: "win", note: "NEC公式・価格.com・PC Watchで一致（2026年秋冬モデル）。端子はUSB-C×3のみ" },
  { maker: "nec", name: "LAVIE X14（X1475/NA）",   form: "note", price: 396555, cpu: "Core Ultra 7 355", gpu: "Intel Graphics（Panther Lake 4コア）", ram: 32, ssd: 512, inch: 14, weight: 1.021, battery: 30.1, hdmi: true, usbA: true, lan: true, sd: true, office: true, os: "win", note: "NEC公式・価格.com・PC Watchで一致（2026年秋冬モデル）" },
  { maker: "nec", name: "LAVIE NEXTREME（X1375/KA）", form: "note", price: 285780, cpu: "Core Ultra 7 258V", gpu: "Intel Arc 140V", ram: 32, ssd: 512, inch: 13.3, weight: 0.994, battery: 20.1, hdmi: true, usbA: true, lan: true, sd: true, office: true, os: "win", note: "NEC公式・価格.com・TechnoEdgeで一致" },
  { maker: "nec", name: "LAVIE A23（A2355/LA）",   form: "aio",  price: 187853, cpu: "Core i5-1335U", gpu: "Intel UHD Graphics", ram: 16, ssd: 512, inch: 23.8, weight: 9.6, battery: null, hdmi: false, usbA: true, lan: true, sd: true, office: true, drive: true, os: "win", note: "NEC公式・価格.com・マイナビニュースで一致。HDMIは入力のみ（テレビやゲーム機をつなげる）" },

  // ---------------- 富士通 ----------------
  { maker: "fujitsu", name: "FMV Note A（A55-L3）", form: "note", price: 291280, cpu: "Ryzen AI 5 430", gpu: "Radeon 840M", ram: 16, ssd: 512, inch: 16, weight: 1.9, battery: 6.8, hdmi: true, usbA: true, lan: true, sd: true, office: true, drive: true, os: "win", note: "富士通公式・価格.com・PC Watchで一致（2026年冬モデル）" },
  { maker: "fujitsu", name: "FMV Note U（U55-L3）", form: "note", price: 291280, cpu: "Ryzen AI 5 430", gpu: "Radeon 840M", ram: 16, ssd: 512, inch: 14, weight: 0.876, battery: 17.5, hdmi: true, usbA: true, lan: true, sd: true, office: true, os: "win", note: "富士通公式・価格.com・PC Watchで一致（2026年冬モデル）" },
  { maker: "fujitsu", name: "FMV Note C（C77-L3）", form: "note", price: 307780, cpu: "Ryzen AI 7 445", gpu: "Radeon 840M", ram: 16, ssd: 512, inch: 13.3, weight: 1.111, battery: 18.6, hdmi: true, usbA: false, lan: false, sd: false, office: true, os: "win", note: "富士通公式・価格.com・PC Watchで一致（2026年冬モデル）" },
  { maker: "fujitsu", name: "FMV Note M（M55-L3）", form: "note", price: 252780, cpu: "Core 5 315", gpu: "Intel Graphics（Wildcat Lake）", ram: 16, ssd: 512, inch: 14, weight: 1.39, battery: 14.8, hdmi: true, usbA: true, lan: true, sd: false, office: true, os: "win", note: "富士通公式・価格.com・PC Watchで一致（2026年冬モデル）" },
  { maker: "fujitsu", name: "FMV Desktop F（F55-L1）", form: "aio", price: 183812, cpu: "Ryzen 5 220", gpu: "Radeon 740M", ram: 16, ssd: 512, inch: 23.8, weight: 6.2, battery: null, hdmi: true, usbA: true, lan: true, sd: true, office: true, drive: true, os: "win", note: "富士通公式・価格.com・FMV Storeで一致。HDMIは入力と出力の両方あり" },

  // ---------------- Dynabook ----------------
  { maker: "dynabook", name: "dynabook T6",  form: "note", price: 267855, cpu: "Core 7 150U", gpu: "Intel Graphics（Core シリーズ1）", ram: 16, ssd: 512, inch: 16, weight: 1.99, battery: 5, hdmi: true, usbA: true, lan: true, sd: true, office: true, drive: true, os: "win", note: "Dynabook公式・価格.com・ニュースリリースで一致（2026年秋冬モデル）" },
  { maker: "dynabook", name: "dynabook C6",  form: "note", price: 253444, cpu: "Core 5 120U", gpu: "Intel Graphics（Core シリーズ1）", ram: 16, ssd: 512, inch: 16, weight: 1.85, battery: 5, hdmi: true, usbA: true, lan: true, sd: true, office: true, os: "win", note: "Dynabook公式・価格.com・ニュースリリースで一致（2026年秋冬モデル）" },
  { maker: "dynabook", name: "dynabook XP7", form: "note", price: 297555, cpu: "Core Ultra 5 322", gpu: "Intel Graphics（Panther Lake 2コア）", ram: 16, ssd: 512, inch: 14, weight: 0.999, battery: 15.5, hdmi: true, usbA: true, lan: true, sd: true, office: true, os: "win", note: "Dynabook公式・価格.com・ニュースリリースで一致（2026年秋冬モデル）" },

  // ---------------- Lenovo ----------------
  { maker: "lenovo", name: "IdeaPad Slim 3 Gen 10",  form: "note", price: 119801, cpu: "Ryzen 5 8640HS", gpu: "Radeon 760M", ram: 16, ssd: 512, inch: 15.3, weight: 1.59, battery: 7.4, hdmi: true, usbA: true, lan: false, sd: true, office: false, os: "win", note: "Lenovo公式（PSREF）・価格.com・Notebookcheckで一致" },
  { maker: "lenovo", name: "IdeaPad Slim 5a Gen 11", form: "note", price: 159800, cpu: "Ryzen AI 7 445", gpu: "Radeon 840M", ram: 16, ssd: 512, inch: 14, weight: 1.37, battery: 11.9, hdmi: true, usbA: true, lan: false, sd: true, office: true, os: "win", note: "Lenovo公式（PSREF）・価格.com・Notebookcheckで一致。Office付きのモデル" },
  { maker: "lenovo", name: "Yoga Slim 7x Gen 11",    form: "note", price: 199996, cpu: "Snapdragon X2 Plus（6コア）", gpu: "Adreno X2-45", ram: 16, ssd: 512, inch: 14, weight: 1.17, battery: 31, hdmi: false, usbA: false, lan: false, sd: false, office: false, os: "win", note: "Lenovo公式（PSREF）・価格.com・Notebookcheckで一致。電池はLenovoの動画再生の公称値" },
  { maker: "lenovo", name: "ThinkPad E14 Gen 8",     form: "note", price: 139920, cpu: "Ryzen AI 7 345", gpu: "Radeon 840M", ram: 16, ssd: 512, inch: 14, weight: 1.34, battery: 14.9, hdmi: true, usbA: true, lan: true, sd: false, office: false, os: "win", note: "Lenovo公式（PSREF）・価格.com・Notebookcheckで一致" },
  { maker: "lenovo", name: "Legion Tower 5",         form: "tower", price: 279730, cpu: "Core Ultra 7 265KF", gpu: "GeForce RTX 5070（デスクトップ）", ram: 16, ssd: 512, inch: null, weight: 15, battery: null, hdmi: true, usbA: true, lan: true, sd: false, office: false, os: "win", note: "Lenovo公式（PSREF）・価格.com・Game*Sparkで一致" },

  // ---------------- HP ----------------
  { maker: "hp", name: "OmniBook 3 16",       form: "note", price: 129700, cpu: "Ryzen 5 230", gpu: "Radeon 760M", ram: 16, ssd: 512, inch: 16, weight: 1.64, battery: 14.3, hdmi: true, usbA: true, lan: false, sd: false, office: false, os: "win", note: "価格.com・価格.comマガジン・kelaptopで一致。電池は動画再生の公称値（HPの日本サイトは最大24時間）" },
  { maker: "hp", name: "OmniBook 7 Aero 13",  form: "note", price: 149800, cpu: "Ryzen AI 5 340", gpu: "Radeon 840M", ram: 16, ssd: 512, inch: 13.3, weight: 0.97, battery: 15.5, hdmi: true, usbA: true, lan: false, sd: false, office: false, os: "win", note: "価格.com・PC Watch・For-Realで一致" },
  { maker: "hp", name: "OmniBook X Flip 14",  form: "2in1", price: 189800, cpu: "Ryzen AI 5 435", gpu: "Radeon 840M", ram: 16, ssd: 512, inch: 14, weight: 1.4, battery: 24, hdmi: true, usbA: true, lan: false, sd: false, office: false, os: "win", note: "価格.com・ITmedia・For-Realで一致。電池はHPの公称値（最大）" },
  { maker: "hp", name: "HyperX OMEN 15",      form: "note", price: 277800, cpu: "Ryzen 7 8745HX", gpu: "GeForce RTX 5060", ram: 16, ssd: 1024, inch: 15.3, weight: 2.42, battery: 7, hdmi: true, usbA: true, lan: true, sd: false, office: false, os: "win", note: "価格.com・HyperX公式・For-Realで一致" },
  { maker: "hp", name: "OmniDesk Mini",       form: "mini", price: 169990, cpu: "Core Ultra 5 325", gpu: "Intel Graphics（Panther Lake 4コア）", ram: 16, ssd: 512, inch: null, weight: 0.475, battery: null, hdmi: true, usbA: true, lan: true, sd: false, office: false, os: "win", note: "HP公式・価格.com・価格.comマガジンで一致。HP直販の希望価格は275,000円（価格.com限定モデルの価格を採用）" },

  // ---------------- ASUS ----------------
  { maker: "asus", name: "Vivobook 16",          form: "note", price: 139800, cpu: "Core Ultra 5 225H", gpu: "Intel Arc 130T", ram: 16, ssd: 512, inch: 16, weight: 1.88, battery: 4.1, hdmi: true, usbA: true, lan: false, sd: false, office: false, os: "win", note: "価格.com・ASUS公式・Notebookcheckで一致" },
  { maker: "asus", name: "Zenbook 14（UX3480QA）", form: "note", price: 189800, cpu: "Snapdragon X", gpu: "Adreno X1-45", ram: 16, ssd: 256, inch: 14, weight: 1.1, battery: 30, hdmi: true, usbA: true, lan: false, sd: false, office: false, os: "win", note: "価格.com・Notebookcheck・週刊アスキーで一致。電池はASUSの動画再生の公称値" },
  { maker: "asus", name: "TUF Gaming A14",       form: "note", price: 222800, cpu: "Ryzen 7 260", gpu: "GeForce RTX 5050", ram: 16, ssd: 512, inch: 14, weight: 1.46, battery: 11.6, hdmi: true, usbA: true, lan: false, sd: true, office: false, os: "win", note: "ASUS公式・価格.com・ケーズデンキで一致（16GBメモリのモデル）" },
  { maker: "asus", name: "ROG Strix G16",        form: "note", price: 309800, cpu: "Ryzen 9 8940HX", gpu: "GeForce RTX 5060", ram: 16, ssd: 512, inch: 16, weight: 2.5, battery: 4.5, hdmi: true, usbA: true, lan: true, sd: false, office: false, os: "win", note: "ASUS公式・価格.com・notebookspecで一致" },
  { maker: "asus", name: "ExpertBook P1（P1403CVA）", form: "note", price: 139800, cpu: "Core 7 240H", gpu: "Intel Graphics（Core シリーズ1）", ram: 16, ssd: 512, inch: 14, weight: 1.43, battery: 8, batteryEstimated: true, hdmi: true, usbA: true, lan: true, sd: false, office: false, os: "win", note: "ASUS公式・価格.com・Multitronicで一致。電池時間は公表されていないので目安" },

  // ---------------- Dell / Alienware ----------------
  { maker: "dell", name: "Dell 15",       form: "note", price: 129800, cpu: "Core i5-1334U", gpu: "Intel UHD Graphics", ram: 16, ssd: 512, inch: 15.6, weight: 1.9, battery: 6, hdmi: true, usbA: true, lan: false, sd: true, office: true, os: "win", note: "価格.com・Dell公式（米国）・JB Hi-Fiで一致。Office付きのモデル。重さは海外の公称値（価格.comは1.62kg）" },
  { maker: "dell", name: "Dell 14 Plus",  form: "note", price: 140000, cpu: "Ryzen AI 5 340", gpu: "Radeon 840M", ram: 16, ssd: 512, inch: 14, weight: 1.52, battery: 20, hdmi: true, usbA: true, lan: false, sd: false, office: true, os: "win", note: "Dell公式（カタログ）・価格.com・PC Watchで一致。Office付きのモデル" },
  { maker: "dell", name: "Dell 16 Plus",  form: "note", price: 199700, cpu: "Ryzen AI 5 340", gpu: "Radeon 840M", ram: 16, ssd: 512, inch: 16, weight: 1.83, battery: 21, hdmi: true, usbA: true, lan: false, sd: false, office: true, os: "win", note: "Dell公式（カタログ）・価格.com・PC Watchで一致。Office付きのモデル" },
  { maker: "alienware", name: "Alienware 16 Aurora", form: "note", price: 219800, cpu: "Core 7 240H", gpu: "GeForce RTX 5050", ram: 16, ssd: 1024, inch: 16, weight: 2.49, battery: 6, hdmi: true, usbA: true, lan: true, sd: false, office: false, os: "win", note: "Dell公式（カタログ）・価格.com・ガジェット侍で一致" },
  { maker: "alienware", name: "Alienware Aurora",    form: "tower", price: 499899, cpu: "Core Ultra 7 265F", gpu: "GeForce RTX 5060（デスクトップ）", ram: 16, ssd: 1024, inch: null, weight: 15.37, battery: null, hdmi: true, usbA: true, lan: true, sd: false, office: false, os: "win", note: "Dell公式（ストア・カタログ）・価格.comで一致。価格はDell直販" },
];
