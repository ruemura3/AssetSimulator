document.getElementById("wrap-chart").style.display = "none"
document.getElementById("howMuch").style.display = "none"

// グラフライブラリ読み込み
var script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js";
var head = document.getElementsByTagName("head");
head[0].appendChild(script);
var chart;

// 将来の金額の計算
function howMuch(){
    // 要素を取得
    var principle = document.getElementById("principle");
    var reserve = document.getElementById("reserve");
    var yield = document.getElementById("yield");
    var period = document.getElementById("period");
    
    // 空白チェック
    if (principle.value == "" || reserve.value == "" || yield.value == "" || period.value == "") {
        alert("値を入力してください。")
    };
    
    // 値を取得
    principle = Number(principle.value);
    reserve = Number(reserve.value);
    yield = Number(yield.value / 100);
    period = Number(period.value);
    var monthYield = yield / 12

    var tmpYear = [0];
    var tmpReserveAmount = [principle];
    var tmpTotalAsset = [principle];
    var year = [0]; // 経過年
    var reserveAmount = [principle]; // 積立元本
    var totalAsset = [principle]; // 総資産
    for (var i = 1; i <= period*12; i++) {
        tmpYear.push(i)
        // 積立元本
        var ra = tmpReserveAmount[i - 1] + reserve;
        tmpReserveAmount.push(ra);
        // 総資産
        var ta = tmpTotalAsset[i - 1] * (1 + monthYield) + reserve;
        tmpTotalAsset.push(ta);

        if (i % 12 == 0) {
            year.push(i / 12);
            reserveAmount.push(ra);
            totalAsset.push(ta);
        };
    };

    // 答え表示
    document.getElementById("howMuch").style.display = "block"
    document.getElementById("year-ans").innerHTML = year[year.length - 1];
    document.getElementById("howMuch-ans").innerHTML = (Math.ceil(totalAsset[totalAsset.length - 1] * 10000)).toLocaleString();

    document.getElementById("wrap-chart").style.display = "block"
    createGraph(year, reserveAmount, totalAsset);
};

// 与えられた条件でグラフを描く
function createGraph(year, reserveAmount, totalAsset) {
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
    // グラフ描画
    var canvas = document.getElementById('howMuchGraph');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(canvas, {
        type: 'line', 
        data: data,
        options: options 
    });
};