var http = require('http');
var fs = require('fs');
var rcvMd = require('./markdown-recieve');

//step1, get my blog list page
var myBlogUrl = 'http://blog.csdn.net/vctisildur';
var fileName = 'download_index.html';
var file = fs.createWriteStream(fileName);

try {
    http.get(myBlogUrl, function(res) {
        res.on('data', function(chunk){
            file.write(chunk);
        }).on('end', extractBlogId);
    });
} catch(e) {
    console.error(e);
}


//step2, extract blog id
function extractBlogId() {
    var idArr = [];
    fs.readFile(fileName, {encoding:'utf8'}, function(err,data) {
        var lines= data.split('\n');
        // filter lines with /article/details/111111
        lines = lines.filter( function(line) {
            var re = /href=.*\/article\/details\/(\d+)/g;
            var results = re.exec(line);
            return !!results && (results.length>1);
        });
        // map /article/details/111111 --> 111111
        idArr = lines.map(function(line) {
            var re = /href=.*\/article\/details\/(\d+)/g;
            var results = re.exec(line);
            if(results) {
                if(results.length>1) {
                    return results[1];
                }
            }
            return null;
        });
        // remove replicated items
        idArr = idArr.reduce(function(arr, item) {
            if( arr.indexOf(item)<0 ) {
                arr.push(item);
            }
            return arr;
        }, []);
        console.log(idArr);
        // step 3 , retrieve markdown using the blog id
        rcvMd(idArr);
    });
}

