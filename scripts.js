// グラフライブラリ読み込み
var script = document.createElement("script");
script.src = "https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.4/Chart.min.js";
var head = document.getElementsByTagName("head");
head[0].appendChild(script);
var chart;

// 将来の金額の計算
function howMuch(){
    // 値を取得
    var principle = Number(document.getElementById("principle").value);
    var reserve = Number(document.getElementById("reserve").value);
    var yield = Number(document.getElementById("yield").value);
    var period = Number(document.getElementById("period").value);
    
    // 空白チェック
    if (principle == "") {
        principle = 0;
        document.getElementById("principle").value = 0;
    };
    if (reserve == "") {
        reserve = 0;
        document.getElementById("reserve").value = 0;
    };
    if (yield == "") {
        yield = 0;
        document.getElementById("yield").value = 0;
    };

    var year = [0]; // 経過年
    var reserveAmount = [principle]; // 積立金額
    var totalAsset = [principle]; // 総資産
    for (var i = 1; i <= period; i++) {
        year.push(i);
        // 積立元本
        var tmpReserveAmount = reserveAmount[i - 1] + reserve;
        tmpReserveAmount = Math.floor(tmpReserveAmount * Math.pow(10, 4)) / Math.pow(10, 4);
        reserveAmount.push(tmpReserveAmount);
        // 総資産
        var tmpTotalAsset = totalAsset[i - 1] * (1 + (yield / 100)) + reserve;
        tmpTotalAsset = Math.floor(tmpTotalAsset * Math.pow(10, 4)) / Math.pow(10, 4);
        totalAsset.push(tmpTotalAsset);
    };

    // 答え表示
    var answer = document.getElementById('howMuch');
    answer.innerHTML = year[year.length - 1]
        + "年後の総資産："
        + (Math.floor(totalAsset[totalAsset.length - 1] * 10000)).toLocaleString()
        + "円";

    // グラフオプション
    var options = {
        title: {display: true, text: '将来いくらになる？'},
        scales: {
            xAxes: [
                {ticks: {
                    suggestedMin: 0,
                    callback: function(value, index, values){
                        return  value +  '年'
                    }
                }}
            ],
            yAxes: [
                {ticks: {
                    suggestedMin: 0,
                    callback: function(value, index, values){
                        return  value +  '万円'
                    }
                }}
            ]
        },
        maintainAspectRatio: false
    };
    // グラフデータ
    var graphdata = {
        labels: year,
        datasets: [
            {
                label: '積立元本',
                data: reserveAmount,
                borderColor: "rgba(0,0,255,0.8)",
                backgroundColor: "rgba(0,0,255,0.6)",
                pointHoverBackgroundColor: "rgba(0,0,255,1)",
            },
            {
                label: '総資産',
                data: totalAsset,
                borderColor: "rgba(255,0,0,0.8)",
                backgroundColor: "rgba(255,0,0,0.6)",
                pointHoverBackgroundColor: "rgba(255,0,0,1)",
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
        data: graphdata,
        options: options 
    });
};