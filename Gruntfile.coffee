module.exports = (grunt) ->

  grunt.initConfig
    
    coffeelint:
      app: ['src/url-match.coffee', 'test/src/url-match.spec.coffee']
    
    jasmine:
      default:
        src: ['build/url-match.js']
        options:
          keepRunner: true
          specs: 'test/spec/url-match.spec.js'

    coffee:
      default:
        files:
          'build/url-match.js' : ['src/url-match.coffee']
          'test/spec/url-match.spec.js' : ['test/src/url-match.spec.coffee']

    uglify:
      default:
        files:
          'build/url-match.min.js' : ['build/url-match.js']
    
    watch:
      default:
        options:
          atStart: true
        files: ['src/url-match.coffee', 'test/src/url-match.spec.coffee']
        tasks: ['dev']
    
    docco:
      default:
        src: ['src/url-match.coffee']
        options:
          output: 'doc/'
    
  grunt.loadNpmTasks 'grunt-coffeelint'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-uglify'
  grunt.loadNpmTasks 'grunt-contrib-jasmine'
  grunt.loadNpmTasks 'grunt-docco'
  
  grunt.registerTask 'build', ['dev', 'uglify:default', 'doc']
  grunt.registerTask 'dev', ['coffeelint', 'coffee:default', 'jasmine:default']
  grunt.registerTask 'default', ['watch:default']
  grunt.registerTask 'doc', ['docco:default']
