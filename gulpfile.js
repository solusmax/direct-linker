'use strict';

const { series, parallel, src, dest, watch } = require('gulp');
const autoprefixer     = require('autoprefixer');
const browserSync      = require('browser-sync').create();
const cssnano          = require('cssnano');
const del              = require('del');
const ghPages          = require('gh-pages');
const gulpIf           = require('gulp-if');
const gulpWebpack      = require('webpack-stream');
const htmlmin          = require('gulp-htmlmin');
const imagemin         = require('gulp-imagemin');
const magicImporter    = require('node-sass-magic-importer');
const plumber          = require('gulp-plumber');
const postcss          = require('gulp-postcss');
const postcssNormalize = require('postcss-normalize');
const rename           = require('gulp-rename');
const sass             = require('gulp-sass')(require('sass'));
const webpack          = require('webpack');

// **************************** ФАЙЛОВАЯ СТРУКТУРА *****************************

const SRC_PATH = './src';
const BUILD_PATH = './build';

const SrcPaths = {
  HTML: `${SRC_PATH}/html`,
  SCSS: `${SRC_PATH}/scss`,
  JS: `${SRC_PATH}/js`,
  FAVICON: `${SRC_PATH}/favicon`
};

const SCSS_ENTRY_POINT = `${SrcPaths.SCSS}/style.scss`;
const JS_ENTRY_POINT = `./${SrcPaths.JS}/main.js`;

const SrcFiles = {
  HTML: [`${SrcPaths.HTML}/**/*.html`],
  SCSS: [`${SrcPaths.SCSS}/**/*.scss`],
  JS: [`${SrcPaths.JS}/**/*.js`],
  FAVICON: [`${SrcPaths.FAVICON}/**/*`]
}

const BuildPaths = {
  HTML: `${BUILD_PATH}`,
  CSS: `${BUILD_PATH}/css`,
  JS: `${BUILD_PATH}/js`,
  FAVICON: `${BUILD_PATH}`
};

const CSS_BUNDLE_FILENAME = 'style.min.css';
const JS_BUNDLE_FILENAME = 'script.min.js';

// ************************* ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ***************************

let isProductionMode = false;

// Включение режима продакшена

const enableProductionMode = (cb) => {
  isProductionMode = true;
  cb();
};

// Перезагрузка страницы в браузере

const reloadPage = (cb) => {
  browserSync.reload();
  cb();
};

// Удаление папки build

const clearBuildForlder = () => {
  return del(`${BUILD_PATH}`, {
    force: true
  });
};

// Публикация на GitHub Pages

const publishGhPages = (cb) => {
  ghPages.publish(`${BUILD_PATH}/`, cb);
}

// ******************************** СБОРКА *************************************

// HTML

const buildHtml = () => {
  return src(SrcFiles.HTML)
    .pipe(htmlmin({
      caseSensitive: true,
      collapseWhitespace: true,
      conservativeCollapse: true,
      removeComments: true
    }))
    .pipe(dest(`${BuildPaths.HTML}`));
}

exports.buildHtml = series(buildHtml);

// CSS

const buildCss = () => {
  return src(SCSS_ENTRY_POINT, { sourcemaps: !isProductionMode })
    .pipe(gulpIf(!isProductionMode, plumber()))
    .pipe(sass({
      importer: magicImporter()
    }).on('error', sass.logError))
    .pipe(postcss([
      postcssNormalize({
        forceImport: 'normalize.css'
      }),
      autoprefixer()
    ]))
    .pipe(gulpIf(isProductionMode, postcss([
      cssnano()
    ])))
    .pipe(rename(CSS_BUNDLE_FILENAME))
    .pipe(dest(`${BuildPaths.CSS}`, { sourcemaps: '.' }));
};

exports.buildCss = series(buildCss);

// JS

const buildJs = () => {
  return src(JS_ENTRY_POINT, { sourcemaps: !isProductionMode })
    .pipe(gulpIf(!isProductionMode, plumber()))
    .pipe(gulpWebpack({
      mode: isProductionMode ? 'production' : 'development',
      entry: JS_ENTRY_POINT,
      output: {
        filename: JS_BUNDLE_FILENAME,
      },
      devtool: isProductionMode ? false : 'source-map',
      module: {
        rules: [
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      }
    }, webpack))
    .pipe(dest(`${BuildPaths.JS}`, { sourcemaps: '.' }));
};

exports.buildJs = series(buildJs);

// Фавиконки

const buildFavicon = () => {
  return src(SrcFiles.FAVICON)
    .pipe(gulpIf(isProductionMode, imagemin([
      imagemin.optipng({
        optimizationLevel: 3
      }),
      imagemin.svgo()
    ])))
    .pipe(dest(`${BuildPaths.FAVICON}`));
};

exports.buildFavicon = series(buildFavicon);

// ***************************** ЛОКАЛЬНЫЙ СЕРВЕР ******************************

const startServer = () => {
  browserSync.init({
    server: `${BUILD_PATH}`,
    cors: true,
    notify: false,
    injectChanges: false,
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false
    }
  });

  // Вотчеры

  watch(
    SrcFiles.HTML,
    series(buildHtml, reloadPage)
  );

  watch(
    SrcFiles.SCSS,
    series(buildCss, reloadPage)
  );

  watch(
    SrcFiles.JS,
    series(buildJs, reloadPage)
  );

  watch(
    SrcFiles.FAVICON,
    series(buildFavicon, reloadPage)
  );
};

// ********************************** ЗАДАЧИ ***********************************

const buildDev = series(
  clearBuildForlder,
  parallel(
    buildHtml,
    buildCss,
    buildJs,
    buildFavicon
  )
);
const buildProd = series(enableProductionMode, buildDev);
const startDev = series(buildDev, startServer);
const deployGhPages = series(buildProd, publishGhPages);

exports.default = startDev;
exports.buildProd = buildProd;
exports.buildDev = buildDev;
exports.deployGhPages = deployGhPages;
