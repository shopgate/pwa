/* eslint-disable require-jsdoc */
import React from 'react';

// Shim memo
const memo = Component => Component;

module.exports = {
  ...React,
  memo,
};
/* eslint-enable */
