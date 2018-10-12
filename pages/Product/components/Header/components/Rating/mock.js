/**
 * Mock for getElementById
 * @param {function} scrollSpy Element.scroll spy function.
 * @returns {function}
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
