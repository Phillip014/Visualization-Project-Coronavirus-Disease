
var globaldeaths = [];
var globalrecovered = [];
var globalconfirmed = [];

var globaldeathsTotal = 0;
var globalrecoveredTotal = 0;
var globalconfirmedTotal = 0;

var bardeathsObj = {};
var barconfirmedObj = {};
var barrecoveredObj = {};
var bardeaths = [];
var barconfirmed = [];
var barrecovered = [];

var myChart = null, lineChart = null,barChart = null;
var globalconfirmedObj = {};

var currdata = "";
var dataset = {};
var isinit = true;
var populationObj = {};
var CountryConfirmedObj = {};
var mappot = 1;

var chianObj = {};

// 根据日期提取数据并绘制可视化图表
function UpdateChartByTime(itme) {   
    currdata = itme;   
    let index = dataset.redata.columns.findIndex(e => e === itme);
    if (index < 0) {
        alert(itme + "not found data!");
        return;
    }
    let redata = dataset.redata;
    let redata1 = dataset.redata1;
    let redata2 = dataset.redata2;
    let redata3 = dataset.redata3;
    let redata4 = dataset.redata4;
    let redata5 = dataset.redata5;
    let len = redata.columns.length;

    //---------------------------------------------------
    // 提取全球确诊数据
    globalconfirmed = [];
    globalconfirmedTotal = 0;
    barconfirmedObj = {};
    globalconfirmedObj = {};

    redata3.forEach(function (d) {
        var item = {};
        item[redata3.columns[0]] = d[redata3.columns[0]];
        item[redata3.columns[1]] = d[redata3.columns[1]];
        item[redata3.columns[2]] = d[redata3.columns[2]] * 1;
        item[redata3.columns[3]] = d[redata3.columns[3]] * 1;
        item["date"] = currdata;
        item["value"] = d[currdata] * 1;
        globalconfirmedTotal += item["value"];
        let State = item["Province/State"];
        if (CountryConfirmedObj[State] === undefined) {
            CountryConfirmedObj[State] = item["value"];
        }
        else {
            CountryConfirmedObj[State] += item["value"];
        }    
        globalconfirmed.push(item);

        if (d[redata.columns[1]] === "China") {
            if (barconfirmedObj[d[redata3.columns[0]]] === undefined) {
                barconfirmedObj[d[redata3.columns[0]]] = {
                    name: d[redata.columns[0]], value: item["value"]
                };
            }
            else {
                barconfirmedObj[d[redata3.columns[0]]].value += item["value"];
            }
        }

        for (var k = 4; k < len; k++) {
            var itme = redata3.columns[k];
            if (globalconfirmedObj[itme] === undefined) {
                globalconfirmedObj[itme] = {
                    name: itme,
                    value: d[itme] * 1
                };
            }
            else {
                globalconfirmedObj[itme].value += d[itme] * 1;
            }
        }
    });
    globalconfirmed.sort(function (a, b) {
        return b.value - a.value;
    });

    //---------------------------------------------------
    // 提取全球死亡数据
    globaldeaths = [];
    globaldeathsTotal = 0;
    bardeathsObj = {};
    redata.forEach(function (d) {
        var item = {};
        item[redata.columns[0]] = d[redata.columns[0]];
        item[redata.columns[1]] = d[redata.columns[1]];
        item[redata.columns[2]] = d[redata.columns[2]] * 1;
        item[redata.columns[3]] = d[redata.columns[3]] * 1;
        item["date"] = currdata;
        item["value"] = d[currdata] * 1;
        globaldeaths.push(item);
        globaldeathsTotal += item["value"];

        if (d[redata.columns[1]] === "China") {
            if (bardeathsObj[d[redata.columns[0]]] === undefined) {
                bardeathsObj[d[redata.columns[0]]] = {
                    name: d[redata.columns[0]], value: item["value"]
                };
            }
            else {
                bardeathsObj[d[redata.columns[0]]].value += item["value"];
            }
        }
    });
    globaldeaths.sort(function (a, b) {
        return b.value - a.value;
    });
    console.log(globaldeaths);

    //---------------------------------------------------
    // 提取全球恢复数据
    globalrecovered = [];
    globalrecoveredTotal = 0;
    redata2.forEach(function (d) {
        var item = {};
        item[redata2.columns[0]] = d[redata2.columns[0]];
        item[redata2.columns[1]] = d[redata2.columns[1]];
        item[redata2.columns[2]] = d[redata2.columns[2]] * 1;
        item[redata2.columns[3]] = d[redata2.columns[3]] * 1;
        item["date"] = currdata;
        item["value"] = d[currdata] * 1;
        globalrecovered.push(item);
        globalrecoveredTotal += item["value"];
    });
    globalrecovered.sort(function (a, b) {
        return b.value - a.value;
    });

    

    //---------------------------------------------------
    // 提取美国死亡数据
    redata4.forEach(function (d) {
        var item = {};
        item["date"] = redata4.columns[len - 1];
        item["value"] = d[redata4.columns[len - 1]] * 1;
        if (barconfirmedObj[d["Province_State"]] === undefined) {
            barconfirmedObj[d["Province_State"]] = {
                name: d["Province_State"], value: item["value"]
            };
        }
        else {
            barconfirmedObj[d["Province_State"]].value += item["value"];
        }
    });

    //---------------------------------------------------
    // 提取美国确诊数据
    redata5.forEach(function (d) {
        var item = {};
        item["date"] = redata5.columns[len - 1];
        item["value"] = d[redata5.columns[len - 1]] * 1;
        if (bardeathsObj[d["Province_State"]] === undefined) {
            bardeathsObj[d["Province_State"]] = {
                name: d["Province_State"], value: item["value"]
            };
        }
        else {
            bardeathsObj[d["Province_State"]].value += item["value"];
        }
    });
    barconfirmed = Object.values(barconfirmedObj);
    bardeaths = Object.values(bardeathsObj);
    barconfirmed.sort(function (a, b) {
        return b.value - a.value;
    });
    bardeaths.sort(function (a, b) {
        return b.value - a.value;
    });

    //---------------------------------------------------
    // 绘制地图数据
    if (isinit) {
        DrawGlobalDeathsChart(globaldeaths);
        DrawGlobalTotalListView(globaldeaths, "Deaths", globaldeathsTotal);
        isinit = false;
    }
    else {
        $(".btn-rate .selected").click();
    }
    
    LineChart(globalconfirmedObj);
    ChianUS_BarChart();
}

d3.csv("data/time_series_covid19_deaths_global.csv").then(function (redata) {
    var len = redata.columns.length;
    currdata = redata.columns[len - 1];
    dataset.redata = redata;
    myChart = echarts.init(document.getElementById('map_1'));
    lineChart = echarts.init(document.getElementById('echart6'));
    barChart = echarts.init(document.getElementById('echart5'));

    d3.csv("data/time_series_covid19_recovered_global.csv").then(function (redata2) {
        dataset.redata2 = redata2;
        d3.csv("data/time_series_covid19_confirmed_global.csv?v=20200526").then(function (redata3) {
            dataset.redata3 = redata3;
            d3.csv("data/time_series_covid19_confirmed_US.csv").then(function (redata4) {
                dataset.redata4 = redata4;
                let OBJ1 = {};
                dataset.redata4.forEach(function (d) {
                    d["Province/State"] = d["Province_State"];
                    d["Country/Region"] = d["Country_Region"];
                    d["Long"] = d["Long_"];
                    if (OBJ1[d["Province/State"]] === undefined) {
                        OBJ1[d["Province/State"]] = {
                            "Province/State": d["Province/State"],
                            "Country/Region": d["Country/Region"],
                            "Lat": d["Lat"],
                            "Long": d["Long"]
                        };
                        for (let i in dataset.redata4.columns) {
                            if (i > 10) {
                                let colname = dataset.redata4.columns[i];
                                OBJ1[d["Province/State"]][colname] = d[colname] * 1;
                            }
                        }
                    }
                    else {
                        for (let i in dataset.redata4.columns) {
                            if (i > 10) {
                                let colname = dataset.redata4.columns[i];
                                OBJ1[d["Province/State"]][colname] += d[colname] * 1;
                            }
                        }
                    }
                });
                for (var key in OBJ1) {
                    if (OBJ1[key]["Lat"] * 1 !== 0 && OBJ1[key]["Long"] * 1) {
                        dataset.redata3.push(OBJ1[key]);
                    }
                }
                d3.csv("data/time_series_covid19_deaths_US.csv?v=20200526").then(function (redata5) {
                    dataset.redata5 = redata5;
                    let OBJ1 = {};
                    dataset.redata5.forEach(function (d) {
                        d["Province/State"] = d["Province_State"];
                        d["Country/Region"] = d["Country_Region"];
                        d["Long"] = d["Long_"];
                        if (OBJ1[d["Province/State"]] === undefined) {
                            OBJ1[d["Province/State"]] = {
                                "Province/State": d["Province/State"],
                                "Country/Region": d["Country/Region"],
                                "Lat": d["Lat"],
                                "Long": d["Long"]
                            };
                            for (let i in dataset.redata4.columns) {
                                if (i > 10) {
                                    let colname = dataset.redata4.columns[i];
                                    OBJ1[d["Province/State"]][colname] = d[colname] * 1;
                                }
                            }
                        }
                        else {
                            for (let i in dataset.redata4.columns) {
                                if (i > 10) {
                                    let colname = dataset.redata4.columns[i];
                                    OBJ1[d["Province/State"]][colname] += d[colname] * 1;
                                }
                            }
                        }
                    });
                    for (var key in OBJ1) {
                        if (OBJ1[key]["Lat"] * 1 !== 0 && OBJ1[key]["Long"] * 1) {
                            dataset.redata.push(OBJ1[key]);
                        }
                    }
                    UpdateChartByTime(currdata);
                    d3.csv("data/population_by_country_2020.csv").then(function (redata6) {
                        redata6.forEach(function (d) {
                            if (populationObj[d["Country (or dependency)"]] === undefined) {
                                d["Population (2020)"] = d["Population (2020)"] * 1;
                                populationObj[d["Country (or dependency)"]] = d;
                            }
                        });
                    });
                    d3.csv("data/State Populations.csv").then(function (redata7) {
                        dataset.USOBJ = {};
                        redata7.forEach(function (d) {
                            if (dataset.USOBJ[d["State"]] === undefined) {
                                d["2018 Population"] = d["2018 Population"] * 1;
                                dataset.USOBJ[d["State"]] = d;
                            }
                        });
                        d3.csv("data/china.csv").then(function (redata8) {
                            redata8.forEach(function (d) {
                                if (chianObj[d["province"]] === undefined) {
                                    d["value"] = d["value"] * 1;
                                    chianObj[d["province"]] = d;
                                }
                            });
                        });
                    });
                });
            });
        });
    });
});

// 解析原始数据为散点图需要的数据
var convertData = function (data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        res.push({
            "Country/Region": data[i]["Country/Region"],
            "Province/State": data[i]["Province/State"],
            name: data[i]["Province/State"] !== "" ? data[i]["Province/State"] : data[i]["Country/Region"],
            value: [data[i]["Long"], data[i]["Lat"], data[i]["value"]]
        });
    }
    return res;
};

//绘制地图和散点
function DrawGlobalDeathsChart(paramdata) {
    option = {
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                if (typeof (params.value)[2] === "undefined") {
                    return params.name + ' : ' + params.value;
                } else {
                    let value = params.value[2];
                    if (params.data["Country/Region"] === "China") {
                        if (mappot === 3) {
                            let name = params.data["name"];
                            if (chianObj[name]) {
                                value = (value / chianObj[name].value * 100).toFixed(2);
                            }
                            else {
                                value = 100;
                            }
                        }
                        else {
                            let name = params.data["Province/State"];
                            if (CountryConfirmedObj[name]) {
                                value = (value / CountryConfirmedObj[name] * 100);
                            }
                            else {
                                value = 100;
                            }
                        }
                        return params.name + ' : ' + value + "%";
                    }
                    if (mappot === 1 || mappot === 2) {
                        let name = params.data["Province/State"];
                        if (CountryConfirmedObj[name]) {
                            value = (value / CountryConfirmedObj[name] * 100).toFixed(2);
                        }
                        else {
                            value = 100;
                        }
                        return params.name + ' : ' + value + "%";
                    }
                    if (mappot === 3) {
                        let name = params.data["Country/Region"];
                        let value = params.value[2];
                        if (populationObj[name]) {
                            value = (value / populationObj[name]["Population (2020)"] * 100).toFixed(10);
                        }
                        else {
                            value = 100;
                        }
                        return params.name + ' : ' + value + "%";
                    }
                }
            }
        },

        geo: {
            map: 'world',
            label: {
                emphasis: {
                    show: false
                }
            },
            roam: true,
            itemStyle: {
                normal: {
                    areaColor: '#4c60ff',
                    borderColor: '#002097'
                },
                emphasis: {
                    areaColor: '#293fff'
                }
            }
        },
        series: [
            {
                name: 'name',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: convertData(paramdata),
                symbolSize: function (val) {
                    var size = val[2] / 15;
                    if (size <= 5) {
                        size = 5;
                    }
                    else if (size >= 20) {
                        size = 20;
                    }
                    return size;
                },
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ffeb7b'
                    }
                }
            }
        ]
    };

    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}

function DrawGlobalTotalListView(data, title, total) {
    //$(".map-chart-title").html(currdata);
    $(".total-title").html("Global " + title);
    $(".total-count-title").html("Total " + title);
    $(".total-count-val").html(total);
    var listbox = $(".total-list-box");
    listbox.html("");

    var obj = {};
    data.forEach(function (d) {
        if (obj[d["Country/Region"]] === undefined) {
            obj[d["Country/Region"]] = d;
        }
        else {
            obj[d["Country/Region"]].value += d.value;
        }
    });
    var list = Object.values(obj);
    list.sort(function (a, b) {
        return b.value - a.value;
    });
    list.forEach(function (d) {
        listbox.append(`<div class="list-item">
                            <ul>
                                <li class="item-count">${d.value}</li>
                                <li class="item-name">${d["Country/Region"]}</li>
                            </ul>
                        </div>`);
    });
}

function LineChart(paramObj,islog) {
    var list = [];
    for (var key in paramObj) {
        var item = Object.create(paramObj[key]);        
        if (islog) {
            item.value = Math.log10(item.value);
        }
        list.push({ name: item.name, value: item.value});
    }
    var max = d3.max(list, function (d) { return d.value; });
    var charts = {
        unit: '',
        names: ['Confirmed'],
        lineX: Object.keys(paramObj),
        value: [
            list
        ]
    };
    var color = ['rgba(23, 255, 243', 'rgba(255,100,97'];
    var lineY = [];

    for (var i = 0; i < charts.names.length; i++) {
        var x = i;
        if (x > color.length - 1) {
            x = color.length - 1;
        }
        var data = {
            name: charts.names[i],
            type: 'line',
            color: color[x] + ')',
            smooth: true,
            areaStyle: {
                normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: color[x] + ', 0.3)'
                    }, {
                        offset: 0.8,
                        color: color[x] + ', 0)'
                    }], false),
                    shadowColor: 'rgba(0, 0, 0, 0.1)',
                    shadowBlur: 10
                }
            },
            symbol: 'circle',
            symbolSize: 5,
            data: charts.value[i]
        };
        lineY.push(data);
    }

    var option = {
        backgroundColor: '#1b2735',
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: charts.names,
            textStyle: {
                fontSize: 12,
                color: 'rgb(0,253,255,0.6)'
            },
            right: '4%'
        },
        grid: {
            top: '14%',
            left: '4%',
            right: '4%',
            bottom: '12%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: charts.lineX,
            axisLabel: {
                textStyle: {
                    color: 'rgb(0,253,255,0.6)'
                },
                formatter: function (params) {
                    return params.split(' ')[0];
                }
            }
        },
        yAxis: {
            name: charts.unit,
            type: 'value',
            axisLabel: {
                formatter: function (value) {
                    if (max < 10000) {
                        return value;
                    }
                    return value/10000 + "w";
                },
                textStyle: {
                    color: 'rgb(0,253,255,0.6)'
                }
            },
            splitLine: {
                lineStyle: {
                    color: 'rgb(23,255,243,0.3)'
                }
            },
            axisLine: {
                lineStyle: {
                    color: 'rgb(0,253,255,0.6)'
                }
            }
        },
        series: lineY
    };
    lineChart.setOption(option);

    setInterval(() => {
        lineChart.setOption({
            legend: {
                selected: {
                    '出口': false
                }
            }
        });
        lineChart.setOption({
            legend: {
                selected: {
                    '出口': true
                }
            }
        });
    }, 10000);
}

function GetChianUS_BarChartList(type) {
    var retObj = {};
    retObj.barconfirmedlist = [];
    retObj.bardeathslist = [];
    retObj.categorydata = [];

    if (type === "confirmed") {
        for (let i = 0; i < 10; i++) {
            if (i < barconfirmed.length) {
                let categoryname = barconfirmed[i].name;
                retObj.categorydata.push(categoryname);
            }
        }
    }
    else if (type === "deaths") {
        for (let i = 0; i < 10; i++) {
            if (i < bardeaths.length) {
                let categoryname = bardeaths[i].name;
                retObj.categorydata.push(categoryname);
            }
        }
    }
    retObj.categorydata.forEach(function (d) {
        retObj.barconfirmedlist.push(barconfirmedObj[d]);
        retObj.bardeathslist.push(bardeathsObj[d]);
    });
    return retObj;
}

function ChianUS_BarChart() {
    var retdata = GetChianUS_BarChartList("confirmed");
    var categorydata = retdata.categorydata;
    var barconfirmedlist = retdata.barconfirmedlist;
    var bardeathslist = retdata.bardeathslist;

    option = {
        backgroundColor: '#142058',
        legend: {
            top: 20,
            textStyle: {
                color: '#fff'
            },
            data: ['Deaths', 'Confirmed']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '10%',
            containLabel: true
        },

        tooltip: {
            show: "true",
            trigger: 'item',
            backgroundColor: 'rgba(0,0,0,0.7)', // 背景
            padding: [8, 10], //内边距
            extraCssText: 'box-shadow: 0 0 3px rgba(255, 255, 255, 0.4);', //添加阴影
            formatter: function (params) {
                var str = `Province/State:${params.data.name}<br>`;
                str += `${params.seriesName}:${params.data.value}<br>`;
                return str;
            }
        },
        yAxis: {
            type: 'value',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#363e83'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#363e83 '
                }
            },
            axisLabel: {
                formatter: function (value) {
                    return value / 10000 + "w";
                },
                textStyle: {
                    color: '#fff',
                    fontWeight: 'normal',
                    fontSize: '12'
                }
            }
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: true,
                lineStyle: {
                    color: '#363e83'
                }
            },
            axisLabel: {
                inside: false,
                textStyle: {
                    color: '#fff',
                    fontWeight: 'normal',
                    fontSize: '12'
                }
                ,
                interval: 0,
                rotate: 40
            },
            data: categorydata
        }, {
            type: 'category',
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                show: false
            },
            splitArea: {
                show: false
            },
            splitLine: {
                show: false
            },
                data: categorydata
        }
        ],
        series: [ {
            name: 'Deaths',
            type: 'bar',
            itemStyle: {
                normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#f7734e'
                    }, {
                        offset: 1,
                        color: '#e12945'
                    }]),
                    barBorderRadius: 10,
                    borderWidth: 0
                }
            },
            zlevel: 2,
            barWidth: '20%',
            data: bardeathslist
        }, {
                name: 'Confirmed',
            type: 'bar',
            barWidth: '20%',
            itemStyle: {
                normal: {
                    show: true,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                        offset: 0,
                        color: '#96d668'
                    }, {
                        offset: 1,
                        color: '#01babc'
                    }]),
                    barBorderRadius: 50,
                    borderWidth: 0
                }
            },
            zlevel: 2,
            barGap: '100%',
                data: barconfirmedlist
        }
        ]
    };
    barChart.setOption(option);
}

$(".btn-rate-type").click(function () {
    $(".btn-rate .selected").removeClass("selected");
    $(this).addClass("selected");
    var param = $(this).attr("param") * 1;
    var option = myChart.getOption();
    if (param === 1) {
        option.series[0].data = convertData(globaldeaths);
        option.series[0].itemStyle.color = "#ffeb7b";
        myChart.setOption(option);
        DrawGlobalTotalListView(globaldeaths, "Deaths", globaldeathsTotal);
        mappot = param;
        return;
    }
    if (param === 2) {
        option.series[0].data = convertData(globalrecovered);
        option.series[0].itemStyle.color = "#76EE00";
        myChart.setOption(option);
        DrawGlobalTotalListView(globalrecovered, "Recovered", globalrecoveredTotal);
        mappot = param;
        return;
    }
    if (param === 3) {
        option.series[0].data = convertData(globalconfirmed);
        option.series[0].itemStyle.color = "#CD3700";
        myChart.setOption(option);
        DrawGlobalTotalListView(globalconfirmed, "Confirmed", globalconfirmedTotal);
        mappot = param;
        return;
    }
});

$(".btn-line-box .btn").click(function () {
    if ($(this).is(".btn-log-type") || $(this).is(".btn-daily-type")) {
        $(".btn-line-box .selected").removeClass("selected");
        $(this).addClass("selected");
    }
    if ($(this).is(".btn-log-type")) {
        LineChart(globalconfirmedObj, true);
        let biglineChart = echarts.init(document.getElementById('big-echart6'));
        let option = lineChart.getOption();
        biglineChart.setOption(option);
        return;
    }
    if ($(this).is(".btn-daily-type")) {
        LineChart(globalconfirmedObj);
        let biglineChart = echarts.init(document.getElementById('big-echart6'));
        let option = lineChart.getOption();
        biglineChart.setOption(option);
        return;
    }
});

$(".btn-bar-box .btn").click(function () {
    if ($(this).is(".btn-confirmed-type") || $(this).is(".btn-deaths-type")) {
        $(".btn-bar-box .selected").removeClass("selected");
        $(this).addClass("selected");
    }
    var option = barChart.getOption();
    if ($(this).is(".btn-confirmed-type")) {
        let retdata = GetChianUS_BarChartList("confirmed");
        option.xAxis[0].data = retdata.categorydata;
        option.xAxis[1].data = retdata.categorydata;
        option.series[0].data = retdata.bardeathslist;
        option.series[1].data = retdata.barconfirmedlist;
        barChart.setOption(option);
        let bigbarChart = echarts.init(document.getElementById('big-echart5'));
        bigbarChart.setOption(option);
        return;
    }
    if ($(this).is(".btn-deaths-type")) {
        let retdata = GetChianUS_BarChartList("deaths");       
        option.xAxis[0].data = retdata.categorydata;
        option.xAxis[1].data = retdata.categorydata;
        option.series[0].data = retdata.bardeathslist;
        option.series[1].data = retdata.barconfirmedlist;
        barChart.setOption(option);
        let bigbarChart = echarts.init(document.getElementById('big-echart5'));
        bigbarChart.setOption(option);
        return;
    }
});

$('.form_date').datetimepicker({
    dateFormat: "yyyy-mm-dd",
    language: 'fr',
    weekStart: 1,
    todayBtn: 1,
    autoclose: 1,
    todayHighlight: 1,
    startView: 2,
    minView: 2,
    forceParse: 0
}).on('changeDate', function (ev) {
    var str = (ev.date.getMonth() + 1).toString() + "/"
        + ev.date.getDate().toString() + "/"
        + (ev.date.getFullYear().toString() % 2000);
    console.log(str);
    UpdateChartByTime(str);
});