const React = require('react');
const rtl = require('@testing-library/react');

const { render: rtlRender } = rtl;

/**
 * Render helper for React Testing Library to migrate Enzyme mount-with-provider tests
 * Wraps UI with an optional wrapper component to support providers.
 *
 * @param {*} ui UI under test.
 * @param {Object} options Render options.
 * @returns {*} Render result.
 */
function render(ui, options = {}) {
  const { wrapper: Wrapper, ...renderOptions } = options;

  if (!Wrapper) {
    return rtlRender(ui, renderOptions);
  }

  return rtlRender(ui, {
    ...renderOptions,
    wrapper: ({ children }) => React.createElement(Wrapper, null, children),
  });
}

module.exports = {
  ...rtl,
  render,
};
