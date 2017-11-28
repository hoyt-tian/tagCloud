const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: './index',

    output:{
        path:path.resolve(__dirname, 'dist'),
        filename:'tagcloud.js',
        libraryTarget:'umd'
    },

    devtool:'source-map',
    target:'web',
    plugins: [
        new UglifyJSPlugin()
    ]
};