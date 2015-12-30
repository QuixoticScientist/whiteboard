module.exports = function (grunt) {
  
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  var pkg = grunt.file.readJSON('package.json');
  
  grunt.initConfig({
    pkg: pkg,

    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['client/app.js', 'client/directives/*.js', 'client/services/*.js'],
        // the location of the resulting JS file
        dest: 'client/dist/whiteboard.js'
      }
    },

    uglify: {
      options: {
        mangle: false,
        compress: true
      },
      target: {
        files: {
          'client/dist/whiteboard.min.js': ['client/dist/whiteboard.js']
        }
      }
    },

    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'client/dist/style.min.css': ['client/style/style.css']
        }
      }
    },

    watch: {
      scripts: {
        files: ['client/app.js', 'client/directives/*.js', 'client/services/*.js'],
        tasks: ['concat', 'uglify']
      },
      css: {
        files: ['client/styles/style.css'],
        tasks: ['cssmin']
      }
    }

  });

  grunt.registerTask('release', 'Concats, Minifies', [
      'concat',
      'uglify'
  ]);
};

