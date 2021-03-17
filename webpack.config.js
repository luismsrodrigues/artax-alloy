const path = require('path');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var isProd = process.env.NODE_ENV === 'production';

module.exports = {
  	entry: ['./src/lib/index.js'],
 	target: 'node',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: isProd ? '[name].[hash].js' : '[name].js',
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