module.exports = {
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
    jest: true,
    mocha: true,
    'cypress/globals': true,
  },
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    // Added this according to: https://eslint.org/docs/rules/camelcase#allow
    camelcase: ['error', {
      allow: [
        'UNSAFE_componentWillMount',
        'UNSAFE_componentWillReceiveProps',
        'UNSAFE_componentWillUpdate',
      ],
    }],
    'capitalized-comments': 0,
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'never',
        jsx: 'never',
        ts: 'never',
        tsx: 'never',
        json: 'always',
      },
    ],
    'no-restricted-syntax': [
      'error',
      // Rules copied from airbnb base ruleset
      {
        selector: 'ForInStatement',
        message: 'for..in loops iterate over the entire prototype chain, which is virtually never what you want. Use Object.{keys,values,entries}, and iterate over the resulting array.',
      },
      {
        selector: 'LabeledStatement',
        message: 'Labels are a form of GOTO; using them makes code confusing and hard to maintain and understand.',
      },
      {
        selector: 'WithStatement',
        message: '`with` is disallowed in strict mode because it makes code impossible to predict and optimize.',
      },
      // Disallow named imports from JSON files since it violates the ESM specifications
      {
        selector:
          'ImportDeclaration[source.value=/\\.([Jj][Ss][Oo][Nn]|[Jj][Ss][Oo][Nn]5)(?:$|[?#])/] > ImportSpecifier',
        message:
          'Named imports from JSON are not allowed since they will not be supported by Webpack in future versions. Import the default and destructure.',
      },
    ],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/named': 'error',
    'no-multiple-empty-lines': [2, {
      max: 1,
      maxBOF: 0,
      maxEOF: 1,
    }],
    'no-prototype-builtins': 'off',
    'require-jsdoc': [2, {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: true,
      },
    }],
    // Reference: http://eslint.org/docs/rules/valid-jsdoc
    'valid-jsdoc': [2, {
      requireReturn: false,
      requireReturnDescription: false,
      preferType: {
        Boolean: 'boolean',
        Number: 'number',
        String: 'string',
        object: 'Object',
        array: 'Array',
        function: 'Function',
      },
    }],
    'operator-linebreak': 0,
    'implicit-arrow-linebreak': 0,
  },
  settings: {
    'import/extensions': [
      '.js',
      '.json',
      '.jsx',
    ],
  },
};
