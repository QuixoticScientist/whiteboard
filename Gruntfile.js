module.exports = function (grunt) {
  
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var pkg = grunt.file.readJSON('package.json');
  
  grunt.initConfig({
    pkg: pkg,

    jshint: {
      options: pkg.jshintConfig,
      all: [
        'Gruntfile.js',
        'client/app.js',
        'client/services/*.js',
        'client/directive/*.js'
      ]
    },

    clean: {
      release: [ 'dist' ]
    },

    useminPrepare: {
      html: 'client/index.html',
      options: {
        dest: 'dist'
      }
    },

    usemin: {
      html: ['dist/*.html'],
      css: ['dist/styles/*.css'],
      options: {
        assetsDirs: ['dist/assets/images', 'dist/js']
      }
    },

    concat: {
      options: {
        separator: ';'
      },
      dist: {}
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      },
      // dist configuration is provided by useminPrepare
      dist: {}
    },

    // Copy HTML, images and fonts
    copy: {
      release: {
        files: [
          {
            expand: true,
            dot: true,
            cwd: 'client',
            src: [
              'assets/images/*.{png,gif,jpg,jpeg,svg,ico}',
              'styles/*.css',
              'views/*.html',
              '*.html'
            ],
            dest: 'dist'
          }
        ]
      }
    },

    // Filerev
    filerev: {
        options: {
          encoding: 'utf8',
          algorithm: 'md5',
          length: 20
        },
        release: {
          files: [{
            src: [
              'dist/assets/images/*.{jpg,jpeg,gif,png,svg}',
              'dist/js/*.js',
              'dist/styles/*.css',
            ]
          }]
        }
    },
  });

  grunt.registerTask('release', 'Creates a release in /dist', [
      'clean',
      'useminPrepare',
      'concat',
      'uglify',
      'copy',
      // 'filerev',
      'usemin'
  ]);
};

