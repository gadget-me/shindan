// =====================================================================
//  PC診断で使う「CPU」と「GPU（グラフィック）」の辞書
//  ★ 新しいCPU・GPUが出たらここに足す。pc_models.js の cpu / gpu と同じ名前にすること
// =====================================================================
//
//  cb        : Cinebench R23 マルチコアの点数（CPUの処理性能の目安）
//  ts        : 3DMark Time Spy の Graphics スコア（ゲームや動画編集の目安）
//  dedicated : true ならグラフィックボード（ゲーム向けの独立GPU）
//  estimated : true のものは公開スコアが見つからず、近いチップや順位からの推定
//
//  出典：Notebookcheck「Mobile Processors - Benchmark List」「Mobile Graphics Cards - Benchmark List」
//        （2026年11月9日に確認。数字は多くのレビューの中央値）

const PC_CPUS = {
  // ---- Apple ----
  "A18 Pro":            { cb: 7500,  estimated: true },  // Macで公開スコアなし。M5の半分弱と推定
  "M5":                 { cb: 15893 },
  "M6":                 { cb: 20239 },
  "M5 Pro（18コア）":   { cb: 34829 },
  "M5 Max":             { cb: 36000, estimated: true },  // CPUはM5 Pro 18コアと同じ構成のため、ほぼ同じと推定

  // ---- Qualcomm Snapdragon ----
  "Snapdragon X":        { cb: 7300 },   // X1-26-100
  "Snapdragon X Plus":   { cb: 7779 },   // X1P-42-100
  "Snapdragon X2 Plus（6コア）":  { cb: 5875 },   // X2P-42-100
  "Snapdragon X2 Plus（10コア）": { cb: 9777 },   // X2P-64-100

  // ---- Intel ----
  "Core i5-1335U":      { cb: 8890 },
  "Core i5-1334U":      { cb: 8641 },
  "Core 5 120U":        { cb: 6659 },
  "Core 7 150U":        { cb: 8883 },
  "Core 5 315":         { cb: 5800,  estimated: true },  // 1つ上の Core 5 320 より少し低いと推定
  "Core 5 320":         { cb: 6258 },
  "Core 7 240H":        { cb: 15225 },
  "Core Ultra 5 225H":  { cb: 14630 },
  "Core Ultra 5 322":   { cb: 7862 },
  "Core Ultra 5 325":   { cb: 10980 },
  "Core Ultra 7 355":   { cb: 11308 },
  "Core Ultra 7 258V":  { cb: 10301 },
  "Core Ultra 7 265F":  { cb: 33000, estimated: true },  // 265K（35,850）より少し低いと推定
  "Core Ultra 7 265KF": { cb: 35850 },                    // 265K と同じ（内蔵GPUがないだけ）

  // ---- AMD ----
  "Ryzen 5 220":        { cb: 9500,  estimated: true },  // 230 より少し低いと推定
  "Ryzen 5 230":        { cb: 10500, estimated: true },  // 同じ世代の 8640HS（11,486）より少し低いと推定
  "Ryzen 5 8640HS":     { cb: 11486 },
  "Ryzen AI 5 340":     { cb: 12532 },
  "Ryzen AI 7 345":     { cb: 11461 },
  "Ryzen AI 5 430":     { cb: 8130 },
  "Ryzen AI 5 435":     { cb: 11333 },
  "Ryzen AI 7 445":     { cb: 10590 },
  "Ryzen 7 260":        { cb: 17212 },
  "Ryzen 7 8745HX":     { cb: 17500, estimated: true },  // 同じ8コアの Ryzen 7 260 と同じくらいと推定
  "Ryzen 9 8940HX":     { cb: 32521 },
};

const PC_GPUS = {
  // ---- グラフィックボード（ゲーム向け）----
  "GeForce RTX 5050":           { ts: 8941,  dedicated: true },
  "GeForce RTX 5060":           { ts: 12052, dedicated: true },
  "GeForce RTX 5060（デスクトップ）": { ts: 12500, dedicated: true, estimated: true },  // ノート版より少し上と推定
  "GeForce RTX 5070（デスクトップ）": { ts: 22000, dedicated: true, estimated: true },  // ノート版（13,563）よりかなり上と推定

  // ---- Apple（Time Spy が Mac で動かないので、Notebookcheck の順位から推定）----
  "Apple A18 Pro 5コアGPU":   { ts: 2500,  estimated: true },
  "Apple M5 8コアGPU":        { ts: 5800,  estimated: true },
  "Apple M5 10コアGPU":       { ts: 6600,  estimated: true },  // Arc B390（6,627）とほぼ同じ順位
  "Apple M6 10コアGPU":       { ts: 6800,  estimated: true },
  "Apple M6 12コアGPU":       { ts: 7500,  estimated: true },
  "Apple M5 Pro 20コアGPU":   { ts: 8300,  estimated: true },
  "Apple M5 Max 32コアGPU":   { ts: 8600,  estimated: true },

  // ---- 内蔵GPU ----
  "Radeon 860M":   { ts: 2565 },
  "Radeon 780M":   { ts: 2808 },
  "Radeon 760M":   { ts: 2281 },
  "Radeon 740M":   { ts: 1527 },
  "Radeon 840M":   { ts: 1415 },
  "Radeon 820M":   { ts: 786 },
  "Intel Arc 130T":      { ts: 3600, estimated: true },  // Arc 140T（約4,000）より少し低いと推定
  "Intel Arc 140V":      { ts: 3900, estimated: true },
  "Intel Graphics（Panther Lake 4コア）": { ts: 2905 },
  "Intel Graphics（Panther Lake 2コア）": { ts: 2200, estimated: true },
  "Intel Graphics（Wildcat Lake）":       { ts: 1401 },
  "Intel Graphics（Core シリーズ1）":     { ts: 1181 },  // Iris Xe 80EU 相当
  "Intel UHD Graphics":  { ts: 1110 },
  "Adreno X1-45":        { ts: 933 },
  "Adreno X2-45":        { ts: 1377 },
};
