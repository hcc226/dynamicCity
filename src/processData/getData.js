import $ from 'jquery'

function success() {

}
var res;
function getdata(url) {
    var res ;
    console.log("getdata");
    $.ajax({
        /* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*/
        url:url,
        type:'GET',
        async:false,
        contentType:"application/json",
        dataType:'jsonp',
        data:{},
        success:function (data) {
            console.log(data);
            res=data;
            console.log(res)

        } });
    return res;
    console.log(res)

}

let getdistrictData = function () {
    $.getJSON('/data/sample.json',function (dt) {
        return dt;
    })
    /*let p = new Promise(function(resolve, reject) {
        $.get('/data/sample.json', function(res, err) {
            if (res['scode']) {
                resolve(res['data']);
            } else {
                reject(err);
            }
        })
    });
   return p;*/
}

let getBoundary = function () {
    $.getJSON('/data/beijingBoundary.json',function (dt) {
        return dt;
    })
    /*let p = new Promise(function(resolve, reject) {
        $.get('/data/beijingBoundary.json', function(res, err) {
            if (res['scode']) {
                resolve(res['data']);
            } else {
                reject(err);
            }
        })
    });
    return p;*/

}


export {
    getdistrictData,
    getdata,
    getBoundary
};