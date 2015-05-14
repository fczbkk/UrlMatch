module.exports = (grunt) ->

  require('load-grunt-tasks')(grunt)

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    banner:
      """
        /*
        <%= pkg.title %>, v<%= pkg.version %>
        by <%= pkg.author %>
        <%= pkg.homepage %>
        */

      """

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
          banner: "<%= banner %>"
        files:
          'build/url-match.min.js' : ['build/url-match.js']

    watch:
      default:
        options:
          atBegin: true
        files: ['src/url-match.coffee', 'test/src/url-match.spec.coffee']
        tasks: ['dev']

    changelog:
      options: {}

    bump:
      options:
        files: [
          'package.json'
          'bower.json'
        ]
        updateConfigs: ['pkg']
        commitFiles: ['-a']
        pushTo: 'origin'


  # Constructs the code, runs tests and if everyting is OK, creates a minified
  # version ready for production. This task is intended to be run manually.
  grunt.registerTask 'build', 'Bumps version and builds JS.', (version_type) ->
    version_type = 'patch' unless version_type in ['patch', 'minor', 'major']
    grunt.task.run [
      "bump-only:#{version_type}"
      'dev'
      'uglify'
      'changelog'
      'bump-commit'
    ]


  grunt.registerTask 'dev', [
    'coffeelint'
    'coffee:default'
    'jasmine:default'
  ]
  grunt.registerTask 'default', [
    'watch:default'
  ]
