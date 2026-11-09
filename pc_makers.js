// =====================================================================
//  PCのメーカーの辞書
//  country : 日本のメーカーは "JP"（「日本のメーカーだと安心」で加点するときに使う）
//  bto     : true なら、メーカー直販で構成（メモリ・SSD など）を選べる
// =====================================================================

const PC_MAKERS = {
  apple:     { name: "Apple",     country: "US", bto: true },
  microsoft: { name: "Microsoft", country: "US" },
  nec:       { name: "NEC",       country: "JP" },
  fujitsu:   { name: "富士通",    country: "JP" },
  dynabook:  { name: "Dynabook",  country: "JP" },
  lenovo:    { name: "Lenovo",    country: "CN", bto: true },
  hp:        { name: "HP",        country: "US", bto: true },
  asus:      { name: "ASUS",      country: "TW" },
  dell:      { name: "Dell",      country: "US", bto: true },
  alienware: { name: "Alienware（Dell）", country: "US", bto: true },
};
