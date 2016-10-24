module.exports = function (grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  var prefixSrc = 'src/';

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: {
      name: 'bootstrap'
    },

    banner: "+function() { }()",

    clean: {
      dist: 'dist'
    },

    jshint: {
      options: {
        jshintrc: prefixSrc + 'js/.jshintrc'
      },
      core   : {
        src: prefixSrc + 'js/*.js'
      }
    },

    concat: {
      options  : {
        banner      : '<%= banner %>\n',
        stripBanners: false
      },
      bootstrap: {
        src : [
          'js/transition.js',
          'js/alert.js',
          'js/button.js',
          'js/carousel.js',
          'js/collapse.js',
          'js/dropdown.js',
          'js/modal.js',
          'js/tooltip.js',
          'js/popover.js',
          'js/scrollspy.js',
          'js/tab.js',
          'js/affix.js',
          'js/one/main.js',
          'js/one/jquery.i18n.properties.js',
          'js/one/i18n.js',
        ].map(function (item) {
          return prefixSrc + item;
        }),
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    uglify: {
      core: {
        src : '<%= concat.bootstrap.dest %>',
        dest: 'dist/js/<%= pkg.name %>.js'
      }
    },

    less: {
      compileCore : {
        options: {
          strictMath       : true,
          sourceMap        : true,
          outputSourceFiles: true,
          sourceMapURL     : '<%= pkg.name %>.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>.css.map'
        },
        src    : prefixSrc + 'less/bootstrap.less',
        dest   : 'dist/css/<%= pkg.name %>.css'
      },
      compileTheme: {
        options: {
          strictMath       : true,
          sourceMap        : true,
          outputSourceFiles: true,
          sourceMapURL     : '<%= pkg.name %>-theme.css.map',
          sourceMapFilename: 'dist/css/<%= pkg.name %>-theme.css.map'
        },
        src    : prefixSrc + 'less/theme.less',
        dest   : 'dist/css/<%= pkg.name %>-theme.css'
      }
    },

    autoprefixer: {
      options: {
        browsers: [
          "Android 2.3",
          "Android >= 4",
          "Chrome >= 20",
          "Firefox >= 24",
          "Explorer >= 8",
          "iOS >= 6",
          "Opera >= 12",
          "Safari >= 6"
        ]
      },
      core   : {
        options: {
          map: true
        },
        src    : 'dist/css/<%= pkg.name %>.css'
      },
      theme  : {
        options: {
          map: true
        },
        src    : 'dist/css/<%= pkg.name %>-theme.css'
      }
    },

    csslint: {
      options: {
        csslintrc: prefixSrc + 'less/.csslintrc'
      },
      dist   : [
        'dist/css/<%= pkg.name %>.css',
        'dist/css/<%= pkg.name %>-theme.css'
      ]
    },

    cssmin: {
      options    : {
        compatibility      : 'ie8',
        keepSpecialComments: '*',
        advanced           : false
      },
      minifyCore : {
        src : 'dist/css/<%= pkg.name %>.css',
        dest: 'dist/css/<%= pkg.name %>.css'
      },
      minifyTheme: {
        src : 'dist/css/<%= pkg.name %>-theme.css',
        dest: 'dist/css/<%= pkg.name %>-theme.css'
      }
    },

    csscomb: {
      options: {
        config: prefixSrc + 'less/.csscomb.json'
      },
      dist   : {
        expand: true,
        cwd   : 'dist/css/',
        src   : ['*.css', '!*.min.css'],
        dest  : 'dist/css/'
      }
    },

    copy: {
      fonts: {
        expand: true,
        cwd   : 'src/fonts',
        src   : '**',
        dest  : 'dist/fonts'
      },
      lang : {
        expand: true,
        cwd   : 'src/i18n',
        src   : '**',
        dest  : 'dist/i18n'
      }
    },

    watch: {
      src : {
        files: 'src/js/**/*.js',
        tasks: ['concat']
        //tasks: ['jshint:core', 'concat']
      },
      less: {
        files: prefixSrc + 'less/**/*.less',
        tasks: 'less'
      }
    },

    imagemin: {
      dynamic: {
        files: [{
          expand: true,
          cwd   : 'src/',
          src   : ['**/*.{png,jpg,gif,ico}'],
          dest  : 'dist/'
        }]
      }
    }

  });

  // These plugins provide necessary tasks.
  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});
  require('time-grunt')(grunt);

  grunt.loadNpmTasks('grunt-contrib-imagemin');

  // JS distribution task.
  grunt.registerTask('dist-js', ['concat', 'uglify:core']);
  grunt.registerTask('dev-js', ['concat']);

  // CSS distribution task.
  grunt.registerTask('less-compile', ['less:compileCore', 'less:compileTheme']);

  grunt.registerTask('dist-css', ['less-compile', 'autoprefixer:core', 'autoprefixer:theme', 'csscomb:dist', 'cssmin:minifyCore', 'cssmin:minifyTheme']);
  grunt.registerTask('dev-css', ['less-compile', 'autoprefixer:core', 'csscomb:dist']);

  // Full distribution task.
  grunt.registerTask('dist', ['clean:dist', 'dist-css', 'copy', 'dist-js', 'imagemin']);

  // Default task.
  grunt.registerTask('dev', ['clean:dist', 'dev-css', 'copy', 'dev-js', 'imagemin', 'watch']);

};