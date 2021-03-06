module.exports = {
  devtool: 'source-map',
  entry: ['./src/index.tsx'],
  output: {
    filename: 'bundle.js',
    path: __dirname + '/dist/'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
    ]
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"]
  }
};
