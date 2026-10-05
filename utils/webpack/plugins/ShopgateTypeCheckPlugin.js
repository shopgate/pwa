const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const {
  blue, cyan, green, grey, red, yellow,
} = require('chalk');
const logger = require('../lib/logger');
const i18n = require('../lib/i18n');
const getTypeCheckProjects = require('../lib/getTypeCheckProjects');
const createTypeCheckParser = require('../lib/createTypeCheckParser');

const t = i18n(__filename);
const LAST_LINES = 20;
const WATCHER = path.resolve(__dirname, '..', 'lib', 'typeCheckWatcher.js');
const NODE_MODULES = `${path.sep}node_modules${path.sep}`;

/**
 * Reads the attached extensions from the environment.
 * @return {Object}
 */
function getAttachedExtensions() {
  try {
    return JSON.parse(process.env.extensions);
  } catch (error) {
    return {};
  }
}

/**
 * Prints the result of a check to the console.
 * @param {Object} project The project.
 * @param {Object[]} errors The errors of the project.
 */
function report(project, errors) {
  const prefix = blue(`[${project.name}]`);

  errors.forEach((error) => {
    const location = error.file
      ? `${cyan(path.relative(process.cwd(), error.file))}:${error.line}:${error.column} - `
      : '';

    logger.log(`${prefix} ${location}${red('error')} ${grey(`${error.code}:`)} ${error.message}`);
  });

  logger.log(`${prefix} ${errors.length > 0
    ? red(t('ERRORS', { count: errors.length }))
    : green(t('NO_ERRORS'))}`);
}

/**
 * Type checks the theme and the attached extensions next to a watching build. The errors are
 * printed to the console and optionally shown in the overlay of the dev server; they never fail
 * the build.
 */
class ShopgateTypeCheckPlugin {
  /**
   * @param {Object} [options={}] The plugin options.
   * @param {boolean} [options.overlay=false] Whether the errors are also shown in the browser.
   */
  constructor({ overlay = false } = {}) {
    this.overlay = overlay;
    this.started = false;
    this.results = new Map();
    this.buildErrors = [];
    this.devServer = null;
    this.overlayShown = false;
  }

  /**
   * @param {Object} compiler The webpack compiler
   */
  apply(compiler) {
    compiler.hooks.watchRun.tap('ShopgateTypeCheckPlugin', () => {
      if (this.started) {
        return;
      }

      this.started = true;
      this.start();
    });

    compiler.hooks.done.tap('ShopgateTypeCheckPlugin', (stats) => {
      this.buildErrors = stats.toJson({
        all: false,
        errors: true,
      }).errors || [];
      setImmediate(() => this.updateOverlay());
    });
  }

  /**
   * Connects the plugin with the dev server, so that it can show the errors in the browser.
   * @param {Object} devServer The dev server.
   */
  setDevServer(devServer) {
    if (!this.overlay || !devServer.webSocketServer) {
      return;
    }

    this.devServer = devServer;
    devServer.webSocketServer.implementation.on('connection', (client) => {
      setImmediate(() => this.updateOverlay([client]));
    });
  }

  /**
   * Starts a TypeScript compiler in watch mode for every project.
   */
  start() {
    const projects = getTypeCheckProjects(process.cwd(), getAttachedExtensions());

    projects.forEach((project) => {
      if (!project.tsc) {
        logger.warn(yellow(`  ${t('NO_TYPESCRIPT', { name: project.name })}`));
        return;
      }

      logger.log(blue(`  ${t('CHECKING', { name: project.name })}`));
      this.watch(project);
    });
  }

  /**
   * Runs the TypeScript compiler of a project in watch mode and collects its errors.
   * @param {Object} project The project.
   */
  watch(project) {
    const projectPath = fs.realpathSync(project.path);
    const child = spawn(process.execPath, [
      WATCHER,
      project.tsc,
      '--project',
      projectPath,
      '--noEmit',
      '--watch',
      '--preserveWatchOutput',
      '--pretty',
      'false',
    ], {
      cwd: projectPath,
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    const parse = createTypeCheckParser();
    const lastLines = [];

    [child.stdout, child.stderr].forEach((stream) => {
      readline.createInterface({ input: stream }).on('line', (line) => {
        if (line.trim()) {
          lastLines.push(line);
          lastLines.splice(0, lastLines.length - LAST_LINES);
        }

        const event = parse(line);

        if (!event) {
          return;
        }

        if (event.type === 'started') {
          this.results.delete(project.name);
          return;
        }

        const errors = event.errors
          .map(error => ({
            ...error,
            file: error.file && path.resolve(projectPath, error.file),
          }))
          .filter(error => project.isTheme || !error.file || (
            error.file.startsWith(`${projectPath}${path.sep}`)
            && !error.file.slice(projectPath.length).includes(NODE_MODULES)
          ));

        this.results.set(project.name, errors);
        report(project, errors);
        this.updateOverlay();
      });
    });

    child.on('error', (error) => {
      logger.warn(yellow(`  ${t('FAILED', {
        name: project.name,
        message: error.message,
      })}`));
    });

    child.on('exit', (code, signal) => {
      if (code === 0) {
        return;
      }

      logger.warn(yellow(`  ${t('STOPPED', {
        name: project.name,
        reason: signal || code,
      })}`));
      lastLines.forEach(line => logger.warn(`${blue(`[${project.name}]`)} ${line}`));
      this.results.delete(project.name);
      this.updateOverlay();
    });
  }

  /**
   * Shows the errors of all finished checks in the overlay of the dev server, together with the
   * errors of the build, since the overlay only holds one set of errors. Without type errors the
   * overlay is handed back to the dev server.
   * @param {Object[]} [clients] The browser connections to update. Defaults to all.
   */
  updateOverlay(clients) {
    if (!this.devServer) {
      return;
    }

    const receivers = clients || this.devServer.webSocketServer.clients;
    const typeErrors = [];

    this.results.forEach((errors, name) => {
      errors.forEach((error) => {
        typeErrors.push({
          moduleName: error.file ? path.relative(process.cwd(), error.file) : name,
          loc: error.file ? `${error.line}:${error.column}` : '',
          message: `${error.code}: ${error.message}`,
        });
      });
    });

    if (typeErrors.length > 0) {
      this.overlayShown = true;
      this.devServer.sendMessage(receivers, 'errors', [...this.buildErrors, ...typeErrors]);
    } else if (this.overlayShown && !clients) {
      this.overlayShown = false;

      if (this.buildErrors.length > 0) {
        this.devServer.sendMessage(receivers, 'errors', this.buildErrors);
      } else {
        this.devServer.sendMessage(receivers, 'still-ok');
      }
    }
  }
}

module.exports = ShopgateTypeCheckPlugin;
