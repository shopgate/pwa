/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

const defaults = { suggestions: [] };
const dummyData = {
  '!!!sh': {
    ...defaults,
    suggestions: [
      'Shirt',
      'Shorts',
      'Shirtbluse',
      'Shirt Farbrausch',
      'Shirt PureNATURE',
      'Shirt PureLUX',
      'Sherwood Squared',
      'Shorts PureNATURE',
      'Sherwood',
      'Shirt PureMIX',
    ],
  },
  '!!!shi': {
    ...defaults,
    suggestions: [
      'Shirt',
      'Shirt PureNATURE',
      'Shirt PureWOOL',
      'Shirt PureMIX',
      'Shirt Farbrausch',
      'Shirt PureLUX',
      'Shirtbluse',
      'Shirt Mädchen',
      'Shirt Leinen',
      'Shirt PureDAILY',
    ],
  },
  '!!!shir': {
    ...defaults,
    suggestions: [
      'Shirt',
      'Shirt PureNATURE',
      'Shirt PureWOOL',
      'Shirt PureMIX',
      'Shirt Farbrausch',
      'Shirt PureLUX',
      'Shirtbluse',
      'Shirt Mädchen',
      'Shirt Leinen',
      'Shirt PureDAILY',
    ],
  },
  '!!!shirt': {
    ...defaults,
    suggestions: [
      'Shirt',
      '!!!Shirt Farbrausch',
      'Shirt Leinen',
      'Shirt Farbrausch blau',
      'Shirt Großtadtdschungel',
    ],
  },
  '!!!shirt farbrausch': {
    ...defaults,
    suggestions: ['Foo', 'Bar', 'Baz'],
  },
};

/**
 * A mocked pipeline.
 */
class MockedPipeline {
  /**
   * Sets the input for the pipeline request.
   * @param {string} searchPhrase The search phrase.
   * @return {MockedPipeline}
   */
  setInput({ searchPhrase }) {
    this.searchPhrase = searchPhrase;
    return this;
  }

  /**
   * Dispatches the pipeline request.
   * @return {Promise}
   */
  dispatch() {
    return new Promise(resolve =>
      setTimeout(() => resolve(dummyData[this.searchPhrase.toLowerCase()] || defaults), 1000)
    );
  }
}

export default MockedPipeline;
