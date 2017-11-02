//document.getElementById('title').style.color='red';
function projectPoint(x, y) {
    let point = mymap.latLngToLayerPoint(new L.LatLng(y, x));
    this.stream.point(point.x, point.y);
}
function boundaryDrawing(data) {
    /*let self = this,
        city = prop['city'],
        type = extraInfoIndex(prop['etype']),
        onlyBound = prop['boundary'],
        statsdata = stats[city],
        numid = self.ides.mapid.slice(-1),
        svgid = `boundSVG`,
        aoiid = `aoiCanvas${self.ides.mapid}`;

    if (!update) {
        this.setBoundData(data);
    } else {
        data = this.getBoundData();
    }

    d3.select(`#${svgid}`).remove();
    if (onlyBound) {
        d3.select(`#${aoiid}`).remove();
    }

    if (!onlyBound) {
        this.clearLayers();
    }

    let range = d3.extent(Object.values(statsdata).map((val) => {
        return val[type];
})),
    vmin = range[1] * prop['slider'][0] / 100.0,
        vmax = range[1] * prop['slider'][1] / 100.0,
        color = d3.scaleLinear().domain([vmin, vmax, range[1]])
            .range(["rgba(255,255,255,0.5)", "rgba(255, 0, 0, 0.9)", "rgba(255, 0, 0, 0.9)"]),
        */
    let svgid = `boundSVG`
    let svg = d3.select(mymap.getPanes().overlayPane).append("svg").attr('id', svgid),
        g = svg.append("g").attr("class", "leaflet-zoom-hide");

    // console.log('vmin', vmin, 'vmax', vmax);

    let transform = d3.geoTransform({point: projectPoint}),
        path = d3.geoPath().projection(transform);

    let feature = g.selectAll("path")
        .data(data.features)
        .enter().append("path")
        .attr('fill', function (d) {
            /*let name = d.properties.name,
                val = statsdata[name][type];
            return onlyBound || val < vmin ? 'none' : color(val);*/
            return 'none';
        })
        .attr('stroke', 'black')
        .style("stroke-dasharray", "4 5")
        .attr("stroke-width", 1.2);

    /*if (!onlyBound) {
        feature.on("mouseover", function(d) {
            let name = d.properties.name;

            d3.select(`#carddistrict${numid}`).html(name);
            d3.select(`#cardenps${numid}`).html(statsdata[name][type]);
        })
            .on("mouseout", function(d) {
                d3.select(`#carddistrict${numid}`).html('Null');
                d3.select(`#cardenps${numid}`).html('Null');
            });

        self.drawGridLegend(`Content`, color);
    }*/


    /*let text = g.selectAll('text')
        .data(data.features)
        .enter().append('text')
        .style("font-family", "sans-serif")
        .style("font-size", "1rem")
        .attr("text-anchor", "middle")
        .text(function(d) {
            let name = d['properties']['english'];
            if (name) {
                return name
            }
            return d['properties']['name'];
        })
        .attr('x', function(d) {
            let p = d['properties']['cp'];
            return self.map.latLngToLayerPoint(new L.LatLng(p[1], p[0])).x;
        })
        .attr('y', function(d) {
            let p = d['properties']['cp'];
            return self.map.latLngToLayerPoint(new L.LatLng(p[1], p[0])).y - 20;
        });*/

    mymap.on("viewreset", reset);
    mymap.on("zoomstart",function(){
        svg.selectAll('.boundSVG')
            .style('display','none');
    });

    mymap.on("zoomend",function() {
       reset();
    });
        reset();

    // Reposition the SVG to cover the features.
    function reset() {
        let bounds = path.bounds(data),
            topLeft = bounds[0],
            bottomRight = bounds[1];
        svg.attr("width", bottomRight[0] - topLeft[0])
            .attr("height", bottomRight[1] - topLeft[1])
            .style("left", topLeft[0] + "px")
            .style("top", topLeft[1] + "px");

        g.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");

        feature.attr("d", path);
        /*text.data(data.features)
            .attr('x', function(d) {
                let p = d['properties']['cp'];
                return self.map.latLngToLayerPoint(new L.LatLng(p[1], p[0])).x;
            })
            .attr('y', function(d) {
                let p = d['properties']['cp'];
                return self.map.latLngToLayerPoint(new L.LatLng(p[1], p[0])).y;
            });
    }*/

        // Use Leaflet to implement a D3 geometric transformation.

    }
}
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

var mymap = L.map('mapid').setView([40.2, 116.3], 9);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light',
    accessToken: 'pk.eyJ1IjoiaGNjMjI2IiwiYSI6ImNqOTlucndyYTB2OWMycXFtOTJyYnR3eTIifQ.yHWmhPWtxqseKfBZfpRvWA'
}).addTo(mymap);

$.getJSON('/data/beijingBoundary.json',function (data) {
    boundaryDrawing(data);
})

/*$.getJSON('./data/bjDistrict.json',function(data){
    $.each(data,function (i,item) {
        //console.log(item.c);
        L.circle([item.cp[1],item.cp[0]], item.population*10, {
            color: '#8d9eeb',
            fillColor: '#1750a7',
            fillOpacity: 0.5
        }).addTo(mymap);
    });
});*/
/*$.getJSON('./data/test.json',function(data){
    $.each(data,function (i,item) {
        console.log(item.c);
        new L.polyline([
            [item.from[1],item.from[0]],
            [item.to[1],item.to[0]]], {
            color: '#6ca8ff',
            opacity: 0.5,
            weight: item.value
        }).addTo(mymap);
    });
});*/

/*$.getJSON('/data/test1.json',function (data) {
    $.each(data,function (i,item) {
        let qlng = (item.from[0]+item.to[0])/2+(item.from[1]-item.to[1])/6;
        let qlat = (item.from[1]+item.to[1])/2+(item.to[0]-item.from[0])/6;
        L.curve([
            'M',[item.from[1],item.from[0]],
            'Q',[qlat,qlng],[item.to[1],item.to[0]]
        ], {color:'#6da6fd',
            weight:item.value
        }).addTo(mymap);
    })
})*/

function  drawnodes(nodes) {
    $.each(nodes,function (i,node) {
        //console.log(item.c);
        L.circle([node.y,node.x], node.stay_device_num*10, {
            color: '#8d9eeb',
            fillColor: '#1750a7',
            fillOpacity: 0.5
        }).addTo(mymap);
    });
}

function drawedges(edges) {
    $.each(edges,function (i,item) {
       // console.log(item.c);
        new L.polyline([
            [item.from_y,item.from_x],
            [item.to_y,item.to_x]], {
            color: '#6ca8ff',
            opacity: 0.5
           // weight: item.value
        }).addTo(mymap);
    });
}
function process(data) {
    $.each(data.edges,function (i , link) {
        var nodes = data.nodes;
        for(var i = 0; i<nodes.length;i++){
            if(link.from_nid == nodes[i].nid){
                link.from_x = nodes[i].x;
                link.from_y = nodes[i].y;
            }
            if(link.to_nid == nodes[i].nid){
                link.to_x = nodes[i].x;
                link.to_y = nodes[i].y;
            }
        }
    });
    return data.edges;
}
$.getJSON('/data/sample.json',function (data) {
    let nodes = data.nodes;
    let links = data.edges;
    drawnodes(nodes);
    let edges = process(data);
    drawedges(edges);
})

