
// this file is required by building script too

// when change variable name, please change 'antdPlugin.js' setting
const theme = {
  "@primary-color": "#ff00ff",
  "@secondry-color": "#ff0000",
  "@my-app": "#add"
};

if (typeof window !== 'undefined') {
  window.theme = theme;
}
        