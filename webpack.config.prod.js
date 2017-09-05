var path = require("path")
var webpack = require("webpack")
var HtmlWebpackPlugin = require("html-webpack-plugin")

module.exports = {
  entry: {
    client: path.join(__dirname, "client/src/index.js")
  },
  output: {
    path: path.join(__dirname, "dist/"),
    publicPath: "/",
    filename: "bundle.js"
  },
  resolve: {
    alias: {
      assets: path.join(__dirname, "assets"),
      ui: path.join(__dirname, "src/ui"),
      game: path.join(__dirname, "src/game"),
      utils: path.join(__dirname, "src/utils"),
      actions: path.join(__dirname, "src/actions"),
      constants: path.join(__dirname, "src/constants")
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: "body",
      template: path.join(__dirname, "index.html")
    })
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        loader: "babel-loader",
        options: {
          presets: [["react"], ["es2015", { modules: false }], ["stage-0"]],
          plugins: [
            "transform-object-rest-spread",
            "transform-decorators-legacy"
          ]
        },
        exclude: /(node_modules)/
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      },
      {
        test: /\.(json|png|jpg)$/,
        loader: "file-loader?name=[path][name].[ext]"
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000"
      }
    ]
  }
}
