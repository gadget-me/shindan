// =====================================================================
//  スマホの現行機種データ（スマホ診断の結果はこの中から選ばれる）
//  ★ 新しい機種が出たら、ここに1行足すだけでOK！
//    評価（カメラ・性能・バッテリーなど）は scoring.js がスペックから自動で計算する
// =====================================================================
//
//  maker   : メーカー（questions.js の makers と同じ名前）
//  name    : 機種名
//  price   : 税込価格（いちばん安い容量）。SIMフリー/メーカー直販を優先
//  chip    : チップ名（chips.js の名前と同じにする）
//  inch    : 画面サイズ（折りたたみは広げたときの大きさ）
//  fold    : 折りたたみなら true
//  weight  : 重さ（g）
//  mah     : バッテリー容量（mAh）
//  videoHours : iPhone のみ。Apple は mAh を公表していないので「ビデオ再生時間」を使う
//  charge  : 有線の最大充電（W）。わからなければ書かない
//  mainMP  : メインカメラの画素数（万画素ではなく MP）
//  sensor  : メインカメラのセンサーサイズ（"1" = 1インチ、"1/1.5" など）。わからなければ書かない
//  tele    : 望遠カメラの光学倍率（望遠がなければ 0）
//  ois     : メインカメラに光学式手ぶれ補正があれば true
//  ip      : 防水防塵の等級
//  felica  : おサイフケータイ対応なら true
//  jack    : 3.5mm イヤホンジャックがあれば true
//  verified: false なら、まだ3つの情報源で照合していない機種（書いていなければ照合済み）
//  discontinued: true なら、メーカーの公式ストアではもう売っていない機種（キャリアや量販店の在庫のみ）
//  note    : 確認できていない点などのメモ
//
//  調べた日：2026年11月5日、11月6日に3つ以上の情報源で照合（メーカー公式・価格.com・ショーケース/ニュース）
//  照合の結果は 確認表.md を参照

const MODELS = [
  // ---- iPhone（Apple 公式の比較ページ）----
  { maker: "iphone", name: "iPhone 17e",        price: 124800, chip: "A19",     inch: 6.1, weight: 169, videoHours: 26, mainMP: 48, tele: 0, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "iphone", name: "iPhone 16",         price: 139800, chip: "A18",     inch: 6.1, weight: 170, videoHours: 22, mainMP: 48, tele: 0, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "iphone", name: "iPhone 17",         price: 159800, chip: "A19",     inch: 6.3, weight: 177, videoHours: 30, mainMP: 48, tele: 0, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "iphone", name: "iPhone Air",        price: 189800, chip: "A19 Pro", inch: 6.5, weight: 165, videoHours: 27, mainMP: 48, tele: 0, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "iphone", name: "iPhone 18 Pro",     price: 219800, chip: "A20 Pro", inch: 6.3, weight: 211, videoHours: 36, mainMP: 48, tele: 4, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "iphone", name: "iPhone 18 Pro Max", price: 239800, chip: "A20 Pro", inch: 6.9, weight: 249, videoHours: 45, mainMP: 48, tele: 4, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "iphone", name: "iPhone Duo",        price: 364800, chip: "A20 Pro", inch: 7.6, fold: true, weight: 254, videoHours: 31, mainMP: 48, tele: 0, ois: true, ip: "IP68", felica: true, jack: false, note: "ビデオ再生は内側画面で最大31時間" },

  // ---- Pixel（Google ストアの比較ページ）----
  { maker: "pixel", name: "Pixel 10a",         price: 92800,  chip: "Tensor G4", inch: 6.3, weight: 183, mah: 5100, mainMP: 48, tele: 0, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "pixel", name: "Pixel 10",          price: 128900, chip: "Tensor G5", inch: 6.3, weight: 204, mah: 4970, mainMP: 48, tele: 5, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "pixel", name: "Pixel 11",          price: 136800, chip: "Tensor G6", inch: 6.3, weight: 197, mah: 4985, mainMP: 48, tele: 5, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "pixel", name: "Pixel 11 Pro",      price: 174800, chip: "Tensor G6", inch: 6.3, weight: 204, mah: 4850, mainMP: 50, tele: 5, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "pixel", name: "Pixel 10 Pro",      price: 174900, chip: "Tensor G5", inch: 6.3, weight: 207, mah: 4870, mainMP: 50, tele: 5, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "pixel", name: "Pixel 10 Pro XL",   price: 192900, chip: "Tensor G5", inch: 6.8, weight: 232, mah: 5200, mainMP: 50, tele: 5, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "pixel", name: "Pixel 11 Pro XL",   price: 207800, chip: "Tensor G6", inch: 6.8, weight: 226, mah: 5115, mainMP: 50, tele: 5, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "pixel", name: "Pixel 10 Pro Fold", price: 267500, chip: "Tensor G5", inch: 8.0, fold: true, weight: 258, mah: 5015, mainMP: 48, tele: 5, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "pixel", name: "Pixel 11 Pro Fold", price: 279900, chip: "Tensor G6", inch: 8.0, fold: true, weight: 239, mah: 4806, mainMP: 48, tele: 5, ois: true, ip: "IP68", felica: true, jack: false },

  // ---- Galaxy（Samsung 公式価格・ショーケースのスペック）----
  { maker: "galaxy", name: "Galaxy A57 5G",        price: 79800,  chip: "Exynos 1680",              inch: 6.7, weight: 179, mah: 5000, mainMP: 50,  tele: 0, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "galaxy", name: "Galaxy S26",           price: 155800, chip: "Snapdragon 8 Elite Gen 5", inch: 6.3, weight: 167, mah: 4300, mainMP: 50,  tele: 3, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "galaxy", name: "Galaxy S26+",          price: 183300, chip: "Snapdragon 8 Elite Gen 5", inch: 6.7, weight: 190, mah: 4900, mainMP: 50,  tele: 3, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "galaxy", name: "Galaxy Z Flip8",       price: 192680, chip: "Snapdragon 8 Elite Gen 5", inch: 6.9, fold: true, weight: 180, mah: 4300, charge: 25, mainMP: 50, tele: 0, ois: true, ip: "IP48", felica: true, jack: false },
  { maker: "galaxy", name: "Galaxy S26 Ultra",     price: 239800, chip: "Snapdragon 8 Elite Gen 5", inch: 6.9, weight: 214, mah: 5000, mainMP: 200, tele: 5, ois: true, ip: "IP68", felica: true, jack: false, note: "望遠は光学3倍と5倍の2つ" },
  { maker: "galaxy", name: "Galaxy Z Fold8",       price: 269880, chip: "Snapdragon 8 Elite Gen 5", inch: 7.6, fold: true, weight: 201, mah: 4800, charge: 45, mainMP: 50, tele: 0, ois: true, ip: "IP48", felica: true, jack: false },
  { maker: "galaxy", name: "Galaxy Z Fold8 Ultra", price: 296780, chip: "Snapdragon 8 Elite Gen 5", inch: 8.0, fold: true, weight: 215, mah: 5000, charge: 45, mainMP: 200, tele: 3, ois: true, ip: "IP48", felica: true, jack: false },

  // ---- AQUOS（ショーケースのスペック）----
  { maker: "aquos", name: "AQUOS wish5",   price: 34980,  chip: "Dimensity 6300",      inch: 6.6, weight: 187, mah: 5000, mainMP: 50, tele: 0, ois: false, ip: "IP68", felica: true, jack: true, note: "シャープ公式ストアでは販売終了。価格は発売時の参考価格" },
  { maker: "aquos", name: "AQUOS wish6",   price: 49940,  chip: "Dimensity 6300",      inch: 6.6, weight: 189, mah: 5000, mainMP: 50, tele: 0, ois: false, ip: "IP68", felica: true, jack: true, note: "IPX9にも対応" },
  { maker: "aquos", name: "AQUOS sense9",  price: 58740,  chip: "Snapdragon 7s Gen 2", inch: 6.1, weight: 166, mah: 5000, mainMP: 50, tele: 0, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "aquos", name: "AQUOS sense10", price: 62700,  chip: "Snapdragon 7s Gen 3", inch: 6.1, weight: 166, mah: 5000, mainMP: 50, sensor: "1/1.55", tele: 0, ois: true, ip: "IP68", felica: true, jack: false },
  { maker: "aquos", name: "AQUOS R10",     price: 99770,  chip: "Snapdragon 7+ Gen 3", inch: 6.5, weight: 197, mah: 5000, mainMP: 50, sensor: "1/1.5", tele: 0, ois: true, ip: "IP68", felica: true, jack: false},
  { maker: "aquos", name: "AQUOS R11",     price: 163900, chip: "Snapdragon 8s Gen 4", inch: 6.5, weight: 195, mah: 5100, mainMP: 50, tele: 2.9, ois: true, ip: "IP68", felica: true, jack: false, note: "SIMフリーは512GBのみ" },
  { maker: "aquos", name: "AQUOS R9 pro",  price: 159500, chip: "Snapdragon 8s Gen 3", inch: 6.7, weight: 229, mah: 5000, mainMP: 50, sensor: "1/0.98", tele: 0, ois: true, ip: "IP68", felica: true, jack: false },

  // ---- Xperia（ショーケースのスペック）----
  { maker: "xperia", name: "Xperia 10 VII",  price: 74800,  chip: "Snapdragon 6 Gen 3",       inch: 6.1, weight: 168, mah: 5000, mainMP: 50, tele: 0, ois: true, ip: "IP68", felica: true, jack: true },
  { maker: "xperia", name: "Xperia 10 VIII", price: 99000,  chip: "Snapdragon 6 Gen 3",       inch: 6.1, weight: 168, mah: 5000, mainMP: 50, tele: 0, ois: true, ip: "IP68", felica: true, jack: true },
  { maker: "xperia", name: "Xperia 1 VII",   price: 182000, chip: "Snapdragon 8 Elite",       inch: 6.5, weight: 197, mah: 5000, mainMP: 48, tele: 7, ois: true, ip: "IP68", felica: true, jack: true, note: "ソニーストアでは販売終了。価格は価格.comの最安値。望遠は 85〜170mm の可変式（最大約7倍として計算）" },
  { maker: "xperia", name: "Xperia 1 VIII",  price: 235400, chip: "Snapdragon 8 Elite Gen 5", inch: 6.5, weight: 200, mah: 5000, mainMP: 48, sensor: "1/1.35", tele: 2.9, ois: true, ip: "IP68", felica: true, jack: true, note: "望遠は70mm（光学2.9倍）" },

  // ---- OPPO（OPPO 公式スペックページ）----
  { maker: "oppo", name: "OPPO A5 5G",         price: 36800,  chip: "Dimensity 6300",           inch: 6.7, weight: 194, mah: 6000, charge: 45,  mainMP: 50,  tele: 0,   ois: false, ip: "IP65", felica: true,  jack: true,  note: "価格はAmazon等の参考価格。IP65なので水没はNG", note: "IP65なので水没はNG" },
  { maker: "oppo", name: "OPPO Reno15 A",      price: 64800,  chip: "Snapdragon 6 Gen 1",       inch: 6.6, weight: 198, mah: 7000, charge: 80,  mainMP: 50,  tele: 0,   ois: true,  ip: "IP68", felica: true,  jack: false, note: "IPX9にも対応" },
  { maker: "oppo", name: "OPPO Reno16 5G",     price: 89800,  chip: "Snapdragon 7 Gen 4",       inch: 6.3, weight: 188, mah: 6700, charge: 80,  mainMP: 50,  tele: 3.5, ois: true,  ip: "IP68", felica: false, jack: false, note: "おサイフケータイ非対応。IP69にも対応" },
  { maker: "oppo", name: "OPPO Find X9 Ultra", price: 274800, chip: "Snapdragon 8 Elite Gen 5", inch: 6.8, weight: 235, mah: 7050, charge: 100, mainMP: 200, tele: 10,  ois: true,  ip: "IP68", felica: false, jack: false, note: "おサイフケータイ非対応。IP69にも対応" },
  { maker: "oppo", name: "OPPO Find N6",       price: 318000, chip: "Snapdragon 8 Elite Gen 5", inch: 8.1, fold: true, weight: 225, mah: 6000, charge: 80, mainMP: 200, tele: 3, ois: true, ip: "IP58", felica: false, jack: false, note: "おサイフケータイ非対応。防塵はIP5X" },
  // Find X9 / Find X8 / Reno14 5G は価格を確認できなかったので未登録

  // =================================================================
  //  2026年11月6日に追加：価格.comの仕様表から自動で取り込んだ機種
  //  verified: false = まだ3つの情報源で照合していない（結果画面に注意書きが出る）
  //  価格は価格.comの最安値（キャリアの割引やセール価格が混ざることがある）
  // =================================================================

  // ---- iPhone ----
  { maker: "iphone", name: "iPhone 16e",        price: 129800, chip: "A18",     inch: 6.1, weight: 167, videoHours: 26, mainMP: 48, tele: 0, ois: true, ip: "IP68", felica: true, jack: false, discontinued: true, note: "Apple公式・価格.com・ガルマックスで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },
  { maker: "iphone", name: "iPhone 17 Pro",     price: 184907, chip: "A19 Pro", inch: 6.3, weight: 206, videoHours: 33, mainMP: 48, tele: 4, ois: true, ip: "IP68", felica: true, jack: false, discontinued: true, note: "Apple公式・価格.com・ガルマックスで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },
  { maker: "iphone", name: "iPhone 17 Pro Max", price: 192877, chip: "A19 Pro", inch: 6.9, weight: 233, videoHours: 39, mainMP: 48, tele: 4, ois: true, ip: "IP68", felica: true, jack: false, discontinued: true, note: "Apple公式・価格.com・ガルマックスで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },

  // ---- Pixel ----
  { maker: "pixel", name: "Pixel 9a", price: 58380, chip: "Tensor G4", inch: 6.3, weight: 186, mah: 5100, mainMP: 48, tele: 0, ois: true, ip: "IP68", felica: true, jack: false, discontinued: true, note: "Googleストア・価格.com・ガルマックスで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値（Googleストアの定価は79,900円）" },

  // ---- Galaxy ----
  { maker: "galaxy", name: "Galaxy A25 5G",    price: 31429,  chip: "Dimensity 6100+",    inch: 6.7, weight: 210, mah: 5000, mainMP: 50,  tele: 0, ois: false, ip: "IP68", felica: true, jack: false, discontinued: true, note: "価格.com・ガルマックス・Business Insider・イオシスで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値（発売時29,900円）" },
  { maker: "galaxy", name: "Galaxy A36 5G",    price: 37800,  chip: "Snapdragon 6 Gen 3", inch: 6.7, weight: 195, mah: 5000, mainMP: 50,  tele: 0, ois: true,  ip: "IP68", felica: true, jack: false, discontinued: true, note: "価格.com・ガルマックス・PC Watchで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値（発売時50,490円）" },
  { maker: "galaxy", name: "Galaxy S25",       price: 104980, chip: "Snapdragon 8 Elite", inch: 6.2, weight: 162, mah: 4000, mainMP: 50,  tele: 3, ois: true,  ip: "IP68", felica: true, jack: false, discontinued: true, note: "価格.com・ガルマックス・レンティオで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },
  { maker: "galaxy", name: "Galaxy S25 Ultra", price: 193745, chip: "Snapdragon 8 Elite", inch: 6.9, weight: 218, mah: 5000, mainMP: 200, tele: 5, ois: true,  ip: "IP68", felica: true, jack: false, discontinued: true, note: "価格.com・ガルマックス・Samsung公式で一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },
  { maker: "galaxy", name: "Galaxy Z Flip7",   price: 163012, chip: "Exynos 2500",        inch: 6.9, fold: true, weight: 188, mah: 4300, mainMP: 50,  tele: 0, ois: true, ip: "IP48", felica: true, jack: false, discontinued: true, note: "価格.com・ガルマックス・すまほん系ニュース（helentech）で一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },
  { maker: "galaxy", name: "Galaxy Z Fold7",   price: 238000, chip: "Snapdragon 8 Elite", inch: 8.0, fold: true, weight: 215, mah: 4400, mainMP: 200, tele: 3, ois: true, ip: "IP48", felica: true, jack: false, discontinued: true, note: "価格.com・ガルマックス・GetNaviで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },

  // ---- OPPO ----
  { maker: "oppo", name: "OPPO A5x",       price: 19800,  chip: "Snapdragon 6s 4G Gen 1", inch: 6.7, weight: 193, mah: 6000, mainMP: 32, tele: 0, ois: false, ip: "IP65", felica: false, jack: true, note: "照合済み（公式・価格.com・ガルマックス）" },
  { maker: "oppo", name: "OPPO Find X9",   price: 159800, chip: "Dimensity 9500",         inch: 6.6, weight: 203, mah: 7025, mainMP: 50, tele: 3, ois: true,  ip: "IP68", felica: true,  jack: false, note: "照合済み（公式・価格.com・ガルマックス）。防水はIP68/IP69" },
  { maker: "oppo", name: "OPPO Reno13 A",  price: 48800,  chip: "Snapdragon 6 Gen 1",     inch: 6.7, weight: 192, mah: 5800, mainMP: 50, tele: 0, ois: true,  ip: "IP68", felica: true,  jack: false, note: "照合済み（公式・価格.com・ガルマックス）" },
  { maker: "oppo", name: "OPPO Reno14 5G", price: 79800,  chip: "Dimensity 8350",         inch: 6.6, weight: 187, mah: 6000, mainMP: 50, tele: 3.5, ois: false, ip: "IP68", felica: false, jack: false, note: "照合済み（公式・価格.com・ガルマックス）" },

  // ---- Xiaomi / POCO / REDMI ----
  { maker: "xiaomi", name: "POCO F7 Pro",              price: 69980, chip: "Snapdragon 8 Gen 3",       inch: 6.67, weight: 206, mah: 6000,  mainMP: 50,  tele: 0, ois: true, ip: "IP68", felica: false, jack: false, discontinued: true, note: "Xiaomi公式・価格.com・ガルマックスで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格.comの最安値（120,588円）が上位機より高く不自然なため、発売時の価格" },
  { maker: "xiaomi", name: "POCO F7 Ultra",            price: 90000,  chip: "Snapdragon 8 Elite",       inch: 6.67, weight: 212, mah: 5300,  mainMP: 50,  tele: 2.5, ois: true, ip: "IP68", felica: false, jack: false, discontinued: true, note: "Xiaomi公式・価格.com・ガルマックスで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },
  { maker: "xiaomi", name: "POCO F9 Ultra",            price: 149800, chip: "Snapdragon 8 Elite Gen 5", inch: 6.9,  weight: 235, mah: 8050,  mainMP: 200, tele: 5, ois: true, ip: "IP68", felica: false, jack: false, note: "照合済み（公式・価格.com・ガルマックス）" },
  { maker: "xiaomi", name: "POCO M7 Pro 5G",           price: 29980,  chip: "Dimensity 7025",           inch: 6.67, weight: 190, mah: 5110,  mainMP: 50,  tele: 0, ois: true,  ip: "IP64", felica: false, jack: true,  discontinued: true, note: "Xiaomi公式・価格.com・ガルマックスで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },
  { maker: "xiaomi", name: "POCO M8 5G",               price: 39980,  chip: "Snapdragon 6 Gen 3",       inch: 6.77, weight: 178, mah: 5520,  mainMP: 50,  tele: 0, ois: false, ip: "IP66", felica: false, jack: false, note: "照合済み（公式・価格.com・ガルマックス）" },
  { maker: "xiaomi", name: "POCO X7 Pro",              price: 56880,  chip: "Dimensity 8400",           inch: 6.67, weight: 195, mah: 6000,  mainMP: 50,  tele: 0, ois: true,  ip: "IP68", felica: false, jack: false, discontinued: true, note: "Xiaomi公式・価格.com・ガルマックスで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },
  { maker: "xiaomi", name: "REDMI 15 5G",              price: 36980,  chip: "Snapdragon 6s Gen 3",      inch: 6.9,  weight: 217, mah: 7000,  mainMP: 50,  tele: 0, ois: false, ip: "IP64", felica: true,  jack: false, note: "照合済み（公式・価格.com・ガルマックス）" },
  { maker: "xiaomi", name: "REDMI 17",                 price: 34980,  chip: "Helio G91",                inch: 6.9,  weight: 232, mah: 7500,  mainMP: 50,  tele: 0, ois: false, ip: "IP64", felica: false, jack: true, note: "照合済み（公式・価格.com・ガルマックス）" },
  { maker: "xiaomi", name: "Redmi Note 14 Pro 5G",     price: 36980,  chip: "Dimensity 7300",           inch: 6.67, weight: 190, mah: 5110,  mainMP: 200, tele: 0, ois: true, ip: "IP68", felica: false, jack: false, discontinued: true, note: "Xiaomi公式・価格.com・ガルマックスで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },
  { maker: "xiaomi", name: "REDMI Note 15 5G",         price: 44980,  chip: "Snapdragon 6 Gen 3",       inch: 6.77, weight: 178, mah: 5520,  mainMP: 108, tele: 0, ois: false, ip: "IP66", felica: false, jack: false, note: "照合済み（公式・価格.com・ガルマックス）" },
  { maker: "xiaomi", name: "REDMI Note 15 Pro 5G",     price: 57980,  chip: "Dimensity 7400",           inch: 6.83, weight: 200, mah: 6300,  mainMP: 200, tele: 0, ois: true, ip: "IP68", felica: true,  jack: false, note: "照合済み（公式・価格.com・ガルマックス）" },
  { maker: "xiaomi", name: "REDMI Note 17 Pro Max 5G", price: 79980,  chip: "Snapdragon 6 Gen 5",       inch: 6.83, weight: 230, mah: 10000, mainMP: 50,  tele: 0, ois: true, ip: "IP68", felica: false, jack: false, note: "照合済み（公式・価格.com・ガルマックス）" },
  { maker: "xiaomi", name: "Xiaomi 15",                price: 97000,  chip: "Snapdragon 8 Elite",       inch: 6.36, weight: 191, mah: 5240,  mainMP: 50,  tele: 2.6, ois: true, ip: "IP68", felica: false, jack: false, discontinued: true, note: "Xiaomi公式・価格.com・ガルマックスで一致。望遠は60mm（約2.6倍）。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格は価格.comの最安値" },
  { maker: "xiaomi", name: "Xiaomi 15 Ultra",          price: 179800, chip: "Snapdragon 8 Elite",       inch: 6.73, weight: 226, mah: 5410,  mainMP: 50,  tele: 4.3, ois: true, ip: "IP68", felica: false, jack: false, note: "照合済み（公式・価格.com・ガルマックス）。望遠は100mm相当（約4.3倍）" },
  { maker: "xiaomi", name: "Xiaomi 15T",               price: 64800,  chip: "Dimensity 8400",           inch: 6.83, weight: 194, mah: 5500,  mainMP: 50,  tele: 2, ois: true, ip: "IP68", felica: false, jack: false, discontinued: true, note: "Xiaomi公式・価格.com・ガルマックスで一致。メーカー公式ストアでは販売終了（キャリア・量販店の在庫のみ）。価格.comの最安値（34,780円）が安すぎて不自然なため、発売時の価格" },
  { maker: "xiaomi", name: "Xiaomi 15T Pro",           price: 119800,  chip: "Dimensity 9400+",          inch: 6.83, weight: 210, mah: 5500,  mainMP: 50,  tele: 5, ois: true,  ip: "IP68", felica: true,  jack: false, note: "照合済み（公式・価格.com・ガルマックス）" },
  { maker: "xiaomi", name: "Xiaomi 17 Ultra",          price: 199800, chip: "Snapdragon 8 Elite Gen 5", inch: 6.9,  weight: 218, mah: 6000,  mainMP: 50,  tele: 4.3, ois: true, ip: "IP68", felica: false, jack: false, note: "照合済み（公式・価格.com・ガルマックス）。望遠は100mm相当（約4.3倍）" },
  { maker: "xiaomi", name: "Xiaomi 17T",               price: 89980,  chip: "Dimensity 8500",           inch: 6.59, weight: 200, mah: 6500,  mainMP: 50,  tele: 5, ois: true, ip: "IP68", felica: false, jack: false, note: "照合済み（公式・価格.com・ガルマックス）。望遠は115mm相当（約5倍）" },
  { maker: "xiaomi", name: "Xiaomi 17T Pro",           price: 139800, chip: "Dimensity 9500",           inch: 6.83, weight: 219, mah: 7000,  mainMP: 50,  tele: 5, ois: true, ip: "IP68", felica: true,  jack: false, note: "照合済み（公式・価格.com・ガルマックス）。望遠は115mm相当（約5倍）" },

  // ---- motorola ----
  { maker: "motorola", name: "moto g05",                price: 21776,  chip: "Helio G81",          inch: 6.7,  weight: 189, mah: 5200, mainMP: 50, tele: 0, ois: false, ip: "IP52", felica: false, jack: true, note: "照合済み（motorola公式・価格.com・ガルマックス）。公式ストアがないため価格は価格.comの最安値" },
  { maker: "motorola", name: "moto g06",                price: 16018,  chip: "Helio G81",          inch: 6.9,  weight: 194, mah: 5200, mainMP: 50, tele: 0, ois: false, ip: "IP64", felica: false, jack: true,  note: "motorola公式・価格.com・ガルマックスで一致" },
  { maker: "motorola", name: "moto g37",                price: 26700,  chip: "Dimensity 6300",     inch: 6.7,  weight: 194, mah: 5200, mainMP: 50, tele: 0, ois: false, ip: "IP64", felica: true,  jack: true,  note: "価格.com・ガルマックス・スマートウォッチライフで一致" },
  { maker: "motorola", name: "moto g37j",               price: 30000,  chip: "Dimensity 6300",     inch: 6.72, weight: 194, mah: 5200, mainMP: 50, tele: 0, ois: false, ip: "IP64", felica: true,  jack: true, note: "照合済み（motorola公式・価格.com・ガルマックス）。公式ストアがないため価格は価格.comの最安値" },
  { maker: "motorola", name: "moto g66j 5G",            price: 31800,  chip: "Dimensity 7060",     inch: 6.7,  weight: 200, mah: 5200, mainMP: 50, tele: 0, ois: false, ip: "IP68", felica: true, jack: true, note: "照合済み（motorola公式・価格.com・ガルマックス）。公式ストアがないため価格は価格.comの最安値。おサイフケータイ対応（価格.comの表記は誤り）" },
  { maker: "motorola", name: "moto g66y 5G",            price: 26000,  chip: "Dimensity 7060",     inch: 6.7,  weight: 200, mah: 5200, mainMP: 50, tele: 0, ois: true,  ip: "IP68", felica: true, jack: true,  note: "ワイモバイル・価格.com・ガルマックスで一致（ワイモバイル版の moto g66j 5G）" },
  { maker: "motorola", name: "motorola edge 60",        price: 37800,  chip: "Dimensity 7400",     inch: 6.7,  weight: 179, mah: 5200, mainMP: 50, tele: 3, ois: true, ip: "IP68", felica: true, jack: false, note: "照合済み（motorola公式・価格.com・ガルマックス）。公式ストアがないため価格は価格.comの最安値。おサイフケータイ対応（価格.comの表記は誤り）" },
  { maker: "motorola", name: "motorola edge 60 pro",    price: 54313,  chip: "Dimensity 8350",     inch: 6.7,  weight: 184, mah: 5000, mainMP: 50, tele: 3, ois: false, ip: "IP68", felica: true, jack: false, note: "照合済み（motorola公式・価格.com・ガルマックス）。公式ストアがないため価格は価格.comの最安値。おサイフケータイ対応（価格.comの表記は誤り）" },
  { maker: "motorola", name: "motorola edge 70 fusion", price: 68500,  chip: "Snapdragon 7s Gen 3", inch: 6.78, weight: 193, mah: 7000, mainMP: 50, tele: 0, ois: true,  ip: "IP68", felica: true,  jack: false, note: "照合済み（motorola公式・価格.com・ガルマックス）。公式ストアがないため価格は価格.comの最安値" },
  { maker: "motorola", name: "motorola razr 60",        price: 135801,  chip: "Dimensity 7400",     inch: 6.9,  fold: true, weight: 188, mah: 4500, mainMP: 50, tele: 0, ois: false, ip: "IP48", felica: true, jack: false, note: "照合済み（motorola公式・ITmedia・ケータイ Watch・ガルマックス）。価格はモトローラ公式ストア（512GB）。おサイフケータイ対応" },
  { maker: "motorola", name: "motorola razr 60d",       price: 126060,  chip: "Dimensity 7400",     inch: 6.9,  fold: true, weight: 190, mah: 4500, mainMP: 50, tele: 0, ois: true,  ip: "IP48", felica: true, jack: false, note: "ドコモ版の razr 60。ドコモ公式・価格.com・ガルマックスで一致。価格はドコモ（ケータイ Watch）" },
  { maker: "motorola", name: "motorola razr fold",      price: 235000, chip: "Snapdragon 8 Gen 5", inch: 8.1,  fold: true, weight: 243, mah: 6000, mainMP: 50, tele: 3, ois: false, ip: "IP48", felica: true, jack: false, note: "照合済み（motorola公式・価格.com・ガルマックス）。公式ストアがないため価格は価格.comの最安値。おサイフケータイ対応（価格.comの表記は誤り）。望遠の倍率は未確認（3倍と仮定）" },

  // ---- arrows / らくらくスマートフォン（FCNT）----
  { maker: "arrows", name: "arrows Alpha",                 price: 82198,  chip: "Dimensity 8350",     inch: 6.4, weight: 188, mah: 5000, mainMP: 50, tele: 0, ois: true,  ip: "IP68", felica: true,  jack: false, note: "FCNT公式・価格.com・楽天モバイル・ガルマックスで一致" },
  { maker: "arrows", name: "arrows Alpha2",                price: 84990,  chip: "Dimensity 8350",     inch: 6.4, weight: 187, mah: 5370, mainMP: 50, tele: 0, ois: true,  ip: "IP68", felica: true,  jack: false, note: "照合済み（FCNT公式・価格.com・ガルマックス）。価格は価格.comの最安値" },
  { maker: "arrows", name: "arrows We3",                   price: 39800,  chip: "Dimensity 6300",     inch: 6.1, weight: 189, mah: 5000, mainMP: 50, tele: 0, ois: false, ip: "IP68", felica: true,  jack: true, note: "照合済み（FCNT公式・価格.com・ガルマックス）。価格は価格.comの最安値" },
  { maker: "arrows", name: "らくらくスマートフォン F-53E", price: 51480, chip: "Snapdragon 6 Gen 3", inch: 5.4, weight: 173, mah: 4000, mainMP: 50, tele: 0, ois: true,  ip: "IP68", felica: false, jack: true, note: "照合済み（FCNT公式・ケータイ Watch・価格.com）。価格はドコモの価格（価格.comの181,578円は誤り）。おサイフケータイは未確認" },
  { maker: "arrows", name: "らくらくスマートフォン Lite",  price: 50000,  chip: "Dimensity 7025",     inch: 6.1, weight: 185, mah: 4500, mainMP: 50, tele: 0, ois: false, ip: "IP68", felica: true,  jack: true, note: "照合済み（FCNT公式・マイナビニュース・価格.com）。価格は発売時の店頭予想価格" },

  // ---- Nothing ----
  { maker: "nothing", name: "Nothing Phone (3a) Lite", price: 42800,  chip: "Dimensity 7300",      inch: 6.77, weight: 199, mah: 5000, mainMP: 50, tele: 0, ois: false, ip: "IP54", felica: true, jack: false, note: "照合済み（Nothing公式・価格.com・ガルマックス）。価格.comの79,000円は誤り" },
  { maker: "nothing", name: "Nothing Phone (4a)",      price: 58800,  chip: "Snapdragon 7s Gen 4", inch: 6.78, weight: 205, mah: 5080, mainMP: 50, tele: 3.5, ois: true, ip: "IP64", felica: true, jack: false, note: "Nothing公式・価格.com・ガルマックス・jetstreamで一致" },
  { maker: "nothing", name: "Nothing Phone (4a) Pro",  price: 79800, chip: "Snapdragon 7 Gen 4",  inch: 6.83, weight: 210, mah: 5080, mainMP: 50, tele: 3.5, ois: true,  ip: "IP65", felica: true, jack: false, note: "照合済み（Nothing公式・価格.com・ガルマックス）。価格.comの129,800円は誤り" },
  { maker: "nothing", name: "Nothing Phone (4b)",      price: 59800,  chip: "Snapdragon 6 Gen 4",  inch: 6.77, weight: 210, mah: 5200, mainMP: 50, tele: 0, ois: true,  ip: "IP64", felica: true,  jack: false, note: "照合済み（Nothing公式・価格.com・ガルマックス）" },

  // ---- nubia ----
  { maker: "nubia", name: "nubia Flip 2",   price: 32922, chip: "Dimensity 7300", inch: 6.9, fold: true, weight: 191, mah: 4300, mainMP: 50, tele: 0, ois: true, ip: "IP42", felica: true, jack: false, note: "価格.com・TikGadget・ガルマックスで一致（ワイモバイルで販売）" },
  { maker: "nubia", name: "nubia Neo 5 GT", price: 49829, chip: "Dimensity 7400", inch: 6.8, weight: 200, mah: 6210, mainMP: 50, tele: 0, ois: false, ip: "IP64", felica: false, jack: false, note: "価格.com・ガルマックス・すまほん!!で一致" },
  { maker: "nubia", name: "nubia S2",       price: 21888, chip: "Unisoc T8100",   inch: 6.7, weight: 189, mah: 5100, mainMP: 50, tele: 0, ois: false,  ip: "IP68", felica: true, jack: true, note: "ケータイ Watch・ガルマックス・価格.comで一致（ワイモバイルで販売）。価格はワイモバイルの発売時価格" },

  // ---- P-UP ----
  { maker: "pup", name: "P-UP World Mode1 Pocket", price: 32680, chip: "Helio G99", inch: 5.3, weight: 152, mah: 2900, mainMP: 64, tele: 0, ois: false, ip: "IP65", felica: false, jack: true, note: "価格.com・ガルマックス・すまほん!!で一致" },

  // ---- 2026年11月6日：Xiaomi公式ストアで販売中のため追加 ----
  { maker: "xiaomi", name: "POCO X8 Pro",     price: 79980, chip: "Dimensity 8500",  inch: 6.59, weight: 201, mah: 6500, mainMP: 50, tele: 0, ois: true, ip: "IP68", felica: false, jack: false, note: "Xiaomi公式・ガルマックス・ITmediaで一致（価格.comは未掲載）" },
  { maker: "xiaomi", name: "POCO X8 Pro Max", price: 99980, chip: "Dimensity 9500s", inch: 6.83, weight: 218, mah: 8500, mainMP: 50, tele: 0, ois: true, ip: "IP68", felica: false, jack: false, note: "Xiaomi公式・ガルマックス・ITmediaで一致（価格.comは未掲載）" },

  // ---- 2026年11月6日：メーカー公式で販売中のため追加（3つ以上の情報源で照合済み）----
  { maker: "nothing",  name: "Nothing Phone (3)",     price: 124800, chip: "Snapdragon 8s Gen 4",  inch: 6.77, weight: 218, mah: 5150, mainMP: 50,  tele: 3, ois: true, ip: "IP68", felica: true, jack: false, note: "照合済み（Nothing公式・ガルマックス・jetstream・価格.com）。価格.comの6.67インチは誤りで6.77インチ" },
  { maker: "nothing",  name: "Nothing Phone (3a)",    price: 47800,  chip: "Snapdragon 7s Gen 3",  inch: 6.77, weight: 201, mah: 5000, mainMP: 50,  tele: 2, ois: true, ip: "IP64", felica: true, jack: false, note: "照合済み（Nothing公式・ガルマックス・価格.com）" },
  { maker: "nothing",  name: "Nothing Phone (2a)",    price: 55800,  chip: "Dimensity 7200",       inch: 6.7,  weight: 190, mah: 5000, mainMP: 50,  tele: 0, ois: true, ip: "IP54", felica: true, jack: false, note: "照合済み（Nothing公式・jetstream・価格.com）。2024年4月発売の少し前の機種" },
  { maker: "xiaomi",   name: "Redmi Note 13 Pro+ 5G", price: 54980,  chip: "Dimensity 7200",       inch: 6.67, weight: 204.5, mah: 5000, mainMP: 200, tele: 0, ois: true, ip: "IP68", felica: true, jack: false, note: "照合済み（Xiaomi公式・価格.com・ガルマックス）。2024年5月発売の少し前の機種" },
  { maker: "motorola", name: "motorola razr 60 ultra", price: 199800, chip: "Snapdragon 8 Elite",  inch: 7.0,  fold: true, weight: 199, mah: 4700, mainMP: 50, tele: 0, ois: true, ip: "IP48", felica: true, jack: false, note: "照合済み（motorola公式・ITmedia・Business Insider・ガルマックス）。価格はモトローラ公式（au は189,800円）" },
];
