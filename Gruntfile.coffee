module.exports = (grunt) ->

  grunt.initConfig
  
    pkg: grunt.file.readJSON 'package.json'
    
    coffeelint:
      app: ['src/url-match.coffee', 'test/src/url-match.spec.coffee']
    
    jasmine:
      default:
        src: ['build/url-match.js']
        options:
          keepRunner: false
          specs: 'test/spec/url-match.spec.js'

    coffee:
      default:
        files:
          'build/url-match.js' : ['src/url-match.coffee']
          'test/spec/url-match.spec.js' : ['test/src/url-match.spec.coffee']

    uglify:
      default:
        options:
          banner:
            """
              // URL Match <%= pkg.version %> (https://github.com/fczbkk/UrlMatch)
              // by <%= pkg.author %>
              
            """
        files:
          'build/url-match.min.js' : ['build/url-match.js']
    
    watch:
      default:
        options:
          atBegin: true
        files: ['src/url-match.coffee', 'test/src/url-match.spec.coffee']
        tasks: ['dev']
    
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'

  grunt.registerTask 'build', ['dev', 'uglify:default']
  grunt.registerTask 'dev', ['coffeelint', 'coffee:default', 'jasmine:default']
  grunt.registerTask 'default', ['watch:default']
