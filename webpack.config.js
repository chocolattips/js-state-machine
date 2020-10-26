module.exports = {
  entry: "./src/StateMachine.ts",
  // target: "node",
  // mode: "development",
  output: {
    filename: "StateMachine.js",
    path: `${__dirname}/dist`,
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
