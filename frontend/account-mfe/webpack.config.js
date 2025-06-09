const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.js",
  devServer: {
    port: 3001,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-react", 
              "@babel/preset-env"
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "[name].[ext]",
            outputPath: "images/",
          },
        },
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "accountMfe",
      filename: "remoteEntry.js",
      exposes: {
        "./AccountManagement": "./src/AccountManagement.jsx",
      },
      shared: {
        react: {
          singleton: true,
          requiredVersion: "^18.2.0",
        },
        "react-dom": {
          singleton: true,
          requiredVersion: "^18.2.0",
        },
        "react-router-dom": {
          singleton: true,
          requiredVersion: "^6.8.1",
        },
        antd: {
          singleton: true,
          requiredVersion: "^5.12.8",
        },
      },
    }),
    new HtmlWebpackPlugin({
      template: "./public/index.html",
      title: "Account Management",
    }),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    extensions: [".js", ".jsx"],
  },
}; 