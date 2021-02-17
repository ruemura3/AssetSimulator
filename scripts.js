document.getElementById("final-wrap-chart").style.display = "none";
document.getElementById("final-desc").style.display = "none";
document.getElementById("howmuch-wrap-chart").style.display = "none";
document.getElementById("howmuch-desc").style.display = "none";

// グラフライブラリ読み込み
const script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js";
const head = document.getElementsByTagName("head");
head[0].appendChild(script);

// 将来の金額を表示する
function final(){
    // 要素を取得
    var reserve = document.getElementById("final-reserve");
    var yield = document.getElementById("final-yield");
    var period = document.getElementById("final-period");
    
    // 空白チェック
    if (reserve.value == "" || yield.value == "") {
        alert("値を入力してください。");
    };
    
    // 数値に変換
    reserve = Number(reserve.value);
    yield = Number(yield.value / 100);
    period = Number(period.value);

    // 将来の金額の計算
    const ansFinal = calculateFinal(reserve, yield, period);

    // 答え表示
    document.getElementById("final-desc").style.display = "block";
    document.getElementById("final-ans").innerHTML = ansFinal.ans.toLocaleString();

    // グラフ表示
    document.getElementById("final-wrap-chart").style.display = "block";
    createGraph("final", ansFinal.year, ansFinal.reserveAmount, ansFinal.totalAsset);
};

// 将来の金額の計算
function calculateFinal(reserve, yield, period) {
    // 変数宣言
    const monthYield = yield / 12;
    const tmpYear = [0];
    const tmpReserveAmount = [0];
    const tmpTotalAsset = [0];
    const year = [0]; // 経過年
    const reserveAmount = [0]; // 積立元本
    const totalAsset = [0]; // 総資産
    // 計算
    for (var i = 1; i <= period*12; i++) {
        tmpYear.push(i);
        const ra = tmpReserveAmount[i - 1] + reserve;
        tmpReserveAmount.push(ra);
        const ta = tmpTotalAsset[i - 1] * (1 + monthYield) + reserve;
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

// 必要な積立金額を表示する
function howMuch() {
    // 要素を取得
    var goal = document.getElementById("howmuch-goal");
    var yield = document.getElementById("howmuch-yield");
    var period = document.getElementById("howmuch-period");

    // 空白チェック
    if (goal.value == "" || yield.value == "") {
        alert("値を入力してください。");
    };

    // 値を取得
    goal = Number(goal.value * 10000);
    yield = Number(yield.value / 100);
    period = Number(period.value);

    // 必要な積立金額の計算
    const reserve = calculateHowmuch(goal, yield, period);
    const ansFinal = calculateFinal(reserve/10000, yield, period);

    // 答え表示
    document.getElementById("howmuch-desc").style.display = "block";
    document.getElementById("howmuch-ans").innerHTML = reserve.toLocaleString();

    // グラフ表示
    document.getElementById("howmuch-wrap-chart").style.display = "block";
    createGraph("howmuch", ansFinal.year, ansFinal.reserveAmount, ansFinal.totalAsset);
}

// 必要な積立金額の計算
function calculateHowmuch(goal, yield, period) {
    // 変数宣言
    const monthYield = yield / 12;
    const month = period * 12;
    // 計算
    var reserve = Math.ceil(goal * ((1 - (1 + monthYield)) / (1 - (1 + monthYield) ** month)));
    // 返り値の用意
    return reserve;
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
    };
};