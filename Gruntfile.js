var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench');

var NAME = 'ti-node-require',
	TMP_DIR = 'tmp';

module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		mochaTest: {
			options: {
				require: ['should'],
				timeout: 3000,
				ignoreLeaks: false,
				reporter: 'spec'
			},
			src: ['test/*_test.js']
		},
		jshint: {
			options: {
				jshintrc: true
			},
			src: [
				'Gruntfile.js',
				'lib/**/*.js',
				'test/**/*.js'
			]
		},
		titanium: {
			create: {
				options: {
					command: 'create',
					name: TMP_DIR,
					workspaceDir: '.',
					platforms: ['ios']
				}
			},
			build: {
				options: {
					command: 'build',
					projectDir: TMP_DIR,
					logLevel: 'trace'
				}
			}
		},
		alloy: {
			all: {
				options: {
					command: 'new',
					args: [TMP_DIR]
				}
			}
		},
		clean: {
			src: [TMP_DIR]
		}
	});

	// Load grunt plugins for modules
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-titanium');
	grunt.loadNpmTasks('grunt-alloy');

	// load test app
	grunt.registerTask('app-prep', 'Load source files into example alloy app', function() {
		var srcDir = path.join('test', 'app'),
			dstDir = path.join(TMP_DIR, 'app'),
			assetsDir = path.join(dstDir, 'assets'),
			tmpAssetsDir = path.join(TMP_DIR, 'assets'),
			libDir = path.join(dstDir, 'lib');

		// copy app source files
		grunt.log.write('Copying "%s" to "%s"...', srcDir, dstDir);
		fs.renameSync(assetsDir, tmpAssetsDir);
		wrench.copyDirSyncRecursive(srcDir, dstDir, { forceDelete: true });
		fs.renameSync(tmpAssetsDir, assetsDir);

		// copy in lib
		copyFileSync(path.join('lib', NAME + '.js'), path.join(libDir, NAME + '.js'));

		// copy in should.js
		//copyFileSync(path.join('node_modules', 'should', 'should.js'), path.join(libDir, 'should.js'));

		// copy in jmk

		// run npm install

		grunt.log.ok();

	});

	// create test alloy app
	grunt.registerTask('app-create', ['clean', 'titanium:create', 'alloy']);

	// run example app
	grunt.registerTask('test', ['app-create', 'app-prep', 'titanium:build']);

	// Register tasks
	grunt.registerTask('default', ['jshint', 'test']);

};

function copyFileSync(src, dst) {
	fs.writeFileSync(dst, fs.readFileSync(src));
}