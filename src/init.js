//import {maps} from './prop'
import {mapview} from './drawMap/mapLayout'
import {objClone,sortline,processPoiToDiv,processDivToPoi} from './processData/processData'
import Vue from 'vue'
import * as d3 from 'd3'
import vueSlider from 'vue-slider-component'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import {getdata,res, getdistrictData, getBoundary} from './processData/getData'
import {drawEdgeAxis} from './drawAxis/drawAxis'
//import {sortline} from "processData/processData"

Vue.use(iView);
var starttime = "2016-July-11-07:00";
var end_time = "2016-July-11-10:00";
var request_days = ["2016-Jul-05"];
var start_hour;
var end_hour;
$(function () {
    $(".form_datetime").datetimepicker({
        language: "zh-CN",
        format: "yyyy-MM-dd",
        autoclose: true,
        todayBtn: true,
        startDate: "2016-07-05 00:00",
        minView: "month"

    }).on('changeDate', function (ev) {

        starttime = $("#starttime").val();
        end_time = $("#endtime").val();
        //changeTime(starttime,end_time);
        console.log(starttime)
        console.log(end_time)
    });
});
var months = {'July': '07', 'August': '08', 'September': '09', 'Jul': "07", 'Aug': "08", 'Sep': "09"};
var map = [];
var graph = {};

function updateGraph(dt) {
    var old_graph = graph;
    var new_graph = {};
    new_graph.nodes = [];
    new_graph.edges = [];
    var dt_nodes = dt.nodes[0], dtNodeLen = dt.nodes[0].length;
    var dt_edges = dt.edges[0], dtEdgeLen = dt.edges[0].length;
    var nodes = old_graph.nodes, nodeLen = old_graph.nodes.length;
    var edges = old_graph.edges, edgeLen = old_graph.edges.length;
    var id_updated = [];
    var eid_updated = [];
    for (var i = 0; i < dtNodeLen; i++) {
        var node = dt_nodes[i];
        for (var j = 0; j < nodeLen; j++) {
            if (nodes[j].id == dt_nodes[i].id) {
                node.stay_device_num += nodes[j].stay_device_num;
                node.stay_record_num += nodes[j].stay_record_num;
                id_updated.push(nodes[j].id);
                break;
            }
        }
        new_graph.nodes.push(node);
    }
    console.log(id_updated);

    for (var i = 0; i < nodeLen; i++) {
        var flag = false;
        var node = nodes[i];
        for (var j = 0; j < id_updated.length; j++) {
            if (nodes[i].id == id_updated[j]) {
                flag = true;
            }
        }
        if (!flag) {
            console.log("add")
            new_graph.nodes.push(node);
        }
    }

    for (var i = 0; i < dtEdgeLen; i++) {
        var edge = dt_edges[i];
        for (var j = 0; j < edgeLen; j++) {
            //    console.log(edges[j]);
            if (edges[j].from_nid === dt_edges[i].from_nid && edges[j].to_nid === dt_edges[i].to_nid) {
                console.log("found!")
                edge.travel_device_num += edges[j].travel_device_num;
                edge.travel_record_num += edges[j].travel_record_num;
                eid_updated.push([edges[j].from_nid, edges[j].to_nid]);
            }
        }
        new_graph.edges.push(edge);
    }
    console.log(eid_updated);
    for (var i = 0; i < edgeLen; i++) {
        var flag = false;
        var edge = edges[i]
        for (var j = 0; j < eid_updated.length; j++) {
            if (edges[i].from_nid == eid_updated[j][0] && edges[i].to_nid == eid_updated[j][1]) {
                flag = true;
            }
        }
        if (!flag) {
            console.log("e_add");
            new_graph.edges.push(edge);
        }
    }
    console.log(new_graph);
    graph = new_graph;
    return new_graph;
}

function reduceGraph(dt) {
    var old_graph = graph;
    var new_graph = {};
    new_graph.nodes = [];
    new_graph.edges = [];
    var dt_nodes = dt.nodes, dtNodeLen = dt.nodes.length;
    var dt_edges = dt.edges, dtEdgeLen = dt.edges.length;
    var nodes = old_graph.nodes, nodeLen = old_graph.nodes.length;
    var edges = old_graph.edges, edgeLen = old_graph.edges.length;
    var id_updated = [];
    var eid_updated = [];
    for (var i = 0; i < nodeLen; i++) {
        var node = nodes[i];
        for (var j = 0; j < dtNodeLen; j++) {
            if (nodes[i].id == dt_nodes[j].id) {
                node.stay_device_num -= dt_nodes[j].stay_device_num;
                node.stay_record_num -= dt_nodes[j].stay_record_num;
                id_updated.push(nodes[i].id);
            }
        }
        new_graph.nodes.push(node);
    }

    for (var i = 0; i < edgeLen; i++) {
        var edge = edges[i];
        for (var j = 0; j < dtEdgeLen; j++) {
            //    console.log(edges[j]);
            if (edges[i].from_nid === dt_edges[j].from_nid && edges[i].to_nid === dt_edges[j].to_nid) {
                console.log("found!")
                edge.travel_device_num = edge.travel_device_num - dt_edges[j].travel_device_num;
                edge.travel_record_num = edge.travel_record_num - dt_edges[j].travel_record_num;
                eid_updated.push([edges[i].from_nid, edges[i].to_nid]);
            }
        }
        new_graph.edges.push(edge);
    }
    console.log("new graph is")
    console.log(new_graph);
    graph = new_graph;
    return new_graph;
}

console.log(maps)
var maps = {
    'mapObj': [{
        'id': {
            'card': 'card0',
            'map': 'map0',
            'tab': 'tab0'
        },
        'visualRadius': 100,
        'nodeStayFilter': 0,
        'nodeInFilter': 0,
        'nodeOutFilter': 0,
        'edgefilter': 0,
        'maxedgefilter':300,
        'comEdgefilter':0,
        'maxComEdgefilter':2000
    }
    ],
    'stay_type': [{
        value: 'District',
        label: 'District'
    },
        {
            value: 'POI',
            label: 'POI'
        },
        {
            value: 'GRID',
            label: 'GRID'
        }],
    'stay_default': 'District',
    'travel_type': [{
        value: 'District-District',
        label: 'DD'
    },
        {
            value: 'District-POI',
            label: 'DP'
        },
        {
            value: 'POI-POI',
            label: 'PP'
        },
        {
            value: 'POI-Grid',
            label: 'PG'
        },
        {
            value: 'District-Grid',
            label: 'DG'
        },
        {
            value: 'Grid-Grid',
            label: 'GG'
        }],
    'travel_default': 'District-District',
    'years': [{
        value: 2016,
        label: 2016
    }],
    'year_default': 2016,
    'months': [{
        value: 'Jul',
        label: 'Jul'
    },
        {
            value: 'Aug',
            label: 'Aug'
        }, {
            value: 'Sep',
            label: 'Sep'
        }],
    'month_default': 'Jul',
    'weekdays': [{
        value: 'ALL',
        label: 'ALL'
    },
        {
            value: 'WORKDAY',
            label: 'WORKDAY'
        }, {
            value: 'WEEKEND',
            label: 'WEEKEND'
        }],
    'weekday_default': ' ',
    'loading': false
}

function getNodes(data) {
    var resdata = data;
    var res = [];
    $.each(data.nodes[0], function (i, node) {
        var edges = data.edges[0];
        var new_node = node;
        new_node.in = 0;
        new_node.out = 0;
        new_node.all = 0;
        new_node.self = 0;
        for (var j = 0; j < edges.length; j++) {
            var f = 0;
            if (edges[j].from_nid == new_node.id) {
                f++;
                new_node.out = new_node.out + edges[j].travel_device_num;
                new_node.all = new_node.all + edges[j].travel_device_num;
            }
            if (edges[j].to_nid == new_node.id) {
                new_node.in = new_node.in + edges[j].travel_device_num;
                new_node.all = new_node.all + edges[j].travel_device_num;
                f++;
            }
            if( f == 2){
                new_node.self = new_node.self + edges[j].travel_device_num;
            }
        }
        res.push(new_node);
    });
    resdata.nodes = res;
    return resdata;
}

function process(data) {
    var res = [];
    $.each(data.edges[0], function (j, edge) {
        var nodes = data.nodes[0];
        var link = edge;
        //console.log(link.from_nid)
        var count = 0;
        if (link.to_nid === 438) {
            for (var i = 0; i < nodes.length; i++) {
                //console.log(nodes[i].nid)
                if (nodes[i].id === 438) {
                    count++;
                    //console.log("found!")
                    link.to_x = nodes[i].x;
                    link.to_y = nodes[i].y;
                    break;
                }
            }
        }
        for (var i = 0; i < nodes.length; i++) {
            //console.log(nodes[i].nid)
            if (link.from_nid === nodes[i].id) {
                count++;
                //console.log("found!")
                link.from_x = nodes[i].x;
                link.from_y = nodes[i].y;
                break;
                // res.push(link);
            }
        }
        /* for(var i = 0; i<nodes.length;i++){
             //console.log(nodes[i].nid)
             if(link.to_nid === 438 || link.to_nid === 603){
                 count ++;
                 //console.log("found!")
                 link.to_x = nodes[i].x;
                 link.to_y = nodes[i].y;
                 break;
             }
         }*/
        if (count == 2) res.push(link);
    });
    console.log(res);
    return res;
}

function process1(data) {
    var res = [];
    $.each(data.edges[0], function (j, edge) {
        /*if(j >500){
            return res;
        }*/
        var nodes = data.nodes[0];
        var link = edge;
        //console.log(link.from_nid)
        var count = 0;
        if (link.from_nid === 438) {
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].id === 438) {
                    count++;
                    link.from_x = nodes[i].x;
                    link.from_y = nodes[i].y;
                }
            }
        }

        /* for(var i = 0; i<nodes.length;i++){
             //console.log(nodes[i].nid)
             if(link.from_nid === 438 || link.from_nid === 603 ){
                 count ++;
                 //console.log("found!")
                 link.from_x = nodes[438].x;
                 link.from_y = nodes[438].y;
                 break;
                 // res.push(link);
             }
         }*/
        for (var i = 0; i < nodes.length; i++) {
            //console.log(nodes[i].nid)
            if (link.to_nid === nodes[i].id) {
                count++;
                //console.log("found!")
                link.to_x = nodes[i].x;
                link.to_y = nodes[i].y;
                break;
            }
        }
        if (count == 2) res.push(link);
    });
    console.log(res);
    return res;
}

function process2(data) {
    var res = [];
    $.each(data.edges[0], function (j, edge) {
        /*if(j >500){
            return res;
        }*/
        var nodes = data.nodes[0];
        var link = edge;
        //console.log(link.from_nid)

        for (var i = 0; i < nodes.length; i++) {
            if (nodes[i].id === link.from_nid) {
                link.from_x = nodes[i].x;
                link.from_y = nodes[i].y;
            }
        }
        for (var i = 0; i < nodes.length; i++) {
            //console.log(nodes[i].nid)
            if (link.to_nid === nodes[i].id) {
                //console.log("found!")
                link.to_x = nodes[i].x;
                link.to_y = nodes[i].y;
                break;
            }
        }
        res.push(link);
    });
    console.log(res);
    return res;
}

function getLinePos(data) {
    var res = [];
    console.log(data)
    console.log(data.edges[0]);
    console.log(data.nodes)
    $.each(data.edges[0], function (j, edge) {
        var nodes = data.nodes;
        var link = edge;
        //console.log(link.from_nid)
        var count = 0;
        for (var i = 0; i < nodes.length; i++) {
            //console.log(nodes[i].nid)
            if (nodes[i].id === link.to_nid) {
                count++;
                //console.log("found!")
                link.to_x = nodes[i].x;
                link.to_y = nodes[i].y;
                break;
            }
        }

        for (var i = 0; i < nodes.length; i++) {
            //console.log(nodes[i].nid)
            if (link.from_nid === nodes[i].id) {
                count++;
                //console.log("found!")
                link.from_x = nodes[i].x;
                link.from_y = nodes[i].y;
                break;
                // res.push(link);
            }
        }
        if (count == 2) res.push(link);
    });
    console.log(res);
    return res;
}


const userpannel = new Vue({
    el: '#maindiv',
    data: maps, starttime, end_time, map,
    components: {
        vueSlider
    },
    methods: {
        'addMap': function () {
            let self = this;
            let index = maps.mapObj.length;
            let obj = objClone(maps.mapObj[index - 1]);
            obj.id.card = 'card${index}';
            obj.id.map = 'map{index}';
            obj.id.tab = 'tab{index}';
            maps.mapObj.push(obj);
            console.log('map' + index.toString());
            // this.drawmap(self);
        },
        'changeTime': function (starttime, end_time) {
            console.log("changetime function")
        },
        'getOverview': function (begintime, endtime) {
            var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime;
            console.log(get_url);
            $.ajax({
                /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
                url: get_url,
                type: 'GET',
                contentType: "application/json",
                dataType: 'jsonp',
                success: function (dt) {
                    console.log(dt);
                    var lines = process(dt);
                    //lines = [];
                    var data = getNodes(dt)
                    console.log(lines);
                    map[0].drawMigration(data, lines);
                }
            });

        },
        'changeFlow': function (index, flag) {
            console.log("changeflow")
            console.log(index)
            map[index].changeFlow(flag);
        },
        //change fill data of each district including stay,flowin/out,in and out
        'changeFill':function (index,flag) {
           map[index].changeFill(flag);
        },
        'changeFilter': function (index, filter) {
            var radius = maps.mapObj[index].visualRadius;
            var stayfilter = maps.mapObj[index].nodeStayFilter;
            var stayinfilter = maps.mapObj[index].nodeInFilter;
            var stayoutfilter = maps.mapObj[index].nodeOutFilter;
            var edgefilter = maps.mapObj[index].edgefilter;
            var comEdgefilter = maps.mapObj[index].comEdgefilter;
            map[index].changeFilter(radius, stayfilter, stayinfilter, stayoutfilter, edgefilter,comEdgefilter);
        },
        'radiusUpdate': function (index, radius) {
            console.log(radius)
            //et radius = maps.mapObj[index].visulRadius;
            map[index].changeVisualRadius(radius);
        },
        'nodeSFU': function (index, stayfilter) {
            console.log(maps.mapObj[index].nodeStayFilter)
            map[index].changeSFU(stayfilter);
        },
        'nodeIFU': function (index, stayinfilter) {
            map[index].changeIFU(stayinfilter);
        },
        'nodeOFU': function (index, stayoutfilter) {
            map[index].changeOFU(stayoutfilter)
        },
        'edgeFU': function (index, edgefilter) {
            map[index].changeEFU(edgefilter)
        },
        'changeTravelType': function (travel_type) {
            if (travel_type == "Grid-Grid") {
                console.log(travel_type);
                var start_hour = "07:00:00", end_hour = "08:00:00";
                var start_month = months[starttime.split('-')[1]];
                var begintime = starttime.split('-')[0] + "-" + start_month + "-" + starttime.split('-')[2] + "+" + start_hour;
                //var end_month = months[end_time.split('-')[1]];
                var endtime = starttime.split('-')[0] + "-" + start_month + "-" + starttime.split('-')[2] + "+" + end_hour;
                var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime;
                $.ajax({
                    url: get_url,
                    type: 'GET',
                    contentType: "application/json",
                    dataType: 'jsonp',
                    success: function (dt) {
                        console.log(dt);
                        var lines = process(dt);
                        var lines1 = process1(dt);
                        var data = getNodes(dt)
                        //lines = [];
                        console.log(lines);
                        console.log(lines1);
                        map[0].drawMigration(data, lines, lines1);
                    }
                });
            }
            else if (travel_type == "District-District") {
                $.getJSON('/data/beijingBoundary.json', function (dt) {
                  //  map[0].drawBoundary(dt);
                    $.getJSON('/data/sample.json', function (dt1) {
                        map[0].drawDistrict(dt1, dt);
                        var lines = process2(dt1);
                        var lines1 = process1(dt1);
                        map[0].drawDisDis(dt1, lines, lines1);
                    })
                });
            }

        },
        'getView': function (get_url) {
            this.dt = getdata(get_url);
            console.log(this.dt);
            var lines = process(this.dt);
            var lines1 = process1(this.dt);
            //lines = [];
            console.log(lines);
            console.log(lines1);
            map[0].drawMigration(this.dt, lines, lines1);
        },
        // click the clock and update graph

        //draw the clock in the time filter
        'drawClock': function () {


            var arc = d3.arc()
                .outerRadius(40)
                .innerRadius(25)
                .padAngle(0.05);
            var big_arc = d3.arc()
                .outerRadius(43)
                .innerRadius(22);
            var arcData = [];
            for (var i = 0; i < 24; i++) {
                var t = {};
                t.id = i;
                t.hour = (i + 12) % 24;
                t.value = 1;
                arcData.push(t);
            }
            ;
            var pie = d3.pie()
                .sort(null)
                .value(function (d1) {
                    return d1.value;
                })
            var svg = d3.select(".time-selector").append("svg")
                .attr("width", 300)
                .attr("height", 200)
                .append("g")
                .attr("class", "time-clock");

            var g = svg.selectAll(".arc")
                .data(pie(arcData))
                .enter().append("g")
                .attr("class", "arc")
                .attr("transform", 'translate(80,60)');
            var timelabel = [{
                'text': 12,
                'position': [73, 15]
            }, {
                'text': 15,
                'position': [110, 30]
            },
                {
                    'text': 18,
                    'position': [123, 65]
                },
                {
                    'text': 21,
                    'position': [110, 100]
                },
                {
                    'text': 0,
                    'position': [77, 112]
                },
                {
                    'text': 3,
                    'position': [40, 100]
                },
                {
                    'text': 6,
                    'position': [30, 65]
                },
                {
                    'text': 9,
                    'position': [40, 30]
                }
            ];

            var text = svg.selectAll("text")
                .data(timelabel)
                .enter()
                .append("text")
                .attr("color", "#777777")
                .attr("x", function (d) {
                    return d.position[0];
                })
                .attr("y", function (d) {
                    return d.position[1];
                })
                .html(function (d) {
                    return d.text;
                })
                .style("font-size","10px");


            var big_svg = d3.select(".time-selector").select("svg").select("g");
            var big_g = big_svg.selectAll(".arc1")
                .data(pie(arcData))
                .enter().append("g")
                .attr("class", "arc1")
                .attr("transform", 'translate(80,60)');

            big_g.append("path")
                .attr("d", big_arc)
                .attr("id", function (d, i) {
                    return "big-path" + i.toString();
                })
                .attr("class", "big_arc")
                .each(function (d, i) {
                    d.clicked = false;
                })
                .style("cursor", 'hand')
                .style("fill", "grey")
                .style("opacity", function (d, i) {
                    if (i === 19 || i === 20 || i === 21) {
                        return '1';
                    }
                    else {
                        return '0';
                    }
                })
                .on("mouseover", function (d, i) {
                    d3.select(this).style("fill", "grey");
                    g.select("#path" + i.toString()).style("fill", "grey");
                })
                .on("mouseout", function (d, i) {
                    d3.select(this).style("fill", "grey");
                    g.select("#path" + i.toString()).style("fill", "silver");
                })
                .on("click", function (d, i) {
                    maps.mapObj[0].edgefilter = 0;
                    d.clicked = !d.clicked;
                    var start_hour = (i + 12) % 24
                    var end_hour = start_hour + 1;
                    console.log(start_hour);
                    if (start_hour < 10) {
                        start_hour = "0" + start_hour.toString() + ":00" + ":00";
                    }
                    else {
                        start_hour = start_hour.toString() + ":00" + ":00";
                    }
                    if (end_hour < 10) {
                        end_hour = "0" + end_hour.toString() + ":00" + ":00";
                    }
                    else {
                        end_hour = end_hour.toString() + ":00" + ":00";
                    }
                    /* var start_month = months[starttime.split('-')[1]];
                     var begintime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+start_hour;
                     //var end_month = months[end_time.split('-')[1]];
                     var endtime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+end_hour;
                     var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=div&timeType=duration&netType=basic&other=none&beginTime="+begintime+"&endTime="+endtime;
                     console.log(get_url);*/

                    if (d3.select(this).style("opacity") == 0) {
                        console.log("nominus")
                        d3.select(this).style("opacity", "1");

                        var data = {}, lines = [], bdData;
                        var currentIndex = 0;

                        function test(data) {
                            if (currentIndex >= request_days.length) {
                                console.log(data);
                                // map[0].drawMigration(data,lines,lines1);
                                map[0].drawDistrict(data, bdData);
                                map[0].drawDisDis(data, lines);
                                return;
                            }
                            starttime = request_days[currentIndex];
                            end_time = request_days[currentIndex];
                            var start_month = months[starttime.split('-')[1]];
                            var begintime = starttime.split('-')[0] + "-" + start_month + "-" + starttime.split('-')[2] + "+" + start_hour;
                            //var end_month = months[end_time.split('-')[1]];
                            var endtime = end_time.split('-')[0] + "-" + start_month + "-" + end_time.split('-')[2] + "+" + end_hour;
                            var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=div&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime+"&v=v2";
                            console.log(get_url);
                            console.log(graph);
                            if (graph.nodes[0] && graph.nodes[0].length != 0 && graph.nodes[0][3].stay_device_num != 0 && graph.nodes[0][3].stay_record_num != 0) {
                                $.getJSON('/data/beijingBoundary.json', function (dt1) {
                                    //map[0].drawBoundary(dt);
                                    bdData = dt1;
                                    $.ajax({
                                        /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
                                        url: get_url,
                                        type: 'GET',
                                        contentType: "application/json",
                                        dataType: 'jsonp',
                                        success: function (dt) {
                                            console.log(dt);
                                            currentIndex++;
                                            data = updateGraph(dt);
                                            lines = getLinePos(data);
                                            data = getNodes(data)
                                            //lines = [];
                                            console.log(lines);
                                            //console.log(lines1);
                                            test(data);
                                        }
                                    });
                                });

                                /*$.ajax({
                                    /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
                                    url:get_url,
                                    type:'GET',
                                    contentType:"application/json",
                                    dataType:'jsonp',
                                    async:false,
                                    success:function (dt) {
                                        currentIndex++;
                                        console.log(dt);
                                        data = updateGraph(dt);
                                        lines = process(data);
                                        lines1 = process1(data);
                                        //lines = [];
                                        data = getNodes(data);
                                        console.log(lines);
                                        console.log(lines1);
                                        test(data);
                                        // map[0].drawMigration(data,lines,lines1);
                                    } });*/
                            }
                            else {

                                $.getJSON('/data/beijingBoundary.json', function (dt1) {
                                    //map[0].drawBoundary(dt);
                                    bdData = dt1;
                                    $.ajax({
                                        /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
                                        url: get_url,
                                        type: 'GET',
                                        contentType: "application/json",
                                        dataType: 'jsonp',
                                        success: function (dt) {
                                            console.log(dt);
                                            currentIndex++;
                                            //data = updateGraph(dt);
                                            lines = getLinePos(dt);
                                            data = getNodes(dt);
                                            graph = data;
                                            console.log(lines);
                                            //console.log(lines1);
                                            test(data);
                                        }
                                    });
                                });

                                /* $.ajax({
                                     /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
                                     url:get_url,
                                     type:'GET',
                                     contentType:"application/json",
                                     dataType:'jsonp',
                                     async:false,
                                     success:function (dt) {
                                         currentIndex++;
                                         console.log(dt);
                                         lines = process(dt);
                                         lines1 = process1(dt);
                                         //lines = [];
                                         data = getNodes(dt);
                                         console.log(lines);
                                         console.log(lines1);
                                         graph = data;
                                         test(data);
                                         //  map[0].drawMigration(data,lines,lines1);
                                     } });*/
                            }
                        }

                        test(data);

                        /*$.ajax({
                            /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
                            url:get_url,
                            type:'GET',
                            contentType:"application/json",
                            dataType:'jsonp',
                            success:function (dt) {
                                console.log(dt);
                                var data = dt;
                                //judge if graph is drawed or not
                                if(graph.nodes){
                                     data = updateGraph(dt);
                                     console.log(data);
                                }
                                else{
                                    graph = data;
                                    console.log(graph);
                                }
                                var lines = process(data);
                                var lines1 = process1(data);
                                data = getNodes(data)
                                //lines = [];
                                console.log(lines);
                                console.log(lines1);
                                map[0].drawMigration(data,lines,lines1);

                            } });*/
                    }
                    else {
                        console.log("minus")
                        d3.select(this).style("opacity", "0");

                        var data = {}, lines = [], bdData;
                        var currentIndex = 0;

                        function test1(data) {
                            if (currentIndex >= request_days.length) {
                                console.log(data);
                                map[0].drawDistrict(data, bdData);
                                map[0].drawDisDis(data, lines);
                                //map[0].drawMigration(data,lines,lines1);
                                return;
                            }
                            starttime = request_days[currentIndex];
                            end_time = request_days[currentIndex];
                            var start_month = months[starttime.split('-')[1]];
                            var begintime = starttime.split('-')[0] + "-" + start_month + "-" + starttime.split('-')[2] + "+" + start_hour;
                            //var end_month = months[end_time.split('-')[1]];
                            var endtime = end_time.split('-')[0] + "-" + start_month + "-" + end_time.split('-')[2] + "+" + end_hour;
                            var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=div&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime +"&v=v2";
                            console.log(get_url);
                            if (graph.nodes[0]) {
                                $.getJSON('/data/beijingBoundary.json', function (dt) {
                                    //map[0].drawBoundary(dt);
                                    bdData = dt;
                                    $.ajax({
                                        /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
                                        url: get_url,
                                        type: 'GET',
                                        contentType: "application/json",
                                        dataType: 'jsonp',
                                        success: function (dt) {
                                            console.log(dt);
                                            currentIndex++;
                                            data = reduceGraph(dt);
                                            lines = getLinePos(data);
                                            data = getNodes(data)
                                            //lines = [];
                                            console.log(lines);
                                            //console.log(lines1);
                                            test1(data);
                                        }
                                    });
                                });
                                /* $.ajax({
                                     /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
                                     url:get_url,
                                     type:'GET',
                                     contentType:"application/json",
                                     dataType:'jsonp',
                                     async:false,
                                     success:function (dt) {
                                         currentIndex++;
                                         console.log(dt);
                                         data = reduceGraph(dt);
                                         lines = process(data);
                                         lines1 = process1(data);
                                         //lines = [];
                                         data = getNodes(data);
                                         console.log(lines);
                                         console.log(lines1);
                                         test1(data);
                                         // map[0].drawMigration(data,lines,lines1);
                                     } });*/
                            }
                            else {
                                console.log("no graph exists")
                            }
                        }

                        test1(data);
                        /* $.ajax({
                             /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
                             url:get_url,
                             type:'GET',
                             contentType:"application/json",
                             dataType:'jsonp',
                             success:function (dt) {
                                 console.log(dt);
                                 var data = dt;
                                 //judge if graph is drawed or not
                                 if(graph.nodes){
                                     data = reduceGraph(dt);
                                     console.log(data);
                                 }
                                 else{
                                     console.log("error")
                                 }
                                 var lines = process(data);
                                 var lines1 = process1(data);
                                 data = getNodes(data)
                                 //lines = [];
                                 console.log(lines);
                                 console.log(lines1);
                                 map[0].drawMigration(data,lines,lines1);

                             } });
 */
                    }
                });

            g.append("path")
                .attr("d", arc)
                .attr("id", function (d, i) {
                    return "path" + i.toString();
                })
                .style('cursor', 'hand')
                .style("fill", "silver")
                .each(function (d, i) {
                    d.clicked = false;
                })
                .style("stroke", "grey")
                .style("stroke-width", '0px')
                .on('mouseover', function (d) {
                    d3.select(this).style("fill", "#eee");
                })
                .on("mouseout", function () {
                    d3.select(this).style("fill", "black");
                });
            this.clock = big_g;
        },
        'changeMonth': function (month) {
            console.log(month)
            maps.mapObj[0].edgefilter = 0;
            d3.select(".time-link").selectAll("a").style("background","white");
            //d3.select(".time-link").select(".a"+index.toString()).style("background","lightblue");
            d3.select(".time-selector").select(".time-clock").selectAll(".big_arc").style("opacity", '0');
            d3.selectAll(".handle--custom").attr("transform", "translate("+0+","+15+")");
            d3.select(".time-link").selectAll("a").style("background","white");
            d3.select(".time-link").selectAll("a").style("color","#777777");

            var parseDate = d3.timeParse("" +
                "%d %b %Y");
            if (month == "Jul") {
                this.x.domain([parseDate("05 Jul 2016"), parseDate("31 Jul 2016")]);
                this.x2.domain([parseDate("05 Jul 2016"), parseDate("31 Jul 2016")]);
                this.focus.select(".axis--x").call(this.xAxis);
                this.focus.select(".brush").call(this.brush.move, [0, 0]);
            }
            if (month == "Aug") {
                //console.log(changing);
                console.log(this.x);
                this.x.domain([parseDate("01 Aug 2016"), parseDate("31 Aug 2016")]);
                this.x2.domain([parseDate("01 Aug 2016"), parseDate("31 Aug 2016")]);
                this.focus.select(".axis--x").call(this.xAxis);
                this.focus.select(".brush").call(this.brush.move, [0, 0]);
                this.axis_left = parseDate("01 Aug 2016");
                this.axis_right = parseDate("08 Aug 2016")
            }
            else if (month == "Sep") {
                //console.log(changing);
                console.log(this.x);
                this.x.domain([parseDate("01 Sep 2016"), parseDate("30 Sep 2016")]);
                this.x2.domain([parseDate("01 Sep 2016"), parseDate("30 Sep 2016")]);
                this.focus.select(".axis--x").call(this.xAxis);
                this.focus.select(".brush").call(this.brush.move, [0, 0]);
                this.axis_left = parseDate("01 Sep 2016");
                this.axis_right = parseDate("08 Sep 2016")
            }
        },
        'changeDay':function (weekday) {
            d3.select(".time-link").selectAll("a").style("background","white");
            //d3.select(".time-link").select(".a"+index.toString()).style("background","lightblue");
            d3.select(".time-selector").select(".time-clock").selectAll(".big_arc").style("opacity", '0');
           // d3.selectAll(".handle--custom").attr("transform", "translate("+0+","+15+")");
            d3.select(".time-link").selectAll("a").style("background","white");
            d3.select(".time-link").selectAll("a").style("color","#777777");
            //starttime = request_days[currentIndex];
            //end_time = request_days[currentIndex];
            var parseDate = d3.timeParse("" +
                "%d %b %Y");
            start_hour = "00:00:00";
            end_hour = "23:59:59";
            if(weekday == "ALL"){
                this.x.domain([parseDate("11 Jul 2016"), parseDate("18 Jul 2016")]);

                this.focus.select(".axis--x").call(this.xAxis);
                //this.focus.select(".brush").call(this.brush.move, [0, 0]);
                this.focus.select(".brush").call(this.brush.move, [0, 605]);
                d3.selectAll(".handle--custom").each(function (d,i) {
                    var h = d3.select(this)
                    h.attr("transform",'translate('+605*i+','+15+')')
                });
                starttime = "2016-July-11-00:00";
                end_time = "2016-July-17-23:00";
            }
            if(weekday == "WORKDAY" ){
                console.log(parseDate("11 Jul 2016"))
                this.x.domain([parseDate("11 Jul 2016"), parseDate("18 Jul 2016")]);

                this.focus.select(".axis--x").call(this.xAxis);
                //this.focus.select(".brush").call(this.brush.move, [0, 0]);
                this.focus.select(".brush").call(this.brush.move, [0, 512]);
                d3.selectAll(".handle--custom").each(function (d,i) {
                    var h = d3.select(this)
                    h.attr("transform",'translate('+512*i+','+15+')')
                });
                starttime = "2016-July-11-00:00";
                end_time = "2016-July-15-23:00";
            }
            if(weekday == "WEEKEND"){
                var t = [282,605]
                this.x.domain([parseDate("11 Jul 2016"), parseDate("18 Jul 2016")]);

                this.focus.select(".axis--x").call(this.xAxis);
                this.focus.select(".brush").call(this.brush.move, [282, 605]);
                d3.selectAll(".handle--custom").each(function (d,i) {
                    var h = d3.select(this)
                    h.attr("transform",'translate('+t[i]+','+15+')')
                });
                starttime = "2016-July-16-00:00";
                end_time = "2016-July-17-23:00";
            }
            var start_month = months[starttime.split('-')[1]];
            var begintime = starttime.split('-')[0] + "-" + start_month + "-" + starttime.split('-')[2] + "+" + start_hour;
            //var end_month = months[end_time.split('-')[1]];
            var endtime = end_time.split('-')[0] + "-" + start_month + "-" + end_time.split('-')[2] + "+" + end_hour;
            var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=div&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime+"&v=v2";
            console.log(get_url)
            var bdData;
            $.getJSON('/data/beijingBoundary.json', function (d) {
                //map[0].drawBoundary(dt);
                bdData = d;
                $.ajax({
                    /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
                    url: get_url,
                    type: 'GET',
                    contentType: "application/json",
                    dataType: 'jsonp',
                    success: function (dt) {
                        var data = getNodes(dt);
                        console.log(dt);
                        var lines = getLinePos(dt);

                        console.log(lines);
                        map[0].drawDistrict(data, bdData,false);
                        map[0].drawDisDis(data, lines);


                    }
                });
            });

        },
        'leftTran': function () {
            var parseDate = d3.timeParse("" +
                "%d %b %Y");
            d3.selectAll(".handle--custom").attr("transform", "translate("+0+","+15+")");
            function processDate(date) {
                date = date.toString();
                var temptime = date.split(" ");
                return temptime[2] + " " + temptime[1] + " " + temptime[3];
            }

            // this.x.domain([parseDate(this.axis_left.setDate(this.axis_left.getDate()-7)),parseDate(this.axis_right.setDate(this.axis_right.getDate()-7))]);
            this.x.domain([parseDate(processDate(this.axis_left.setDate(this.axis_left.getDate() - 7))), parseDate(processDate(this.axis_right.setDate(this.axis_right.getDate()-7)))]);
            this.x2.domain([parseDate(processDate(this.axis_left)), parseDate(processDate(this.axis_right))]);

//            this.x2.domain([parseDate(this.axis_left),parseDate(this.axis_right)]);

            //var xAxis = d3.axisBottom(x);
            this.focus.select(".axis--x").call(this.xAxis);
            this.focus.select(".brush").call(this.brush.move, [0, 0]);
        },
        'rightTran': function () {
            var parseDate = d3.timeParse("" +
                "%d %b %Y");
            d3.selectAll(".handle--custom").attr("transform", "translate("+0+","+15+")");
            function processDate(date) {
                date = date.toString();
                var temptime = date.split(" ");
                return temptime[2] + " " + temptime[1] + " " + temptime[3];
            }

// this.x.domain([parseDate(this.axis_left.setDate(this.axis_left.getDate()-7)),parseDate(this.axis_right.setDate(this.axis_right.getDate()-7))]);
            this.x.domain([parseDate(processDate(this.axis_left.setDate(this.axis_left.getDate() +7 ))), parseDate(processDate(this.axis_right.setDate(this.axis_right.getDate() + 7)))]);
            this.x2.domain([parseDate(processDate(this.axis_left)), parseDate(processDate(this.axis_right))]);

//            this.x2.domain([parseDate(this.axis_left),parseDate(this.axis_right)]);

//var xAxis = d3.axisBottom(x);
            this.focus.select(".axis--x").call(this.xAxis);
            this.focus.select(".brush").call(this.brush.move, [0, 0]);
        },
        'drawTimeAxis': function () {

                var margin = {top: 10, right: 30, bottom: 40, left: 15},
                    margin2 = {top: 10, right: 30, bottom: 40, left: 15},
                    width = 650 - margin.left - margin.right,
                    height = 80 - margin.top - margin.bottom,
                    height2 = 80 - margin.top - margin.bottom;
                var svg = d3.select("body").select(".time-option").select(".timeAxis")
                    .append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", 100)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                var parseDate = d3.timeParse("" +
                    "%d %b %Y");

                var x = d3.scaleTime()
                        .domain([parseDate("11 Jul 2016"), parseDate("18 Jul 2016")])
                        .rangeRound([0, width]),
                    x2 = d3.scaleTime().domain([parseDate("11 Jul 2016"), parseDate("18 Jul 2016")])
                        .rangeRound([0, width]),
                    y = d3.scaleLinear()
                        .domain([0, 10])
                        .rangeRound([height, 0]);
                //y2 = d3.scaleLinear().range([height2, 0]);
                this.x = x;
                this.x2 = x2;
                this.axis_left = parseDate("05 Jul 2016");
                this.axis_right = parseDate("12 Jul 2016")
                console.log(x2.range())
                var xAxis = d3.axisBottom(x),
                    xAxis2 = d3.axisBottom(x2),
                    yAxis = d3.axisLeft(y);


                var zoom = d3.zoom()
                    .scaleExtent([1, 6])
                    .translateExtent([[0, 0], [width, height]])
                    .extent([[0, 0], [width, height]])
                    .on("zoom", zoomed);
                /* svg.append("rect")
                     .attr("class", "zoom")
                     .attr("width", width)
                     .attr("height", 20)
                     .attr("fill","steelblue")
                     .attr("opacity","1")
                     .attr("transform", "translate(" + margin.left + "," + (height-margin.top) + ")")
                     .call(zoom);*/
                var brush = d3.brushX()
                    .extent([[0, 0], [width, height2]])
                    .on("brush end", brushed);

                var focusBrush = d3.brushX()
                    .extent([[0, 0], [width, height]])
                    .on("start ",startbrush)
                    .on("brush", focusbrushed)
                    .on("end", getRequestDays);


            var area = d3.area()
                    .curve(d3.curveMonotoneX)
                    .x(function (d) {
                        return x(d.date);
                    })
                    .y0(height)
                    .y1(function (d) {
                        return 3;
                    });

                svg.append("defs").append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", width)
                    .attr("height", height);

                var focus = svg.append("g")
                    .attr("class", "focus")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                /*  var context = svg.append("g")
                      .attr("class", "context")
                      .attr("transform", "translate(" + margin2.left + "," + margin2.top + ")");

            */
                /* x.domain([parseDate("05 Jul 2016"),parseDate("11 Jul 2016")]);
                var cpx = x;*/
                // x2.domain(x.domain())
                /*  x.domain(d3.extent(data, function(d) { return d.date; }));
                    y.domain([0, d3.max(data, function(d) { return d.price; })]);
                    x2.domain(x.domain());
                    y2.domain(y.domain());

                    focus.append("path")
                        .datum(data)
                        .attr("class", "area")
                        .attr("d", area);*/

                focus.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + height + ")")
                    .call(xAxis);

                focus.append("g")
                    .attr("class", "axis axis--y")
                    .call(yAxis);


                /* context.append("path")
                     .datum(data)
                     .attr("class", "area")
                     .attr("d", area2);*/

                /*context.append("g")
                    .attr("class", "axis axis--x")
                    .attr("transform", "translate(0," + height2 + ")")
                    .call(xAxis2);*/
                /* console.log(x.range())
                 context.append("g")
                     .attr("class", "brush")
                     .call(brush)
                     .call(brush.move, x.range());*/


                var gb = focus.append("g")
                    .attr("class", "brush")
                    .call(focusBrush);


            var handle = gb.selectAll(".handle--custom")
                .data([{type: "w"}, {type: "e"}])
                .enter().append("path")
                .attr("class", "handle--custom")
                .attr("fill", "#8C8C8C")
                .attr("fill-opacity", 0.8)
                .attr("stroke", "none")
                .attr("stroke-width", 1.5)
                .attr("cursor", "ew-resize")
                .attr("d", d3.arc()
                    .innerRadius(0)
                    .outerRadius(height / 2)
                    .startAngle(0)
                    .endAngle(function(d, i) {
                        return i ? Math.PI : -Math.PI;
                    })
                )
                .attr("transform", function (d,i) {
                    return "translate(" + 230*i + "," + height/2 + ")"
                });

        gb.call(brush.move,[0,230])
                .call(zoom);
            /* focus.append("rect")
                 .attr("class", "zoom")
                 .attr("width", width)
                 .attr("height", 60)
                 .attr("fill","steelblue")
                 .attr("opacity","1")
                 //.attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                 .call(zoom);*/
                var d0, d1;
                function startbrush() {
                    var s = d3.event.selection;
                    if (s == null) {
                        handle.attr("display", "none");
                        //circle.classed("active", false);
                    } else {
                        var sx = s.map(x.invert);
                        //circle.classed("active", function(d) { return sx[0] <= d && d <= sx[1]; });
                        handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + s[i] + "," + height / 2 + ")"; });
                    }
                }

                function focusbrushed() {
                    d3.select(".time-link").selectAll("a").style("background","white");
                    //d3.select(".time-link").select(".a"+index.toString()).style("background","lightblue");
                    if (d3.event.sourceEvent.type === "brush") return;
                    console.log(x.invert)
                    var s = d3.event.selection;

                    d0 = d3.event.selection.map(x.invert);
                    d1 = d0.map(d3.timeDay.round);
                    console.log(d1);
                    // If empty when rounded, use floor instead.
                    if (d1[0] >= d1[1]) {
                        d1[0] = d3.timeDay.floor(d0[0]);
                        d1[1] = d3.timeDay.offset(d1[0]);
                    }
                    d3.select(this).call(d3.event.target.move, d1.map(x));
                    if (s == null) {
                        handle.attr("display", "none");
                        //circle.classed("active", false);
                    }
                    else{
                        handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + x(d1[i]) + "," + height / 2 + ")"; });
                    }

                    //circle.classed("active", function(d) { return sx[0] <= d && d <= sx[1]; });

                    /*while (d1[0]<=d1[1]){
                        request_days.push(d1[0]++);
                    }*/

                    //this.axis_left = d1[0].setDate(d1[0].getDate()-30);
                    //this.axis_right = d1[1];
                    starttime = d1[0].toString();
                    var temptime = starttime.split(" ");
                    var sdate = temptime[2];
                    starttime = temptime[3] + "-" + temptime[1] + "-" + temptime[2];
                    end_time = d1[1].toString();
                    temptime = end_time.split(" ");
                    var edate = temptime[2];
                    if (edate[1] != '0') {
                        temptime[2] = edate[0] + (parseInt(edate[1]) - 1).toString();
                    }
                    else {
                        temptime[2] = parseInt(edate[0] - 1).toString() + "9";
                    }
                    end_time = temptime[3] + "-" + temptime[1] + "-" + temptime[2];
                }

                function getRequestDays() {

                    //var s = d3.event.selection;
                    //handle.attr("display", null).attr("transform", function(d, i) { return "translate(" + s[i] + "," + height / 2 + ")"; });

                    request_days = [];
                    d3.select(".time-selector").select(".time-clock").selectAll(".big_arc").style("opacity", '0');
                    d3.select(".time-link").selectAll("a").style("background","white");
                    d3.select(".time-link").selectAll("a").style("color","#777777");

                    graph = {};

                    function processDate(date) {
                        date = date.toString();
                        var temptime = date.split(" ");
                        return temptime[3] + "-" + temptime[1] + "-" + temptime[2];
                    }

                    while (true) {
                        request_days.push(processDate(d1[0]))
                        d1[0].setDate(d1[0].getDate() + 1);
                        if (d1[0].toString() == d1[1].toString()) {
                            break;
                        }

                    }
                    console.log(request_days);
                }

                function brushed() {
                    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "zoom") return; // ignore brush-by-zoom
                    var s = d3.event.selection || x2.range();
                    x.domain(s.map(x2.invert, x2));
                    focus.select(".area").attr("d", area);
                    focus.select(".axis--x").call(xAxis);
                    svg.select(".zoom").call(zoom.transform, d3.zoomIdentity
                        .scale(width / (s[1] - s[0]))
                        .translate(-s[0], 0));
                }

                function zoomed() {
                    if (d3.event.sourceEvent && d3.event.sourceEvent.type === "brush") {
                        console.log("filter!")
                        return;
                    } // ignore zoom-by-brush
                    var t = d3.event.transform;
                    console.log(t);
                    x.domain(t.rescaleX(x2).domain());
                   // x.range().map(t.invertX, t);
                    focus.select(".area").attr("d", area);
                    focus.select(".axis--x").call(xAxis);
                    focus.select(".brush").call(brush.move, [0, 0]);
                    d3.selectAll(".handle--custom").attr("transform","translate("+0+","+25+")");                    //context.select(".brush").call(brush.move, x.range().map(t.invertX, t));
                }

                this.brush = brush;
                this.focus = focus;
                this.xAxis = xAxis;

            }

        ,
        'brush': function () {
                maps.loading = !maps.loading;
                if (d3.select(".time-option").select("svg").select(".zoom").attr("fill") == "steelblue") {
                    d3.select(".time-option").select("svg").select(".zoom").attr("fill", "none");
                }
                else {

                    d3.select(".time-option").select("svg").select(".zoom").attr("fill", "steelblue");

                }
            },
        'changeTI': function (index) {
                var g = this.clock;
                console.log(g);
                var start_hour = "07:00:00", end_hour = "10:00:00";
                var interval_set = [];
                maps.mapObj[0].edgefilter = 0;
               function showClock(interval_set) {
                    for (var i = 0; i < 24; i++) {
                        var flag = false;
                        if (interval_set.length == 0) break;
                        interval_set.forEach(function (d) {
                            if (d == i) {
                                flag = true;
                                console.log(g.select('#big-path' + d.toString()).style("opacity"))
                                g.select('#big-path' + d.toString()).style("opacity", '1');
                                console.log(g.select('#big-path' + d.toString()).style("opacity"))

                            }
                        });
                        if (!flag) {
                            g.select('#big-path' + i.toString()).style("opacity", '0');
                        }
                    }
                }

                if (index == 0) {
                    console.log(this.clock);
                    this.clock.selectAll(".big_arc").style("opacity", '1');
                    start_hour = "00:00:00";
                    end_hour = "23:59:59";
                }
                if (index == 1) {
                    this.clock.selectAll(".big_arc").style("opacity", '0');
                    start_hour = "00:00:00";
                    end_hour = "00:00:00";
                }
                if (index == 2) {
                    interval_set = [0, 1, 2, 3, 4, 5, 6, 7, 23, 22, 21, 20, 19];
                    //showClock(interval_set);
                    start_hour = "07:00:00";
                    end_hour = "20:00:00";
                }
                if (index == 3) {
                    interval_set = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18];
                    //showClock(interval_set);
                    // to be added not full!
                    start_hour = "20:00:00";
                    end_hour = "23:59:59";
                }
                if (index == 4) {
                    interval_set = [19, 20, 21];
                    //showClock(interval_set);
                    start_hour = "07:00:00";
                    end_hour = "10:00:00";
                }
                if (index == 5) {
                    console.log(index);
                    interval_set = [5, 6, 7];
                    //showClock(interval_set);
                    start_hour = "17:00:00";
                    end_hour = "20:00:00";
                }
                if (index == 6) {
                    interval_set = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
                    //showClock(interval_set);
                    // not full 0-3 not included
                    start_hour = "18:00:00";
                    end_hour = "23:59:59";
                }
                if (index == 7) {
                    interval_set = [0, 1, 2, 3, 23, 22, 21, 20];
                    //showClock(interval_set);
                    start_hour = "08:00:00";
                    end_hour = "16:00:00";
                }
                if (index == 8) {
                    interval_set = [4, 5, 6, 7, 8, 9, 10, 11];
                    //showClock(interval_set);
                    start_hour = "16:00:00";
                    end_hour = "23:59:59";
                }
                if (index == 9) {
                    interval_set = [12, 13, 14, 15, 16, 17, 18, 19];
                    //showClock(interval_set);
                    start_hour = "00:00:00";
                    end_hour = "08:00:00";
                }
                var bdData;
                var data = {}, lines = [], lines1 = [];
                var currentIndex = 0;
                graph = {};

                function test(data) {
                    if (currentIndex >= request_days.length) {
                        console.log(data);
                        console.log(interval_set);
                        d3.select(".time-link").selectAll("a").style("background","white");
                        d3.select(".time-link").selectAll("a").style("color","#777777");

                        d3.select(".time-link").select(".a"+index.toString()).style("background","#ED5858");
                        d3.select(".time-link").select(".a"+index.toString()).style("color","white");

                        showClock(interval_set);
                        map[0].drawDistrict(data, bdData);
                        map[0].drawDisDis(data, lines);
                        //map[0].drawMigration(data,lines,lines1);
                        return;
                    }
                    starttime = request_days[currentIndex];
                    end_time = request_days[currentIndex];
                    var start_month = months[starttime.split('-')[1]];
                    var begintime = starttime.split('-')[0] + "-" + start_month + "-" + starttime.split('-')[2] + "+" + start_hour;
                    //var end_month = months[end_time.split('-')[1]];
                    var endtime = end_time.split('-')[0] + "-" + start_month + "-" + end_time.split('-')[2] + "+" + end_hour;
                    var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=div&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime+"&v=v2";
                    console.log(get_url);
                    if (currentIndex == 0) {
                        $.getJSON('/data/beijingBoundary.json', function (dt) {
                            //map[0].drawBoundary(dt);
                            bdData = dt;
                            $.ajax({
                                /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
                                url: get_url,
                                type: 'GET',
                                contentType: "application/json",
                                dataType: 'jsonp',
                                success: function (dt) {
                                    console.log(dt);
                                    currentIndex++;
                                    //data = getNodes(dt);
                                    lines = getLinePos(dt);
                                    data = getNodes(dt);
                                    //lines = [];
                                    graph = data;
                                    test(data)
                                    console.log(lines);

                                }
                            });
                        });
                        /* $.ajax({
                             /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
                             url:get_url,
                             type:'GET',
                             contentType:"application/json",
                             dataType:'jsonp',
                             async:false,
                             success:function (dt) {
                                 currentIndex++;
                                 console.log(dt);
                                 lines = process(dt);
                                 lines1 = process1(dt);
                                 //lines = [];
                                 data = getNodes(dt);
                                 console.log(lines);
                                 console.log(lines1);
                                 graph = data;
                                 test(data);
                                 //  map[0].drawMigration(data,lines,lines1);
                             } });*/
                    }
                    else {
                        $.getJSON('/data/beijingBoundary.json', function (dt) {
                            //map[0].drawBoundary(dt);
                            bdData = dt;
                            $.ajax({
                                /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
                                url: get_url,
                                type: 'GET',
                                contentType: "application/json",
                                dataType: 'jsonp',
                                success: function (dt) {
                                    console.log(dt);
                                    currentIndex++;
                                    data = updateGraph(dt);
                                    lines = getLinePos(data);
                                    data = getNodes(data);
                                    test(data)
                                    console.log(lines);

                                }
                            });
                        });
                        /* $.ajax({
                             /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
                             url:get_url,
                             type:'GET',
                             contentType:"application/json",
                             dataType:'jsonp',
                             async:false,
                             success:function (dt) {
                                 currentIndex++;
                                 console.log(dt);
                                 data = updateGraph(dt);
                                 lines = process(data);
                                 lines1 = process1(data);
                                 //lines = [];
                                 data = getNodes(data);
                                 console.log(lines);
                                 console.log(lines1);
                                 test(data);
                                 // map[0].drawMigration(data,lines,lines1);
                             } });*/
                    }
                }

                test(data);


                /*      var data={},lines=[],lines1=[];
                      var currentIndex = 0;
                      graph = {};
                      function test(data) {
                          if(currentIndex >= request_days.length){
                              console.log(data);
                              console.log(interval_set);
                              showClock(interval_set);
                              map[0].drawMigration(data,lines,lines1);
                              return;
                          }
                          starttime = request_days[currentIndex];
                          end_time = request_days[currentIndex];
                          var start_month = months[starttime.split('-')[1]];
                          var begintime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+start_hour;
                          //var end_month = months[end_time.split('-')[1]];
                          var endtime = end_time.split('-')[0]+"-"+start_month+"-"+end_time.split('-')[2]+"+"+end_hour;
                          var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime="+begintime+"&endTime="+endtime;
                          console.log(get_url);
                          if(currentIndex == 0){
                              $.ajax({
                                  /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
                                  url:get_url,
                                  type:'GET',
                                  contentType:"application/json",
                                  dataType:'jsonp',
                                  async:false,
                                  success:function (dt) {
                                      currentIndex++;
                                      console.log(dt);
                                      lines = process(dt);
                                      lines1 = process1(dt);
                                      //lines = [];
                                      data = getNodes(dt);
                                      console.log(lines);
                                      console.log(lines1);
                                      graph = data;
                                      test(data);
                                      //  map[0].drawMigration(data,lines,lines1);
                                  } });
                          }
                          else{
                              $.ajax({
                                  /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
                                  url:get_url,
                                  type:'GET',
                                  contentType:"application/json",
                                  dataType:'jsonp',
                                  async:false,
                                  success:function (dt) {
                                      currentIndex++;
                                      console.log(dt);
                                      data = updateGraph(dt);
                                      lines = process(data);
                                      lines1 = process1(data);
                                      //lines = [];
                                      data = getNodes(data);
                                      console.log(lines);
                                      console.log(lines1);
                                      test(data);
                                      // map[0].drawMigration(data,lines,lines1);
                                  } });
                          }
                      }
                      test(data);*/
            }
    },
    computed: {
        mapClass: function () {
            let mapNumber = maps.mapObj.length;
            if (mapNumber == 1) {
                return 'onemap';
            } else if (mapNumber == 2) {
                return 'twomap';
            } else {
                return 'formap';
            }
        }
    }
    ,
    mounted() {
        let self = this;
        console.log("mounted")
        this.drawClock();
        this.drawTimeAxis();
        //drawEdgeAxis();
        /* var margin = {top: 20, right: 10, bottom: 20, left: 4},
             width = 330- margin.left - margin.right,
             height = 60 - margin.top - margin.bottom;

         var x = d3.scaleLinear()
             .domain([6, 24])
             .rangeRound([0, width]);

         var svg = d3.select("body").select("#hour-selector").append("svg")
             .attr("width", width + margin.left + margin.right)
             .attr("height", height + margin.top + margin.bottom)
             .append("g")
             .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

         svg.append("g")
             .attr("class", "axis axis--grid")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(x)
                 .ticks(20)
                 .tickSize(-height)
                 .tickFormat(function() { return null; }))
             .selectAll(".tick")
             .classed("tick--minor", function(d) { return d; });

         svg.append("g")
             .attr("class", "axis axis--x")
             .attr("transform", "translate(0," + height + ")")
             .call(d3.axisBottom(x)
                 .ticks(20)
                 .tickPadding(0))
             .attr("text-anchor", null)
             .selectAll("text")
             .attr("x", 0);

         svg.append("g")
             .attr("class", "brush")
             .call(d3.brushX()
                 .extent([[0, 0], [width, height]])
                 .on("brush", brushed)
                 .on("end",draw))
             .call(d3.brushX().move,[18,35])
         var d0,d1;
         var start_hour = "07:00:00",end_hour = "09:00:00";
         var count = 0;
         function brushed() {
             if (d3.event.sourceEvent.type === "brush") return;
             d0 = d3.event.selection.map(x.invert);
                 d1 = d0.map(Math.round);
             console.log(d1);
             // If empty when rounded, use floor instead.
             if (d1[0] >= d1[1]) {
                 d1[0] = Math.floor(d0[0]);
                 d1[1] = Math.offset(d1[0]);
             }

             d3.select(this).call(d3.event.target.move, d1.map(x));
             start_hour = d1[0];
             end_hour = d1[1];
             if(start_hour<10){
                 start_hour = "0"+start_hour.toString()+":00"+":00";
             }
             else{
                 start_hour = start_hour.toString()+":00"+":00";
             }
             if(end_hour<10){
                 end_hour = "0"+end_hour.toString()+":00"+":00";
             }
             else{
                 end_hour = end_hour.toString()+":00"+":00";
             }
         }
         function draw() {
             var start_month = months[starttime.split('-')[1]];
             var begintime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+start_hour;
             //var end_month = months[end_time.split('-')[1]];
             var endtime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+end_hour;
             var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime="+begintime+"&endTime="+endtime;
             console.log(get_url);
             $.ajax({
                 /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
                 url:get_url,
                 type:'GET',
                 contentType:"application/json",
                 dataType:'jsonp',
                 success:function (dt) {
                     console.log(dt);
                     var lines = process(dt);
                     var lines1 = process1(dt);
                     var data = getNodes(dt)
                     //lines = [];
                     console.log(lines);
                     console.log(lines1);
                     map[0].drawMigration(data,lines,lines1);

                 } });
         }*/


        this.$nextTick(function () {
            let self = this;
            map[0] = new mapview('map0');
            var bdData;
            var start_hour = "07:00:00", end_hour = "10:00:00";
            var start_month = months[starttime.split('-')[1]];
            var begintime = starttime.split('-')[0] + "-" + start_month + "-" + starttime.split('-')[2] + "+" + start_hour;
            //var end_month = months[end_time.split('-')[1]];
            var endtime = end_time.split('-')[0] + "-" + start_month + "-" + end_time.split('-')[2] + "+" + end_hour;
            var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=div&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime +"&v=v2";
            console.log(get_url);
            var poi_to_div_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=poi_to_div&timeType=duration&netType=basic&other=poi_to_div_demo&beginTime=" + begintime + "&endTime=" + endtime +"&v=v2";
            var div_to_poi_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=div_to_poi&timeType=duration&netType=basic&other=div_to_poi_demo&beginTime=" + begintime + "&endTime=" + endtime +"&v=v2";
            $.getJSON('/data/beijingBoundary.json', function (d) {
                //map[0].drawBoundary(dt);
                bdData = d;

                $.ajax({
                    /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
                    url: get_url,
                    type: 'GET',
                    contentType: "application/json",
                    dataType: 'jsonp',
                    async:false,
                    success: function (dt) {

                        var data = getNodes(dt)
                        //lines = [];
                        graph = data;
                        console.log(dt);
                        var lines = getLinePos(dt);
                        console.log(lines);
                        //console.log(lines1);
                       map[0].drawDistrict(data, bdData);
                        map[0].drawDisDis(data, lines);
                        maps.mapObj[0].maxedgefilter = lines.length-1;
                        var sort_lines = sortline(lines,graph.nodes)
                        drawEdgeAxis(sort_lines);
                        $.ajax({
                         url: poi_to_div_url,
                         type: 'GET',
                         contentType: "application/json",
                         dataType: 'jsonp',
                         async:false,
                         success: function (dd) {

                             $.ajax({
                                url :div_to_poi_url,
                                type:'GET',
                                contentType:'application/json',
                                dataType:'jsonp',
                                async:false,
                                success:function (d) {
                                    var  poi_to_div_data = processPoiToDiv(dd);
                                    var div_to_poi_line = processDivToPoi(d);
                                    var type = "com";
                                    div_to_poi_line.forEach(function (line) {
                                        poi_to_div_data.edges[0].push(line);
                                    })
                                    //poi_to_div_data = processPoiToDiv(poi_to_div_data);
                                    map[0].drawPoiToDiv(poi_to_div_data);
                                    maps.mapObj[0].maxComEdgefilter = poi_to_div_data.nodes[0].length*2 + poi_to_div_data.edges[0].length-1;
                                    var com_sort_lines = sortline(poi_to_div_data.edges[0],poi_to_div_data.nodes[0],type)
                                    map[0].com_sort_lines = com_sort_lines;
                                    drawEdgeAxis(com_sort_lines,type);
                                }
                            })

                         }
                    })
                    }
                });




                /*$.getJSON('/data/sample.json',function (dt1) {
                    map[0].drawDistrict(dt1,dt);
                    var lines = process2(dt1);
                    var lines1 = process1(dt1);


                    })*/
            });
            /*getdata(poi_to_div_url).then(function (res) {
                var  data = processPoiToDiv(res);
                map[0].drawPoiToDiv(data);
            })*/


            /*       console.log(bdData)

                   console.log(starttime);
                   console.log(end_time);
                   var start_month = months[starttime.split('-')[1]];
                   var begintime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+start_hour;
                   var end_month = months[end_time.split('-')[1]];
                   var endtime = end_time.split('-')[0]+"-"+end_month+"-"+end_time.split('-')[2]+"+"+end_hour;
                   var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime="+begintime+"&endTime="+endtime;
                   console.log(get_url);
                   self.getView(get_url);*/

        });
    }
    ,
    updated() {

        let self = this;
        console.log(maps.mapObj.length)
        console.log("update!")
        let mapobjs = maps.mapObj;
        let len = mapobjs.length;
        /*for(var i=0;i<len;i++){
            maps.mapObj[i].edgefilter = 0;
        }*/

        if (len >= 2) {
            map[0].invalidateSize();
        }
        $.getJSON('/data/beijingBoundary.json', function (data) {
            for (var i = 1; i < len; i++) {
                map[i] = new mapview('map' + i.toString());
                //map[i].drawBoundary(data);
                $.ajax({
                    url: 'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-10+07%3A00%3A00&endTime=2016-07-10+10%3A00%3A00',
                    type: 'GET',
                    contentType: "application/json",
                    dataType: 'jsonp',
                    success: function (dt) {
                        console.log(dt);
                        var lines = process(dt);
                        var lines1 = process1(dt);
                        var data = getNodes(dt);
                        //lines = [];
                        console.log(lines);
                        console.log(lines1);
                        map[1].drawMigration(data, lines, lines1);
                    }
                });
            }
        });
    }

})




