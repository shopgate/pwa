/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ParsedLink from './index';

describe('Tests link options', () => {
  global.console.groupCollapsed = () => {};

  const testLinks = {
    '/item/123': [
      {
        action: 'reactRouter',
        options: {
          queryParams: {},
          url: '/item/123',
        },
      },
    ],
    'shopgate-12345://item/123': [
      {
        action: 'reactRouter',
        options: {
          queryParams: {},
          url: '/item/123',
        },
      },
    ],
    '/': [
      {
        action: 'reactRouter',
        options: {
          queryParams: {},
          url: '/',
        },
      },
    ],
    '/category': [
      {
        action: 'reactRouter',
        options: {
          queryParams: {},
          url: '/category',
        },
      },
    ],
    '/category/123': [
      {
        action: 'reactRouter',
        options: {
          queryParams: {},
          url: '/category/123',
        },
      },
    ],

    // Legacy pages.
    '/register_legacy': [
      {
        action: 'legacyLink',
        options: {
          targetTab: 'main',
          url: '/register/default',
        },
      },
    ],
    '/page/shipping': [
      {
        action: 'legacyLink',
        options: {
          targetTab: 'main',
          url: '/page/shipping',
        },
      },
    ],
    '/page/terms': [
      {
        action: 'legacyLink',
        options: {
          targetTab: 'main',
          url: '/page/terms',
        },
      },
    ],
    '/page/return_policy': [
      {
        action: 'legacyLink',
        options: {
          targetTab: 'main',
          url: '/page/return_policy',
        },
      },
    ],
    '/page/privacy': [
      {
        action: 'legacyLink',
        options: {
          targetTab: 'main',
          url: '/page/privacy',
        },
      },
    ],
    '/page/imprint': [
      {
        action: 'legacyLink',
        options: {
          targetTab: 'main',
          url: '/page/imprint',
        },
      },
    ],
    '/page/payment': [
      {
        action: 'legacyLink',
        options: {
          targetTab: 'main',
          url: '/page/payment',
        },
      },
    ],
    '/page/warranty': [
      {
        action: 'legacyLink',
        options: {
          targetTab: 'main',
          url: '/page/warranty',
        },
      },
    ],
    // Custom pages.
    '/page/foo': [
      {
        action: 'reactRouter',
        options: {
          queryParams: {},
          url: '/page/foo',
        },
      },
    ],
    '/account': [
      {
        action: 'legacyLink',
        options: {
          targetTab: 'main',
          url: '/account',
        },
      },
    ],
    '/storefinder': [
      {
        action: 'legacyLink',
        options: {
          targetTab: 'main',
          url: '/storefinder',
        },
      },
    ],
    '/orders': [
      {
        action: 'reactRouter',
        options: {
          queryParams: {},
          url: '/orders',
        },
      },
    ],
    '/channel/sn-10006?shop_number=10006': [
      {
        action: 'legacyLink',
        options: {
          targetTab: 'main',
          url: '/channel/sn-10006?shop_number=10006',
        },
      },
    ],
    '/favourite_list': [
      {
        action: 'legacyLink',
        options: {
          navigationType: 'plain',
          targetTab: 'favourite_list',
          url: '/favourite_list',
          popTabToRoot: true,
        },
      },
    ],
    '/search?s=test': [
      {
        action: 'reactRouter',
        options: {
          queryParams: {
            s: 'test',
          },
          url: '/search?s=test',
        },
      },
    ],
    'shopgate-12345://search?s=test': [
      {
        action: 'reactRouter',
        options: {
          queryParams: {
            s: 'test',
          },
          url: '/search?s=test',
        },
      },
    ],
    'http://www.shopgate.com/foo/bar?a=b': [
      {
        action: 'externalLink',
        options: 'http://www.shopgate.com/foo/bar?a=b',
      },
    ],
    'tel:1234': [
      {
        action: 'native',
        options: 'tel:1234',
      },
    ],
    'mailto:noreply@shopgate.com': [
      {
        action: 'native',
        options: 'mailto:noreply@shopgate.com',
      },
    ],
  };

  Object.keys(testLinks).forEach((link) => {
    it(`should parse '${link}' and use [${
      testLinks[link].map(l => l.action).join(',')
    }] to handle link`, () => {
      const parsedLink = new ParsedLink(link);
      expect(parsedLink.getHandlers()).toEqual(testLinks[link]);
    });
  });
});
