const path = require('path');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackBar = require('webpackbar');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const sveltePreprocess = require('svelte-preprocess');


/**
 * Renderer process bundle
 * @type {webpack.WebpackOptionsNormalized}
 */
const rendererConfig = {
    entry: {
        main: ['./src/renderer/main.ts'],
    },
    resolve: {
        alias: {
            svelte: path.dirname(require.resolve('svelte/package.json')),
        },
        extensions: ['.ts', '.js', '.svelte'],
        mainFields: ['svelte', 'browser', 'module', 'main'],
    },
    output: {
        path: `${__dirname}/../dist/renderer`,
        filename: 'bundle.js',
        publicPath: './',
    },
    target: 'electron-renderer',
    module: {
        rules: [
            {
                test: /\.svelte$/,
                use: {
                    loader: 'svelte-loader',
                    options: {
                        preprocess: sveltePreprocess(),
                        emitCss: true,
                    },
                },
            },
            {
                test: /\.node$/,
                loader: 'node-loader',
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                // required to prevent errors from Svelte on Webpack 5+
                test: /node_modules\/svelte\/.*\.mjs$/,
                resolve: {
                    fullySpecified: false,
                },
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'src/renderer/app.html',
        }),
        new MiniCssExtractPlugin({ filename: '[name].css' }),
        new WebpackBar({
            name: 'Renderer',
            color: 'green',
            basic: true,
        }),
    ],
};

/**
 * Main process bundle
 * @type {webpack.WebpackOptionsNormalized}
 */
const mainConfig = {
    entry: {
        main: ['./src/main/main.ts'],
    },
    output: {
        path: `${__dirname}/../dist/main`,
        filename: 'bundle.js',
        publicPath: './',
    },
    target: 'electron-main',
    node: {
        __dirname: false,
        __filename: false,
    },
    plugins: [
        new WebpackBar({
            name: 'Main',
            color: 'cyan',
            basic: true,
        }),
    ],
};

/**
 * Shared config
 * @type {webpack.WebpackOptionsNormalized}
 */
const sharedConfig = {
    resolve: {
        extensions: ['.mjs', '.ts', '.tsx', '.js', '.json'],
        alias: {
            '@': path.resolve(__dirname, '../src'),
        },
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.(ts|tsx)([?]?.*)$/,
                        use: 'ts-loader',
                        exclude: /node_modules/,
                    },
                    {
                        test: /\.css$/,
                        use: [MiniCssExtractPlugin.loader, 'css-loader'],
                        include: path.join(__dirname, 'node_modules'),
                    },
                    {
                        test: /\.(eot|woff|woff2|ttf)([?]?.*)$/,
                        type: 'asset/resource',
                    },
                    {
                        test: /\.(png|jpg|ico)([?]?.*)$/,
                        type: 'asset/resource',
                        exclude: /node_modules/,
                    },
                    {
                        // Hotfix for iconv-lite https://github.com/ashtuchkin/iconv-lite/issues/204
                        test: /node_modules[\/\\](iconv-lite)[\/\\].+/,
                        resolve: { aliasFields: ['main'] },
                    },
                ],
            },
        ],
    },
    stats: {
        children: false,
        chunks: false,
        chunkModules: false,
        modules: false,
        reasons: false,
    },
    plugins: [new CleanWebpackPlugin()],
};

/**
 * Exports
 */
module.exports.renderer = webpackMerge.merge(rendererConfig, sharedConfig);
module.exports.main = webpackMerge.merge(mainConfig, sharedConfig);
