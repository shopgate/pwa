const path = require('path');

const ENV_KEY_DEVELOPMENT = 'development';

/** @type {"development" | "production"} */
exports.ENV = process.env.NODE_ENV || ENV_KEY_DEVELOPMENT;
exports.isDev = exports.ENV === ENV_KEY_DEVELOPMENT;
exports.PUBLIC_FOLDER = 'public';
exports.EXTENSIONS_PATH = path.resolve(process.cwd(), 'extensions');
