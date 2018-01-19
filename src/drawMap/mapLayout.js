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
//import  {drag} from '../events/dragNode'
 import {sortline} from "../processData/processData"
import {getWidth,getDisWidth} from "../calculate/calculateEdge"
import {getRadius} from "../calculate/calculateCircle"
class mapview{
    constructor(id) {
        let self = this;
        this.mapid = id;
        this.ddnodeLayer = null;
        this.node = null;
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
        L.svg({clickable:true}).addTo(self.map);

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
        function getRadius(num,min,max) {
            return (num-min)/(max-min)*10 +2;
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
                if(d.stay_device_num <= 0){
                    return 'none';
                }
                /*return getColor(1,0.5,(d.stay_device_num-min)/(max-min));*/
                return "steelblue"
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
                    if(d.stay_device_num <= 0 ){
                        return 0;
                    }
                    var r = getRadius(d.stay_device_num,min,max)
                    return curZoom*r/initZoom;
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
                    if(d.travel_device_num<=0){
                        return 0;
                    }
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
                    if(d.travel_device_num<=0){
                        return 0;
                    }
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
                    if(d.travel_device_num<=0){
                        return 0;
                    }
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
                    if(d.travel_device_num<=0){
                        return 0;
                    }
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
    changeFill(flag){
        var data = this.data;
        var bdData = this.bdData;
        let self = this;
        var num=[];
        console.log(flag)
        /*if(this.ddnodeLayer){
            console.log("removedd")
            this.map.removeLayer(this.ddnodeLayer);
        }*/
        if(data.nodes.length === 0 || data.nodes[1].stay_device_num === 0){
            console.log("nodes is null")
            this.ddnodeLayer = L.geoJSON(bdData,{
                style:function (feature) {
                    return {color:'grey',
                        weight:1,
                        fillColor:'none'
                    };
                }
            }).addTo(self.map);
            return ;
        }
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
       /* data.nodes.forEach(function (t) {
            num.push(t.stay_device_num);
            num.push(t.in);
            num.push(t.out);
            num.push(t.all);
        })*/
        if(flag == "stay"){
            data.nodes.forEach(function (t) {
                num.push(t.stay_device_num);
            })
        }
        if(flag == "in"){
            data.nodes.forEach(function (t) {
                num.push(t.in);
            })
        }
        if(flag == "out"){
            data.nodes.forEach(function (t) {
                num.push(t.out);
            })
        }
        if(flag == "all"){
            data.nodes.forEach(function (t) {
                num.push(t.all);
            })
        }

        console.log(num);
        var min = d3.min(num);
        var max = d3.max(num);
        console.log(min)
        console.log(max)
        let features =bdData.features;
        features.forEach(function (feature,index) {
            for(var i=0;i<data.nodes.length;i++){
                var  node = data.nodes[i];
                if(node.x == bdData.features[index].properties.cp[0]
                    && node.y == bdData.features[index].properties.cp[1]){
                    if(flag == "stay"){
                        bdData.features[index].properties.num = node.stay_device_num;
                        bdData.features[index].properties.color = getColor(1,0.5,(node.stay_device_num-min)/(max-min));
                    }
                    if(flag == "in"){
                        bdData.features[index].properties.num = node.in;
                        bdData.features[index].properties.color = getColor(1,0.5,(node.in-min)/(max-min));
                    }
                    if(flag == "out"){
                        bdData.features[index].properties.num = node.out;
                        bdData.features[index].properties.color = getColor(1,0.5,(node.out-min)/(max-min));
                    }
                    if(flag == "all"){
                        bdData.features[index].properties.num = node.all;
                        bdData.features[index].properties.color = getColor(1,0.5,(node.all-min)/(max-min));
                    }
                    }
            }
        });
console.log(d3.select(self.map.getPanes().overlayPane).select("svg").select("g").selectAll(".leaflet-interactive"));
        d3.select(self.map.getPanes().overlayPane).select("svg").select("g").selectAll(".leaflet-interactive")
            .each(function (d,i) {
                d3.select(this).attr("fill",function (d1) {
                    return bdData.features[i].properties.color;
                });
            })


        /*this.ddnodeLayer = L.geoJSON(bdData,{
            style:function (feature) {
                console.log(feature.properties.color)
                return {color:'grey',
                    weight:1,
                    fillColor:feature.properties.color
                };
            }
        }).addTo(self.map);*/
    }
    changeFilter(radius, stayfilter, stayinfilter,stayoutfilter,edgefilter,comEdgefilter){
        let visual_nodes = [];
        function deg2rad(deg) {
            return deg * (Math.PI/180)
        }

        var z = this.sort_lines[edgefilter];
        var com_z = this.com_sort_lines[comEdgefilter];
        console.log(com_z)
        function getDistance(lon1,lat1,lon2,lat2) {
            var R = 6371; // Radius of the earth in km
            var dLat = deg2rad(lat2-lat1);  // deg2rad below
            var dLon = deg2rad(lon2-lon1);
            var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
            var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            var d = R * c; // Distance in km
            return d;

            /*var p = 0.017453292519943295;    // Math.PI / 180
            var c = Math.cos;
            var a = 0.5 - c((lat2 - latitude) * p)/2 +
                c(latitude * p) * c(lat2 * p) *
                (1 - c((long2 - longitude) * p))/2;
            return 12742 * Math.asin(Math.sqrt(a));*/

           /* let R = 6371; // 地球半径
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
            return d;*/
        }
       /* this.node.attr("display",function (d) {
            let distance = getDistance(d.y,d.x,39.975,116.345)
            console.log(distance)
            if(d.id==438){
                return "block";
            }
            else if(distance > radius || d.stay_device_num < stayfilter ||
            d.in < stayinfilter || d.out < stayoutfilter){
                visual_nodes.push(d.id);
                return "none"
            }
            else {
                return "block"
            }
        });*/
        console.log(this.sort_lines);
        console.log(this.com_sort_lines)
        console.log(edgefilter);
        console.log(z)
        this.link.attr("display",function (d) {
            if( d.width < z){
                return "none"
            }
            else {
                return "block"
            }
        });
        this.arrow.attr("display",function (d) {
            if( d.width < z){
                return "none"
            }
            else {
                return "block"
            }
        });

        /*this.bignode.each(function (d) {
            var bz = d3.select(this);

            bz.select(".arc").select("path").style("fill",function () {
                if(d.self >= z){
                    return "red"
                }
                else {

                    return "white"
                }
            })
        });*/
        this.com_bignode.each(function (d) {
            var com_bz = d3.select(this);
            //console.log(d.all)
            com_bz.select(".arc").select("path").style("fill",function () {
                if(d.outer >= com_z){
                    return "steelblue"
                }
                else {
                    return "none"
                }
            })
        })
       /* this.ddnode.attr("fill",function (d) {
            //console.log(d);
            if(d.stay_device_num >= z){
                return "grey"
            }
            else {
                return "white"
            }
        })*/

        this.com_node.attr("fill",function (d) {
            if(d.innerRadius >= com_z){
                return "black"
            }
            else {
                return "none"
            }
        })


        /*this.com_link.attr("display",function (d) {
            if( d.travel_device_num < com_z){
                return "none"
            }
            else {
                return "block"
            }
        });
        this.com_arrow.attr("display",function (d) {
            if( d.travel_device_num < com_z){
                return "none"
            }
            else {
                return "block"
            }
        });*/
 /*       this.link.attr("display",function (d) {
            let distance = getDistance(d.from_y,d.from_x,39.975,116.345);
            if(distance>radius || d.travel_record_num < edgefilter){
                return "none"
            }
            else {
                return "block"
            }
        });
        this.arrow.attr("display",function (d) {
            let distance = getDistance(d.from_y,d.from_x,39.975,116.345);
            if(distance>radius || d.travel_record_num < edgefilter){
                return "none"
            }
            else {
                return "block"
            }
        });*/

       /* this.link1.attr("display",function (d) {
            let distance = getDistance(d.to_y,d.to_x,39.975,116.345);
            if(distance>radius || d.travel_record_num < edgefilter){
                return "none"
            }
            else {
                return "block"
            }
        });
        this.arrow1.attr("display",function (d) {
            let distance = getDistance(d.to_y,d.to_x,39.975,116.345);
            if(distance>radius || d.travel_record_num < edgefilter ){
                return "none"
            }
            else {
                return "block"
            }
        });*/

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
    changeSFU(stayfilter){
        this.node.attr('display',function (d) {
            if(d.stay_record_num>=stayfilter){
                return 'block'
            }
            else return 'none'
        })
            }
    changeIFU(stayinfilter){
        this.node.attr('display',function (d) {
            if(d.in >= stayinfilter){
                return 'block'
            }
            else return 'none'
        })
    }
    changeOFU(stayoutfilter){
        this.node.attr('display',function (d) {
            if(d.out >= stayoutfilter){
                return 'block'
            }
            else return 'none'
        })
    }
    changeEFU(edgefilter){
        this.link.attr('display',function (d) {
            if(d.travel_record_num>=edgefilter){
                return 'block'
            }
            else return 'none'
        })
        this.arrow.attr('display',function (d) {
             if(d.travel_record_num>=edgefilter){
                    return 'block'
                }
                else return 'none'
        })
    }
    /*removeLayer(layer){
        this.map.removeLayer(layer);
    }*/

    // color each district
    drawDistrict(data,bdData,isRemove){
        let self = this;
        this.data = data;
        this.bdData = bdData;

        var num=[];
        if(isRemove === false){

        }
        else{
            let g = d3.select(self.map.getPanes().overlayPane).select("svg").remove();

        }
       if(this.ddnodeLayer){
            console.log("removedd")
            this.map.removeLayer(this.ddnodeLayer);
        }
        if(data.nodes.length === 0 || data.nodes[1].stay_device_num === 0){
            console.log("nodes is null")
            this.ddnodeLayer = L.geoJSON(bdData,{

                style:function (feature) {
                    return {color:'grey',
                        weight:1,
                        fillColor:'none'
                    };
                }
            }).addTo(self.map);
            return ;
        }

        function getColor(h,s,l) {
            var colors=[204,204];
            //var colors = [0,0];
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

        data.nodes.forEach(function (t) {
            num.push(t.stay_device_num);
        })
        console.log(num);
        var min = d3.min(num);
        var max = d3.max(num);

        let features =bdData.features;
        features.forEach(function (feature,index) {
            for(var i=0;i<data.nodes.length;i++){
               var  node = data.nodes[i];
                if(node.x == bdData.features[index].properties.cp[0]
                && node.y == bdData.features[index].properties.cp[1]){
                    bdData.features[index].properties.num = node.stay_device_num;
                    bdData.features[index].properties.color = getColor(1,0.5,(node.stay_device_num-min)/(max-min));
                }
            }
             });
        this.ddnodeLayer = L.geoJSON(bdData,{
            interactive:true,
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
        var sort_lines = sortline(lines,graph.nodes);
        this.sort_lines = sort_lines;
        var initZoom = self.map.getZoom();

        let g = d3.select(self.map.getPanes().overlayPane).select("svg").select("g");
        g.select(".node-dd-layer").remove();
        g.select(".edge-dd-layer").remove();
        g.select(".arrow-dd-layer").remove();
        let ddEdgeG = g.append("g").attr("class","edge-dd-layer");
        let ddArrowG = g.append("g").attr("class","arrow-dd-layer");
        let ddnodeG =  g.append("g").attr("class","node-dd-layer");

        /* let ddnodeG = this.ddnodeG;
       let ddEdgeG = this.ddEdgeG;
       let ddArrowG = this.ddArrowG;*/
        var num = [];
        var selfnum = [];
        graph.nodes.forEach(function (t) {
            num.push(t.stay_device_num);
            selfnum.push(t.self);
        })
        var staymin = d3.min(num);
        var staymax = d3.max(num);
        var selfmin = d3.min(selfnum);
        var selfmax = d3.max(selfnum);
        function getColor(h,s,l) {
            var colors=[204,204];
            //var colors = [0,0]
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
        function getRadius(num,min,max) {
            return (num-min)/(max-min)*10+5;
        }
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
        function pathToSelf(point1,point2) {
            var x1 = point1.x,
                y1 = point1.y,
                x2 = point2.x,
                y2 = point2.y,
                dx = x2 - x1,
                dy = y2 - y1,
                dr = Math.sqrt(dx * dx + dy * dy),

                // Defaults for normal edge.
                drx = dr,
                dry = dr,
                xRotation = 0, // degrees
                largeArc = 0, // 1 or 0
                sweep = 1; // 1 or 0

            // Self edge.
            if ( x1 === x2 && y1 === y2 ) {
                // Fiddle with this angle to get loop oriented.
                xRotation = -45;

                // Needs to be 1.
                largeArc = 1;

                // Change sweep to change orientation of loop.
                //sweep = 0;

                // Make drx and dry different to get an ellipse
                // instead of a circle.
                drx = 30;
                dry = 20;

                // For whatever reason the arc collapses to a point if the beginning
                // and ending points of the arc are the same, so kludge it.
                x2 = x2 + 1;
                y2 = y2 + 1;
            }

            return "M" + x1 + "," + y1 + "A" + drx + "," + dry + " " + xRotation + "," + largeArc + "," + sweep + " " + x2 + "," + y2;

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
        let transform = d3.geoTransform({point: self.projectPoint}),
            path = d3.geoPath().projection(transform);


        function get_leaflet_offset(){
            var trfm = $(".leaflet-map-pane").css('transform');
            trfm = trfm.split(", ");
            return [parseInt(trfm[4]), parseInt(trfm[5])];

        }

        function dragstarted(d) {
           console.log("start")
            self.map.dragging.disable();
            d3.event.sourceEvent.stopPropagation();
            d3.select(this).classed("dragging",true)
           //d_string = d3.select(this).attr("d");
            //d_string = d_string.substring(d_string.indexOf("m"));

        }

        function dragmove(d) {
            var offset = get_leaflet_offset();
            var size = d3.select(this).attr("r")/2;
            var pt = layer_to_LL(d3.event.sourceEvent.clientX - size - offset[0], d3.event.sourceEvent.clientY - size - offset[1]);
            //d.geometry.coordinates = [pt.lng, pt.lat];
            d.x = pt.lng;
            d.y = pt.lat;
            d3.select(this).classed("dragging", false);
            lines.forEach(function (line) {
                if(line.from_nid == d.id){
                    line.from_x = d.x;
                    line.from_y = d.y;
                }
                if(line.to_nid == d.id){
                    line.to_x = d.x;
                    line.to_y = d.y;
                }
            })
            reset();

           /* d3.select(this).attr("fill","blue")
            d.ax = d3.event.x;
            d.ay = d3.event.y;
            d3.select(this).attr("transform",function () {
                return "translate("+d.ax+","+d.ay+")";
            })*/
        }
        function layer_to_LL(x,y){return self.map.layerPointToLatLng(new L.Point(x,y));}
        function dragended(d) {
            self.map.dragging.enable();
        }


        var drag = d3.drag()
            .on('start', dragstarted)
            .on("drag",dragmove)
            .on("end",dragended);

        let ddnode = ddnodeG.selectAll("circle")
            .data(graph.nodes)
            .enter().append("circle")
            .attr("fill",function (d) {
                //return getColor(1,0.5,(d.stay_device_num-min)/(max-min));
                return "grey"
            })
            .attr("class","node")
            .style("cursor","point")
            .attr("id",function (d) {
                return "node_"+d.id
            })
            .on("click",function (d) {
                console.log("click")
            })
            .on("mouseover",function (d) {
                d3.select(".tooltip").html(d.id  + "<br />" +
                    d.stay_device_num)
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY-90) + "px")
                    .style("opacity",1.0);
            })
            .call(drag);


        let bignode = ddnodeG.selectAll("node")
            .data(graph.nodes)
            .enter().append("g")
            .attr("class","big-node")
            .attr("id",function (d) {
                return "g"+d.id
            })
            .call(drag);

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
            .on("mouseover",function (d) {
                return d.travel_device_num;
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
        var nums = [];
        lines.forEach(function (line) {
            nums.push(line.travel_device_num);
        })
        console.log(nums);
        var min = d3.min(nums);
        var max = d3.max(nums);
        console.log(min)
        console.log(max)
        reset();

        function reset() {
            console.log("reset!")
            var curZoom = self.map.getZoom();
            console.log(curZoom);
            console.log(initZoom);
            g.style('display', 'block');

           /* bignode.attr("transform",function (d) {

                var pos = self.map.latLngToLayerPoint(new L.LatLng(d.y,d.x));

                return "translate("+pos.x+","+pos.y+")";
            })
                .attr("r",function (d) {
                    //return curZoom*d.stay_record_num/800/initZoom;*!/
                    if(d.self <= 0 ){
                        return 0;
                    }
                    var r = getRadius(d.self,min,max)
                    d.outerRadius = curZoom*r/initZoom.r;
                    return curZoom*r/initZoom;
                })
                .style("opacity","0.8");*/



            ddnode.attr("transform",function (d) {

                var pos = self.map.latLngToLayerPoint(new L.LatLng(d.y,d.x));
                d.pos = pos;
                //映射位置
                return "translate("+pos.x+","+pos.y+")";
            })
                .attr("r",function (d) {
                    //return curZoom*d.stay_record_num/800/initZoom;*!/
                    if(d.stay_device_num <= 0 ){
                        return 0;
                    }
                    var r = getRadius(d.stay_device_num,staymin,staymax)
                    d.innerRadius = curZoom*r/initZoom;
                    return curZoom*r/initZoom;
                })
                .style("opacity","0.8")
                .call(drag);

            bignode.each(function (d,i) {
                var R = getRadius(d.self,selfmin,selfmax);

                //映射位置
                d.outerRadius = curZoom*R/initZoom+d.innerRadius;
                var arcdata = [];
                arcdata.push({
                    "id":d.id,
                    "num":d.self
                })
                var arc = d3.arc()
                    .outerRadius(d.outerRadius)
                    .innerRadius(d.innerRadius)
                    .padAngle(0);

                var pie = d3.pie()
                    .sort(null)
                    .value(function (d1) {
                        return d1.num;
                    });

                var z = d3.select(this);
                z.attr("transform",function () {
                    var pos = self.map.latLngToLayerPoint(new L.LatLng(d.y,d.x));
                    return 'translate(' + pos.x + ',' + pos.y +')';
                })
                var bz=z.selectAll(".arc")
                    .data(pie(arcdata))
                    .enter()
                    .append('g')
                    .attr('class','arc')
                    .attr('id',function (d,i) {
                        //console.log(arc(d));
                        return 'arc'+i;
                    })
                    /*.attr('transform', function () {
                        var pos = self.map.latLngToLayerPoint(new L.LatLng(d.y,d.x));
                        return 'translate(' + pos.x + ',' + pos.y +')';
                    });*/


                bz.append("path")
                    .attr("d",arc )
                    .attr('id',function (d,i) {
                        //console.log(arc(d));
                        return i;
                    })
                    .style("cursor","hand")
                    .style("fill",function(d,i){
                        return "red"
                    })
                    .each(function (d1,i) {
                        d1.arcdata=arcdata;
                    })
                    .style("stroke",function (d,i) {
                        return "red";
                    })
                    .style("stroke-width",'1px')
                    // .style('z-index','200')
                    .style('opacity',function (d,i) {
                        return 1;
                    })
                    .on("click",function (d) {
                        console.log("click")
                    })


            })



            ddlink.attr("d",function (d) {
                var point1 =  self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x));
                var point2 =  self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x))
                // draw path to itself
               /* if(d.from_nid == d.to_nid){
                    return pathToSelf(point1,point2)
                }*/
                //console.log(point1)
                return pathData(point1, point2);
            })
                .attr("stroke-width",function(d){
                    /*if(curZoom == 9){
                        var width = getWidth(d.travel_device_num,min,max);
                        return (curZoom)*width/initZoom/2;
                    }*/
                    if(d.travel_device_num == 0){
                        return 0;
                    }
                    var width = getDisWidth(d.travel_device_num,min,max);
                   // console.log((curZoom+20)*width/initZoom);
                    return (curZoom+20)*width/initZoom;
                   /* if(curZoom*d.travel_device_num/initZoom>10)
                        return 10;
                    return curZoom*d.travel_device_num/initZoom;*/
                });

            //.attr("marker-end","url(#arrow)");
            ddarrow.attr("d",function (d) {
                var point1 =  self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x));
                var point2 =  self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x))
                return arrowData(point1, point2);
            })
                .attr("stroke-width",function (d) {
                    if(d.from_nid == d.to_nid){
                        return 0;
                    }
                    if(d.travel_device_num == 0){
                        return 0;
                    }
                   /* if(curZoom = 9){
                        var width = getWidth(d.travel_device_num,min,max);
                        return (curZoom)*width/initZoom/2;
                    }*/
                    var width = getDisWidth(d.travel_device_num,min,max);
                    return (curZoom+20)*width/initZoom;
                    /*if(curZoom*d.travel_device_num/initZoom>10)
                        return 5;
                    return curZoom*d.travel_device_num/initZoom/2;*/
                });
        }
        this.bignode = bignode;
        this.ddnode = ddnode;
        this.link = ddlink;
        this.arrow = ddarrow;
        this.ddEdgeLayer = ddEdgeG;
        this.ddArrowLayer = ddArrowG;
        this.ddedge = ddlink;
        this.ddarrow = ddarrow;
        }
    drawPoiToDiv(data){
        console.log("drawPoiToDiv")
        let self = this;

        var initZoom = self.map.getZoom();
        var curZoom = self.map.getZoom();
        console.log(self.map);
        let svgid = `graphSVG`
        //let svg = d3.select("#"+self.map.id).select("svg");
        //console.log(svg)
        //let   g= svg.append("g").attr("class", "leaflet-zoom-hide");
        let g = d3.select(self.map.getPanes().overlayPane).select("svg").select("g");
        //g = svg.append("g").attr("class", "leaflet-zoom-hide");
        console.log(g)
        g.select(".node-layer").remove();
        g.select(".edge-in-layer").remove();
        g.select(".edge-out-layer").remove();
        g.select(".arrow-in-layer").remove();
        g.select(".arrow-out-layer").remove();

        let nodeG = g.append("g").attr("class","node-layer");
        let edgeG = g.append("g").attr("class","edge-in-layer");
        let edgeG1 = g.append("g").attr("class","edge-out-layer").style("display","none");

        let arrowG = g.append("g").attr("class","arrow-in-layer");
        let arrowG1 = g.append("g").attr("class","arrow-out-layer").style("display","none");

        console.log(nodeG)

        /*g.selectAll(".node").remove();
        g.selectAll(".edge").remove();
        g.selectAll(".arrow").remove();*/
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
        var allnums = []
        data.nodes[0].forEach(function (d) {
            nums.push(d.stay_device_num);
            allnums.push(d.all);
        })
        var edgenum=[];
        data.edges[0].forEach(function (d) {
            edgenum.push(d.travel_device_num)
        })
        var min = d3.min(edgenum);
        var max = d3.max(edgenum);
        var staymin = d3.min(nums);
        var staymax = d3.max(nums)
        var allmin = d3.min(allnums);
        var allmax = d3.max(allnums)

       /* let node = nodeG.selectAll("circle")
            .data(data.nodes[0])
            .enter().append("circle")
            .attr("fill",function (d) {
                if(d.stay_device_num <= 0){
                    return 'none';
                }
                /!*return getColor(1,0.5,(d.stay_device_num-min)/(max-min));*!/
                return "steelblue"
            })
            .attr("class","node")
            .attr("id",function (d) {
                return "node_"+d.id
            });
*/
       var link = null;
        let com_node = nodeG.selectAll("circle")
            .data(data.nodes[0])
            .enter().append("circle")
            .attr("fill",function (d) {
                //return getColor(1,0.5,(d.stay_device_num-min)/(max-min));
                return "black"
            })
            .attr("class","com-node")
            .style("cursor","point")
            .attr("id",function (d) {
                return "node_"+d.id
            })
            .on("click",function (d) {
                console.log("click")
            })
            .on("mouseover",function (d) {
                console.log(d.edges);
                d3.select(".tooltip").html("name:"+d.name  + "<br />" +
                    "stay:"+d.stay_device_num+"<br />"
                    +"in:"+d.in+"<br />"
                    +"out:"+d.out+"<br />"
                    +"all:"+(d.all)+"<br />")
                    .style("left", (d3.event.pageX) + "px")
                    .style("top", (d3.event.pageY-90) + "px")
                    .style("opacity",1.0);
                d.link = edgeG.selectAll("path" +d.id)
                    .data(d.edges)
                    .enter().append("path")
                    .attr("stroke","steelblue")
                    .style("fill",'none')
                    .attr("class","edge")
                    .attr("opacity","0.5")
                    .attr("id",function (d) {
                        return "link_"+d.from_nid;
                    })
                    .attr("d",function (d) {
                        var point1 =  self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x));
                        var point2 =  self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x))
                        //console.log(point1)
                        return pathData(point1, point2);
                    })
                    .attr("stroke-width",function(d){
                        if(d.travel_device_num<=0){
                            return 0;
                        }
                        var width = getWidth(d.travel_device_num,min,max);
                        d.width = (curZoom+20)*width/initZoom;
                        // console.log((curZoom+20)*width/initZoom);
                        return (curZoom+20)*width/initZoom;
                    });
                d.arrow = arrowG.selectAll("path")
                    .data(d.edges)
                    .enter()
                    .append("path")
                    .attr("class","arrow")
                    .style("stroke","steelblue")
                    .style("fill","none")
                    .style("opacity","0.5")
                    .attr("id",function (d) {
                        return "arrow_"+d.eid;
                    })
                    .attr("d",function (d) {
                    var point1 =  self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x));
                    var point2 =  self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x))
                    return arrowData(point1, point2);
                })
                    .attr("stroke-width",function (d) {
                        if(d.travel_device_num<=0){
                            return 0;
                        }
                        return d.width;
                    });

            })
            .on("mouseout",function (d) {
                edgeG.selectAll("path").remove();
                arrowG.selectAll("path").remove();
                //d3.select(".tooltip").style("opacity",0);
            })
            


        let com_bignode = nodeG.selectAll("node")
            .data(data.nodes[0])
            .enter().append("g")
            .attr("class","com-big-node")
            .attr("id",function (d) {
                return "g"+d.id
            });


        /*let link1=edgeG1.selectAll("path")
            .data(data.edges[0])
            .enter().append("path")
            .attr("stroke","black")
            .style("fill",'none')
            .attr("class","edge")
            .attr("opacity","0.5");*/

       /* let link=edgeG.selectAll("path")
            .data(data.edges[0])
            .enter().append("path")
            .attr("stroke","steelblue")
            .style("fill",'none')
            .attr("class","edge")
            .attr("opacity","0.5")
            .attr("id",function (d) {
                return "link_"+d.from_nid;
            });*/

       /* let arrow1 = arrowG1.selectAll("path")
            .data(lines1)
            .enter()
            .append("path")
            .attr("class","arrow")
            .style("stroke","black")
            .style("fill","none")
            .style("opacity","0.5");
*/
        /*let arrow = arrowG.selectAll("path")
            .data(data.edges[0])
            .enter()
            .append("path")
            .attr("class","arrow")
            .style("stroke","steelblue")
            .style("fill","none")
            .style("opacity","0.5")
            .attr("id",function (d) {
                return "arrow_"+d.eid;
            });*/

        self.map.on("viewreset", reset);
        self.map.on("zoomstart",function(){
            g.style('display','none');
        });

        self.map.on("zoomend",function() {
            reset();
        });
        reset();

        function clicked() {
            
        }
        function reset() {
            console.log("reset!")
            curZoom = self.map.getZoom();
            g.style('display','block');

            com_node.attr("transform",function (d) {

                var pos = self.map.latLngToLayerPoint(new L.LatLng(d.y,d.x));
                d.pos = pos;
                //映射位置
                return "translate("+pos.x+","+pos.y+")";
            })
                .attr("r",function (d) {
                    //return curZoom*d.stay_record_num/800/initZoom;*!/
                    if(d.stay_device_num <= 0 ){
                        return 0;
                    }
                    var r = getRadius(d.stay_device_num,staymin,staymax)
                    d.innerRadius = r;
                    return curZoom*r/initZoom;
                })
                .style("opacity","0.8")



            com_bignode.each(function (d,i) {

                if(d.all!=0){
                    var R = getRadius(d.all,allmin,allmax);

                    //映射位置
                    d.outer = R;
                    d.outerRadius = curZoom*(R+d.innerRadius)/initZoom;
                    var arcdata = [];
                    //all includes two selfs
                    arcdata.push({
                        "id":d.id,
                        "num":d.all
                    })

                    var arc = d3.arc()
                        .outerRadius(d.outerRadius)
                        .innerRadius(d.innerRadius)
                        .padAngle(0);

                    var pie = d3.pie()
                        .sort(null)
                        .value(function (d1) {
                            return d1.num;
                        });

                    var z = d3.select(this);
                    z.attr("transform",function () {
                        var pos = self.map.latLngToLayerPoint(new L.LatLng(d.y,d.x));
                        return 'translate(' + pos.x + ',' + pos.y +')';
                    })
                    var bz=z.selectAll(".arc")
                        .data(pie(arcdata))
                        .enter()
                        .append('g')
                        .attr('class','arc')
                        .attr('id',function (d,i) {
                            //console.log(arc(d));
                            return 'arc'+i;
                        })
                    /*.attr('transform', function () {
                        var pos = self.map.latLngToLayerPoint(new L.LatLng(d.y,d.x));
                        return 'translate(' + pos.x + ',' + pos.y +')';
                    });*/


                    bz.append("path")
                        .attr("d",arc )
                        .attr('id',function (d,i) {
                            //console.log(arc(d));
                            return i;
                        })
                        .style("cursor","hand")
                        .style("fill",function(d,i){
                            return "steelblue"
                        })
                        .each(function (d1,i) {
                            d1.arcdata=arcdata;
                        })
                        .style("stroke",function (d,i) {
                            return "none";
                        })
                        .style("stroke-width",'0.5px')
                        // .style('z-index','200')
                        .style('opacity',function (d,i) {
                            return 1;
                        })
                        .on("click",function (d) {
                            console.log("click")
                        })
                        .on("click",clicked);

                }


            })


            //.attr("marker-end","url(#arrow)");
            /*arrow.attr("d",function (d) {
                var point1 =  self.map.latLngToLayerPoint(new L.LatLng(d.from_y, d.from_x));
                var point2 =  self.map.latLngToLayerPoint(new L.LatLng(d.to_y, d.to_x))
                return arrowData(point1, point2);
            })
                .attr("stroke-width",function (d) {
                    if(d.travel_device_num<=0){
                        return 0;
                    }
                    return d.width;
                });*/
        }

        this.com_node = com_node;
        this.com_bignode = com_bignode;
       // this.com_link = link;
        //this.com_arrow = arrow;
    }

    }
    //testout

export {mapview}
