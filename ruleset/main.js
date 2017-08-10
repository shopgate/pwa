/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

 const path = require('path');

module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  env: {
    browser: true,
    node: true,
    jest: true,
    mocha: true,
  },
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    },
  },
  rules: {
    'capitalized-comments': ['error', 'always'],
    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'never',
    }],
    'import/extensions': ['error', 'never'],
    'import/prefer-default-export': 'off',
    'import/no-extraneous-dependencies': 'off',
    'no-multiple-empty-lines': [2, {
      'max': 1,
      'maxBOF': 0, 
      'maxEOF': 1
    }],
    'no-prototype-builtins': 'off',
    'require-jsdoc': [2, {
      require: {
        FunctionDeclaration: true,
        MethodDefinition: true,
        ClassDeclaration: true,
        ArrowFunctionExpression: true,
      }
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
      }
    }],
  },
  settings: {
    'import/extensions': [
      '.js',
      '.json',
      '.jsx'
    ],
  },
};
