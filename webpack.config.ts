import path from "path";

import webpack from "webpack";

const umdConfig: webpack.Configuration = {
  mode: "production",
  entry: path.join(__dirname, "src", "umd.ts"),
  output: {
    libraryTarget: "umd",
    path: path.join(__dirname, "dist", "umd"),
    filename: "timber.js"
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
          context: __dirname,
          configFile: "tsconfig.umd.json"
        }
      }
    ]
  },
  resolve: {
    extensions: [".ts"]
  }
};

export default umdConfig;
