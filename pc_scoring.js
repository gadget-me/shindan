// =====================================================================
//  PCのスペックから評価（0〜10点）を自動で計算する
//  ★ 「重さをもっと厳しく見たい」などは、ここの数字を変える
//  （starCount と clamp10 は scoring.js のものを使う）
// =====================================================================

// 0〜10点に「対数」で直す（小さい側の差をくわしく見る。体感に近い）
function logScore(value, min, max) {
  return clamp10((10 * Math.log(value / min)) / Math.log(max / min));
}

// ---- 処理性能：Cinebench R23 マルチ ----
//  例：6,000点 → 約1.8点、10,000点 → 約4点、15,000点 → 約5.7点、35,000点 → 約9.4点
const PC_CB_MIN = 4000;
const PC_CB_MAX = 40000;
function pcPerformance(m) {
  return logScore(PC_CPUS[m.cpu].cb, PC_CB_MIN, PC_CB_MAX);
}

// ---- グラフィック（ゲーム・動画編集）：3DMark Time Spy ----
//  例：1,400点 → 約2点、2,900点 → 約4.2点、9,000点 → 約7.1点、22,000点 → 約9.7点
const PC_TS_MIN = 700;
const PC_TS_MAX = 25000;
function pcGraphics(m) {
  return logScore(PC_GPUS[m.gpu].ts, PC_TS_MIN, PC_TS_MAX);
}

// ---- 持ち運び：重さ（デスクトップは0点）----
//  例：0.9kg → 10点、1.2kg → 7.9点、1.5kg → 5.7点、2.0kg → 2.1点、2.3kg以上 → 0点
function pcPortability(m) {
  if (m.battery === null) return 0;
  return clamp10((2.3 - m.weight) / 0.14);
}

// ---- バッテリー：動画再生の時間（デスクトップは0点）----
//  例：5時間 → 0.8点、10時間 → 2.9点、15時間 → 5点、20時間 → 7.1点、27時間以上 → 10点
function pcBattery(m) {
  if (m.battery === null) return 0;
  return clamp10((m.battery - 3) / 2.4);
}

// ---- 画面の見やすさ：大きさ（画面がないデスクトップは、好きなモニターを選べるので5点）----
//  例：13インチ → 3点、14インチ → 4.5点、16インチ → 7.5点、23.8インチ以上 → 10点
function pcScreen(m) {
  if (m.inch === null) return 5;
  return clamp10((m.inch - 11) * 1.5);
}

// ---- 安さ：価格 ----
//  例：12万円 → 9点、15万円 → 7.7点、20万円 → 6.1点、30万円 → 3.9点、50万円 → 1点
function pcValue(m) {
  return clamp10(10 - (10 * Math.log(m.price / 100000)) / Math.log(6));
}

// ---- 総合（「特にない」を選んだ人向け）----
//  ノートは持ち運びとバッテリーも入れる。デスクトップはその分を性能とグラフィックで見る
function pcOverall(d, desktop) {
  if (desktop) return clamp10((d.performance * 2 + d.graphics + d.screen + d.value) / 5);
  return clamp10((d.performance + d.graphics * 0.5 + d.portability + d.battery + d.screen * 0.5 + d.value) / 5);
}

// 全機種に評価と分類をつける（app.js の最初で1回だけ呼ぶ）
function addPcScores(models) {
  for (const m of models) {
    const desktop = ["aio", "mini", "tower"].includes(m.form);
    const d = {
      performance: pcPerformance(m),
      graphics: pcGraphics(m),
      portability: pcPortability(m),
      battery: pcBattery(m),
      screen: pcScreen(m),
      value: pcValue(m),
    };
    d.overall = pcOverall(d, desktop);
    m.scores = d;
    m.desktop = desktop;                                       // デスクトップか
    m.laptop = !desktop;                                       // ノート（2in1を含む）か
    m.big = !desktop && m.inch >= 15;                          // 据え置き向けの大きいノート
    m.dgpu = !!PC_GPUS[m.gpu].dedicated;                       // グラフィックボードがあるか（ゲーム向け）
    m.light = !desktop && m.weight <= 1.2;                     // 1.2kg 以下を「軽い」とする
    m.ram32 = m.ram >= 32;                                     // メモリが32GB以上
    m.japan = PC_MAKERS[m.maker].country === "JP";
    m.bto = !!PC_MAKERS[m.maker].bto;
  }
}

// 結果画面のスペック表（売り場のポップのような短い行）
function pcSpecLines(m) {
  const d = m.scores;
  const ports = [m.hdmi ? "HDMI" : null, m.usbA ? "USB-A" : null, m.lan ? "有線LAN" : null, m.sd ? "SDカード" : null, m.drive ? "DVD/BDドライブ" : null]
    .filter(Boolean).join("・");
  const storage = m.ssd >= 1024 ? `${m.ssd / 1024}TB` : `${m.ssd}GB`;
  const lines = [
    ["処理性能",   `${stars(d.performance)}　${m.cpu}`],
    ["グラフィック", `${stars(d.graphics)}　${m.gpu}`],
  ];
  if (m.desktop) {
    lines.push(["本体", m.inch ? `${m.inch}インチの画面一体型` : "画面なし（モニターは別に用意）"]);
  } else {
    lines.push(["持ち運び", `${stars(d.portability)}　${m.weight}kg・${m.inch}インチ`]);
    lines.push(["バッテリー", `${stars(d.battery)}　約${m.battery}時間${m.batteryEstimated ? "（公表なし・目安）" : ""}`]);
  }
  lines.push(["メモリ・SSD", `${m.ram}GB・${storage}`]);
  lines.push(["端子", ports || "USB-C のみ"]);
  lines.push(["Office", m.office ? "付いている" : "なし"]);
  return lines;
}

// Office を「必要」と答えた人に、Office が付いていない機種の「Office込みの金額」を出す
//  Office Home 2024 の参考価格（2026年、Amazon の参考価格。週刊アスキー）
const OFFICE_PRICE = 41360;
function pcPriceNote(m, answers) {
  if (m.office || !answers.some((a) => a.needOffice)) return "";
  const total = Math.round((m.price + OFFICE_PRICE) / 1000) * 1000;
  return `（Office込みなら約${total.toLocaleString("ja-JP")}円）`;
}

// 結果画面の注意書き
function pcNotices(m) {
  const list = [];
  if (m.bto) list.push("※ メーカー直販で構成を選べる機種です。メモリやSSDを増やすと価格が変わります。");
  if (m.form === "2in1" && m.maker === "microsoft") list.push("※ キーボード（タイプカバー）は別売です。");
  if (m.desktop && m.inch === null) list.push("※ モニター・キーボード・マウスは別に用意してください。");
  return list;
}
