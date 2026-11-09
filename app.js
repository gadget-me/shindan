// =====================================================================
//  診断の動き（画面の切り替え・点数の計算）
//  ※ 診断の中身は questions.js に書く。こっちは基本さわらなくてOK
// =====================================================================

// いま進めている診断の状態
let current = null;    // 選んだ診断（DIAGNOSES.smartphone など）
let step = 0;          // 何問目か（0から数える）
let history = [];      // これまで選んだ答え（「戻る」で使う）

// 画面の部品を取ってくる
const screens = {
  start: document.getElementById("start-screen"),
  question: document.getElementById("question-screen"),
  result: document.getElementById("result-screen"),
};

// 指定した画面だけを表示する
function showScreen(name) {
  for (const key in screens) {
    screens[key].classList.toggle("hidden", key !== name);
  }
}

// ボタンを1つ作る
function makeButton(label, onClick) {
  const button = document.createElement("button");
  button.className = "choice";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}

// ① スタート画面：ジャンルのボタンを並べる
function showStart() {
  const box = document.getElementById("genre-buttons");
  box.innerHTML = "";
  for (const key in DIAGNOSES) {
    if (DIAGNOSES[key].hidden) continue;   // 作りかけの診断は出さない
    box.appendChild(makeButton(DIAGNOSES[key].genreLabel, () => startDiagnosis(key)));
  }
  showScreen("start");
}

// 診断を始める
function startDiagnosis(key) {
  current = DIAGNOSES[key];
  step = 0;
  history = [];
  skipped = [];
  showQuestion();
}

// 複数選択の答えは parts にまとめて入っているので、1つずつの答えに展開する
function flatten(answers) {
  return answers.flatMap((a) => a.parts || [a]);
}

// その答えを選んでも機種が1つ以上残るか
function stillHasModels(extraAnswers) {
  if (!current.models) return true;   // メーカーごとの診断では消去法を使わない
  return calcModelResult(current, [...history, ...extraAnswers]).length > 0;
}

// ② 質問画面：いまの質問と答えを表示する
function showQuestion() {
  const questions = current.questions;
  const q = questions[step];

  document.getElementById("progress").textContent = `質問 ${step + 1} / ${questions.length}`;
  document.getElementById("bar-fill").style.width = `${(step / questions.length) * 100}%`;
  document.getElementById("question-text").textContent = q.text;
  const box = document.getElementById("answer-buttons");
  box.innerHTML = "";

  if (q.multi) {
    showMultiQuestion(q, box);
    return;
  }

  // 選んでも機種が1つも残らない答えは出さない（例：〜5万円 → 折りたたみは出さない）
  const answers = q.answers.filter((answer) => stillHasModels([answer]));

  // 選べる答えが1つ以下なら、聞く意味がないので自動で次へ進む
  if (answers.length <= 1) {
    choose(answers[0] || {}, true);
    return;
  }
  for (const answer of answers) {
    box.appendChild(makeButton(answer.label, () => choose(answer)));
  }
  showScreen("question");
}

// 複数選べる質問（例：絶対に必要な機能は？）
//  - 押すたびに選択/解除が切り替わる
//  - 「特になし」（none: true）を押すと、ほかの選択はすべて外れる
//  - いまの選び方と組み合わせると機種がなくなる答えは押せなくする
function showMultiQuestion(q, box) {
  const options = q.answers.filter((a) => !a.none);
  const noneAnswer = q.answers.find((a) => a.none) || { label: "特になし" };

  // どれを選んでも機種がなくなるなら、聞かずに次へ
  if (!options.some((o) => stillHasModels([o]))) {
    choose(noneAnswer, true);
    return;
  }

  const selected = new Set();
  const buttons = new Map();
  for (const option of options) {
    const button = makeButton(option.label, () => {
      if (selected.has(option)) selected.delete(option);
      else selected.add(option);
      refresh();
    });
    buttons.set(option, button);
    box.appendChild(button);
  }
  box.appendChild(makeButton(noneAnswer.label, () => choose(noneAnswer)));

  const next = document.createElement("button");
  next.className = "main-button next-button";
  next.textContent = "次へ";
  next.addEventListener("click", () => {
    if (selected.size === 0) choose(noneAnswer);
    else choose({ label: [...selected].map((o) => o.label).join("・"), parts: [...selected] });
  });
  box.appendChild(next);

  function refresh() {
    for (const [option, button] of buttons) {
      const on = selected.has(option);
      button.classList.toggle("selected", on);
      button.textContent = (on ? "✓ " : "") + option.label;
      // まだ選んでいない答えは、今の選択と組み合わせて機種が残るときだけ押せる
      button.disabled = !on && !stillHasModels([...selected, option]);
    }
    next.textContent = selected.size === 0 ? "次へ（特になし）" : "次へ";
  }
  refresh();
  showScreen("question");
}

// 答えを選んだとき（auto が true なら、自動で飛ばした質問）
let skipped = [];   // 何問目を自動で飛ばしたか（「戻る」で使う）
function choose(answer, auto = false) {
  history.push(answer);
  skipped.push(auto);
  step++;
  if (step < current.questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

// 「ひとつ前に戻る」（自動で飛ばした質問は、さらにその前まで戻る）
function goBack() {
  while (step > 0) {
    history.pop();
    const wasSkipped = skipped.pop();
    step--;
    if (!wasSkipped) {
      showQuestion();
      return;
    }
  }
  showStart();      // 1問目より前なら、ジャンル選びに戻る
}

// その機種が条件（例：{ size: "fold" }）にすべて当てはまるか
function matches(model, condition) {
  for (const field in condition) {
    if (model[field] !== condition[field]) return false;
  }
  return true;
}

// 【機種ごとの診断】選んだ答えから、機種ごとの点数を計算して並べる
function calcModelResult(diagnosis, answers) {
  answers = flatten(answers);
  // 全機種を0点・候補に残っている状態でスタート
  const rows = diagnosis.models.map((model, index) => ({ model, index, score: 0, alive: true }));

  for (const answer of answers) {
    for (const row of rows) {
      const m = row.model;
      if (answer.scores && answer.scores[m.maker]) row.score += answer.scores[m.maker];   // メーカーに点数
      if (answer.attr) row.score += m.scores[answer.attr] * ATTR_WEIGHT;                   // 重視する性能の評価（scoring.js）
      for (const k in answer.attrs || {}) row.score += m.scores[k] * answer.attrs[k] * ATTR_WEIGHT;  // 使いみちなどの評価（いくつでも）
      if (answer.match && matches(m, answer.match)) row.score += answer.points;            // 条件に合えば点数
      for (const b of answer.bonus || []) if (matches(m, b.when)) row.score += b.points;  // 追加の条件ボーナス
      if (answer.budget && (m.price < answer.budget.min || m.price > answer.budget.max)) row.alive = false;  // 予算外は外す
      if (answer.only && !matches(m, answer.only)) row.alive = false;                       // 条件に合わなければ外す
      if (answer.exclude && matches(m, answer.exclude)) row.alive = false;                  // 条件に合えば外す
    }
  }

  // 重視した項目の星の数でしぼる・加点する
  //  1. 条件に合う機種の中に ★PRIORITY_GOOD_STARS 以上があれば、それ未満は外す
  //  2. なければ ★PRIORITY_MIN_STARS 以上だけ残す（それもなければ0機種＝その答えは表示されない）
  //  3. ★PRIORITY_GOOD_STARS 以上の機種には PRIORITY_GOOD_BONUS 点を足す
  const priority = answers.find((a) => a.attr);
  if (priority) {
    const starsOf = (row) => starCount(row.model.scores[priority.attr]);
    let kept = false;
    for (const level of [PRIORITY_GOOD_STARS, PRIORITY_MIN_STARS]) {
      if (rows.some((row) => row.alive && starsOf(row) >= level)) {
        for (const row of rows) if (starsOf(row) < level) row.alive = false;
        kept = true;
        break;
      }
    }
    if (!kept) for (const row of rows) row.alive = false;   // 重視した項目が★1しかないなら、その答えは選べないようにする
    for (const row of rows) if (starsOf(row) >= PRIORITY_GOOD_STARS) row.score += PRIORITY_GOOD_BONUS;
  }

  // 残った機種を点数の高い順に並べる
  // 同点なら「総合評価が高いほう」→ それも同じなら「安いほう」を先にする
  return rows
    .filter((row) => row.alive)
    .sort((a, b) =>
      b.score - a.score ||
      (b.model.scores ? b.model.scores.overall - a.model.scores.overall : 0) ||
      a.model.price - b.model.price);
}

// 【メーカーごとの診断】（ノートPC診断で使う、前からの方式）
function calcCandidateResult(diagnosis, answers) {
  const totals = {};
  for (const key in diagnosis.candidates) totals[key] = 0;
  for (const answer of answers) {
    for (const key in answer.scores || {}) totals[key] += answer.scores[key];
  }
  let bestKey = null;
  for (const key in totals) {
    if (bestKey === null || totals[key] > totals[bestKey]) bestKey = key;
  }
  return bestKey;
}

// 価格を「¥136,800〜」の形にする
function yen(price) {
  return "¥" + price.toLocaleString("ja-JP") + "〜";
}

// 0〜10点を ★1〜5 で表す（★1 は 0〜1点台のときだけ）
function stars(score) {
  const n = starCount(score);
  return "★".repeat(n) + "☆".repeat(5 - n);
}

// 結果の機種のスペックを、売り場のポップのような短い行にする
function specLines(m) {
  const d = m.scores;
  const battery = m.mah ? `${m.mah.toLocaleString()}mAh` : `ビデオ再生 最大${m.videoHours}時間`;
  const camera = m.tele > 0 ? `${m.mainMP}MP＋光学${m.tele}倍望遠` : `${m.mainMP}MP（望遠なし）`;
  const extras = [m.fold ? "折りたたみ" : null, m.felica ? "おサイフケータイ" : null, m.jack ? "イヤホンジャック" : null, m.ip || null]
    .filter(Boolean).join("・");
  return [
    ["処理性能", `${stars(d.performance)}　${m.chip}`],
    ["カメラ",   `${stars(d.camera)}　${camera}`],
    ["バッテリー", `${stars(d.battery)}　${battery}`],
    ["AI機能",   `${stars(d.ai)}`],
    ["本体",     `${m.inch}インチ・${m.weight}g`],
    ["対応",     extras || "—"],
  ];
}

// candidates の中で、m の attr の評価が何番目か
function rankBy(attr, m, candidates) {
  return 1 + candidates.filter((c) => c.scores[attr] > m.scores[attr]).length;
}

// どの答えがこの機種を押し上げたか（選ばれた理由）
//  candidates：条件（予算・サイズ・おサイフなど）に合って残った機種
function reasons(m, candidates) {
  const list = [];
  for (const answer of flatten(history)) {
    if (answer.budget) list.push(`予算「${answer.label}」に入る`);
    if (answer.attr && answer.attr !== "overall") {
      const rank = rankBy(answer.attr, m, candidates);
      const where = rank === 1 ? "条件に合う機種の中でいちばん" : `条件に合う${candidates.length}機種の中で${rank}番目に`;
      list.push(`重視した「${answer.label}」が、${where}高い評価（${stars(m.scores[answer.attr])}）`);
    }
    if (answer.attr === "overall") list.push(`全体のバランスが ${stars(m.scores.overall)}`);
    if (answer.scores && answer.scores[m.maker]) list.push(`「${answer.label}」を使っている人と相性がいい`);
    if (answer.match && matches(m, answer.match)) list.push(`「${answer.label}」に合うサイズ`);
    for (const b of answer.bonus || []) {
      if (!matches(m, b.when)) continue;
      if (b.reason) list.push(b.reason);
      else if (b.when.light) list.push(`${m.weight}g と軽い`);
      else if (b.when.japan) list.push("日本のメーカー");
      else if (b.when.android) list.push("今と同じ Android なので乗り換えが楽");
      else list.push(`「${answer.label}」に合う`);
    }
    if (answer.only && answer.reason) list.push(answer.reason);
    if (answer.only && answer.only.felica) list.push("おサイフケータイ対応");
    if (answer.only && answer.only.jack) list.push("イヤホンジャックあり");
    if (answer.only && answer.only.ip) list.push(`防水防塵（${answer.only.ip}）`);
  }
  return list;
}

// 「今使っているスマホ」「持っている機器」で選んだメーカー（例：iPhone）が1位にならなかったとき、
// そのメーカーのおすすめを案内するひとことを作る
//  1. 条件にすべて合う機種があれば、その中でいちばん順位が高い機種
//  2. なければ、重視した項目の★が足りないだけの「予算内の機種」と、
//     予算を上げれば★も足りる「いちばん安い機種」の両方を案内する
function loyaltyAdvice(best, ranking) {
  // 答えの scores から、いちばん点数が多いメーカーを「こだわりのメーカー」とする
  const answers = flatten(history);
  const totals = {};
  for (const answer of answers) {
    for (const maker in answer.scores || {}) totals[maker] = (totals[maker] || 0) + answer.scores[maker];
  }
  const maker = Object.keys(totals).sort((x, y) => totals[y] - totals[x])[0];
  if (!maker || best.maker === maker) return null;
  const makerName = current.makers[maker].name;
  const ofMaker = (rows) => rows.map((r) => r.model).filter((m) => m.maker === maker);

  // 1. 条件にすべて合う機種がある
  const inside = ofMaker(ranking)[0];
  if (inside) {
    return `${makerName}にこだわる場合：条件に合う中では ${inside.name}（${yen(inside.price)}）がおすすめです。`;
  }

  const priority = answers.find((a) => a.attr);
  const budget = answers.find((a) => a.budget);
  const label = priority ? `「${priority.label}」` : "";
  const parts = [];

  // 2-a. 予算内にはあるが、重視した項目の★が足りない機種
  const withoutPriority = answers.filter((a) => !a.attr);
  const inBudget = ofMaker(calcModelResult(current, withoutPriority))[0];
  if (inBudget && priority) {
    parts.push(`予算内なら ${inBudget.name}（${yen(inBudget.price)}）がありますが、${label}は${stars(inBudget.scores[priority.attr])}です`);
  }

  // 2-b. 予算を上げれば条件に合う、いちばん安い機種
  if (budget) {
    const upper = ofMaker(calcModelResult(current, answers.filter((a) => !a.budget)))
      .filter((m) => m.price > budget.budget.max)
      .sort((x, y) => x.price - y.price)[0];
    if (upper) {
      const diff = yen(upper.price - budget.budget.max).replace("〜", "");
      parts.push(`予算をあと${diff}上げると ${upper.name}（${yen(upper.price)}）があります`);
    }
  }
  if (parts.length === 0) return null;   // イヤホンジャックなど予算以外の条件で外れているなら案内しない
  return `${makerName}にこだわる場合：${parts.join("。")}。`;
}

// 重視した項目が★PRIORITY_GOOD_STARS 未満のとき、予算以外の条件はそのままで
// ★PRIORITY_GOOD_STARS 以上になるいちばん安い機種を探して、ひとことにする
function upgradeAdvice(best) {
  const priority = flatten(history).find((a) => a.attr);
  if (!priority || starCount(best.scores[priority.attr]) >= PRIORITY_GOOD_STARS) return null;
  const withoutBudget = flatten(history).filter((a) => !a.budget);
  const candidates = calcModelResult(current, withoutBudget)
    .map((r) => r.model)
    .filter((m) => starCount(m.scores[priority.attr]) >= PRIORITY_GOOD_STARS && m.price > best.price)
    .sort((x, y) => x.price - y.price);
  if (candidates.length === 0) return null;
  const cheapest = candidates[0];
  // 画面サイズなど「match」の希望にも合う機種
  const wishes = flatten(history).filter((a) => a.match).map((a) => a.match);
  const fit = candidates.find((m) => wishes.every((w) => matches(m, w)));

  let text = `ワンポイント：この予算だと「${priority.label}」が★${PRIORITY_GOOD_STARS}以上の機種はありませんでした。` +
    `いちばん近いのは ${yen(cheapest.price)}の ${cheapest.name}（${stars(cheapest.scores[priority.attr])}）です。`;
  if (fit && fit !== cheapest) {
    text += `画面の大きさの希望にも合わせるなら、${yen(fit.price)}の ${fit.name}（${stars(fit.scores[priority.attr])}）です。`;
  }
  return text;
}

// 「条件を変えると」：答えを1つだけ変えたら、重視した項目がもっと高い機種や、もっと安い機種が出るか
//  質問に short（例："予算"）が書いてあるものだけ試す。いちばん役に立ちそうなものを WHAT_IFS 個まで返す
function whatIfs(best, ranking) {
  const priority = flatten(history).find((a) => a.attr);
  if (!priority) return [];
  const shown = new Set(ranking.slice(0, 1 + RUNNER_UPS).map((r) => r.model));
  const bestScore = best.scores[priority.attr];
  const found = [];
  current.questions.forEach((q, i) => {
    if (!q.short || !history[i]) return;
    const tries = [];
    if (q.multi) {
      // 複数選んだ条件は、1つずつ外してみる
      for (const part of history[i].parts || []) {
        if (part.none) continue;
        const rest = history[i].parts.filter((p) => p !== part);
        tries.push({ text: `${q.short}の「${part.label.replace(/（.*）/, "")}」がなくてもよければ`, answer: { parts: rest } });
      }
    } else {
      for (const a of q.answers) {
        if (a === history[i]) continue;
        tries.push({ text: `${q.short}を「${a.label.replace(/（.*）/, "")}」にすると`, answer: a });
      }
    }
    for (const t of tries) {
      const changed = history.map((h, j) => (j === i ? t.answer : h));
      const rows = calcModelResult(current, changed);
      if (rows.length === 0) continue;
      const m = rows[0].model;
      if (shown.has(m)) continue;
      // 「日本のメーカーだと安心」のような好みの答えなら、その好みに合う機種のときだけ出す
      const wish = [...(t.answer.bonus || []).map((b) => b.when), t.answer.match].filter(Boolean);
      if (wish.length > 0 && !wish.some((w) => matches(m, w))) continue;
      const gain = m.scores[priority.attr] - bestScore;
      const sameStars = starCount(m.scores[priority.attr]) >= starCount(bestScore);
      const saving = best.price - m.price;
      let value = 0;
      if (gain >= 1) value = gain;                                         // 重視した項目がはっきり上がる
      else if (sameStars && saving >= best.price * 0.15) value = saving / best.price;   // 同じ★のまま15%以上安い
      if (value > 0) found.push({ q: i, text: t.text, model: m, value, attr: priority.attr, cheaper: gain < 1 ? saving : 0 });
    }
  });
  found.sort((a, b) => b.value - a.value);
  const picked = [];
  for (const f of found) {
    if (picked.length >= WHAT_IFS) break;
    if (picked.some((p) => p.model === f.model || p.q === f.q)) continue;   // 同じ機種・同じ質問は1回だけ
    picked.push(f);
  }
  return picked;
}

// ③ 結果画面
function showResult() {
  const nameEl = document.getElementById("result-name");
  const descEl = document.getElementById("result-description");
  const specEl = document.getElementById("result-specs");
  const othersEl = document.getElementById("result-others");
  const link = document.getElementById("result-link");
  specEl.innerHTML = "";
  othersEl.innerHTML = "";
  specEl.classList.add("hidden");
  othersEl.classList.add("hidden");
  link.classList.remove("hidden");

  if (current.models) {
    // 機種ごとの診断
    const ranking = calcModelResult(current, history);
    console.log("ランキング:", ranking.map((r) => `${r.model.name} ${r.score.toFixed(1)}点`));   // 確認用

    if (ranking.length === 0) {
      nameEl.textContent = "ぴったりの機種が見つかりませんでした";
      descEl.textContent = "今の条件に合う現行機種がないようです。予算やほかの条件を変えて、もう一度試してみてください。";
      link.classList.add("hidden");
    } else {
      const best = ranking[0].model;
      nameEl.textContent = best.name;
      const priceNote = (m) => (current.priceNote ? current.priceNote(m, flatten(history)) : "");
      descEl.textContent = `${current.makers[best.maker].name}　${yen(best.price)}（税込）${priceNote(best)}`;

      // スペック表
      const table = document.createElement("dl");
      table.className = "spec-table";
      for (const [label, value] of (current.specLines || specLines)(best)) {
        const dt = document.createElement("dt");
        dt.textContent = label;
        const dd = document.createElement("dd");
        dd.textContent = value;
        table.append(dt, dd);
      }
      specEl.appendChild(table);

      // 選ばれた理由
      const why = reasons(best, ranking.map((r) => r.model));
      if (why.length > 0) {
        const title = document.createElement("p");
        title.className = "label";
        title.textContent = "この機種を選んだ理由";
        const ul = document.createElement("ul");
        ul.className = "reason-list";
        for (const r of why) {
          const li = document.createElement("li");
          li.textContent = r;
          ul.appendChild(li);
        }
        specEl.append(title, ul);
      }
      // まだ3つの情報源で照合していない機種には注意書きを出す
      for (const text of current.notices ? current.notices(best) : []) {
        const note = document.createElement("p");
        note.className = "unverified";
        note.textContent = text;
        specEl.appendChild(note);
      }
      if (best.discontinued) {
        const warn = document.createElement("p");
        warn.className = "unverified";
        warn.textContent = "※ メーカーの公式ストアでは販売が終わっている機種です。キャリアや量販店の在庫限りになります。";
        specEl.appendChild(warn);
      }
      if (best.verified === false) {
        const warn = document.createElement("p");
        warn.className = "unverified";
        warn.textContent = "※ この機種のスペックと価格は、まだ3つの情報源で確認できていません。購入前にメーカー公式サイトで確認してください。";
        specEl.appendChild(warn);
      }
      specEl.classList.remove("hidden");
      link.href = current.link;

      // ワンポイント：予算内に重視した項目が★3以上の機種がないとき、予算を上げた場合の候補を出す
      for (const advice of [loyaltyAdvice(best, ranking), upgradeAdvice(best)]) {
        if (!advice) continue;
        const tip = document.createElement("p");
        tip.className = "advice";
        tip.textContent = advice;
        specEl.appendChild(tip);
      }

      // ほかの候補
      const others = ranking.slice(1, 1 + RUNNER_UPS);
      if (others.length > 0) {
        const title = document.createElement("p");
        title.className = "label";
        title.textContent = "ほかの候補";
        othersEl.appendChild(title);
        for (const row of others) {
          const item = document.createElement("p");
          item.className = "other-item";
          item.textContent = `${row.model.name}（${yen(row.model.price)}${priceNote(row.model)}）`;
          othersEl.appendChild(item);
        }
        othersEl.classList.remove("hidden");
      }

      // 条件を変えると（小さく表示）
      const ifs = whatIfs(best, ranking);
      if (ifs.length > 0) {
        const title = document.createElement("p");
        title.className = "label whatif-title";
        title.textContent = "条件を変えると";
        othersEl.appendChild(title);
        const pr = flatten(history).find((a) => a.attr);
        const label = pr.attr === "overall" ? "総合" : pr.label.replace(/（.*）/, "");
        for (const f of ifs) {
          const item = document.createElement("p");
          item.className = "whatif-item";
          const merit = f.cheaper > 0 ? `${yen(f.cheaper).replace("〜", "")}安い` : `${label} ${stars(f.model.scores[f.attr])}`;
          item.textContent = `${f.text} → ${f.model.name}（${yen(f.model.price)}・${merit}）`;
          othersEl.appendChild(item);
        }
        othersEl.classList.remove("hidden");
      }
    }
  } else {
    // メーカーごとの診断
    const best = current.candidates[calcCandidateResult(current, history)];
    nameEl.textContent = best.name;
    descEl.textContent = best.description;
    link.href = best.link;
  }
  showScreen("result");
}

// ボタンに動きをつける
document.getElementById("back-button").addEventListener("click", goBack);
document.getElementById("retry-button").addEventListener("click", showStart);

// スペックから評価を計算してから、スタート画面を出す
addDerivedScores(MODELS);
addPcScores(PC_MODELS);
showStart();
