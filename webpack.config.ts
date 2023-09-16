import { DefinePlugin, Configuration } from "webpack";
import HtmlWebpackPlugin from "html-webpack-plugin";
import path from "path";
import { VueLoaderPlugin } from "vue-loader"
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";
const Dotenv = require("dotenv-webpack");

const isProduction = process.env.NODE_ENV === "production";

const environmentVaribles = new DefinePlugin({
    // Drop Options API from bundle
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
    __VUE_HMR_RUNTIME__: false,
});

const config: Configuration = {
    entry: "./src/main.ts",
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[fullhash][name].js",
    },
    // devServer: {
    //     historyApiFallback: true,
    //     // port: process.env.PORT || 3000,
    //     hot: true
    // },
    resolve: {
        extensions: [".tsx", ".ts", ".vue", ".jsx", ".js", ".json"],
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    optimization: {
        minimizer: [
            new TerserPlugin(),
            new CssMinimizerPlugin(),
        ]
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ["css-loader", !isProduction ? "style-loader" : MiniCssExtractPlugin.loader],
            },
            {
                test: /\.scss$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.vue$/,
                loader: "vue-loader",
                options: {
                    hotReload: false
                }
            },

            {
                test: /\.tsx?$/,
                use: [
                    "babel-loader",
                    {
                        loader: "ts-loader",
                        options: {
                            transpileOnly: true,
                            appendTsSuffixTo: ["\\.vue$"],
                            happyPackMode: true,
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "url-loader",
                options: {
                    limit: 8192,
                    name: "[name].[ext]?[hash]"
                }
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                loader: "file-loader",
                options: {
                    name: "[name].[ext]?[hash]"
                }
            }
        ]
    },
    plugins: [
        new Dotenv(),
        new VueLoaderPlugin(),
        environmentVaribles,
        new HtmlWebpackPlugin({
            template: "./src/index.html",
        }),
    ].concat(!isProduction ? [] : [new MiniCssExtractPlugin({
        filename: isProduction ? "[name].[hash].css" : "[name].css",
        chunkFilename: isProduction ? "[id].[hash].css" : "[id].css"
    })])

};

export default config;