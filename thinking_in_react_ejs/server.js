var app = require('./app');
console.log(process.argv);
var port = 0;
for(var i=0, l=process.argv.length; i<l; i++) {
    if(process.argv[i] === 'node') {
        port = process.argv[i+2];
        break;
    }
}
var defaultPort = port || 8097;
app.listen(defaultPort);
