/**
 * Mock for getElementById
 * @param {Function} scrollSpy Element.scroll spy function.
 * @returns {Function}
 */
const getElementById = scrollSpy => () => ({
  offsetTop: 100,
  closest() {
    return {
      scroll: scrollSpy,
    };
  },
});

export { getElementById };
