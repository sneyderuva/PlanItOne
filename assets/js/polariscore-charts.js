(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports', 'echarts'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports, require('echarts'));
    } else {
        // Browser globals
        factory({}, root.echarts);
    }
}(this, function (exports, echarts) {
    var log = function (msg) {
        if (typeof console !== 'undefined') {
            console && console.error && console.error(msg);
        }
    };
    if (!echarts) {
        log('ECharts is not Loaded');
        return;
    }
    echarts.registerTheme('S-PLAN', {
        "color": [
            "#e63b21",
            "#00594e",
            "#b5a160",
            "#e6a751",
            "#b5c334",
            "#fe8463",
            "#9bca63",
            "#fad860",
            "#f3a43b",
            "#60c0dd",
            "#d7504b",
            "#c6e579",
            "#f4e001",
            "#f0805a",
            "#26c0c0"
        ],
        "backgroundColor": "rgba(0,0,0,0)",
        "textStyle": {},
        "title": {
            "textStyle": {
                "color": "#00594e"
            },
            "subtextStyle": {
                "color": "#aaaaaa"
            }
        },
        "line": {
            "itemStyle": {
                "borderWidth": 1
            },
            "lineStyle": {
                "width": "3"
            },
            "symbolSize": "5",
            "symbol": "emptyCircle",
            "smooth": false
        },
        "radar": {
            "itemStyle": {
                "borderWidth": 1
            },
            "lineStyle": {
                "width": "3"
            },
            "symbolSize": "5",
            "symbol": "emptyCircle",
            "smooth": false
        },
        "bar": {
            "itemStyle": {
                "barBorderWidth": 0,
                "barBorderColor": "#ccc"
            }
        },
        "pie": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "scatter": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "boxplot": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "parallel": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "sankey": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "funnel": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "gauge": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            }
        },
        "candlestick": {
            "itemStyle": {
                "color": "#e63b21",
                "color0": "#b5c334",
                "borderColor": "#e63b21",
                "borderColor0": "#b5c334",
                "borderWidth": 1
            }
        },
        "graph": {
            "itemStyle": {
                "borderWidth": 0,
                "borderColor": "#ccc"
            },
            "lineStyle": {
                "width": 1,
                "color": "#aaa"
            },
            "symbolSize": "5",
            "symbol": "emptyCircle",
            "smooth": false,
            "color": [
                "#e63b21",
                "#00594e",
                "#b5a160",
                "#e6a751",
                "#b5c334",
                "#fe8463",
                "#9bca63",
                "#fad860",
                "#f3a43b",
                "#60c0dd",
                "#d7504b",
                "#c6e579",
                "#f4e001",
                "#f0805a",
                "#26c0c0"
            ],
            "label": {
                "color": "#eee"
            }
        },
        "map": {
            "itemStyle": {
                "areaColor": "#dddddd",
                "borderColor": "#eeeeee",
                "borderWidth": 0.5
            },
            "label": {
                "color": "#e63b21"
            },
            "emphasis": {
                "itemStyle": {
                    "areaColor": "#fe994e",
                    "borderColor": "#444",
                    "borderWidth": 1
                },
                "label": {
                    "color": "rgb(100,0,0)"
                }
            }
        },
        "geo": {
            "itemStyle": {
                "areaColor": "#dddddd",
                "borderColor": "#eeeeee",
                "borderWidth": 0.5
            },
            "label": {
                "color": "#e63b21"
            },
            "emphasis": {
                "itemStyle": {
                    "areaColor": "#fe994e",
                    "borderColor": "#444",
                    "borderWidth": 1
                },
                "label": {
                    "color": "rgb(100,0,0)"
                }
            }
        },
        "categoryAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#00594e"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#00594e"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "#333333"
            },
            "splitLine": {
                "show": false,
                "lineStyle": {
                    "color": [
                        "#ccc"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "valueAxis": {
            "axisLine": {
                "show": false,
                "lineStyle": {
                    "color": "#333333"
                }
            },
            "axisTick": {
                "show": false,
                "lineStyle": {
                    "color": "#333333"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "#333333"
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#ccc"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "logAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#00594e"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#333333"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "#333333"
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#ccc"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "timeAxis": {
            "axisLine": {
                "show": true,
                "lineStyle": {
                    "color": "#00594e"
                }
            },
            "axisTick": {
                "show": true,
                "lineStyle": {
                    "color": "#333333"
                }
            },
            "axisLabel": {
                "show": true,
                "color": "#333333"
            },
            "splitLine": {
                "show": true,
                "lineStyle": {
                    "color": [
                        "#ccc"
                    ]
                }
            },
            "splitArea": {
                "show": false,
                "areaStyle": {
                    "color": [
                        "rgba(250,250,250,0.3)",
                        "rgba(200,200,200,0.3)"
                    ]
                }
            }
        },
        "toolbox": {
            "iconStyle": {
                "borderColor": "#e63b21"
            },
            "emphasis": {
                "iconStyle": {
                    "borderColor": "#e6a751"
                }
            }
        },
        "legend": {
            "textStyle": {
                "color": "#333333"
            }
        },
        "tooltip": {
            "axisPointer": {
                "lineStyle": {
                    "color": "#00594e",
                    "width": 1
                },
                "crossStyle": {
                    "color": "#00594e",
                    "width": 1
                }
            }
        },
        "timeline": {
            "lineStyle": {
                "color": "#293c55",
                "width": 1
            },
            "itemStyle": {
                "color": "#00594e",
                "borderWidth": 1
            },
            "controlStyle": {
                "color": "#00594e",
                "borderColor": "#00594e",
                "borderWidth": 0.5
            },
            "checkpointStyle": {
                "color": "#e63b21",
                "borderColor": "#c23531"
            },
            "label": {
                "color": "#293c55"
            },
            "emphasis": {
                "itemStyle": {
                    "color": "#72d4e0"
                },
                "controlStyle": {
                    "color": "#00594e",
                    "borderColor": "#00594e",
                    "borderWidth": 0.5
                },
                "label": {
                    "color": "#293c55"
                }
            }
        },
        "visualMap": {
            "color": [
                "#e63b21",
                "#b5a160"
            ]
        },
        "dataZoom": {
            "backgroundColor": "rgba(0,0,0,0)",
            "dataBackgroundColor": "rgba(181,195,52,0.3)",
            "fillerColor": "rgba(181,195,52,0.2)",
            "handleColor": "#00594e",
            "handleSize": "100%",
            "textStyle": {
                "color": "#999999"
            }
        },
        "markPoint": {
            "label": {
                "color": "#eee"
            },
            "emphasis": {
                "label": {
                    "color": "#eee"
                }
            }
        }
    });
}));

// Firma institucional S-PLAN
window.aplicarFirmaSPlan = function (chartInstance, fecha_actualizacion) {
    const fechaHoy = fecha_actualizacion;

    chartInstance.setOption({
        graphic: [
            {
                type: 'image',
                id: 'logoMarca',
                left: 10,
                bottom: 30,
                z: 100,
                style: {
                    image: '../assets/img/polariscore/logo.png',
                    width: 120,
                    opacity: 0.9
                }
            },
            {
                type: 'text',
                id: 'disclaimer',
                right: 10,
                bottom: 10,
                z: 100,
                style: {
                    text: `Fuente: Oficina Asesora de Planeación - Unitrópico\nFecha de actualización: ${fechaHoy}`,
                    textAlign: 'right',
                    fill: '#555',
                    fontSize: 12,
                    fontFamily: 'sans-serif',
                    fontWeight: 'normal',
                    fontStyle: 'italic',
                    lineHeight: 18
                }
            }
        ]
    });
};
