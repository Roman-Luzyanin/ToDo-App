// webpack.config.js
import path from "node:path";
import HtmlWebpackPlugin from "html-webpack-plugin";

export default (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: "./src/index.js",
    output: {
      filename: "main.js",
      path: path.resolve(import.meta.dirname, "dist"),
      clean: true,
    },
    devtool: isProduction ? false : "eval-source-map", 
    devServer: {
      static: "./dist",
      watchFiles: ["./src/**/*.html"],
      open: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/home.html",
      }),
    ],
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif)$/i,
          type: "asset/resource",
        },
      ],
    },
  };
};