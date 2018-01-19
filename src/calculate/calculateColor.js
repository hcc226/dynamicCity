function getColor(h,s,l) {
    var colors=[0,0];
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

export {getColor}