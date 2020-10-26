module.exports = {
  entry: "./src/index.ts",
  // target: "node",
  // mode: "development",
  output: {
    filename: "index.js",
    path: `${__dirname}/dist/`,
    libraryTarget: "commonjs2",
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
};
