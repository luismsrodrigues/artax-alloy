const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  	entry: ['babel-polyfill', './src/lib.http-client.js'],
 	target: 'node',
	output: {
		path: path.resolve(__dirname, '..', 'dist'),
		filename: '[name].js',
		publicPath: '/dist/'
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['@babel/preset-env'],
						}
					}
				]
			},
		]
	},
	plugins: [
		new CleanWebpackPlugin()
	]
};