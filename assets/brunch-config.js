exports.config = {
    // See http://brunch.io/#documentation for docs.
    files: {
      javascripts: {
        joinTo: {
          'js/app.js': [
            'js/*.js',
            'vendor/*.js'
          ],
          // 'js/aframe.js': [
          //   'aframe/*.js',
          //   'aframe/components/*.js'
          // ]
          'js/aframe.js': [
            /^aframe/,
            //phoenix deps didnt load in /aframe...
            'node_modules/phoenix_html/priv/static/phoenix_html.js',
            'node_modules/phoenix/priv/static/phoenix.cjs.js'
          ]
        },
  
        // To use a separate vendor.js bundle, specify two files path
        // https://github.com/brunch/brunch/blob/stable/docs/config.md#files
        // joinTo: {
        //  'js/app.js': /^(web\/static\/js)/,
        //  'js/vendor.js': /^(web\/static\/vendor)|(deps)/
        // },
        //
        // To change the order of concatenation of files, explicitly mention here
        // https://github.com/brunch/brunch/tree/master/docs#concatenation
        order: {
          before: [
            'vendor/d3.min.js',
          ],
          after: [
            'vendor/d3-msg-seq.js',
          ]
        }
      },
      stylesheets: {
        joinTo: 'css/app.css'
      },
      templates: {
        joinTo: 'js/app.js'
      }
    },
  
    conventions: {
      // This option sets where we should place non-css and non-js assets in.
      // By default, we set this to '/web/static/assets'. Files in this directory
      // will be copied to `paths.public`, which is "priv/static" by default.
      // assets: /^(static)/
      assets: /static\//
    },
  
    // Phoenix paths configuration
    paths: {
      // Dependencies and current project directories to watch
      watched: ["images", "static", "css", "js", "vendor", "aframe", "components"],
  
      // Where to compile files to
      public: "../priv/static"
    },
  
    // Configure your plugins
    plugins: {
      babel: {
        // Do not use ES6 compiler in vendor code
        ignore: [/vendor/]
      }
    },
  
    modules: {
      autoRequire: {
        "js/app.js": ["js/app.js"],
       // "js/aframe.js": ["aframe/*.js"]
       "js/aframe.js": ["aframe/aframeApp.js"]//, "aframe/test.js"]
      }
    },
  
    npm: {
      enabled: true
    }
  };
  