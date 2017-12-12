/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */
import ParsedLink from './index';

/**
 * Mock of ParsedLink.
 */
class ParsedLinkMock extends ParsedLink {
  /**
   * @inheritDoc
   */
  constructor(...args) {
    super(...args);
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
