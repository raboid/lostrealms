var path = require('path');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
  entry: {
    client: path.join(__dirname, 'client/src/client.js')
  },
  output: {
    path: path.join(__dirname, 'client/dist/'),
    publicPath: '/',
    filename: 'bundle.js',
    sourceMapFilename: 'bundle.js.map'
  },
  resolve: {
    alias: {
      'assets': path.join(__dirname, 'client/assets'),
      'ui': path.join(__dirname, 'client/src/ui'),
      'game': path.join(__dirname, 'client/src/game'),
      'utils': path.join(__dirname, 'client/src/utils'),
      'actions': path.join(__dirname, 'client/src/actions'),
      'constants': path.join(__dirname, 'client/src/constants'),
      'shared': path.join(__dirname, 'shared')
    }
  },
  devtool: 'inline-source-map',
  performance: {
    hints: "warning"
  },
  stats: {
    colors: true,
    warnings: true,
    errors: true,
    chunks: false,
    cached: true,
    assets: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'body',
      template: path.join(__dirname, 'client/src/index.html')
    }),
    //new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      { 
        test: /\.js?$/, 
        loader: 'babel-loader',
        options: {
          presets: [
            ["react"],
            ["es2015", { modules: false }],
            ["stage-0"]
          ],
          plugins: [
            "transform-object-rest-spread",
            "transform-decorators-legacy"
          ]
        },
        exclude: /(node_modules)/
      },
      { 
        test: /\.css$/, 
        use: [ 'style-loader', 'css-loader' ]
      },
      { 
        test: /\.(json|png|jpg)$/, 
        loader: 'file-loader?name=[path][name].[ext]' 
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url?limit=10000'
      }
    ]
  }
}
