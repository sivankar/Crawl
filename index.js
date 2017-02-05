var utils = require('./lib/utils');



var options = {
    hostname: 'medium.com',
    port: 443,
    path: '/',
    method: 'GET'
};

utils.collectAllLinks(options, function(err, res){
    if(err){
        console.log(err);
    }else{
        utils.writeLinksInCSVFormat('out.csv', res);
    }
});