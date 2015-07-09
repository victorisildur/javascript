var http = require('http');
var fs = require('fs');

var baseUrl = 'http://write.blog.csdn.net/mdeditor/getArticle?id=';
var postUrl = '&username=vctisildur';

function mdRcv(idArr) {
    idArr.forEach(function(id) {
        var url = baseUrl + id + postUrl;
        http.get(url, function(res) {
            var resChunkArr = []
            res.on('data', function(chunk) {
                resChunkArr.push(chunk);
            }).on('end', function() {
                try {
                    var obj = JSON.parse(resChunkArr.join(''));
                    var title = obj.data.title;
                    console.log(title);
                    var markdownContent = obj.data.markdowncontent;
                    var file = fs.createWriteStream('./blogs/' + title + '.markdown');
                    file.write(markdownContent);
                } catch(e) {
                    console.error(url+'\n'+e);
                }
            });
        });
    });
}


module.exports = mdRcv;