const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");


module.exports = {
	mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.[contenthash].js',
		publicPath: '/',
		clean: true
	},
	module: {
		rules: [
			{
				test: /\.html$/i,
				loader: 'html-loader',
				options: {
					minimize: {
						removeComments: true,
						collapseWhitespace: true
					}
				}
			},
			{
				test: /\.(svg|webp|png|jpe?g)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'assets/[name].[contenthash][ext]',
				},
				use: [
					{
						loader: 'image-webpack-loader',
						options: {
							mozjpeg: {
								progressive: true,
								quality: 65
							},
							webp: {
								quality: 60
							}
						}
					}
				]
			},
			{
				test: /\.css$/i,
				use: [ MiniCssExtractPlugin.loader,
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [['autoprefixer']]
							}
						}
					}
				],
			}
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
			minify: {
				removeComments: true,
				collapseWhitespace: true,
				removeAttributeQuotes: true,
				minifyCSS: true,
				minifyJS: true
			},
			inlineSource: /\.css$|\.js$/
		}),
		new MiniCssExtractPlugin({
				filename: 'styles.[contenthash].css'
			}
		),
		new CopyWebpackPlugin({
			patterns: [
				{
					from: path.resolve(__dirname, 'public/lang'),
					to: path.resolve(__dirname, 'dist/lang'),
				},
			],
		}),
	],
	optimization: {
		minimize: process.env.NODE_ENV === 'production',
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					compress: {
						drop_console: true,
					},
				},
			}),
			new CssMinimizerPlugin(),
		]
	}
};