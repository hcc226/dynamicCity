/**
 * mapLayout.js
 * @author Congcong Huang
 * #date 2017-11-12
 */



//import L from 'leaflet'
//import 'leaflet-echarts'
//import '../../public/javascripts/echarts.source.js'
//import echarts from 'echarts'
//var echarts = require('echarts');

class mapview{
    constructor(id) {
        let self = this;
        this.mapid = id;
        this.ddnodeLayer = null;
        this.map = new L.map(id,{
            zoomControl:false
        }).setView([40.2, 116.3], 9);
        this.baseLayers = {
            'normal': L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.light',
                accessToken: 'pk.eyJ1IjoiaGNjMjI2IiwiYSI6ImNqOTlucndyYTB2OWMycXFtOTJyYnR3eTIifQ.yHWmhPWtxqseKfBZfpRvWA'
            }).addTo(self.map),
            'dark': L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
                attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
                maxZoom: 18,
                id: 'mapbox.dark',
                accessToken: 'pk.eyJ1IjoiaGNjMjI2IiwiYSI6ImNqOTlucndyYTB2OWMycXFtOTJyYnR3eTIifQ.yHWmhPWtxqseKfBZfpRvWA'
            }),
            "高德地图": L.tileLayer('http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}', {
                subdomains: "1234"
            }),
            '高德影像': L.layerGroup([L.tileLayer('http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
                subdomains: "1234"
            }), L.tileLayer('http://t{s}.tianditu.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}', {
                subdomains: "1234"
            })]),
            'GeoQ灰色底图': L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}')
        };
        this.control = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
            maxZoom: 18,
            id: 'mapbox.light',
            zoomControl:false,
            accessToken: 'pk.eyJ1IjoiaGNjMjI2IiwiYSI6ImNqOTlucndyYTB2OWMycXFtOTJyYnR3eTIifQ.yHWmhPWtxqseKfBZfpRvWA'
        }).addTo(self.map);
        this.zoomControl = L.control.zoom({
            position:'bottomright'
        });
        self.map.addControl(this.zoomControl);
        this.layercontrol = L.control.layers(self.baseLayers).addTo(self.map);
        //var overlay;
        /*this.overlay = new L.echartsLayer(self.map, echarts);
        //console.log(overlay);
        var chartsContainer=this.overlay.getEchartsContainer();
        //console.log(chartsContainer);

        this.myChart=this.overlay.initECharts(chartsContainer);*/
    }
    /*latLngToLayerPoint(x){
        this.map.latLngToLayerPoint(x);
    }
*/
    drawBoundary(data){
        let self = this;
        L.geoJSON(data,{
            style:function (feature) {
                return {color:'grey',
                    weight:1,
                    fillColor:'none'
                };
            }
        }).addTo(self.map);
    }
        //$.getJSON('/data/beijingBoundary.json',function (data) {
            //  boundaryDrawing(data);
    //using leaflet-echarts
   /* drawMigration(dt,lines,lines1){
        //console.log(datasets)

        let self = this;
       // this.datasets = datasets;
        //console.log(self.map);

        //console.log(myChart);

        window.onresize = this.myChart.onresize;


        var option = {
            color: ['gold','aqua','lime'],
            title : {
                //text: '模拟迁徙',
                //subtext:'数据纯属虚构',
                x:'center',
                textStyle : {
                    color: '#fff'
                }
            },
            tooltip : {
                trigger: 'item',
                formatter: '{b}'
            },
            legend: {
                orient: 'vertical',
                x:'left',
                data:['in', 'out'],
                selectedMode: 'single',
                selected:{
                    'out' : false
                },
                textStyle : {
                    color: '#fff'
                }
            },
            toolbox: {
                show : true,
                orient : 'vertical',
                x: 'right',
                y: 'center',
                feature : {
                    mark : {show: true},
                    dataView : {show: true, readOnly: false},
                    restore : {show: true},
                    saveAsImage : {show: true}
                }
            },
            dataRange: {
                min : 0,
                max : 10,
                calculable : true,
                color: ['#ff3333', 'orange', 'yellow','lime','#8d9eeb'],
                textStyle:{
                    color:'#fff'
                }
            },
            series : [
                {
                    name: "in",
                    type: 'map',
                    mapType: 'none',
                    data: [],
                    markLine: {
                        smooth: true,
                        effect: {
                            show: true,
                            scaleSize: 1,
                            period: 30,
                            color: "#fff",
                            shadowBlur: 10
                        },
                        itemStyle: {
                            normal: {
                                borderWidth:1,
                                lineStyle: {
                                    type: 'solid',
                                    shadowBlur: 10
                                }
                            }
                        },
                        data: []
                    },
                    markPoint: {
                        symbol: 'emptyCircle',
                        symbolSize: function (v) {
                            return 2 + v / 10
                        },
                        effect: {
                            show: true,
                            shadowBlur: 0
                        },
                        itemStyle: {
                            normal: {
                                label: {show: false}
                            },
                            emphasis: {
                                label: {
                                    position: 'top'
                                }
                            }
                        },
                        data: []
                    },
                    geoCoord: {}
                },
                {
                    name: "out",
                    type: 'map',
                    mapType: 'none',
                    data: [],
                    markLine: {
                        smooth: true,
                        effect: {
                            show: true,
                            scaleSize: 1,
                            period: 30,
                            color: "#fff",
                            shadowBlur: 10
                        },
                        itemStyle: {
                            normal: {
                                borderWidth:1,
                                lineStyle: {
                                    type: 'solid',
                                    shadowBlur: 10
                                }
                            }
                        },
                        data: []
                    },
                    markPoint: {
                        symbol: 'emptyCircle',
                        symbolSize: function (v) {
                            return 2 + v / 10
                        },
                        effect: {
                            show: true,
                            shadowBlur: 0
                        },
                        itemStyle: {
                            normal: {
                                label: {show: false}
                            },
                            emphasis: {
                                label: {
                                    position: 'top'
                                }
                            }
                        },
                        data: []
                    },
                    geoCoord: {}
                }
            ]
        };

        var dt_len = dt.nodes.length;
        var nodes = dt.nodes;
        for(var i = 0; i<dt_len; i++){
            //var geoCoords = {}
            var id = nodes[i].id.toString()
            option.series[0].geoCoord[id] = [nodes[i].x,nodes[i].y]
            option.series[1].geoCoord[id] = [nodes[i].x,nodes[i].y]
        }
        console.log(option.series[0].geoCoord[0])
        //option.series[0].goeCoord = geoCoords;
        console.log(option.series[0].geoCoord)
        option.series[0].markPoint.data = dt.nodes.map(function (t) {
            //var coor = [t.x, t.y]
            //console.log(coor);

                return {
                    name: t.id.toString(),
                    value:t.stay_record_num/4000
                }
        });
        option.series[1].markPoint.data = dt.nodes.map(function (t) {
            //var coor = [t.x, t.y]
            //console.log(coor);

            return {
                name: t.id.toString(),
                value:t.stay_record_num/4000
            }
        });
        console.log(option.series[0].markPoint.data);
        option.series[0].markLine.data = lines.map(function (line) {
            //var start = [line.from_x,line.from_y];
            //var end = [line.to_x,line.to_y];
            //console.log(start);
            //console.log(end);
            /!*return [{
                geoCoord:start
            }, {
                geoCoord: end
            }]*!/
                return [{
                        name:line.from_nid.toString()
                        },
                        {
                            name:line.to_nid.toString(), value:line.travel_record_num/2
                        }]
        })
        option.series[1].markLine.data = lines1.map(function (line) {
            return [{
                name:line.from_nid.toString()
            },
                {
                    name:line.to_nid.toString(), value:line.travel_record_num/2
                }]
        })
        console.log(option.series[0].markLine.data);
        this.overlay.setOption(option,true);
    }*/

    //using leaflet circle and leaflet-curve
   /* drawMigration(dt,lines,lines1){
        let self = this;
        var nodes = dt.nodes;
        $.each(nodes,function (i,node) {
            //console.log(item.c);
            L.circle([node.y,node.x], node.stay_device_num/5, {
                color: '#8d9eeb',
                fillColor: '#1750a7',
                fillOpacity: 0.5
            }).addTo(self.map).bindPopup(node.stay_device_num.toString());
        });
        $.each(lines,function (i,item) {
            // console.log(item.c);
            let qlng = (item.from_x+item.to_x)/2+(item.from_y-item.to_y)/6;
            let qlat = (item.from_y+item.to_y)/2+(item.to_x-item.from_x)/6;
            L.curve([
                'M',[item.from_y,item.from_x],
                'Q',[qlat,qlng],[item.to_y,item.to_x]
            ], {color:'#6da6fd',
                weight:item.travel_device_num,
                id:item.eid
            }).addTo(self.map).bindPopup(item.travel_device_num.toString());
        });

    }*/
    //using d3 draw forcelayout fail!
    /*drawMigration(graph,lines,lines1){

        let self = this;
        var initZoom = self.map.getZoom();
        let svgid = `graphSVG`
        //let svg = d3.select("#"+self.map.id).select("svg");
        //console.log(svg)
          //let   g= svg.append("g").attr("class", "leaflet-zoom-hide");
       let g = d3.select(self.map.getPanes().overlayPane).select("svg").select("g");
            //g = svg.append("g").attr("class", "leaflet-zoom-hide");

// console.log('vmin', vmin, 'vmax', vmax);
        function projectPoint(x, y) {
            let self = this;
            let point = self.map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
        let transform = d3.geoTransform({point: self.projectPoint}),
            path = d3.geoPath().projection(transform);

        var simulation = d3.forceSimulation()
            .force("link",d3.forceLink().id(function (d) {
                return d.id;
            }))
            .force("charge",d3.forceManyBody())
            .force("center",d3.forceCenter());

            simulation.nodes(graph.nodes)
                .on("tick", ticked);
            let len = lines.length;
            graph.links=[];
            for(var i = 0;i <len; i++){
                let link = {};
                link.source = lines[i].from_nid;
                link.target = lines[i].to_nid;
                graph.links.push(link);
            }
            console.log(graph.links);
            simulation.force("link")
                .links(graph.links);


            var node = g.selectAll("circle")
                .data(graph.nodes)
                .enter().append("circle")
                /!*.attr("cx",function (d) {
                    console.log(d.x);
                    return self.map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).x;
                })
                .attr("cy",function (d) {
                    console.log(d.y);
                    return self.map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).y;
                })
                .attr("r",function (d) {
                    return d.stay_record_num/500/initZoom;
                })*!/
                .attr("fill",function (d) {
                    return "blue";
                });

           var link=g.selectAll("line")
                .data(graph.links)
                .enter().append("line")
                .attr("stroke","red");

        self.map.on("viewreset", reset);
        self.map.on("zoomstart",function(){
                g.style('display','none');
            });

        self.map.on("zoomend",function() {
                reset();
            });
            reset();

            function reset() {
                console.log("reset!")
                var curZoom = self.map.getZoom();
                var newmap = self.map;
                g.style('display','block');
                node.attr("transform",function (d) {

                    var pos = newmap.latLngToLayerPoint(new L.LatLng(d.y,d.x));
                    console.log(pos);
                    return "translate("+pos.x+","+pos.y+")";
                    })
               /!*node.attr("cx",function (d) {
                   return self.map.latLngToLayerPoint(new L.LatLng(d.y,d.x)).x
               })
                   .attr("cy",function (d) {
                       return self.map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).y
                   })*!/
                    .attr("r",function (d) {
                        return curZoom*d.stay_record_num/500/initZoom;
                    });

                link.attr("x1",function (d) {
                    return self.map.latLngToLayerPoint(new L.LatLng(d.source.y, d.source.x)).x;
                })
                    .attr("y1",function (d) {
                        return self.map.latLngToLayerPoint(new L.LatLng(d.source.y, d.source.x)).y;
                    })
                    .attr("x2",function (d) {
                        return self.map.latLngToLayerPoint(new L.LatLng(d.target.y, d.target.x)).x;
                    })
                    .attr("y2",function (d) {
                        return self.map.latLngToLayerPoint(new L.LatLng(d.target.y, d.target.x)).y;
                    });

            }


            function ticked() {
                /!* link
                     .attr("x1",function (d) {
                     return d.source.x;
                 })
                     .attr("y1",function (d) {
                         return d.source.y;
                     })
                     .attr("x2",function (d) {
                         return d.target.x;
                     })
                     .attr("y2",function (d) {
                         return d.target.y;
                 });

                 node.attr("cx",function (d) {
                     return d.x;
                 })
                     .attr("cy",function (d) {
                         return d.y;
                     })*!/
            }
    }*/
    //draw line
   /* drawMigration(graph,lines,lines1){

        let self = this;
        var initZoom = self.map.getZoom();
        let svgid = `graphSVG`
        //let svg = d3.select("#"+self.map.id).select("svg");
        //console.log(svg)
        //let   g= svg.append("g").attr("class", "leaflet-zoom-hide");
        let g = d3.select(self.map.getPanes().overlayPane).select("svg").select("g");
        //g = svg.append("g").attr("class", "leaflet-zoom-hide");

// console.log('vmin', vmin, 'vmax', vmax);
        function projectPoint(x, y) {
            let self = this;
            let point = self.map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
        let transform = d3.geoTransform({point: self.projectPoint}),
            path = d3.geoPath().projection(transform);

        /!* var simulation = d3.forceSimulation()
             .force("link",d3.forceLink().id(function (d) {
                 return d.id;
             }))
             .force("charge",d3.forceManyBody())
             .force("center",d3.forceCenter());

             simulation.nodes(graph.nodes)
                 .on("tick", ticked);
             let len = lines.length;
             graph.links=[];
             for(var i = 0;i <len; i++){
                 let link = {};
                 link.source = lines[i].from_nid;
                 link.target = lines[i].to_nid;
                 graph.links.push(link);
             }
             console.log(graph.links);
             simulation.force("link")
                 .links(graph.links);*!/


        var node = g.selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            /!*.attr("cx",function (d) {
                console.log(d.x);
                return self.map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).x;
            })
            .attr("cy",function (d) {
                console.log(d.y);
                return self.map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).y;
            })
            .attr("r",function (d) {
                return d.stay_record_num/800/initZoom;
            })*!/
            .attr("fill",function (d) {
                return "blue";
            });

        var link=g.selectAll("line")
            .data(lines)
            .enter().append("line")
            .attr("stroke","red")
            .attr("x1",function (d) {
                return self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x)).x;
            })
            .attr("y1",function (d) {
                return self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x)).y;
            })
            .attr("x2",function (d) {
                return self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x)).x;
            })
            .attr("y2",function (d) {
                return self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x)).y;
            });

        self.map.on("viewreset", reset);
        self.map.on("zoomstart",function(){
            g.style('display','none');
        });

        self.map.on("zoomend",function() {
            reset();
        });
        reset();

        function reset() {
            console.log("reset!")
            var curZoom = self.map.getZoom();
            var newmap = self.map;
            g.style('display','block');
            node.attr("transform",function (d) {

                var pos = newmap.latLngToLayerPoint(new L.LatLng(d.y,d.x));
                console.log(pos);
                return "translate("+pos.x+","+pos.y+")";
            })
            /!*node.attr("cx",function (d) {
                return self.map.latLngToLayerPoint(new L.LatLng(d.y,d.x)).x
            })
                .attr("cy",function (d) {
                    return self.map.latLngToLayerPoint(new L.LatLng(d.y, d.x)).y
                })*!/
                .attr("r",function (d) {
                    return curZoom*d.stay_record_num/800/initZoom;
                })
                .style("opacity","0.3");

            link.attr("x1",function (d) {
                return self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x)).x;
            })
                .attr("y1",function (d) {
                    return self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x)).y;
                })
                .attr("x2",function (d) {
                    return self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x)).x;
                })
                .attr("y2",function (d) {
                    return self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x)).y;
                });

        }


        function ticked() {
            /!* link
                 .attr("x1",function (d) {
                 return d.source.x;
             })
                 .attr("y1",function (d) {
                     return d.source.y;
                 })
                 .attr("x2",function (d) {
                     return d.target.x;
                 })
                 .attr("y2",function (d) {
                     return d.target.y;
             });

             node.attr("cx",function (d) {
                 return d.x;
             })
                 .attr("cy",function (d) {
                     return d.y;
                 })*!/
        }
    }*/
    //draw curve
    drawMigration(graph,lines,lines1){
        let self = this;
        if(this.ddnodeLayer!= null){
            this.ddnodeLayer.remove();
        }

        var initZoom = self.map.getZoom();
        console.log(self.map);
        let svgid = `graphSVG`
        //let svg = d3.select("#"+self.map.id).select("svg");
        //console.log(svg)
        //let   g= svg.append("g").attr("class", "leaflet-zoom-hide");
        let g = d3.select(self.map.getPanes().overlayPane).select("svg").select("g");
        //g = svg.append("g").attr("class", "leaflet-zoom-hide");
        console.log(g)
        let nodeG = g.append("g").attr("class","node-layer");
        let edgeG = g.append("g").attr("class","edge-in-layer");
        let edgeG1 = g.append("g").attr("class","edge-out-layer").style("display","none");

        let arrowG = g.append("g").attr("class","arrow-in-layer");
        let arrowG1 = g.append("g").attr("class","arrow-out-layer").style("display","none");

console.log(nodeG)

        g.selectAll(".node").remove();
        g.selectAll(".edge").remove();
        g.selectAll(".arrow").remove();
        function pathData(point1,point2) {
            var x1,y1,x2,y2,r1,r2,dis;
            var xc,yc;
            x1 = point1.x;
            y1 = point1.y;
            x2 = point2.x;
            y2 = point2.y;
            xc=(x1+x2)/2+(y1-y2)/8;
            yc=(y1+y2)/2+(x2-x1)/8;
            return [
                'M', x1, ' ', y1,
                'Q', xc, ' ', yc,' ',x2, ' ', y2
            ].join('');
        }
        function qBerzier(p0,p1,p2,t){
            var x = (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
            var y = (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;
            var midpoint={
                x:x,
                y:y
            }
            return midpoint;
        }
        function arrowData(point1,point2) {
            var slopy,cosy,siny,x1,x2,y1,y2;
            var Par=10.0;
            x1 = point1.x;
            y1 = point1.y;
            x2 = point2.x;
            y2 = point2.y;
            var xc=(x1+x2)/2+(y1-y2)/8;
            var yc=(y1+y2)/2+(x2-x1)/8;
            var p1={x:xc,y:yc};
            var midPoint=qBerzier(point1,p1,point2,0.5)
            slopy=Math.atan2((y1-y2),(x1-x2));
            cosy=Math.cos(slopy);
            siny=Math.sin(slopy);
            return [
                'M', midPoint.x, ' ', midPoint.y,
                'L', (Number(midPoint.x)+Number(Par*cosy-(Par/2.0*siny))*initZoom/10), ' ', Number(midPoint.y)+Number(Par*siny+(Par/2.0*cosy))*initZoom/10,
                'M', Number(midPoint.x)+Number(Par*cosy+Par/2.0*siny)*initZoom/10, ' ', Number(midPoint.y)-Number(Par/2.0*cosy-Par*siny)*initZoom/10,
                'L', midPoint.x, ' ', midPoint.y,
            ].join('');
        }
        function projectPoint(x, y) {
            let self = this;
            let point = self.map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
        function getColor(h,s,l) {
            var colors=[204,204];
            //var colors=204;
            var sRange=[1,0];
            var lRange=[0.8,0.3];
            var sScale=d3.scaleLinear()
                .domain([0,1])
                .range(sRange);
            var lScale=d3.scaleLinear()
                .domain([0,1])
                .range(lRange);
            var value='hsl('+colors[h]+','+(sScale(s)*100)+'%,'+(lScale(l)*100)+'%)';
            return value
        }
        let transform = d3.geoTransform({point: self.projectPoint}),
            path = d3.geoPath().projection(transform);
        var nums = []
        graph.nodes.forEach(function (d) {
            nums.push(d.stay_device_num);
        })
        var min = d3.min(nums);
        var max = d3.max(nums)

        let node = nodeG.selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("fill",function (d) {
                return getColor(1,0.5,(d.stay_device_num-min)/(max-min));
            })
            .attr("class","node")
            .attr("id",function (d) {
                return "node_"+d.id
            });

        let link1=edgeG1.selectAll("path")
            .data(lines1)
            .enter().append("path")
            .attr("stroke","black")
            .style("fill",'none')
            .attr("class","edge")
            .attr("opacity","0.5");

        let link=edgeG.selectAll("path")
            .data(lines)
            .enter().append("path")
            .attr("stroke","red")
            .style("fill",'none')
            .attr("class","edge")
            .attr("opacity","0.5")
            .attr("id",function (d) {
                return "link_"+d.eid;
            });

        let arrow1 = arrowG1.selectAll("path")
            .data(lines1)
            .enter()
            .append("path")
            .attr("class","arrow")
            .style("stroke","black")
            .style("fill","none")
            .style("opacity","0.5");

        let arrow = arrowG.selectAll("path")
            .data(lines)
            .enter()
            .append("path")
            .attr("class","arrow")
            .style("stroke","red")
            .style("fill","none")
            .style("opacity","0.5")
            .attr("id",function (d) {
                return "arrow_"+d.eid;
            });

        self.map.on("viewreset", reset);
        self.map.on("zoomstart",function(){
            g.style('display','none');
        });

        self.map.on("zoomend",function() {
            reset();
        });
        reset();

        function reset() {
            console.log("reset!")
            var curZoom = self.map.getZoom();
            g.style('display','block');
            node.attr("transform",function (d) {

                var pos = self.map.latLngToLayerPoint(new L.LatLng(d.y,d.x));

                return "translate("+pos.x+","+pos.y+")";
                })
                .attr("r",function (d) {
                    /*return curZoom*d.stay_record_num/800/initZoom;*/
                    return 5*curZoom/initZoom;
                })
                .style("opacity","0.8");

            link1.attr("d",function (d) {
                //console.log(d.from_nid)
                var point1 =  self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x));
                var point2 =  self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x))
                //console.log(point2);
                return pathData(point1, point2);
            })
                .attr("stroke-width",function(d){
                    if(curZoom*d.travel_device_num/initZoom>10)
                        return 10;
                    return curZoom*d.travel_device_num/initZoom;
                });

            arrow1.attr("d",function (d) {
                var point1 =  self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x));
                var point2 =  self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x))

                return arrowData(point1, point2);
            })
                .attr("stroke-width",function (d) {
                    if(curZoom*d.travel_device_num/initZoom>10)
                        return 5;
                    return curZoom*d.travel_device_num/initZoom/2;
                });

            link.attr("d",function (d) {
                var point1 =  self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x));
                var point2 =  self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x))
                //console.log(point1)
                return pathData(point1, point2);
                })
                .attr("stroke-width",function(d){
                    if(curZoom*d.travel_device_num/initZoom>10)
                        return 10;
                return curZoom*d.travel_device_num/initZoom;
                });

                //.attr("marker-end","url(#arrow)");
            arrow.attr("d",function (d) {
                var point1 =  self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x));
                var point2 =  self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x))
                return arrowData(point1, point2);
            })
                .attr("stroke-width",function (d) {
                    if(curZoom*d.travel_device_num/initZoom>10)
                        return 5;
                    return curZoom*d.travel_device_num/initZoom/2;
                });
        }

        this.nodeLayer = nodeG;
        this.edgeInLayer = edgeG;
        this.edgeOutLayer = edgeG1;
        this.arrowInLayer = arrowG;
        this.arrowOutLayer = arrowG1;
        this.node = node;
        this.link = link;
        this.arrow = arrow;
        this.link1 = link1;
        this.arrow1 = arrow1;
        function ticked() {
        }
    }
    invalidateSize(){
        this.map.invalidateSize();
    }
    changeFlow(flag){
        console.log(flag)
        if(flag =="in"){
            this.edgeOutLayer.style("display","none");
            this.arrowOutLayer.style("display","none");
            this.edgeInLayer.style("display","block");
            this.arrowInLayer.style("display","block");
            /*d3.select(".edge-out-layer").style("dispaly","none");
            d3.select(".arrow-out-layer").style("dispaly","none");
            d3.select(".edge-in-layer").style("dispaly","block");
            d3.select(".arrow-in-layer").style("dispaly","block");*/

        }
        else if(flag =="out"){
            this.edgeInLayer.style("display","none");
            this.arrowInLayer.style("display","none");
            this.edgeOutLayer.style("display","block");
            this.arrowOutLayer.style("display","block");
            /*d3.select(".edge-in-layer").style("dispaly","none");
            d3.select(".arrow-in-layer").style("dispaly","none");
            d3.select(".edge-out-layer").style("dispaly","block");
            d3.select(".arrow-out-layer").style("dispaly","block");*/

        }
    }
    changeVisualRadius(radius){
        let visual_nodes = [];
        function getDistance(longitude,latitude,long2,lat2) {
            let R = 6371; // 地球半径
            latitude = latitude * Math.PI / 180.0;
            lat2 = lat2 * Math.PI / 180.0;
            let a = latitude - lat2;
            let b = (longitude - long2) * Math.PI / 180.0;
            let  d;
            let sa2, sb2;
            sa2 = Math.sin(a / 2.0);
            sb2 = Math.sin(b / 2.0);
            d = 2 * R * Math.asin(
                Math.sqrt(sa2 * sa2 + Math.cos(latitude)
                    * Math.cos(lat2) * sb2 * sb2));
            return d;
        }
        console.log(this.nodeLayer);
        console.log(this.node);
        this.node.each(function (d) {
            console.log(d)
        })
        this.node.attr("display",function (d) {
            let distance = getDistance(d.y,d.x,39.975,116.345)
            console.log(distance)
            if(d.id==438){
                return "block";
            }
            else if(distance>radius){
                visual_nodes.push(d.id);
                return "none"
            }
            else {

                return "block"
            }
        });
        console.log(visual_nodes)
        this.link.attr("display",function (d) {
            let distance = getDistance(d.from_y,d.from_x,39.975,116.345);
            if(distance>radius){
                return "none"
            }
            else {
                return "block"
            }
            });
        this.arrow.attr("display",function (d) {
            let distance = getDistance(d.from_y,d.from_x,39.975,116.345);
            if(distance>radius){
                return "none"
            }
            else {
                return "block"
            }
        });

        this.link1.attr("display",function (d) {
            let distance = getDistance(d.to_y,d.to_x,39.975,116.345);
            if(distance>radius){
                return "none"
            }
            else {
                return "block"
            }
        });
        this.arrow1.attr("display",function (d) {
            let distance = getDistance(d.to_y,d.to_x,39.975,116.345);
            if(distance>radius){
                return "none"
            }
            else {
                return "block"
            }
        });

    }
    drawDistrict(data,bdData){
        let self = this;
        var num=[];
        function getColor(h,s,l) {
            var colors=[204,204];
            //var colors=204;
            var sRange=[1,0];
            var lRange=[0.9,0.4];
            var sScale=d3.scaleLinear()
                .domain([0,1])
                .range(sRange);
            var lScale=d3.scaleLinear()
                .domain([0,1])
                .range(lRange);
            var value='hsl('+colors[h]+','+(sScale(s)*100)+'%,'+(lScale(l)*100)+'%)';
            return value
        }
        console.log(data);
        data.nodes.forEach(function (t) {
            num.push(t.stay_device_num);
        })
        var min = d3.min(num);
        var max = d3.max(num);
        let features =bdData.features;
        features.forEach(function (feature,index) {
            bdData.features[index].properties.num = num[index];
            bdData.features[index].properties.color = getColor(1,0.5,(num[index]-min)/(max-min));
        })
        this.ddnodeLayer = L.geoJSON(bdData,{
            style:function (feature) {
                return {color:'grey',
                    weight:1,
                    fillColor:feature.properties.color
                };
            }
        }).addTo(self.map);
    }
    drawDisDis(graph,lines){
        let self = this;
        var initZoom = self.map.getZoom();
        let g = d3.select(self.map.getPanes().overlayPane).select("svg").select("g");
        let ddEdgeG = g.append("g").attr("class","edge-dd-layer");
        let ddArrowG = g.append("g").attr("class","arrow-dd-layer");

        g.selectAll(".node").remove();
        g.selectAll(".edge").remove();
        g.selectAll(".arrow").remove();
        function pathData(point1,point2) {
            var x1,y1,x2,y2,r1,r2,dis;
            var xc,yc;
            x1 = point1.x;
            y1 = point1.y;
            x2 = point2.x;
            y2 = point2.y;
            xc=(x1+x2)/2+(y1-y2)/8;
            yc=(y1+y2)/2+(x2-x1)/8;
            return [
                'M', x1, ' ', y1,
                'Q', xc, ' ', yc,' ',x2, ' ', y2
            ].join('');
        }
        function qBerzier(p0,p1,p2,t){
            var x = (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * p1.x + t * t * p2.x;
            var y = (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * p1.y + t * t * p2.y;
            var midpoint={
                x:x,
                y:y
            }
            return midpoint;
        }
        function arrowData(point1,point2) {
            var slopy,cosy,siny,x1,x2,y1,y2;
            var Par=10.0;
            x1 = point1.x;
            y1 = point1.y;
            x2 = point2.x;
            y2 = point2.y;
            var xc=(x1+x2)/2+(y1-y2)/8;
            var yc=(y1+y2)/2+(x2-x1)/8;
            var p1={x:xc,y:yc};
            var midPoint=qBerzier(point1,p1,point2,0.5)
            slopy=Math.atan2((y1-y2),(x1-x2));
            cosy=Math.cos(slopy);
            siny=Math.sin(slopy);
            return [
                'M', midPoint.x, ' ', midPoint.y,
                'L', (Number(midPoint.x)+Number(Par*cosy-(Par/2.0*siny))*initZoom/5), ' ', Number(midPoint.y)+Number(Par*siny+(Par/2.0*cosy))*initZoom/5,
                'M', Number(midPoint.x)+Number(Par*cosy+Par/2.0*siny)*initZoom/5, ' ', Number(midPoint.y)-Number(Par/2.0*cosy-Par*siny)*initZoom/5,
                'L', midPoint.x, ' ', midPoint.y,
            ].join('');
        }
        function projectPoint(x, y) {
            let self = this;
            let point = self.map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
        let transform = d3.geoTransform({point: self.projectPoint}),
            path = d3.geoPath().projection(transform);


        let ddlink = ddEdgeG.selectAll("path")
            .data(lines)
            .enter().append("path")
            .attr("stroke","red")
            .style("fill","none")
            .attr("class","edge")
            .attr("opacity","0.5")
            .attr("id",function (d) {
                return "link_"+d.eid;
            })

        let ddarrow = ddArrowG.selectAll("path")
            .data(lines)
            .enter()
            .append("path")
            .attr("class","arrow")
            .style("stroke","red")
            .style("fill","none")
            .style("opacity","0.5")
            .attr("id",function (d) {
                return "arrow_"+d.eid;
            });

        self.map.on("viewreset", reset);
        self.map.on("zoomstart",function(){
            g.style('display','none');
        });

        self.map.on("zoomend",function() {
            reset();
        });
        reset();
        function reset() {
            console.log("reset!")
            var curZoom = self.map.getZoom();
            g.style('display', 'block');

            ddlink.attr("d",function (d) {
                var point1 =  self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x));
                var point2 =  self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x))
                //console.log(point1)
                return pathData(point1, point2);
            })
                .attr("stroke-width",function(d){
                    if(curZoom*d.travel_device_num/initZoom>10)
                        return 10;
                    return curZoom*d.travel_device_num/initZoom;
                });

            //.attr("marker-end","url(#arrow)");
            ddarrow.attr("d",function (d) {
                var point1 =  self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x));
                var point2 =  self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x))
                return arrowData(point1, point2);
            })
                .attr("stroke-width",function (d) {
                    if(curZoom*d.travel_device_num/initZoom>10)
                        return 5;
                    return curZoom*d.travel_device_num/initZoom/2;
                });
        }
        this.ddEdgeLayer = ddEdgeG;
        this.ddArrowLayer = ddArrowG;
        this.ddedge = ddlink;
        this.ddarrow = ddarrow;
        }
    }

export {mapview}
