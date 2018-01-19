import $ from "jquery"
import {getDisWidth} from "../calculate/calculateEdge"
import {getRadius} from "../calculate/calculateCircle"
import {maps} from "../init/mapVueInit"

let objClone = function (obj) {
    let res = {};

    return JSON.parse(JSON.stringify(obj));;
};

function getNodes(data,isZero) {
    var resdata = data;
    var res = [];
    var nodes;
    var edges;
    if(isZero === false){
        nodes = data.nodes;
        edges = data.edges;
    }
    else{
        nodes = data.nodes[0]
        edges = data.edges[0]
    }
    $.each(nodes, function (i, node) {
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
function updateGraph(dt) {
    var old_graph = maps.mapObj[0].graph;
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
    maps.mapObj[0].graph = new_graph;
    return new_graph;
}
// for　district data get start point and end point of each line
function getLinePos(data,isZero) {
    var res = [];
    console.log(data)
    console.log(data.edges[0]);
    console.log(data.nodes)
    var edges;
    if(isZero === false){
        edges = data.edges;
    }
    else{
        edges = data.edges[0];
    }
    var range = d3.extent(edges,function (d) {
        return d.travel_device_num;
    })
    var min = range[0];
    var max = range[1];
    console.log(range)

    $.each(edges, function (j, edge) {
        var nodes = data.nodes;
        var link = edge;
        //console.log(link.from_nid)
        var count = 0;
        link.width = getDisWidth(link.travel_device_num,min,max)
        //console.log(link.width);
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

//for poi_to_div_data get in ,all,all ,self,edges of each node
function  processPoiToDivNodes(data,num) {
    var res = [];
    console.log("edges is ")
    console.log(data.edges[0])
    $.each(data.nodes[parseInt(num)], function (i, node) {
        var edges = data.edges[0];
        var new_node = node;
        new_node.in = 0;
        new_node.out = 0;
        new_node.all = 0;
        new_node.self = 0;
        new_node.edges = [];
        for (var j = 0; j < edges.length; j++) {
            var f = 0;
            if (edges[j].from_nid == new_node.id) {
                f++;
                new_node.out = new_node.out + edges[j].travel_device_num;
                new_node.all = new_node.all + edges[j].travel_device_num;
                new_node.edges.push(edges[j])
            }
            if (edges[j].to_nid == new_node.id) {
                new_node.in = new_node.in + edges[j].travel_device_num;
                if(f === 0){
                    new_node.all = new_node.all + edges[j].travel_device_num;
                    new_node.edges.push(edges[j])
                }
                f++;
            }
            if( f == 2){
                new_node.self = new_node.self + edges[j].travel_device_num;

            }
        }
        res.push(new_node);
    });
    return res;
}

//for poitodivdata get start and end point of each line
function getPoiToDivLinePos(data) {
    var res = [];
    console.log(data)
    console.log(data.edges[0]);
    console.log(data.nodes);

    $.each(data.edges[0], function (j, edge) {
        var nodes = data.nodes[1];
        /*data.nodes[0].forEach(function (node) {
            nodes.push(node);
        })*/
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
        nodes = data.nodes[0]
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

//process poi_to_div_data
function processPoiToDiv(data){
    console.log(data);
    var resdata = data;
    var res0 = processPoiToDivNodes(data,0);
    var res1 = processPoiToDivNodes(data,1)
    var resLink = getPoiToDivLinePos(data);
    resdata.edges[0] = resLink;


    resdata.nodes[0] = res0;
    resdata.nodes[1] = res1;

    console.log(resdata)
    return resdata;
}

// process div_to_poi line
function processDivToPoi(data) {

    var resLink = getPoiToDivLinePos(data);
    return resLink;

}
var compare = function (x, y) {//比较函数
    if (x > y) {
        return -1;
    } else if (x < y) {
        return 1;
    } else {
        return 0;
    }
}

//sort arrays
function sortline(lines,nodes,type) {
    var res = [];
    var tmp = [];
    if(type === "com"){
        nodes.forEach(function (node) {
            tmp.push(parseInt(node.stay_device_num))
            tmp.push(parseInt(node.all))
        })
        var min = d3.min(tmp);
        var max = d3.max(tmp);
        nodes.forEach(function (node) {
            res.push(parseFloat(getRadius(node.stay_device_num,min,max)));
            res.push(parseFloat(getRadius(node.all,min,max)));
        })
    }
    else{
        lines.forEach(function (line) {
            res.push(parseFloat(line.width))
        })
    }
    /*else{
        nodes.forEach(function (node) {
            //res.push(parseInt(node.stay_device_num))
            //res.push(parseInt(node.self))
        })
    }*/
    console.log(res);
    res.sort(compare);
    console.log(res);
    return res;
}

export {objClone,getNodes,sortline,getLinePos,updateGraph,processPoiToDiv,processDivToPoi}