const fs = require('fs');
const os = require('os');
const path = require('path');
const { RuleTester } = require('eslint');
const rule = require('../missing-extension-config');

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'missing-extension-config-'));
const attached = path.join(root, 'attached', 'frontend');
const detached = path.join(root, 'detached', 'frontend');
const library = path.join(root, 'library');

fs.mkdirSync(path.join(attached, 'components'), { recursive: true });
fs.mkdirSync(path.join(detached, 'components'), { recursive: true });
fs.mkdirSync(path.join(detached, 'helpers', 'config'), { recursive: true });
fs.mkdirSync(library);
fs.writeFileSync(path.join(root, 'attached', 'extension-config.json'), '{}');
fs.writeFileSync(path.join(root, 'detached', 'extension-config.json'), '{}');
fs.writeFileSync(path.join(attached, 'config.json'), '{}');
fs.writeFileSync(path.join(detached, 'components', 'config.js'), '');
fs.writeFileSync(path.join(detached, 'helpers', 'config', 'index.ts'), '');

afterAll(() => {
  fs.rmSync(root, {
    recursive: true,
    force: true,
  });
});

const ruleTester = new RuleTester({
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
});

ruleTester.run('missing-extension-config', rule, {
  valid: [
    {
      code: "import config from './config.json';",
      filename: path.join(attached, 'index.js'),
    },
    {
      code: "import config from './config';",
      filename: path.join(attached, 'index.js'),
    },
    {
      code: "import { enabled } from '../config';",
      filename: path.join(attached, 'components', 'Component.jsx'),
    },
    {
      code: "import config from './config';",
      filename: path.join(detached, 'components', 'Component.jsx'),
    },
    {
      code: "import config from './config';",
      filename: path.join(detached, 'helpers', 'index.js'),
    },
    {
      code: "import config from './helpers/config.json';",
      filename: path.join(detached, 'index.js'),
    },
    {
      code: "import config from '@shopgate/pwa-common/helpers/config';",
      filename: path.join(detached, 'index.js'),
    },
    {
      code: "const config = require('./config.json');",
      filename: path.join(attached, 'index.js'),
    },
    {
      code: "export { default } from './config.json';",
      filename: path.join(attached, 'index.js'),
    },
    {
      code: 'const config = require(name);',
      filename: path.join(detached, 'index.js'),
    },
    {
      code: 'export const enabled = true;',
      filename: path.join(detached, 'index.js'),
    },
  ],
  invalid: [
    {
      code: "import config from './config.json';",
      filename: path.join(detached, 'index.js'),
      errors: [{
        messageId: 'missing',
        data: { source: './config.json' },
      }],
    },
    {
      code: "import config from './config';",
      filename: path.join(detached, 'index.js'),
      errors: [{ messageId: 'missing' }],
    },
    {
      code: "import { enabled } from '../../config';",
      filename: path.join(detached, 'helpers', 'config', 'index.ts'),
      errors: [{ messageId: 'missing' }],
    },
    {
      code: "import config from '../config.json';",
      filename: path.join(detached, 'components', 'Component.jsx'),
      errors: [{ messageId: 'missing' }],
    },
    {
      code: "const config = require('./config.json');",
      filename: path.join(detached, 'index.js'),
      errors: [{ messageId: 'missing' }],
    },
    {
      code: "const config = require('../config');",
      filename: path.join(detached, 'helpers', 'index.js'),
      errors: [{ messageId: 'missing' }],
    },
    {
      code: "export { default } from './config.json';",
      filename: path.join(detached, 'index.js'),
      errors: [{ messageId: 'missing' }],
    },
    {
      code: "export * from './config.json';",
      filename: path.join(detached, 'index.js'),
      errors: [{ messageId: 'missing' }],
    },
    {
      code: "const config = import('./config.json');",
      filename: path.join(detached, 'index.js'),
      errors: [{ messageId: 'missing' }],
    },
    {
      code: "import config from './config.json';",
      filename: path.join(detached, 'helpers', 'index.js'),
      errors: [{
        messageId: 'unresolved',
        data: { source: './config.json' },
      }],
    },
    {
      code: "import config from './config';",
      filename: path.join(library, 'index.js'),
      errors: [{ messageId: 'unresolved' }],
    },
    {
      code: "const config = require('./config.json');",
      filename: path.join(library, 'index.js'),
      errors: [{ messageId: 'unresolved' }],
    },
  ],
});
