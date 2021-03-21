const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const path = require('path');
const packageInfo = require('./package.json');

const productionMode = process.env.NODE_ENV === 'production';
const outputDir = productionMode ? 'build' : 'dist';

// Generate pages object
const pages = {};

const chromeName = ['popup', 'options', 'background', 'selection', 'generation'];

chromeName.forEach(name => {
  pages[name] = {
    entry: `src/${name}/index.ts`,
    template: path.resolve(`src/${name}/index.html`),
    filename: `${name}.html`,
    chunks: ['chunk-vendors', 'chunk-common', name],
  };
});

const copyFiles = productionMode
  ? [
      {
        from: path.resolve('src/manifest.production.json'),
        to: `${path.resolve('build')}/manifest.json`,
      },
    ]
  : [
      {
        from: path.resolve('src/manifest.development.json'),
        to: `${path.resolve('dist')}/manifest.json`,
      },
    ];

copyFiles.push({
  from: path.resolve('src/assets'),
  to: path.resolve(outputDir),
});

process.env.VUE_APP_VERSION = productionMode ? packageInfo.version : packageInfo.version + ' (Dev)';

module.exports = {
  outputDir,
  filenameHashing: false,
  lintOnSave: 'warning',
  pages,
  productionSourceMap: false,
  configureWebpack: config => {
    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: copyFiles,
      })
    );

    if (productionMode) {
      Object.assign(config.optimization.minimizer[0].options.terserOptions.compress, {
        warnings: false,
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log'],
      });
    }

    if (process.env.VUE_APP_TITLE === 'zip') {
      config.plugins.push(
        new ZipWebpackPlugin({
          path: path.resolve('archive'),
          filename: `${packageInfo.name}_v${packageInfo.version}.zip`,
        })
      );
    }

    config.resolve.alias = {
      '@': path.resolve('src'),
    };

    // 关闭 webpack 的性能提示
    config.performance = {
      hints: false,
    };
  },
};
