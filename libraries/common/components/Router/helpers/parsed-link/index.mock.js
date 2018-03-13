import options from './options';

/**
 * Mock of ParsedLink.
 */
class ParsedLinkMock {
  /**
   * Constructs the mock and prepares a mock of open function.
   * @param {string} href Href.
   */
  constructor(href) {
    this.href = options.convertDeepLink(href);
    this.originalHref = href;
    this.openFunctionMock = jest.fn();
  }

  /**
   * Mock of original `.open` function.
   * Calls `.openFunctionMock` only.
   */
  open() {
    this.openFunctionMock();
  }
}

export default ParsedLinkMock;
