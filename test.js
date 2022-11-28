const path = require('path');
const f2elint = require('./lib/index');

const aa = async () => {
  await f2elint.init({
    cwd: path.resolve(__dirname, './test_project'),
    eslintType: 'vue3',
    enableStylelint: true,
    enableMarkdownlint: true,
    enablePrettier: true,
    disableNpmInstall: false,
  });
};

aa();
// cleanDir();
