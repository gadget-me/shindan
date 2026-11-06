// =====================================================================
//  スペックから評価（0〜10点）を自動で計算する
//  ★ 「カメラのこの要素をもっと重く見たい」などは、ここの数字を変える
// =====================================================================

// 0〜10点を星の数（1〜5）にする。★1 は 0〜1点台のときだけ
function starCount(score) {
  return Math.min(5, 1 + Math.round(score * 0.4));
}

// 0〜10 の範囲におさめる
function clamp10(x) {
  return Math.max(0, Math.min(10, Math.round(x * 10) / 10));
}

// センサーサイズ "1/1.5" → 0.67、"1" → 1 のような数字にする（大きいほど良い）
function sensorValue(text) {
  if (!text) return 0;
  const [a, b] = text.split("/").map(Number);
  return b ? a / b : a;
}

// ---- 処理性能：AnTuTu を「対数」で0〜10点にする ----
//  まっすぐ比例させると、普段使いには十分な機種まで低い点になってしまうので、
//  体感に近づけるため、差が大きいところ（低い側）をくわしく見る計算にしている
//  例：66万点 → 約2点、106万点 → 約4点、186万点 → 約6点、400万点 → 約9.5点
const ANTUTU_MIN = 400000;    // これで0点
const ANTUTU_MAX = 4500000;   // これで10点
function scorePerformance(m) {
  const a = CHIPS[m.chip].antutu;
  return clamp10((10 * Math.log(a / ANTUTU_MIN)) / Math.log(ANTUTU_MAX / ANTUTU_MIN));
}

// ---- バッテリー：容量（mAh）から。iPhone はビデオ再生時間を mAh に換算した「推定」 ----
function batteryEquivalent(m) {
  if (m.mah) return m.mah;
  return m.videoHours * 150 + 500;   // 例：30時間 → 5,000mAh 相当
}
function scoreBattery(m) {
  let s = (batteryEquivalent(m) - 3500) / 350;   // 5,000mAh で約4.3点、7,000mAh で10点
  if (m.fold) s -= 1;                               // 折りたたみは画面が大きく電池が減りやすい
  return clamp10(s);
}

// ---- カメラ（写真）----
const PHOTO_PROCESSING_BONUS = { pixel: 1.5, iphone: 1.5 };   // 画像処理・AI補正の強さ（売り場の感覚で調整）
function scoreCamera(m) {
  let s = 2;                                                    // 基本点
  if (m.tele > 0) s += 2 + Math.min(m.tele, 10) * 0.2;          // 望遠カメラ（倍率が高いほど加点）
  if (m.mainMP >= 200) s += 1;                                  // 2億画素
  const sv = sensorValue(m.sensor);
  if (sv >= 0.9) s += 2; else if (sv >= 0.6) s += 1;            // 大きなセンサー
  if (m.ois) s += 0.5;                                          // 光学式手ぶれ補正
  if (CHIPS[m.chip].antutu >= 3000000) s += 1;                  // ハイエンドチップの画像処理
  s += PHOTO_PROCESSING_BONUS[m.maker] || 0;
  return clamp10(s);
}

// ---- 動画：カメラの評価をもとに、動画に強いメーカーを加点 ----
const VIDEO_BONUS = { iphone: 3, xperia: 1 };                   // 売り場の感覚：iPhone は動画が強い
function scoreVideo(m) {
  return clamp10(1 + scoreCamera(m) * 0.6 + (VIDEO_BONUS[m.maker] || 0) + (m.ois ? 1 : 0));
}

// ---- AI機能：メーカーごとの基本点（makers.js）+ チップの強さ ----
function scoreAI(m) {
  let s = MAKERS[m.maker].ai;
  if (m.chip === "Tensor G6") s += 2;
  else if (m.chip === "Tensor G5") s += 1;
  else if (CHIPS[m.chip].antutu >= 2500000) s += 1;
  return clamp10(s);
}

// ---- 総合（「特にない」を選んだ人向け）----
function scoreOverall(d) {
  return clamp10((d.performance + d.battery + d.camera + d.ai) / 4);
}

// 画面の大きさの分類
function sizeClass(m) {
  if (m.fold) return "fold";
  return m.inch <= 6.3 ? "small" : "large";
}

// 全機種に評価をつける（app.js の最初で1回だけ呼ぶ）
function addDerivedScores(models) {
  for (const m of models) {
    const d = {
      performance: scorePerformance(m),
      battery: scoreBattery(m),
      camera: scoreCamera(m),
      video: scoreVideo(m),
      ai: scoreAI(m),
    };
    d.overall = scoreOverall(d);
    m.scores = d;
    m.size = sizeClass(m);
    m.light = m.weight <= 175;                    // 175g 以下を「軽い」とする
    m.japan = MAKERS[m.maker].country === "JP";    // 日本のメーカーか（makers.js の country）
    m.chinese = MAKERS[m.maker].country === "CN";  // 中国のメーカーか
    m.android = m.maker !== "iphone";              // Android か
  }
}
