document.getElementById("final-wrap-chart").style.display = "none";
document.getElementById("final-desc").style.display = "none";
document.getElementById("howmuch-wrap-chart").style.display = "none";
document.getElementById("howmuch-desc").style.display = "none";
document.getElementById("howlong-wrap-chart").style.display = "none";
document.getElementById("howlong-desc").style.display = "none";
document.getElementById("percent-wrap-chart").style.display = "none";
document.getElementById("percent-desc").style.display = "none";

// グラフライブラリ読み込み
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js";
const head = document.getElementsByTagName("head");
head[0].appendChild(script);

// 将来の金額を表示する
function final() {
    // 要素を取得
    var principal = document.getElementById("final-principal");
    var reserve = document.getElementById("final-reserve");
    var yield = document.getElementById("final-yield");
    var period = document.getElementById("final-period");
    
    // 空白チェック
    if (principal.value == "" || reserve.value == "" || yield.value == "") {
        alert("値を入力してください。");
        return;
    };
    
    // 数値に変換
    principal = Number(principal.value * 10000);
    reserve = Number(reserve.value * 10000);
    yield = Number(yield.value / 100);
    period = Number(period.value);

    // 将来の金額の計算
    const ansFinal = calculateFinal(principal, reserve, yield, period);

    // 答え表示
    document.getElementById("final-desc").style.display = "block";
    document.getElementById("final-ans").innerHTML = ansFinal.ans.toLocaleString() + "円";

    // グラフ表示
    document.getElementById("final-wrap-chart").style.display = "block";
    createGraph("final", ansFinal.year, ansFinal.reserveAmount, ansFinal.totalAsset);
};

// 必要な積立金額を表示する
function howMuch() {
    // 要素を取得
    var goal = document.getElementById("howmuch-goal");
    var principal = document.getElementById("howmuch-principal");
    var yield = document.getElementById("howmuch-yield");
    var period = document.getElementById("howmuch-period");

    // 空白チェック
    if (goal.value == "" || principal.value == "" || yield.value == "") {
        alert("値を入力してください。");
        return;
    };

    // 値を取得
    goal = Number(goal.value * 10000);
    principal = Number(principal.value * 10000);
    yield = Number(yield.value / 100);
    period = Number(period.value);

    // 異常値チェック
    if (principal < 0) {
        alert("初期元本は0円以上にしてください。");
        return;
    };
    if (principal >= goal) {
        alert("目標金額は初期元本より大きく設定してください。");
        return;
    };
    if (yield <= 0) {
        alert("想定利回りは0％より大きい値にしてください。");
        return;
    };

    // 必要な積立金額の計算
    const reserve = calculateHowmuch(goal, principal, yield, period);
    const ansFinal = calculateFinal(principal, reserve, yield, period);

    // 答え表示
    document.getElementById("howmuch-desc").style.display = "block";
    document.getElementById("howmuch-ans").innerHTML = reserve.toLocaleString() + "円";

    // グラフ表示
    document.getElementById("howmuch-wrap-chart").style.display = "block";
    createGraph("howmuch", ansFinal.year, ansFinal.reserveAmount, ansFinal.totalAsset);
};

// 必要な運用期間を表示する
function howLong() {
    // 要素を取得
    var goal = document.getElementById("howlong-goal");
    var principal = document.getElementById("howlong-principal");
    var reserve = document.getElementById("howlong-reserve");
    var yield = document.getElementById("howlong-yield");

    // 空白チェック
    if (goal.value == "" || principal.value == "" || reserve == "" || yield.value == "") {
        alert("値を入力してください。");
        return;
    };
    
    // 値を取得
    goal = Number(goal.value * 10000);
    principal = Number(principal.value * 10000);
    reserve = Number(reserve.value * 10000);
    yield = Number(yield.value / 100);

    // 異常値チェック
    if (principal < 0) {
        alert("初期元本は0円以上にしてください。");
        return;
    };
    if (principal >= goal) {
        alert("目標金額は初期元本より大きく設定してください。");
        return;
    };
    if (reserve <= 0) {
        alert("毎月の積立資金は0％より大きい値にしてください。");
        return;
    };

    // 必要な積立金額の計算
    const monthPeriod = calculateHowlong(goal, principal, reserve, yield);
    const period = Math.ceil(monthPeriod / 12);
    const ansFinal = calculateFinal(principal, reserve, yield, period);

    // 答え表示
    document.getElementById("howlong-desc").style.display = "block";
    document.getElementById("howlong-ans").innerHTML = (Math.floor(monthPeriod / 12)).toLocaleString() + "年" + monthPeriod % 12 + "ヶ月";

    // グラフ表示
    document.getElementById("howlong-wrap-chart").style.display = "block";
    createGraph("howlong", ansFinal.year, ansFinal.reserveAmount, ansFinal.totalAsset);
};

// 必要な運用利回りを表示する
function percent() {
    // 要素を取得
    var goal = document.getElementById("percent-goal");
    var principal = document.getElementById("percent-principal");
    var reserve = document.getElementById("percent-reserve");
    var period = document.getElementById("percent-period");

    // 空白チェック
    if (goal.value == "" || principal.value == "" || reserve == "" || period.value == "") {
        alert("値を入力してください。");
        return;
    };
    
    // 値を取得
    goal = Number(goal.value * 10000);
    principal = Number(principal.value * 10000);
    reserve = Number(reserve.value * 10000);
    period = Number(period.value);

    // 異常値チェック
    if (principal < 0) {
        alert("初期元本は0円以上にしてください。");
        return;
    };
    if (principal >= goal) {
        alert("目標金額は初期元本より大きく設定してください。");
        return;
    };
    if (reserve <= 0) {
        alert("毎月の積立資金は0％より大きい値にしてください。");
        return;
    };
    // 必要な積立金額の計算
    const yield = calculatePercent(goal, principal, reserve, period);
    const ansFinal = calculateFinal(principal, reserve, yield, period);

    // 答え表示
    document.getElementById("percent-desc").style.display = "block";
    document.getElementById("percent-ans").innerHTML = yield * 100 + "％";

    // グラフ表示
    document.getElementById("percent-wrap-chart").style.display = "block";
    createGraph("percent", ansFinal.year, ansFinal.reserveAmount, ansFinal.totalAsset);
};

// 将来の金額の計算
function calculateFinal(principal, reserve, yield, period) {
    // 変数宣言
    const tmpPrincipal = principal / 10000
    const tmpReserve = reserve / 10000
    const monthYield = yield / 12;
    const tmpYear = [0];
    const tmpReserveAmount = [tmpPrincipal];
    const tmpTotalAsset = [tmpPrincipal];
    const year = [0]; // 経過年
    const reserveAmount = [tmpPrincipal]; // 積立元本
    const totalAsset = [tmpPrincipal]; // 総資産
    // 計算
    for (var i = 1; i <= period * 12; i++) {
        tmpYear.push(i);
        const ra = tmpReserveAmount[i - 1] + tmpReserve;
        tmpReserveAmount.push(ra);
        const ta = tmpTotalAsset[i - 1] * (1 + monthYield) + tmpReserve;
        tmpTotalAsset.push(ta);
        if (i % 12 == 0) {
            year.push(i / 12);
            reserveAmount.push(ra);
            totalAsset.push(ta);
        };
    };
    // 返り値の用意
    const rtn = [];
    rtn.year = year;
    rtn.reserveAmount = reserveAmount;
    rtn.totalAsset = totalAsset;
    rtn.ans = Math.ceil(totalAsset[totalAsset.length - 1] * 10000);
    return rtn;
};

// 必要な積立金額の計算
function calculateHowmuch(goal, principal, yield, period) {
    // 変数宣言
    const monthYield = yield / 12;
    const tmpPeriod = period * 12;
    // 計算
    var reserve = (goal - principal * (1 + monthYield) ** (tmpPeriod - 1)) * ((1 - (1 + monthYield)) / (1 - (1 + monthYield) ** tmpPeriod));
    reserve = Math.ceil(reserve);
    // 返り値の用意
    return reserve;
};

// 必要な運用期間の計算
function calculateHowlong(goal, principal, reserve, yield) {
    // 変数宣言
    const monthYield = yield / 12;
    const a = 1 + monthYield;
    const an = goal;
    const b = reserve;
    const c = principal;
    // 計算
    var monthPeriod = 0;
    const line = a * ((an * (1 - a) -b) / (c - c * a - b * a));
    while (line > a ** monthPeriod) {
        monthPeriod += 1;
    };
    // 返り値の用意
    return monthPeriod;
};

// 必要な運用利回りの計算
function calculatePercent(goal, principal, reserve, period) {
    // 変数宣言
    var a = 1.001;
    console.log(a);
    const an = goal;
    const b = reserve;
    const c = principal;
    const n = period * 12;
    const line = b - an;
    if (line <= (b + c) * a ** n - c * a ** (n-1) - a * an) {
        a = 1;
    } else {
        while (line > (b + c) * a ** n - c * a ** (n-1) - a * an) {
            a = a + 0.001;
            console.log(a);
        };
    };
    // 返り値の用意
    return Math.round(((a - 1) * 12) * Math.pow(10, 3)) / Math.pow(10, 3);
};

// 与えられた条件でグラフを描く
function createGraph(mode, year, reserveAmount, totalAsset) {
    // グラフオプション
    var options = {
        title: {display: true, text: '将来いくらになる？'},
        scales: {
            xAxes: [
                {
                    ticks: {
                        suggestedMin: 0,
                        callback: function(value){
                            return  value +  '年'
                        }
                    }
                }
            ],
            yAxes: [
                {
                    ticks: {
                        suggestedMin: 0,
                        callback: function(value){
                            return  value +  '万円'
                        }
                    }
                }
            ]
        },
        tooltips: {
            mode: "label",
            yPadding: 20,
            titleFontSize: 16,
            bodyFontSize: 16,
            callbacks: {
                title: function(tooltipItem, data) {
                    return tooltipItem[0].xLabel + "目"
                },
                label: function(tooltipItem, data) {
                    var label = data.datasets[tooltipItem.datasetIndex].label;
                    label += Math.round(tooltipItem.yLabel * 10) / 10;
                    label += "万円";
                    return label;
                }
            },
        },
        maintainAspectRatio: false
    };
    // グラフデータ
    var data = {
        labels: year,
        datasets: [
            {
                label: '積立元本',
                data: reserveAmount,
                borderColor: "rgba(181,255,244,0.8)",
                backgroundColor: "rgba(181,255,244,0.6)",
                pointHoverBackgroundColor: "rgba(181,255,244,1)",
            },
            {
                label: '総資産',
                data: totalAsset,
                borderColor: "rgba(255,182,193,0.8)",
                backgroundColor: "rgba(255,182,193,0.6)",
                pointHoverBackgroundColor: "rgba(255,182,193,1)",
            }
        ]
    };
    // グラフを描画する
    createChart(mode, data, options)
};

// グラフをグローバルで宣言しておく
var finalChart;
var howmuchChart;
var howlongChart;
var percentChart

// グラフを描画する
function createChart(mode, data, options) {
    if (mode == "final") {
        // グラフ描画
        if (finalChart) {
            finalChart.destroy();
        }
        var finalCanvas = document.getElementById('final-graph');
        finalChart = new Chart(finalCanvas, {
            type: 'line', 
            data: data,
            options: options 
        });
    } else if (mode == "howmuch") {
        // グラフ描画
        if (howmuchChart) {
            howmuchChart.destroy();
        }
        var howmuchCanvas = document.getElementById('howmuch-graph');
        howmuchChart = new Chart(howmuchCanvas, {
            type: 'line', 
            data: data,
            options: options 
        });
    } else if (mode == "howlong") {
        // グラフ描画
        if (howlongChart) {
            howlongChart.destroy();
        }
        var howlongCanvas = document.getElementById('howlong-graph');
        howlongChart = new Chart(howlongCanvas, {
            type: 'line', 
            data: data,
            options: options 
        });
    } else if (mode == "percent") {
        // グラフ描画
        if (percentChart) {
            percentChart.destroy();
        }
        var percentCanvas = document.getElementById('percent-graph');
        percentChart = new Chart(percentCanvas, {
            type: 'line', 
            data: data,
            options: options 
        });
    };
};