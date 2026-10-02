const path = require('path');

module.exports = (request, options) => {
  const resolved = options.defaultResolver(request, options);
  const root = options.rootDir || process.cwd();

  if (path.isAbsolute(resolved) && !resolved.startsWith(root + path.sep)) {
    const error = new Error(`Cannot find module '${request}' inside ${root} (it only resolves to ${resolved})`);
    error.code = 'MODULE_NOT_FOUND';
    throw error;
  }

  return resolved;
};
