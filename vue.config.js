const CopyWebpackPlugin = require('copy-webpack-plugin');
const ZipWebpackPlugin = require('zip-webpack-plugin');
const path = require('path');
const packageInfo = require('./package.json');

const productionMode = process.env.NODE_ENV === 'production';
const appName = process.env.VUE_APP_NAME;
const zipMode = process.env.VUE_APP_BUILD === 'zip';

// Generate pages object
const pages = {};

const modulesName = ['popup', 'options', 'background', 'selection', 'generation'];

modulesName.forEach(name => {
  pages[name] = {
    entry: `src/${name}/index.ts`,
    template: path.resolve(`src/${name}/index.html`),
    filename: `${name}.html`,
    chunks: ['chunk-vendors', 'chunk-common', name],
  };

  if (name === 'background') {
    pages[name].chunks.push('gloria-utils');
  }
});

let outputDir = '';
let copyFiles = [];
const folderName = productionMode ? 'build' : 'dist';
const fileName = productionMode ? 'production' : 'development';
outputDir = `${folderName}/${appName}`;
copyFiles = [
  {
    from: path.resolve(`src/${appName}/manifest.${fileName}.json`),
    to: `${path.resolve(folderName)}/${appName}/manifest.json`,
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

      config.optimization.splitChunks = {
        cacheGroups: {
          'gloria-utils': {
            chunks: 'initial',
            name: 'gloria-utils',
            test: /[\\/]node_modules[\\/]gloria-utils[\\/]/,
            priority: -10,
          },
        },
      };
    }

    if (zipMode) {
      config.plugins.push(
        new ZipWebpackPlugin({
          path: path.resolve('archive'),
          filename: `${packageInfo.name}_${appName}_v${packageInfo.version}.zip`,
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
  css: {
    sourceMap: false,
    loaderOptions: {
      sass: {
        // additionalData: `@import "~@/scss/index.scss"`,
        sassOptions: {
          fiber: false,
        },
      },
      scss: {
        // additionalData: `@import "~@/scss/index.scss";`,
        sassOptions: {
          fiber: false,
        },
      },
    },
  },
};
