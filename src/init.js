//import {maps} from './prop'
import {mapview} from './drawMap/mapLayout'
import {objClone} from './processData/processData'
import Vue from 'vue'
import * as d3 from 'd3'
import vueSlider from 'vue-slider-component'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import {getdata,getdistrictData,getBoundary} from './processData/getData'

Vue.use(iView);
var starttime = "2016-July-05-07:00";
var end_time = "2016-July-05-09:00";
$(function () {
    $(".form_datetime").datetimepicker({
        language: "zh-CN",
        format: "yyyy-MM-dd",
        autoclose: true,
        todayBtn: true,
        startDate: "2016-07-05 00:00",
        minView:"month"

    }).on('changeDate', function(ev){

        starttime = $("#starttime").val();
        end_time = $("#endtime").val();
        //changeTime(starttime,end_time);
        console.log(starttime)
        console.log(end_time)
    });
});
var months = {'July':'07','August':'08','September':'09'};
var map = [];
console.log(maps)
var maps = {
    'mapObj' : [{
        'id': {
            'card': 'card0',
            'map': 'map0',
            'tab': 'tab0'
        },
        'visualRadius':100,
        'nodeStayFilter':0,
        'nodeInFilter':0,
        'nodeOutFilter':0,
        'edgefilter':0
    }
    ],
'stay_type':[ {
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
    'stay_default':'District',
    'travel_type':[ {
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
    'travel_default':'District-District',
    'years':[{
        value:2016,
        label:2016
    }],
    'year_default':2016,
    'months':[{
        value:'JULY',
        label:'JULY'
    },
        {
            value:'AUGUST',
            label:'AUGUST'
        },{
        value:'SEP',
            label:'SEPTEMBER'
        }],
    'month_default':'JULY',
    'weekdays':[{
        value:'ALL',
        label:'ALL'
    },
        {
            value:'WORKDAY',
            label:'WORKDAY'
        },{
        value:'WEEKEND',
            label:'WEEKEND'
        }],
    'weekday_default':'ALL'
}

function getNodes(data) {
    var resdata = data;
    var res = [];
    $.each(data.nodes,function (i,node) {
        var edges = data.edges;
        var new_node = node;
        new_node.in = 0;
        new_node.out = 0;
        for(var j = 0; j < edges.length; j++){
            if(edges[j].from_nid == new_node.id){
                new_node.out = new_node.out+1;
            }
            if(edges[j].to_nid == new_node.id){
                new_node.in = new_node.in+1;
            }
        }
        res.push(new_node);
    });
    resdata.nodes = res;
    return resdata;
}
function process(data) {
    var res = [];
    $.each(data.edges,function (j , edge) {
        var nodes = data.nodes;
        var link =  edge;
        //console.log(link.from_nid)
        var count = 0;
        if(link.to_nid === 438){
            for(var i = 0; i<nodes.length;i++){
                //console.log(nodes[i].nid)
                if(nodes[i].id === 438 ){
                    count ++;
                    //console.log("found!")
                    link.to_x = nodes[i].x;
                    link.to_y = nodes[i].y;
                    break;
                }
            }
        }
        for(var i = 0; i<nodes.length;i++){
            //console.log(nodes[i].nid)
            if(link.from_nid === nodes[i].id){
                count ++;
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
        if(count == 2)res.push(link);
    });
    console.log(res);
    return res;
}
function process1(data) {
    var res = [];
    $.each(data.edges,function (j , edge) {
        /*if(j >500){
            return res;
        }*/
        var nodes = data.nodes;
        var link =  edge;
        //console.log(link.from_nid)
        var count = 0;
        if(link.from_nid === 438){
            for(var i = 0; i<nodes.length;i++){
                if(nodes[i].id === 438 ){
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
        for(var i = 0; i<nodes.length;i++){
            //console.log(nodes[i].nid)
            if(link.to_nid === nodes[i].id){
                count ++;
                //console.log("found!")
                link.to_x = nodes[i].x;
                link.to_y = nodes[i].y;
                break;
            }
        }
        if(count == 2)res.push(link);
    });
    console.log(res);
    return res;
}
function process2(data) {
    var res = [];
    $.each(data.edges,function (j , edge) {
        /*if(j >500){
            return res;
        }*/
        var nodes = data.nodes;
        var link =  edge;
        //console.log(link.from_nid)

            for(var i = 0; i<nodes.length;i++){
                if(nodes[i].id === link.from_nid ){
                    link.from_x = nodes[i].x;
                    link.from_y = nodes[i].y;
                }
            }
        for(var i = 0; i<nodes.length;i++){
            //console.log(nodes[i].nid)
            if(link.to_nid === nodes[i].id){
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


const userpannel = new Vue({
    el:'#maindiv',
    data:maps,starttime, end_time, map,
    components:{
        vueSlider
},
    methods:{
        'addMap':function () {
            let self = this;
            let index = maps.mapObj.length;
            let obj   = objClone(maps.mapObj[index-1]);
            obj.id.card = 'card${index}';
            obj.id.map = 'map{index}';
            obj.id.tab = 'tab{index}';
            maps.mapObj.push(obj);
            console.log('map'+index.toString());
           // this.drawmap(self);
        },
        'changeTime':function (starttime,end_time) {
            console.log("changetime function")
        },
        'getOverview':function (begintime,endtime) {
            var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime="+begintime+"&endTime="+endtime;
            console.log(get_url);
            $.ajax({
                /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
                url:get_url,
                type:'GET',
                contentType:"application/json",
                dataType:'jsonp',
                success:function (dt) {
                    console.log(dt);
                    var lines = process(dt);
                    //lines = [];
                    var data  = getNodes(dt)
                    console.log(lines);
                    map[0].drawMigration(data,lines);
                } });

        },
        'changeFlow':function (index,flag) {
            console.log("changeflow")
            console.log(index)
          map[index].changeFlow(flag);
        },
        'changeFilter':function(index,filter){
            var radius = maps.mapObj[index].visualRadius;
            var stayfilter = maps.mapObj[index].nodeStayFilter;
            var stayinfilter = maps.mapObj[index].nodeInFilter;
            var stayoutfilter = maps.mapObj[index].nodeOutFilter;
            var edgefilter = maps.mapObj[index].edgefilter;
            map[index].changeFilter(radius, stayfilter,stayinfilter,stayoutfilter,edgefilter);
        },
        'radiusUpdate':function (index,radius) {
            console.log(radius)
            //et radius = maps.mapObj[index].visulRadius;
            map[index].changeVisualRadius(radius);
        },
        'nodeSFU':function (index,stayfilter) {
            console.log(maps.mapObj[index].nodeStayFilter)
            map[index].changeSFU(stayfilter);
        },
        'nodeIFU':function (index,stayinfilter) {
            map[index].changeIFU(stayinfilter);
        },
        'nodeOFU':function (index,stayoutfilter) {
            map[index].changeOFU(stayoutfilter)
        },
        'edgeFU':function (index,edgefilter) {
            map[index].changeEFU(edgefilter)
        },
        'changeTravelType':function (travel_type) {
            if(travel_type == "Grid-Grid"){
                console.log(travel_type);
                var start_hour = "07:00:00",end_hour = "08:05:00";
                var start_month = months[starttime.split('-')[1]];
                var begintime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+start_hour;
                //var end_month = months[end_time.split('-')[1]];
                var endtime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+end_hour;
                var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime="+begintime+"&endTime="+endtime;
                $.ajax({
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
            }
            else if(travel_type == "District-District"){
                $.getJSON('/data/beijingBoundary.json',function (dt) {
                    map[0].drawBoundary(dt);
                    $.getJSON('/data/sample.json',function (dt1) {
                        map[0].drawDistrict(dt1,dt);
                        var lines = process2(dt1);
                        var lines1 = process1(dt1);
                        map[0].drawDisDis(dt1,lines,lines1);
                    })
                });
            }

        },
        'getView':function (get_url) {
            this.dt = getdata(get_url);
            console.log(this.dt);
                var lines = process(this.dt);
                var lines1 = process1(this.dt);
                //lines = [];
                console.log(lines);
                console.log(lines1);
                map[0].drawMigration(this.dt,lines,lines1);
        },
        //draw the clock in the time filter
        'drawClock':function () {

            var arc = d3.arc()
                .outerRadius(40)
                .innerRadius(25)
                .padAngle(0.05);
            var big_arc =  d3.arc()
                .outerRadius(43)
                .innerRadius(22);
            var arcData = [];
            for(var i=0;i<24;i++){
                var t = {};
                t.id = i;
                t.hour = (i+12)%24;
                t.value = 1;
                arcData.push(t);
            };
            var pie = d3.pie()
                .sort(null)
                .value(function (d1) {
                    return d1.value;
                })
            var svg = d3.select(".time-selector").append("svg")
                .attr("width",300)
                .attr("height",200)
                .append("g")
                .attr("class","time-clock");

            var g=svg.selectAll(".arc")
                .data(pie(arcData))
                .enter().append("g")
                .attr("class","arc")
                .attr("transform",'translate(150,100)');
            var timelabel=[{
                'text':12,
                'position':[143,55]
            },{
                'text':15,
                'position':[180,70]
            },
                {
                    'text':18,
                    'position':[193,105]
                },
                {
                    'text':21,
                    'position':[180,140]
                },
                {
                    'text':0,
                    'position':[147,152]
                },
                {
                    'text':3,
                    'position':[110,140]
                },
                {
                    'text':6,
                    'position':[100,105]
                },
                {
                    'text':9,
                    'position':[110,70]
                }
            ];

            var text = svg.selectAll("text")
                .data(timelabel)
                .enter()
                .append("text")
                .attr("fill","black")
                .attr("x",function (d) {
                    return d.position[0];
                })
                .attr("y",function (d) {
                    return d.position[1];
                })
                .html(function (d) {
                    return d.text;
                });




            var big_svg = d3.select(".time-selector").select("svg").select("g");
            var big_g = big_svg.selectAll(".arc1")
                .data(pie(arcData))
                .enter().append("g")
                .attr("class","arc1")
                .attr("transform",'translate(150,100)');

            big_g.append("path")
                .attr("d",big_arc)
                .attr("id",function (d,i) {
                    return "big-path"+i.toString();
                })
                .attr("class","big_arc")
                .each(function (d,i) {
                    d.clicked = false;
                })
                .style("opacity","0")
                .style("cursor",'hand')
                .style("fill","grey")
                .on("mouseover",function (d,i) {
                    d3.select(this).style("fill","#eee");
                    g.select("#path"+i.toString()).style("fill","#eee");
                })
                .on("mouseout",function (d,i) {
                    d3.select(this).style("fill","grey");
                    g.select("#path"+i.toString()).style("fill","black");
                })
                .on("click",function (d) {
                    d.clicked = !d.clicked;
                    if(d.clicked){
                        d3.select(this).style("opacity","1");
                    }
                    else{
                        d3.select(this).style("opacity","0");
                    }
                });

            g.append("path")
                .attr("d",arc)
                .attr("id",function (d,i) {
                    return "path"+i.toString();
                })
                .style('cursor','hand')
                .style("fill","black")
                .each(function (d,i) {
                    d.clicked = false;
                })
                .style("stroke","grey")
                .style("stroke-width",'0px')
                .on('mouseover',function (d) {
                    d3.select(this).style("fill","#eee");
                })
                .on("mouseout",function () {
                    d3.select(this).style("fill","black");
                });
                this.clock = big_g;
        },
        'changeTI':function (index) {
            var g = this.clock;
            var start_hour = "07:00:00",end_hour = "09:05:00";
            function showClock(interval_set) {
                for(var i = 0; i < 24; i++){
                    var flag = false;
                    interval_set.forEach(function (d) {
                        if( d == i){
                            flag = true;
                            g.select('#big-path'+d.toString()).style("opacity",'1');
                        }
                    });
                    if(!flag){
                        g.select('#big-path'+i.toString()).style("opacity",'0');
                    }
                }
            }
            if(index == 0){
                console.log(this.clock);
                this.clock.selectAll(".big_arc").style("opacity",'0');
                start_hour = "00:00:00";
                end_hour ="23:59:59";
            }
            if(index == 1){
                this.clock.selectAll(".big_arc").style("opacity",'1');
                start_hour = "00:00:00";
                end_hour = "00:00:00";
            }
            if(index == 2){
                var interval_set = [0,1,2,3,4,5,6,7,23,22,21,20,19];
                showClock(interval_set);
                start_hour = "07:00:00";
                end_hour = "20:00:00";
            }
            if(index == 3){
                var interval_set = [8,9,10,11,12,13,14,15,16,17,18];
                showClock(interval_set);
                // to be added not full!
                start_hour = "20:00:00";
                end_hour = "23:59:59";
            }
            if(index == 4){
                var interval_set = [19,20,21];
                showClock(interval_set);
                start_hour = "07:00:00";
                end_hour = "09:59:59";
            }
            if(index == 5){
                var interval_set = [5,6,7];
                showClock(interval_set);
                start_hour = "17:00:00";
                end_hour = "19:59:59";
            }
            if(index == 6){
                var interval_set = [6,7,8,9,10,11,12,13,14,15];
                showClock(interval_set);
                // not full 0-3 not included
                start_hour = "18:00:00";
                end_hour = "23:59:59";
            }
            if(index == 7){
                var interval_set = [0,1,2,3,23,22,21,20];
                showClock(interval_set);
                start_hour = "08:00:00";
                end_hour = "15:59:59";
            }
            if(index == 8){
                var interval_set = [4,5,6,7,8,9,10,11];
                showClock(interval_set);
                start_hour = "16:00:00";
                end_hour = "23:59:59";
            }
            if(index == 9){
                var interval_set = [12,13,14,15,16,17,18,19];
                showClock(interval_set);
                start_hour = "00:00:00";
                end_hour = "07:59:59";
            }
            var start_month = months[starttime.split('-')[1]];
            var begintime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+start_hour;
            //var end_month = months[end_time.split('-')[1]];
            var endtime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+end_hour;
            var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime="+begintime+"&endTime="+endtime;
            console.log(get_url);
           /* var dt = getdata(get_url);
            var lines = process(dt);
            var lines1 = process1(dt);
            map[0].drawMigration(dt,lines,lines1);*/
            $.ajax({
                /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
                url:get_url,
                type:'GET',
                contentType:"application/json",
                dataType:'jsonp',
                success:function (dt) {
                    console.log(dt);
                    var lines = process(dt);
                    var lines1 = process1(dt);
                    //lines = [];
                    var data = getNodes(dt);
                    console.log(lines);
                    console.log(lines1);
                    map[0].drawMigration(data,lines,lines1);
                } });
        }

    
    },
    computed:{
        mapClass:function () {
            let mapNumber = maps.mapObj.length;
            if(mapNumber == 1){
                return 'onemap';
            }else if(mapNumber == 2){
                return 'twomap';
            }else{
                return 'formap';
            }
        }
    },
    mounted() {
        let self =this;
        console.log("mounted")
        this.drawClock();
        var margin = {top: 20, right: 10, bottom: 20, left: 4},
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
        var start_hour = "07:00:00",end_hour = "09:05:00";
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
                end_hour = "0"+end_hour.toString()+":05"+":00";
            }
            else{
                end_hour = end_hour.toString()+":05"+":00";
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
                /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
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
        }


      this.$nextTick(function () {
          let self = this;
          map[0] = new mapview('map0');
          var bdData;
          $.getJSON('/data/beijingBoundary.json',function (dt) {
              map[0].drawBoundary(dt);
              bdData = dt;
              $.getJSON('/data/sample.json',function (dt1) {
                  map[0].drawDistrict(dt1,dt);
                  var lines = process2(dt1);
                  var lines1 = process1(dt1);
                  var start_month = months[starttime.split('-')[1]];
                  var begintime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+start_hour;
                  //var end_month = months[end_time.split('-')[1]];
                  var endtime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+end_hour;
                  var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime="+begintime+"&endTime="+endtime;
                  console.log(get_url);
                  $.ajax({
                      /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
                      url:get_url,
                      type:'GET',
                      contentType:"application/json",
                      dataType:'jsonp',
                      success:function (dt) {
                          console.log(dt);
                          var data = getNodes(dt)
                          //lines = [];
                          console.log(lines);
                          console.log(lines1);
                          map[0].drawDisDis(data,lines,lines1);
                      } });
                  })
          });

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
    },
    updated(){

        let self = this;
        console.log(maps.mapObj.length)
        console.log("update!")
        let mapobjs = maps.mapObj;
        let len = mapobjs.length;

        if(len>=2){
            map[0].invalidateSize();
        }
        $.getJSON('/data/beijingBoundary.json',function (data) {
            for(var i = 1;i<len;i++){
                map[i] = new mapview('map'+i.toString());
                map[i].drawBoundary(data);
                $.ajax({
                    url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-10+07%3A00%3A00&endTime=2016-07-10+10%3A00%3A00',
                    type:'GET',
                    contentType:"application/json",
                    dataType:'jsonp',
                    success:function (dt) {
                        console.log(dt);
                        var lines = process(dt);
                        var lines1 = process1(dt);
                        var data = getNodes(dt);
                        //lines = [];
                        console.log(lines);
                        console.log(lines1);
                        map[1].drawMigration(data,lines,lines1);
                    } });
            }
        });
    }

})




