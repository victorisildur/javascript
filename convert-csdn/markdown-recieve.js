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
                    var createTime = obj.data.create;
                    createTime = createTime.substring(0, createTime.indexOf(' '));
                    var title = createTime+'-'+obj.data.title;
                    console.log(title);
                    var markdownContent = obj.data.markdowncontent;
                    var file = fs.createWriteStream('./blogs/' + title + '.markdown');
                    var header = '---\n';
                    header += 'layout: post\n';
                    header += 'title: ' + title + '\n';
                    header += 'date: ' + obj.data.create + '\n';
                    header += 'categories:' + obj.data.categories.substring(0, obj.data.categories.indexOf(',')) + '\n';
                    header += '---\n';
                    file.write(header + markdownContent);
                } catch(e) {
                    console.error(url+'\n'+e);
                }
            });
        });
    });
}


module.exports = mdRcv;