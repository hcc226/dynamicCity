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
        'visualRadius':60
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
    'travel_default':'District-District'
}

function process(data) {
    var res = [];
    $.each(data.edges,function (j , edge) {
        /*if(j >500){
            return res;
        }*/
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
                    console.log(lines);
                    map[0].drawMigration(dt,lines);
                } });

        },
        'changeFlow':function (index,flag) {
            console.log("changeflow")
            console.log(index)
          map[index].changeFlow(flag);
        },
        'radiusUpdate':function (index) {
            console.log(maps.mapObj[index].visulRadius)
            let radius = maps.mapObj[index].visulRadius;
            map[index].changeVisualRadius(radius);
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
                        //lines = [];
                        console.log(lines);
                        console.log(lines1);
                        map[0].drawMigration(dt,lines,lines1);
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
        console.log("mounted")
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
        var start_hour = "07:00:00",end_hour = "08:05:00";
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
                    //lines = [];
                    console.log(lines);
                    console.log(lines1);
                    map[0].drawMigration(dt,lines,lines1);
                } });
        }

      let self = this;
      this.$nextTick(function () {
          map[0] = new mapview('map0');
          var bdData;
          $.getJSON('/data/beijingBoundary.json',function (dt) {
              map[0].drawBoundary(dt);
              bdData = dt;
              $.getJSON('/data/sample.json',function (dt1) {
                  map[0].drawDistrict(dt1,dt);
                  var lines = process2(dt1);
                  var lines1 = process1(dt1);
                  map[0].drawDisDis(dt1,lines,lines1);
                  })
          });

          console.log(bdData)
         /* var districtData = getdistrictData();
          map[0].drawBoundary(bdData) map[0].drawBoundary(bdData);
          map[0].drawDistrict(districtData, bdData);*/
          /*console.log(districtData);
          $.getJSON('/data/beijingBoundary.json',function (data) {
              console.log(data);
              bdData = data;
              map[0].drawBoundary(data);
              $.getJSON('/data/sample.json',function (districtData) {
                  map[0].drawDistrict(districtData, bdData);
              })
          })*/

          console.log(starttime);
          console.log(end_time);
          var start_month = months[starttime.split('-')[1]];
          var begintime = starttime.split('-')[0]+"-"+start_month+"-"+starttime.split('-')[2]+"+"+start_hour;
          var end_month = months[end_time.split('-')[1]];
          var endtime = end_time.split('-')[0]+"-"+end_month+"-"+end_time.split('-')[2]+"+"+end_hour;
          var get_url = "http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime="+begintime+"&endTime="+endtime;
          console.log(get_url);
           getdata(get_url).then(function(dt){
               var lines = process(dt);
               var lines1 = process1(dt);
               //lines = [];
               console.log(lines);
               console.log(lines1);
               map[0].drawMigration(dt,lines,lines1);
           });


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
                        //lines = [];
                        console.log(lines);
                        console.log(lines1);
                        map[1].drawMigration(dt,lines,lines1);
                    } });
            }
        });
    }

})




