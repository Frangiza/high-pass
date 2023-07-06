const { src, dest, parallel, series, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const notify = require('gulp-notify');
const rename = require('gulp-rename');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const del = require('del');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-imagemin');
const webpackStream = require('webpack-stream');
const uglify = require('gulp-uglify-es').default;

const clean = () => {
  return del(['app/*'])
}

const scripts = () => {
  return src('./src/js/main.js')
    .pipe(webpackStream({
      output: {
        filename: 'main.js'
      },
      mode: 'development',
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
          }
        ]
      }
    }))
    .on('error', function (err) {
      console.error('WEBPACK ERROR', err);
      this.emit('end');
    })
    .pipe(sourcemaps.init())
    .pipe(uglify().on("error", notify.onError()))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/js'))
    .pipe(browserSync.stream())
}

const svgSprites = () => {
  return src('./src/img/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: "../sprite.svg"
        }
      }
    }))
    .pipe(dest('./app/img'))
}

const styles = () => {
  return src('./src/scss/**/*.scss')
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
    }).on('error', notify.onError()))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(autoprefixer({
      cascade: false,
      grid: true,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('./app/css/'))
    .pipe(browserSync.stream())
}

const htmlInclude = () => {
  return src(['./src/*.html'])
  .pipe(fileinclude({
    prefix: '@',
    basepath: '@file'
  }))
  .pipe(dest('./app'))
  .pipe(browserSync.stream())
}

const resources = () => {
  return src('./src/resources/**')
    .pipe(dest('./app'))
}

const images = () => {
  return src(['./src/img/**.jpg', './src/img/**.jpeg', 'src/img/*.svg', './src/img/**.png'])
    .pipe(image([
      image.mozjpeg({
        quality: 80,
        progressive: true
      }),
      image.optipng({
        optimizationLevel: 2
      }),
    ]))
    .pipe(dest('./app/img'))
};


const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: './app'
    }
  });

  watch('./src/scss/**/*.scss', styles);
  watch('./src/**/*.html', htmlInclude);
  watch('./src/*.html', htmlInclude);
  watch('./src/img/**.jpg', images);
  watch('./src/img/**.jpeg', images);
  watch('./src/img/**.png', images);
  watch('src/img/*.svg', images);
  watch('./src/img/svg/**/*.svg', svgSprites);
  watch('./src/resources/**', resources);
  watch('./src/js/**/*.js', scripts);
}

const htmlMinify = () => {
  return src('./app/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(dest('./app'));
}

const stylesBuild = () => {
	return src('./src/scss/**/*.scss')
		.pipe(sass({
			outputStyle: 'expanded'
		}).on('error', notify.onError()))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(autoprefixer({
			cascade: false,
		}))
		.pipe(cleanCSS({
			level: 2
		}))
		.pipe(dest('./app/css/'))
}

const scriptsBuild = () => {
	return src('./src/js/main.js')
		.pipe(webpackStream({
				mode: 'development',
				output: {
					filename: 'main.js',
				},
				module: {
					rules: [{
						test: /\.m?js$/,
						exclude: /(node_modules|bower_components)/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env']
							}
						}
					}]
				},
			}))
			.on('error', function (err) {
				console.error('WEBPACK ERROR', err);
				this.emit('end');
			})
		.pipe(uglify().on("error", notify.onError()))
		.pipe(dest('./app/js'))
}

exports.styles = styles
exports.watchFiles = watchFiles
exports.fileinclude = htmlInclude

exports.default = series(clean, parallel(htmlInclude, scripts, styles, resources, images, svgSprites), watchFiles)

exports.build = series(clean, parallel(htmlInclude, scriptsBuild, resources, images, svgSprites), stylesBuild, htmlMinify);
