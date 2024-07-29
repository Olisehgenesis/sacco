const path = require("path");
const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const webpackConfig = require("./webpack.config");

const webpackDevServerOptions = {
  static: path.join(process.cwd(), "dist"),
  devMiddleware: {
    publicPath: "/",
  },
  historyApiFallback: true,
  hot: true,
  host: "0.0.0.0",
  port: process.env.PORT || 3000,
};

const compiler = webpack(webpackConfig);

const server = new WebpackDevServer(webpackDevServerOptions, compiler);

server.start();
console.log(`App listening on ${webpackDevServerOptions.port}`);
