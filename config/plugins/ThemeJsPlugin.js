const path = require('path');
const fs = require('fs');
const { appLess, appPublic } = require('../paths');
const { loadAndResolveLessVars } =  require('@hon2a/less-vars-to-js');

const THEME_FILE_NAME = 'theme.js';

class ThemeJsPlugin {
  constructor(options) {
    this.options = options || {};
  }

  async apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'ThemeJsPlugin',
      async (compilation, cb) => {
        const filePath = path.resolve(appPublic, THEME_FILE_NAME);
        const vars = await loadAndResolveLessVars(path.resolve(appLess, 'variables/custom-vars.less'));
        const varsAddAt = Object.keys(vars).reduce((sum, k) => {
          sum[`@${k}`] = vars[k];
          return sum;
        }, {});
        const jsContent = `
// this file is required by building script too

// when change variable name, please change 'antdPlugin.js' setting
const theme = ${JSON.stringify(varsAddAt, null, 2)};

if (typeof window !== 'undefined') {
  window.theme = theme;
}
        `;

        fs.writeFileSync(filePath, jsContent);
        cb();
      }
    )
  }
}

module.exports = ThemeJsPlugin;
