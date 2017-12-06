import $ from 'jquery'

let getdata=function(url) {
    let p = new Promise(function(resolve, reject) {
        $.ajax({
            url:url,
            type:'GET',
            contentType:"application/json",
            dataType:'jsonp',
            success:function (dt) {
                if (dt['scode']) {
                    resolve(dt['data']);
                }else {

                }
        } });
        /*$.get(url, function(res, err) {
            if (res['scode']) {
                resolve(res['data']);
            } else {
                reject(err);
            }
        });*/
    });
    return p;
    /*$.ajax({
        /!* url:'http://192.168.1.42:3000/api/basicGraph?spaceType=grid&timeType=duration&netType=basic&other=none&beginTime=2016-07-05+03%3A30%3A00&endTime=2016-07-05+06%3A05%3A00',*!/
        url:url,
        type:'GET',
        contentType:"application/json",
        dataType:'jsonp',
        success:function (dt) {
            console.log(dt);
            return dt;
            /!*var lines = process(dt);
            var lines1 = process1(dt);
            //lines = [];
            console.log(lines);
            console.log(lines1);
            map[0].drawMigration(dt,lines,lines1);*!/
        } });
*/
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