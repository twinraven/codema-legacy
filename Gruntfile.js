/*global module:true */
module.exports = function ( grunt ) {
	'use strict';

	// Array of Script files to include into build
	var APP_SCRIPTS = [
		// module dependancies
		'src/js/modules/*.js',

		// app
		'src/js/app.js',

		// services
		'src/js/services/*.js',

		// controllers
		'src/js/controllers/*.js',

		// directives
		'src/js/directives/*.js',

		// router - goes last
		'src/js/router/*.js'
	];

	require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

	// GRUNT PLUGIN CONFIGURATION
	grunt.initConfig({

		// Get package data
		pkg: grunt.file.readJSON( 'package.json' ),

		// Banners to prepend to built files
		banner: {
			ecma: '/**\n' +
					' *  <%= pkg.title %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
					'<%= pkg.homepage ? " *  " + pkg.homepage + "\\n" : "" %>' +
					' *  (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %> All Rights Reserved\n' +
					' */ \n\n'
		},

		// JSHINT
		jshint: { /* Lint the Gruntfile, all modules and specs except JQuery. */
			all: [
                'Gruntfile.js',
                'src/js/**/*.js',

                // Nots
                '!src/js/libs/**/*.js'
			],
			options: {
				bitwise: false,
				browser: true,
				curly: true,
				eqeqeq: true,
				es3: true, /* Assume site must work in IE6/7/8. */
				forin: true,
				globals: { /* Require and Jasmine's Globals. Note that $ is not permitted. */
					'requirejs': false, /* Require */
					'require': false,
					'define': false,
					'describe': false, /* Jasmine */
					'xdescribe': false,
					'it': false,
					'xit': false,
					'beforeEach': false,
					'afterEach': false,
					'jasmine': false,
					'spyOn': false,
					'expect': false,
					'waitsFor': false
				},
				immed: true,
				indent: 4,
				jquery: true,
				latedef: true,
				maxdepth: 2,
				newcap: true,
				noarg: true,
				noempty: false,
				onevar: true,
				plusplus: false,
				quotmark: 'single', /* Use backslashes if they\'re needed. */
				regexp: false,
				regexdash: true,
				'-W099': true, // suppresses mixed spaces and tabs errors - have both.
				strict: false, /* Use one 'use strict'; per file. */
				trailing: true, /* Turn 'show whitespace' on in your editor. */
				undef: false,
				unused: false
			}
		},

		// CLEAN Output dir
		clean: {
			options: {
				force: true
			},
			src: ['dist/']
		},

		autoprefixer: {
			dev: {
				src: 'src/css/main.css'
			},
			dist: {
				src: 'dist/css/main.css'
			}
		},

		connect: {
			dev: {
				options: {
					port: 9001,
					base: 'src/'
				}
			},
			dist: {
				options: {
					port: 9001,
					base: 'dist/'
				}
			}
		},

		// COPY
		copy: {
			html: {
				cwd: 'src/',
				dest: 'dist/',
				src: '*.html',
				expand: true
			},
			fonts: {
				cwd: 'src/',
				dest: 'dist/',
				src: 'fonts/**',
				expand: true
			},
			js: {
				cwd: 'src/',
				dest: 'dist/',
				src: 'js/**/*',
				expand: true
			},
			images: {
				cwd: 'src/',
				dest: 'dist/',
				src: 'images/**',
				expand: true
			},
			favicons: {
				cwd: 'src/',
				dest: 'dist/',
				src: '*.ico',
				expand: true
			},
			partials: {
				cwd: 'src/',
				dest: 'dist/',
				src: 'partials/**',
				expand: true
			}
		},

		// SASS COMPILATION
		sass: {
			dev: {
				files: {
					'src/css/main.css': 'src/scss/main.scss'
				},
				options: {
					outputStyle: 'nested'
				}
			},
			dist: {
				files: {
					'dist/css/main.css': 'src/scss/main.scss'
				},
				options: {
					outputStyle: 'compressed'
				}
			}
		},

		// FILE CONCATINATION
		concat: {
			options: {
				banner: '<%= banner.ecma %>'
			},
			js: {
				src: APP_SCRIPTS,
				dest: 'dist/js/app.js'
			}
		},

		// SCRIPT MINIFICATION
		uglify: {
			options: {
				banner: '<%= banner.ecma %>'
			},
			js: {
				files: {
					'dist/js/app.js': APP_SCRIPTS
				}
			}
		},

		// WATCH for file changes
		watch: {
			options: {
				livereload: true
			},
			configuration: {
				files: ['Gruntfile.js', 'src/images/**', 'src/js/**/*', 'src/scss/**/*.{scss,sass}', 'src/**/*.html'],
				tasks: ['dist']
			}
		}
	});

	// ENVIRONMENT TASKS

	// development build - run 'grunt dev'
	grunt.registerTask( 'dev', ['clean', 'build-dev'] );
	grunt.registerTask( 'build-dev', ['sass:dev', 'autoprefixer:dev', 'concat:js', 'copy', 'jshint'] );

	grunt.registerTask( 'dist', ['clean', 'build-dist'] );
	grunt.registerTask( 'build-dist', ['sass:dist', 'autoprefixer:dist', 'copy', 'uglify'] );

	grunt.registerTask( 'server', ['connect:dist', 'watch'] );

	// default task - Production to prevent development code going live
	grunt.registerTask( 'default', 'dev' );
};
