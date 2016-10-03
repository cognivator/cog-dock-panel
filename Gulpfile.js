(function () {
  "use strict";
  var path = require('path'),
      fs = require('fs');

  var appRoot = require('app-root-path').toString();

  var gulp = require('gulp'),
      $G = require('gulp-load-plugins')(),
      pump = require('pump'),
      del = require('del');
      // combiner = require('stream-combiner2'),
      // conventionalGithubReleaser = require('conventional-github-releaser');

  var yargs = require('yargs'),
      argv = yargs.argv,
      _ = require('lodash'),
      Q = require('q');

  var conversions = require(path.join(appRoot, 'util', 'conversions.js'));

  var root = appRoot;
  var paths = {
    root: root,
    libroot: path.join(root, 'lib'),
    styleroot: path.join(root, 'lib', 'style'),
    stageroot: path.join(root, 'stage')
  };

  var globs = {
    scss: path.join('**', '*.scss'),
    less: path.join('**', '*.less'),
    modules: path.join('**', '*.module.js'),
    js: path.join('**', '*.js')
  };

  var files = {
    CHANGELOG: 'CHANGELOG.md'
  };


  //// RELEASE

  /// Version
  gulp.task('recommend-bump', function () {
    var cmd = 'conventional-recommended-bump -p angular';

    var options = {
      pipeStdout: true
    };

    gulp.src('')
        .pipe($G.exec(cmd, options))
        .pipe($G.tap(function (file) {
          console.log(file.contents && file.contents.toString());
        }));
  });

  gulp.task('bump-version', function (done) {
    // Set command argument `--bump <type>` to specify 'major', 'minor' or a 'patch' [default] change.
    // Use task 'recommend-bump' to get a suggested type based on commit structure.
    var type = argv.bump || 'patch';

    pump([
      gulp.src(['./package.json']),
      $G.bump({type: type}).on('error', $G.util.log),
      gulp.dest('./')
    ], done);
  });

  /// Changelog / Release notes
  gulp.task('changelog', function (done) {
    pump([
      gulp.src(files.CHANGELOG, {
        buffer: false
      }),
      $G.conventionalChangelog({
        preset: 'angular' // Or to any other commit message convention you use.
      }),
      gulp.dest('./')
    ], done);
  });

  /// VCS operations
  gulp.task('commit-changes', function (done) {
    pump([
      gulp.src('.'),
      $G.git.add(),
      $G.git.commit('[Prerelease] Bumped version number')
    ], done);
  });

  gulp.task('push-changes', function (done) {
    $G.git.push('origin', 'master', done);
  });

  /// Packaging
  gulp.task('create-new-tag', function (done) {
    var version = getPackageJsonVersion();
    $G.git.tag(version, 'Created Tag for version: ' + version, function (error) {
      if (error) {
        return done(error);
      }
      $G.git.push('origin', 'master', {args: '--tags'}, done);
    });

    function getPackageJsonVersion() {
      // We parse the json file instead of using require because require caches
      // multiple calls so the version number won't be updated
      return JSON.parse(fs.readFileSync('./package.json', 'utf8')).version;
    }
  });

  /*
   gulp.task('github-release', function (done) {
   conventionalGithubReleaser({
   // TODO:1 Modify for this project
   type: "oauth",
   token: '0126af95c0e2d9b0a7c78738c4c00a860b04acc8' // change this to your own GitHub token or use an environment variable
   }, {
   preset: 'angular' // Or to any other commit message convention you use.
   }, done);
   });
   */

  /// EntryPoint - RELEASE
  gulp.task('release', function (done) {
    $G.sequence(
        'bump-version',
        'changelog',
        'commit-changes',
        'push-changes',
        'create-new-tag',
        // 'github-release',
        function (error) {
          if (error) {
            console.log(error.message);
          } else {
            console.log('RELEASE FINISHED SUCCESSFULLY');
          }
          done(error);
        });
  });


  //// BUILD

  /// Cleaners
  gulp.task('clean-stage', function (done) {
    clean(paths.stageroot, done);
  });

  gulp.task('clean-less', function (done) {
    clean(path.join(paths.styleroot, 'less'), done);
  });

  gulp.task('clean-root', function (done) {
    var delPaths = [
      path.join(paths.root, 'ng-dock-panel*.js'),
      path.join(paths.root, 'ng-dock-panel*.css')
    ];
    clean(delPaths, done);
  });

  /// Styles
  gulp.task('lint-styles', function (done) {
    var processors = [
          // require('postcss-unprefix')  // causes first 'transform:' within a block to disappear
          require('stylelint'),
          require('postcss-class-prefix')('dock-', {ignore: [/ng-/, /dock-/, /ui-/]}),
          require('autoprefixer')
        ],
        syntax = require('postcss-scss');

    pump([
      gulp.src(path.join(paths.styleroot, globs.scss)),
      $G.plumber(),
      $G.postcss(processors, {syntax: syntax}),
      gulp.dest(paths.stageroot)
    ], done);
  });

  gulp.task('convert-sass-less', function (done) {
    var srcOptions = {
      base: path.join(paths.stageroot, 'sass')
    };

    pump([
      gulp.src(path.join(paths.stageroot, 'sass', globs.scss), srcOptions),
      $G.plumber(),
      $G.change(scss2less),
      $G.rename({extname: '.less'}),
      $G.rename(scssResolveUnderscoreFiles),
      gulp.dest(path.join(paths.styleroot, 'less'))
    ], done);
  });

  gulp.task('publish-styles', function (done) {
    var processors = [
      require('cssnano')
    ];

    var sassOptions = {
      outputStyle: 'expanded'
    };


    pump([
      gulp.src(path.join(paths.stageroot, 'sass', globs.scss)),
      $G.plumber(),
      $G.sass(sassOptions),
      $G.flatten(),
      gulp.dest(paths.root),
      $G.postcss(processors),
      $G.rename({extname: '.min.css'}),
      gulp.dest(paths.root)
    ], done);
  });

  gulp.task('build-styles', function (done) {
    $G.sequence('lint-styles', ['convert-sass-less', 'publish-styles'], done);
  });

  /// Modules
  gulp.task('build-module', function (done) {
    pump([
      gulp.src([path.join(paths.libroot, globs.modules), path.join(paths.libroot, globs.js)]),
      $G.plumber(),
      $G.concat('ng-dock-panel.js'),
      $G.flatten(),
      gulp.dest(paths.root),
      $G.uglify(),
      $G.rename({extname: '.min.js'}),
      gulp.dest(paths.root)
    ], done);
  });

  /// EntryPoint - BUILD
  gulp.task('build', ['build-styles', 'build-module'], function (done) {
    done();
  });


  //// DEFAULT
  gulp.task('default', function (done) {
    $G.sequence(['clean-less', 'clean-root'], 'build', 'clean-stage', done);
  });


  //// EXPERIMENTS ////
  gulp.task('test-less', function (done) {
    pump([
      gulp.src(path.join(paths.styleroot, 'less', globs.less)),
      $G.plumber(),
      $G.tap(function (file) {
        console.log('tapped: ', file.path);
      }),
      $G.less(),
      $G.tap(function (file) {
        console.log('lessed: ', file.path);
      }),
      $G.flatten(),
      $G.tap(function (file) {
        console.log('flattened: ', file.path);
      }),
      gulp.dest(path.join(paths.root, 'lesstest')),
    ], done);
  });


  //// HELPERS ////
  function scss2less(content) {
    var rules = conversions.scss2less;

    return _.reduce(rules, function (content, rule, idx, rules) {
      var pattern = rule.pattern,
          replace = rule.replace,
          iterate = 'iterated' === rule.type;

      do {
        content = content.replace(pattern, replace);
      } while (iterate && pattern.test(content));

      return content;
    }, content);
  }

  function scssResolveUnderscoreFiles(path) {
    path.basename = path.basename.replace(/^\_/, '');
  }

  function clean(delPaths, done) {

    return Q(del(delPaths))
        .nodeify(done);
  }

})();
