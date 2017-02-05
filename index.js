var utils = require('./lib/utils');
var url = require('url');

var options = {
    hostname: 'medium.com',
    port: 443,
    path: '/',
    method: 'GET'
};

var links = new Set();
var iterator = null;

Set.prototype.union = function(setB) {
    var union = new Set(this);
    for (var elem of setB) {
        union.add(elem);
    }
    return union;
}

utils.collectAllLinks(options, function (err, res) {
    if (err) {
        console.log(err);
    } else {
        links = res;
        iterator = links[Symbol.iterator]();
        utils.writeLinksInCSVFormat('out.csv', res);
        a(0);
    }
});

function a(count) {

    this.count = count;

    while (this.count < 5) {

        data = iterator.next()
        if (data.value) {
            makeRequest(this, data.value);
        } else {
            console.log('Process complete!!');
            break;
        }

    }
}

function makeRequest(self, data) {

    var myurl = url.parse(data);
    var options = {
        hostname: myurl.host,
        port: 443,
        path: myurl.pathname,
        method: 'GET'
    };

    self.count++;
    utils.collectAllLinks(options, function (err, res) {
        if (err) {
            console.log(err);
        } else {
            links.union(res);
            utils.writeLinksInCSVFormat('out.csv', res);
            a(--self.count);
        }
    });
}