const fs = require('fs');
const os = require('os');
const path = require('path');
const getTypeCheckProjects = require('./getTypeCheckProjects');

describe('getTypeCheckProjects', () => {
  let root;
  let themePath;

  const write = (file, content = '{}') => {
    const target = path.join(root, file);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, content);
  };

  beforeEach(() => {
    root = fs.realpathSync(fs.mkdtempSync(path.join(os.tmpdir(), 'type-check-')));
    themePath = path.join(root, 'themes', 'theme-test');
    fs.mkdirSync(themePath, { recursive: true });
  });

  afterEach(() => {
    fs.rmSync(root, {
      recursive: true,
      force: true,
    });
  });

  it('returns the theme and the attached extensions that have a tsconfig', () => {
    write('themes/theme-test/tsconfig.json');
    write('extensions/typed/frontend/tsconfig.json');
    write('extensions/untyped/frontend/index.js', '');
    write('extensions/detached/frontend/tsconfig.json');

    const projects = getTypeCheckProjects(themePath, {
      '@acme/typed': { path: 'typed' },
      '@acme/untyped': { path: 'untyped' },
    });

    expect(projects.map(({ name, path: projectPath, isTheme }) => ({
      name,
      path: projectPath,
      isTheme,
    }))).toEqual([
      {
        name: 'theme-test',
        path: themePath,
        isTheme: true,
      },
      {
        name: '@acme/typed',
        path: path.join(root, 'extensions', 'typed', 'frontend'),
        isTheme: false,
      },
    ]);
  });

  it('leaves out a theme without a tsconfig', () => {
    expect(getTypeCheckProjects(themePath)).toEqual([]);
  });

  it('resolves the compiler that the project has installed', () => {
    write('extensions/typed/frontend/tsconfig.json');
    write(
      'extensions/typed/frontend/node_modules/typescript/package.json',
      JSON.stringify({ bin: { tsc: './bin/tsc' } })
    );

    const [project] = getTypeCheckProjects(themePath, { '@acme/typed': { path: 'typed' } });

    expect(project.tsc).toBe(path.join(
      root, 'extensions', 'typed', 'frontend', 'node_modules', 'typescript', 'bin', 'tsc'
    ));
  });

  it('reports no compiler when the project has none installed', () => {
    write('extensions/typed/frontend/tsconfig.json');

    const [project] = getTypeCheckProjects(themePath, { '@acme/typed': { path: 'typed' } });

    expect(project.tsc).toBeNull();
  });
});
