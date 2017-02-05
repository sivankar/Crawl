var utils = require('./lib/utils');
var url = require('url');
var async = require('async');

var options = {
    hostname: 'medium.com',
    port: 443,
    path: '/',
    method: 'GET'
};

var links = new Set();
var iterator = null;

Set.prototype.union = function (setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}


function makeRequest(callback) {

    var data = iterator.next().value;
    if(!data){
        callback();
    }
    var myurl = url.parse(data);
    var options = {
        hostname: myurl.host,
        port: 443,
        path: myurl.pathname,
        method: 'GET'
    };

    utils.collectAllLinks(options, function (err, res) {
        if (err) {
            callback(err, null);
        } else {
            links.union(res);
            utils.writeLinksInCSVFormat('out.csv', res);
            callback(null, res);
        }
    });
};


utils.collectAllLinks(options, function (err, res) {
    if (err) {
        console.log(err);
    } else {
        links = res;
        iterator = links[Symbol.iterator]();
        utils.writeLinksInCSVFormat('out.csv', res);
        myAsync();
    }
});

function myAsync() {

    var arr = [];
    var count = 0;

    while(count < links.size){
        arr.push(makeRequest);
        count++;
    }
    async.parallelLimit(arr, 5, function (err, results) {
        if (err) {
            console.log(err);
        } else {
            console.log('Process complete!!')
        }
    });
}