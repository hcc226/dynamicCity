import {maps} from "../init/mapVueInit"
import {objClone,sortline,getNodes,getLinePos,updateGraph,processPoiToDiv,processDivToPoi} from '../processData/processData'
import {disAxis,comAxis,request_days} from "../init"
import {getColor} from "../calculate/calculateColor"
import {mapview} from "../drawMap/mapLayout"
class clockView{
    constructor(map){
        var months = {'July': '07', 'August': '08', 'September': '09', 'Jul': "07", 'Aug': "08", 'Sep': "09"};
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

        var request_day = request_days[0]
        var day = months[request_day.split('-')[1]];
        day = request_day.split('-')[0] + "-" + day + "-" + request_day.split('-')[2];

        $.getJSON("/data/flowCount.json",function (d) {
            var data = d.data;
            data.forEach(function (object) {
                if (object.date == day) {
                    var flowNum = object.flowCount;
                    var min = d3.min(flowNum);
                    var max = d3.max(flowNum);
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
                        .style("fill", function (d, i) {
                            d.color = getColor(1, 0.2, (flowNum[(i + 12) % 24] - min) / (max - min));
                            return getColor(1, 0.2, (flowNum[(i + 12) % 24] - min) / (max - min))
                        })
                        .style("opacity", function (d, i) {
                            if (i === 0 || i === 1 ) {
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
                            d3.select(this).style("fill", function () {
                                return d.color;
                            });
                            g.select("#path" + i.toString()).style("fill", function () {
                                return d.color
                            });
                        })
                        .on("click", function (d, i) {
                            d3.select(".time-selector").select(".time-clock").selectAll(".big_arc").style("opacity", '0');
                            // d3.selectAll(".handle--custom").attr("transform", "translate("+0+","+15+")");
                            d3.select(".time-link").selectAll("a").style("background", "white");
                            d3.select(".time-link").selectAll("a").style("color", "#777777");
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

                                var bdData;
                                var data = {}, lines = [], lines1 = [];
                                var currentIndex = 0;
                                maps.mapObj[0].graph = {};
                                var poi_to_div_data = [];

                                function test(data) {
                                    if (currentIndex >= request_days.length) {
                                        console.log(data);
                                        d3.select(".time-link").selectAll("a").style("background", "white");
                                        d3.select(".time-link").selectAll("a").style("color", "#777777");

                                        /*d3.select(".time-link").select(".a"+index.toString()).style("background","#ED5858");
                                        d3.select(".time-link").select(".a"+index.toString()).style("color","white");*/

                                        map.drawDistrict(data, bdData, false);
                                        map.drawDisDis(data, lines);
                                        console.log("line length")
                                        console.log(lines.length)
                                        maps.mapObj[0].edgefilter = lines.length - 1;
                                        maps.mapObj[0].maxedgefilter = lines.length - 1;
                                        var sort_lines = sortline(lines, maps.mapObj[0].graph.nodes)
                                        disAxis.updateData(sort_lines)
                                        var type = "com";
                                        map.drawPoiToDiv(poi_to_div_data);
                                        maps.mapObj[0].comEdgefilter = poi_to_div_data.nodes[0].length * 2 - 1;
                                        maps.mapObj[0].maxComEdgefilter = poi_to_div_data.nodes[0].length * 2 - 1;
                                        var com_sort_lines = sortline(poi_to_div_data.edges[0], poi_to_div_data.nodes[0], type)
                                        map.com_sort_lines = com_sort_lines;
                                        comAxis.updateData(com_sort_lines);


                                        //map[0].drawMigration(data,lines,lines1);
                                        return;
                                    }
                                    var starttime = request_days[currentIndex];
                                    var end_time = request_days[currentIndex];
                                    var start_month = months[starttime.split('-')[1]];
                                    var begintime = starttime.split('-')[0] + "-" + start_month + "-" + starttime.split('-')[2] + "+" + start_hour;
                                    //var end_month = months[end_time.split('-')[1]];
                                    var endtime = end_time.split('-')[0] + "-" + start_month + "-" + end_time.split('-')[2] + "+" + end_hour;
                                    var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=div&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime + "&v=v2";
                                    var poi_to_div_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=poi_to_div&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime + "&v=v2";
                                    console.log(poi_to_div_url)
                                    var div_to_poi_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=div_to_poi&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime + "&v=v2";
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
                                                    data = getNodes(dt);
                                                    //data = getNodes(dt);
                                                    lines = getLinePos(dt);

                                                    //lines = [];
                                                    maps.mapObj[0].graph = data;


                                                    $.ajax({
                                                        url: poi_to_div_url,
                                                        type: 'GET',
                                                        contentType: "application/json",
                                                        dataType: 'jsonp',
                                                        async: false,
                                                        success: function (dd) {
                                                            $.ajax({
                                                                url: div_to_poi_url,
                                                                type: 'GET',
                                                                contentType: 'application/json',
                                                                dataType: 'jsonp',
                                                                async: false,
                                                                success: function (d) {
                                                                    var poi_to_div_data0 = {};
                                                                    var div_to_poi_line = processDivToPoi(d);
                                                                    console.log(div_to_poi_line)

                                                                    poi_to_div_data0.edges = [[]];
                                                                    var a = dd.edges[0];
                                                                    div_to_poi_line.forEach(function (line) {
                                                                        a.push(line);
                                                                    })
                                                                    poi_to_div_data0.edges[0] = a;
                                                                    poi_to_div_data0.nodes = dd.nodes;
                                                                    console.log("poi_to_data0 is ")
                                                                    console.log(poi_to_div_data0)
                                                                    poi_to_div_data = processPoiToDiv(poi_to_div_data0);
                                                                    test(data);
                                                                }
                                                            })

                                                        }
                                                    })

                                                }
                                            });
                                        });
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
                                                    lines = getLinePos(data, false);
                                                    data = getNodes(data, false);
                                                    test(data)
                                                    console.log(lines);

                                                }
                                            });
                                        });
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
                                d3.select(self.map.getPanes().overlayPane).select("svg").remove();
                                /* var data = {}, lines = [], bdData;
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
                                                 /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
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
                                         /!* $.ajax({
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
                                              } });*!/
                                     }
                                     else {
                                         console.log("no graph exists")
                                     }
                                 }

                                 test1(data);*/
                            }
                        });

                    g.append("path")
                        .attr("d", arc)
                        .attr("id", function (d, i) {
                            return "path" + i.toString();
                        })
                        .style('cursor', 'hand')
                        .style("fill", function (d, i) {
                            d.color = getColor(1, 0.5, (flowNum[(i + 12) % 24] - min) / (max - min));
                            return getColor(1, 0.5, (flowNum[(i + 12) % 24] - min) / (max - min))
                        })
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
                }
            })
        })
        this.clock = big_g;
        this.smallClock = g;
    }
    update(){
        console.log("addColor")
        var months = {'July': '07', 'August': '08', 'September': '09', 'Jul': "07", 'Aug': "08", 'Sep': "09"};
        var request_day = request_days[0]
        var day = months[request_day.split('-')[1]];
        day = request_day.split('-')[0] + "-" + day + "-" + request_day.split('-')[2];
        var g = this.smallClock;
        var bigg = this.clock;
        $.getJSON("/data/flowCount.json",function (d) {
            var data = d.data;
            data.forEach(function (object) {
                if(object.date == day){
                    var flowNum = object.flowCount;
                    var min = d3.min(flowNum);
                    var max = d3.max(flowNum);
                    g.each(function (d,i) {
                        d3.select(this).select("path")
                            .style("fill",function (dd) {
                                dd.color = getColor(1,0.5,(flowNum[(i + 12) % 24]-min)/(max-min));
                                return getColor(1,0.5,(flowNum[(i + 12) % 24]-min)/(max-min))
                            })
                    })
                    bigg.each(function (d,i) {
                        d3.select(this).select("path")
                            .style("fill",function (dd) {
                                dd.color = getColor(1,0.5,(flowNum[(i + 12) % 24]-min)/(max-min))
                                return getColor(1,0.5,(flowNum[(i + 12) % 24]-min)/(max-min))
                            })
                    })
                }

            })
        })
    }
    changeTimeInterval(index,map){
        var months = {'July': '07', 'August': '08', 'September': '09', 'Jul': "07", 'Aug': "08", 'Sep': "09"};

        var g = d3.select(".time-clock");
        console.log(g);
        var start_hour = "12:00:00", end_hour = "14:00:00";
        var interval_set = [];
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
            interval_set = [18,19,20];
            //showClock(interval_set);
            start_hour = "06:00:00";
            end_hour = "09:00:00";
        }
        if (index == 3) {
            interval_set = [21,22,23];
            //showClock(interval_set);
            // to be added not full!
            start_hour = "09:00:00";
            end_hour = "12:00:00";
        }
        if (index == 4) {
            interval_set = [0, 1];
            //showClock(interval_set);
            start_hour = "12:00:00";
            end_hour = "14:00:00";
        }
        if (index == 5) {
            console.log(index);
            interval_set = [2,3,4];
            //showClock(interval_set);
            start_hour = "14:00:00";
            end_hour = "17:00:00";
        }
        if (index == 6) {
            interval_set = [5,6,7,8];
            //showClock(interval_set);
            // not full 0-3 not included
            start_hour = "17:00:00";
            end_hour = "21:00:00";
        }
        if (index == 7) {
            interval_set = [9,10,11];
            //showClock(interval_set);
            start_hour = "21:00:00";
            end_hour = "24:00:00";
        }
        if (index == 8) {
            interval_set = [12,13,14,15,16,17];
            //showClock(interval_set);
            start_hour = "00:00:00";
            end_hour = "06:00:00";
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
        maps.mapObj[0].graph = {};
        var poi_to_div_data = [];

        function test(data) {
            if (currentIndex >= request_days.length) {
                console.log(data);
                console.log(interval_set);
                d3.select(".time-link").selectAll("a").style("background","white");
                d3.select(".time-link").selectAll("a").style("color","#777777");

                d3.select(".time-link").select(".a"+index.toString()).style("background","#ED5858");
                d3.select(".time-link").select(".a"+index.toString()).style("color","white");

                showClock(interval_set);
                map.drawDistrict(data, bdData,false);
                map.drawDisDis(data, lines);
                console.log("line length")
                console.log(lines.length)
                maps.mapObj[0].edgefilter = lines.length-1;
                maps.mapObj[0].maxedgefilter = lines.length-1;
                var sort_lines = sortline(lines,maps.mapObj[0].graph.nodes)
                disAxis.updateData(sort_lines)
                var type = "com";
                map.drawPoiToDiv(poi_to_div_data);
                maps.mapObj[0].comEdgefilter = poi_to_div_data.nodes[0].length*2 -1;
                maps.mapObj[0].maxComEdgefilter = poi_to_div_data.nodes[0].length*2 -1;
                var com_sort_lines = sortline(poi_to_div_data.edges[0],poi_to_div_data.nodes[0],type)
                map.com_sort_lines = com_sort_lines;
                comAxis.updateData(com_sort_lines);


                //map[0].drawMigration(data,lines,lines1);
                return;
            }
            var starttime = request_days[currentIndex];
            var end_time = request_days[currentIndex];
            var start_month = months[starttime.split('-')[1]];
            var begintime = starttime.split('-')[0] + "-" + start_month + "-" + starttime.split('-')[2] + "+" + start_hour;
            //var end_month = months[end_time.split('-')[1]];
            var endtime = end_time.split('-')[0] + "-" + start_month + "-" + end_time.split('-')[2] + "+" + end_hour;
            var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=div&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime+"&v=v2";
            var poi_to_div_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=poi_to_div&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime +"&v=v2";
            console.log(poi_to_div_url)
            var div_to_poi_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=div_to_poi&timeType=duration&netType=basic&other=none&beginTime=" + begintime + "&endTime=" + endtime +"&v=v2";
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
                            data = getNodes(dt);
                            //data = getNodes(dt);
                            lines = getLinePos(dt);

                            //lines = [];
                            maps.mapObj[0].graph = data;


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
                                            var  poi_to_div_data0 = {};
                                            var div_to_poi_line = processDivToPoi(d);
                                            console.log(div_to_poi_line)

                                            poi_to_div_data0.edges = [[]];
                                            var a = dd.edges[0];
                                            div_to_poi_line.forEach(function (line) {
                                                a.push(line);
                                            })
                                            poi_to_div_data0.edges[0] = a;
                                            poi_to_div_data0.nodes = dd.nodes;
                                            console.log("poi_to_data0 is ")
                                            console.log(poi_to_div_data0)
                                            poi_to_div_data = processPoiToDiv(poi_to_div_data0);
                                            test(data);
                                        }
                                    })

                                }
                            })

                        }
                    });
                });
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
                            lines = getLinePos(data,false);
                            data = getNodes(data,false);
                            test(data)
                            console.log(lines);

                        }
                    });
                });
            }
        }
        test(data);
    }
}

export{clockView}