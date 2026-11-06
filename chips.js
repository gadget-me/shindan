// =====================================================================
//  チップの辞書（AnTuTu ベンチマークの総合スコアの目安）
//  ★ 新しいチップが出たらここに足す。models.js の chip と同じ名前にすること
// =====================================================================
//
//  antutu    : AnTuTu の総合スコア（できるだけ Ver.12 にそろえた目安）
//  estimated : true のものは公開スコアが見つからず、近いチップからの推定
//
//  出典：ガルマックス「AnTuTuベンチマークスコア一覧」、「独自調べ」はVer.12の比較グラフをもとにした値（2026年11月5日）
//  ※ Ver.11 と Ver.12 では点数の基準が違うので、Ver.11 しかないものは推定で補正している

const CHIPS = {
  // ---- Snapdragon ----
  "Snapdragon 8 Elite Gen 5": { antutu: 4000000 },
  "Snapdragon 8 Elite":       { antutu: 3300000 },
  "Snapdragon 8s Gen 4":      { antutu: 2500000 },
  "Snapdragon 8s Gen 3":      { antutu: 2100000 },
  "Snapdragon 7+ Gen 3":      { antutu: 1860000 },
  "Snapdragon 7 Gen 4":       { antutu: 1590000 },
  "Snapdragon 7s Gen 3":      { antutu: 1060000 },
  "Snapdragon 7s Gen 2":      { antutu: 720000 },   // 独自調べ（Ver.12）
  "Snapdragon 6 Gen 3":       { antutu: 880000 },   // 独自調べ（Ver.12）
  "Snapdragon 6 Gen 1":       { antutu: 785000 },

  // ---- MediaTek / Exynos ----
  "Dimensity 6300":           { antutu: 660000 },
  "Exynos 1680":              { antutu: 1400000 },  // 独自調べ（Ver.12）

  // ---- Google Tensor ----
  "Tensor G6":                { antutu: 2100000 },  // 独自調べ（Ver.12）
  "Tensor G5":                { antutu: 1600000 },  // 独自調べ（Ver.12）
  "Tensor G4":                { antutu: 1400000, estimated: true },  // G5 より約15%遅い（ガジェット侍）ことから推定

  // ---- Apple ----
  "A20 Pro":                  { antutu: 3800000 },  // 独自調べ（Ver.12）
  "A19 Pro":                  { antutu: 2900000 },  // 独自調べ（Ver.12）
  "A19":                      { antutu: 2500000 },  // 独自調べ（Ver.12）
  "A18":                      { antutu: 1900000 },  // 独自調べ（Ver.12）

  // ---- 2026年11月6日に追加（ガルマックスのAnTuTu一覧より。Ver.11/12が混ざっているので目安）----
  "Snapdragon 8 Gen 5":       { antutu: 3000000, estimated: true },  // 公開スコアなし。8 Elite と 8 Gen 3 の間と推定
  "Snapdragon 8 Gen 3":       { antutu: 2420000 },  // Xiaomi 14（Ver.11）
  "Snapdragon 7s Gen 4":      { antutu: 1020000 },  // POCO M8 Pro（Ver.11）
  "Snapdragon 6 Gen 5":       { antutu: 990000 },   // REDMI Note 17 Pro Max（Ver.11）
  "Snapdragon 6 Gen 4":       { antutu: 940000 },   // Nothing Phone (4b)（Ver.11）
  "Snapdragon 6s Gen 3":      { antutu: 650000 },   // REDMI 15 5G（Ver.11）
  "Snapdragon 6s 4G Gen 1":   { antutu: 370000 },   // OPPO A5x（Ver.11）
  "Dimensity 9500":           { antutu: 3890000 },  // vivo X300 Pro（Ver.12）
  "Dimensity 9500s":          { antutu: 3090000 },  // POCO X8 Pro Max（Ver.11 メーカー公表値）
  "Dimensity 9400+":          { antutu: 2950000 },  // iQOO Z10 Turbo+（Ver.11）
  "Dimensity 9400":           { antutu: 2940000 },  // OPPO Find X8 Pro
  "Dimensity 9300+":          { antutu: 2300000, estimated: true },
  "Dimensity 8500":           { antutu: 2090000 },  // POCO X8 Pro
  "Dimensity 8400":           { antutu: 1620000 },  // Xiaomi 15T
  "Dimensity 8350":           { antutu: 1720000 },  // motorola edge 60 pro
  "Dimensity 8300":           { antutu: 1500000, estimated: true },  // タブレットの実測（186万）しかないため控えめに推定
  "Dimensity 7400":           { antutu: 955000 },   // motorola razr 60
  "Dimensity 7200":           { antutu: 850000, estimated: true },  // Nothing Phone (2a)・Redmi Note 13 Pro+（7200 Pro / 7200-Ultra）
  "Dimensity 7300":           { antutu: 930000 },   // iQOO Z10x
  "Dimensity 7060":           { antutu: 800000 },   // moto g66j 5G（Ver.12）
  "Dimensity 7025":           { antutu: 740000 },   // moto g64y 5G（Ver.12）
  "Dimensity 6100+":          { antutu: 455000 },   // Galaxy A25 5G 日本版
  "Helio G99":                { antutu: 655000 },   // ALLDOCUBE iPlay 50 Pro NFE（Ver.12）
  "Helio G91":                { antutu: 350000, estimated: true },
  "Helio G81":                { antutu: 280000, estimated: true },
  "Exynos 2400e":             { antutu: 1970000 },  // Galaxy S24 FE（Ver.11）
  "Exynos 2500":              { antutu: 2200000, estimated: true },
  "Unisoc T8100":             { antutu: 600000, estimated: true },
};
