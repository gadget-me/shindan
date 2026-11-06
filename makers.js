// =====================================================================
//  メーカーの情報
//  ★ 新しいメーカーの機種を models.js に足すときは、先にここに1行足す
// =====================================================================
//
//  name        : 画面に出すメーカー名
//  country     : メーカーの国（"JP" 日本 / "CN" 中国 / "US" アメリカ / "KR" 韓国 / "UK" イギリス）
//                「日本のメーカーだと安心」「中国メーカーは避けたい」の判定に使う
//  ai          : AI機能の基本点（0〜10）。scoring.js がチップの強さを足す
//  description : 結果画面に出る一言。※ 仮の文。売り場の言葉に書き換えよう！
//
//  ※ motorola はアメリカ生まれのブランドだが、今は中国のレノボの会社なので "CN" にしている。
//    arrows（FCNT）もレノボの傘下だが、日本の会社なので "JP" にしている。売り場の感覚で変えてOK

const MAKERS = {
  iphone:   { name: "iPhone",   country: "US", ai: 6, description: "Apple製品と組み合わせると、写真の共有やデータの引き継ぎがとてもスムーズ。動画もきれいに撮れます。" },
  pixel:    { name: "Pixel",    country: "US", ai: 8, description: "Googleが自分で作っているAndroid。新しいAI機能をいち早く使えて、写真がきれい。iPhoneより安く感じるコスパの良さも魅力です。" },
  galaxy:   { name: "Galaxy",   country: "KR", ai: 6, description: "高性能な上位モデルから手ごろなモデル、折りたたみまでそろう豊富なラインナップ。大画面や性能を重視する人に。" },
  aquos:    { name: "AQUOS",    country: "JP", ai: 3, description: "日本のメーカーならではの使いやすさ。手ごろな価格帯のモデルも多く、電池持ちを重視する人にも向いています。" },
  xperia:   { name: "Xperia",   country: "JP", ai: 3, description: "イヤホンジャックを残しているのが大きな特徴。音楽や写真にこだわりたい人に。" },
  arrows:   { name: "arrows / らくらくスマートフォン", country: "JP", ai: 3, description: "日本向けに作られた、丈夫で洗えるスマホ。はじめてのスマホや、シニアの方にも安心です。" },
  pup:      { name: "P-UP",     country: "JP", ai: 2, description: "小さくて軽い、個性派のコンパクトスマホ。サブ機や、とにかく小さいスマホがほしい人に。" },
  oppo:     { name: "OPPO",     country: "CN", ai: 4, description: "とにかくコスパ重視の人に。手ごろな価格で、必要な機能がひととおりそろっています。" },
  xiaomi:   { name: "Xiaomi / POCO / REDMI", country: "CN", ai: 5, description: "スペックの高さに対して価格が安い、コスパの強いメーカー。性能やカメラを安く手に入れたい人に。" },
  motorola: { name: "motorola", country: "CN", ai: 4, description: "シンプルで使いやすいAndroid。安いモデルが多く、折りたたみの razr シリーズも人気です。" },
  nubia:    { name: "nubia",    country: "CN", ai: 3, description: "価格の安さが魅力。とにかく安く、そこそこ使えるスマホがほしい人に。" },
  nothing:  { name: "Nothing",  country: "UK", ai: 4, description: "背面が光る、ほかにないデザインが特徴。見た目にこだわりたい人に。" },
};
