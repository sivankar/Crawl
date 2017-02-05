var https = require('https');
var cheerio = require('cheerio');
var fs = require('fs');


function writeLinksInCSVFormat(file, allLinks) {
    var csvContent = allLinks.join(",");
    fs.writeFileSync(file, csvContent);
}


function collectAllLinks(options, cb) {

    var req = https.request(options, function (res) {
        var data = [];
        var allLinks = [];
        
        res.on('data', (d) => {
            //process.stdout.write(d);
            d = d.toString('utf8')
            data.push(d);
        });

        res.on('error', (err) => {
            return cb(err);
        });

        res.on('end', () => {
            data = data.join('');
            var $ = cheerio.load(data);
            var relativeLinks = $("a[href^='/']");
            relativeLinks.each(function () {
                allLinks.push('https:' + $(this).attr('href'));
            });

            var absoluteLinks = $("a[href^='http']");
            absoluteLinks.each(function () {
                allLinks.push($(this).attr('href'));
            });
            return cb(null, allLinks);
        });
    });

    req.on('error', (e) => {
        return cb(e);
    });
    req.end();
}



module.exports = {
    collectAllLinks: collectAllLinks,
    writeLinksInCSVFormat : writeLinksInCSVFormat
};