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

    watch: {
      files: ['client/app.js', 'client/directives/*.js', 'client/services/*.js'],
      tasks: ['concat', 'uglify']
    }

  });

  grunt.registerTask('release', 'Concats, Minifies', [
      'concat',
      'uglify'
  ]);
};

