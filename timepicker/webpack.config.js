var webpack = require('webpack');

module.exports = {
    entry: './js/timepicker.js',
    output: {
        path: './dist',
        filename: 'timepicker.js'
    },
    module: {
        loaders: [{
            test: /\.less$/,
            loader: 'style!css!less'
        },{
            test: /\.html$/,
            loader: 'html'
        }]
    }
};
