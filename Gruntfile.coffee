semver = require 'semver'

module.exports = (grunt) ->

  current_version = grunt.file.readJSON('package.json').version

  require('load-grunt-tasks')(grunt)

  grunt.initConfig

    pkg: grunt.file.readJSON 'package.json'

    usebanner:
      js:
        options:
          banner:
            """
              /*
              <%= pkg.title %>, v<%= pkg.version %>
              by <%= pkg.author.name %>
              <%= pkg.homepage %>
              */
            """
        files:
          src: ['./lib/*.js']

    coffeelint:
      app: ['./src/**/*.coffee']

    jasmine:
      default:
        src: ['./temp/lib/<%= pkg.name %>.js']
        options:
          keepRunner: false
          specs: './temp/test/<%= pkg.name %>.spec.js'
          summary: true

    coffee:
      default:
        options:
          bare: true
        files:
          './temp/lib/<%= pkg.name %>.js' : [
            './src/lib/pattern.coffee'
            './src/lib/url-part.coffee'
            './src/lib/scheme.coffee'
            './src/lib/host.coffee'
            './src/lib/path.coffee'
            './src/lib/params.coffee'
            './src/lib/fragment.coffee'
            './src/lib/url-match.coffee'
          ]
          './temp/test/<%= pkg.name %>.spec.js' : ['./src/test/*.coffee']
      build:
        options:
          join: true
        files:
          './lib/<%= pkg.name %>.js' : ['./src/lib/*.coffee']

    watch:
      default:
        options:
          atBegin: true
        files: ['./src/**/*.coffee']
        tasks: ['dev']

    conventionalChangelog:
      options:
        changelogOpts:
          preset: 'angular'
      release:
        src: 'CHANGELOG.md'

    bump:
      options:
        files: [
          'package.json'
          'bower.json'
        ]
        updateConfigs: ['pkg']
        commitFiles: ['-a']
        pushTo: 'origin'

    clean: ['temp']

    # dialog choices used in `release` task
    prompt:

      release:
        options:
          questions: [
            {
              config: 'version'
              type: 'list'
              message: 'Bump version from <%= pkg.version %> to:'
              default: 'patch'
              choices: [
                {
                  value: 'patch'
                  name: "Patch (#{semver.inc current_version, 'patch'})"
                }
                {
                  value: 'minor'
                  name: "Minor (#{semver.inc current_version, 'minor'})"
                }
                {
                  value: 'major'
                  name: "Major (#{semver.inc current_version, 'major'})"
                }
              ]
            }
          ]


  # Constructs the code, runs tests and if everyting is OK, creates a minified
  # version ready for production. This task is intended to be run manually.
  do_build_msg = 'Do not run directly. Use `grunt release` instead.'
  grunt.registerTask 'do_release', do_build_msg, ->

    tasks_list = [
      "bump-only:#{grunt.config 'version'}"
      'build'
      'conventionalChangelog'
      'bump-commit'
    ]

    grunt.task.run tasks_list


  grunt.registerTask 'dev', [
    'coffeelint'
    'coffee:default'
    'jasmine'
  ]

  grunt.registerTask 'build', 'Compile source code to `./lib`.', [
    'clean'
    'dev'
    'coffee:build'
    'usebanner'
  ]

  grunt.registerTask 'release', 'Build, bump version and push to GIT.', [
    'prompt:release'
    'do_release'
  ]

  grunt.registerTask 'default', [
    'watch:default'
  ]
