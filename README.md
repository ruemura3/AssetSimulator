# かんたん資産運用シミュレーター

自分のブログ専用に作った資産運用シミュレーターです。
* ブログ→<https://ruemura3.com/catmoney>
* シミュレーター→<https://ruemura3.com/catmoney/asset-simulator>

このソースコードは最低限の機能のみを搭載しており、CSSなどのデザインはありません。
（レスポンシブ対応のみしています。）
もし必要な人がいれば自分の好きなように改造して自由に使ってください。


## 機能

以下の機能を持っています。
* 「毎月の積立金額」「想定利回り」「運用期間」から「将来の資産額」を計算
* 「目標金額」「想定利回り」「運用期間」から「必要な毎月の積立金額」を計算

以下の機能に対応「予定」です。
* 「目標金額」「毎月の積立金額」「想定利回り」から「必要な運用期間」を計算
* 「目標金額」「毎月の積立金額」「運用期間」から「必要な運用利回り」を計算


## 実装

Chart.jsを利用してグラフ描画をしています。
* Chart.js→<https://www.chartjs.org/>
* Chart.js日本語ドキュメント→<https://misc.0o0o.org/chartjs-doc-ja/>

年利を月利に変換して月利計算をしています。


## 動作確認環境

* Chrome 87.0.4280