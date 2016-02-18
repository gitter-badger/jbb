var gulp 		= require('gulp');
var header 		= require('gulp-header');
var webpack 	= require('webpack-stream');
var PROD 		= JSON.parse(process.env.PROD_DEV || "0");

//
// Compile the binary loader 
//
gulp.task('dist/jbb', function() {
	return gulp.src('decoder.js')
		.pipe(webpack({
			module: {
				loaders: [
					{ test: /\.json$/, loader: 'json' },
				],
		    },
		    node: {
		    	'fs': 'empty'
		    },
		    output: {
		    	// The output filename
		    	filename: PROD ? 'jbb.min.js' : 'jbb.js',
				// Export itself to a global var
				libraryTarget: 'var',
				// Name of the global var: 'Foo'
				library: 'JBBBinaryLoader'
			},
			externals: {
				'three': 'THREE',
			},
		    plugins: ([
		    	new webpack.webpack.optimize.DedupePlugin(),
				new webpack.webpack.DefinePlugin({
				    PROD 	  	: PROD,
				    LOG_PARSING : false
				})
		    ]).concat(PROD ? [
			    new webpack.webpack.optimize.UglifyJsPlugin({
			    	minimize: true
			    })
		    ] : [])
		}))
		.pipe(header("/* JBB Binary Bundle Loader - https://github.com/wavesoft/jbb */\n"))
		.pipe(gulp.dest('dist'));
});

//
// Compile the source loader
//
gulp.task('dist/jbb-loader', function() {
	return gulp.src('loader.js')
		.pipe(webpack({
			module: {
				loaders: [
					{ test: /\.json$/, loader: 'json' },
				],
		    },
		    node: {
		    	'fs': 'empty'
		    },
		    output: {
		    	// The output filename
		    	filename: PROD ? 'jbb-loader.min.js' : 'jbb-loader.js',
				// Export itself to a global var
				libraryTarget: 'var',
				// Name of the global var: 'Foo'
				library: 'JBBSourceLoader'
			},
			externals: {
				'three': 'THREE',
			},
		    plugins: PROD ? [
		    	new webpack.webpack.optimize.DedupePlugin(),
			    new webpack.webpack.optimize.UglifyJsPlugin({
			    	minimize: true
			    })
		    ] : [
		    	new webpack.webpack.optimize.DedupePlugin(),
		    ]
		}))
		.pipe(header("/* JBB Source Bundle Loader - https://github.com/wavesoft/jbb */\n"))
		.pipe(gulp.dest('dist'));
});

// The files to pack on dist release
gulp.task('dist', [
	'dist/jbb',
	'dist/jbb-loader'
]);


// By default run only script
gulp.task('default', ['dist']);

