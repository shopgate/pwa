// Shim memo
// eslint-disable-next-line require-jsdoc
const memo = Component => Component;

module.exports = {
  ...jest.requireActual('react'),
  memo,
};
