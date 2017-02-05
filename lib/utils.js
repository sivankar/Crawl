var https = require('https');
var cheerio = require('cheerio');
var fs = require('fs');


function writeLinksInCSVFormat(file, allLinks) {
     
    allLinks = Array.from(allLinks);
    var csvContent = allLinks.join(",") + '\n';
    fs.writeFileSync(file, csvContent, {flag : 'a'});
}


function collectAllLinks(options, cb) {

    var req = https.request(options, function (res) {
        var data = [];

        // set to avoid visiting same website multiple times
        var allLinks = new Set();

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
                allLinks.add('https:' + $(this).attr('href'));
            });

            var absoluteLinks = $("a[href^='http']");
            absoluteLinks.each(function () {
                allLinks.add($(this).attr('href'));
            });

            // converting set to array
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