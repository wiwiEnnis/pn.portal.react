const path = require('path');
const { appNodeModules, appLess } = require('../paths');
const { loadAndResolveLessVars } =  require('@hon2a/less-vars-to-js');
const { generateTheme } = require("antd-theme-generator");

class AntdThemePlugin {
  constructor(options) {
    const defaultOptions = {
      antDir: path.resolve(appNodeModules, 'antd'),
      stylesDir: appLess,
      varFile: path.resolve(appLess, 'variables/vars.less'),
      mainLessFile: path.resolve(appLess, 'index.less'),
      indexFileName: ' index.html',
      generateOnce: false,
      lessUrl: '/less.min.js',
      publicPath: '',
      customColorRegexArray: [/^fade\(.*\)$/], // An array of regex codes to match your custom color variable values so that code can identify that it's a valid color. Make sure your regex does not adds false positives.
    };
    this.options = defaultOptions;
  }

  async apply(compiler) {
    compiler.hooks.emit.tapAsync('AntdThemePlugin', async (compilation, callback) => {
      const vars = await loadAndResolveLessVars(path.resolve(appLess, 'variables/custom-vars.less'));
      const themeVariables = Object.keys(vars).map(o => `@${o}`);
      const options = {
        ...this.options,
        themeVariables,
      };
      const less = `
    <link rel="stylesheet/less" type="text/css" href="${options.publicPath}/color.less" />
    <script>
      window.less = {
        async: false,
        env: 'production'
      };
    </script>
    <script type="text/javascript" src="${options.lessUrl}"></script>
        `;
      if (
        options.indexFileName &&
        options.indexFileName in compilation.assets
      ) {
        const index = compilation.assets[options.indexFileName];
        let content = index.source();

        if (!content.match(/\/color\.less/g)) {
          index.source = () =>
            content.replace(less, "").replace(/<body>/gi, `<body>${less}`);
          content = index.source();
          index.size = () => content.length;
        }
      }

      if (options.generateOnce && this.colors) {
        compilation.assets["color.less"] = {
          source: () => this.colors,
          size: () => this.colors.length
        };
        return callback();
      }
      generateTheme(options)
        .then(css => {
          console.log(css.slice(0, 100));
          if (options.generateOnce) {
            this.colors = css;
          }
          compilation.assets["color.less"] = {
            source: () => css,
            size: () => css.length
          };
          callback();
        })
        .catch(err => {
          callback(err);
        });
    });
  }
}

module.exports = AntdThemePlugin;
