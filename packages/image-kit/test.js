const path = require('path');
const { startClient } = require('./dist/browser-run/run');

startClient({
  assetsAbsPath: path.join(
    __dirname,
    '../../apps/image-browser/image-kit-assets',
  ),
});
