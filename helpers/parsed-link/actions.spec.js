/**
 * Copyright (c) 2017, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import flushTab from '@shopgate/pwa-core/commands/flushTab';
import openPage from '@shopgate/pwa-core/commands/openPage';
import popTabToRoot from '@shopgate/pwa-core/commands/popTabToRoot';
import showTab from '@shopgate/pwa-core/commands/showTab';
import actions from './actions';

jest.mock('Library/commands', () => ({
  showTab: jest.fn(),
  flushTab: jest.fn(),
  popTabToRoot: jest.fn(),
  openPage: jest.fn(),
}));

/**
 * Reset all imported mock functions
 */
const resetMocks = () => {
  showTab.mockReset();
  flushTab.mockReset();
  popTabToRoot.mockReset();
  openPage.mockReset();
};

describe('Tests link actions', () => {
  describe('Tests reactRouter action', () => {
    it('should open link using history.push', () => {
      const push = jest.fn();
      const history = { push };
      actions.reactRouter('/category/123', history);

      expect(showTab).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledTimes(1);
      expect(push).toHaveBeenCalledWith('/category/123');
    });
  });

  describe('Tests external link', () => {
    it('should open a link in the in app browser', () => {
      actions.externalLink('http://google.de', () => {
        resetMocks();

        expect(showTab).toHaveBeenCalledTimes(1);
        expect(showTab).toHaveBeenCalledWith({ targetTab: 'in_app_browser' });
        expect(openPage).toHaveBeenCalledTimes(1);
        expect(openPage).toHaveBeenCalledWith({
          src: 'http://google.de',
          previewSrc: 'sgapi:page_preview',
          emulateBrowser: true,
          targetTab: 'in_app_browser',
          navigationBarParams: {
            type: 'in-app-browser-url',
            popTab: 'in_app_browser',
            animation: 'none',
            rightButtonCallback: 'SGAction.showTab({ targetTab: "main" });',
          },
        });
        expect(flushTab).toHaveBeenCalledTimes(1);
        expect(flushTab).toHaveBeenCalledWith({ targetTab: 'in_app_browser' });
      });
    });
  });

  describe('Tests legacy links', () => {
    it('should open a link without any special configuration', () => {
      resetMocks();
      actions.legacyLink({
        url: '/cart',
        targetTab: 'main',
      });

      expect(showTab).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledWith({
        src: 'sgapi:cart',
        previewSrc: 'sgapi:page_preview',
        targetTab: 'main',
        navigationBarParams: {
          type: 'default',
          leftButtonCallback: '',
        },
      });
      expect(popTabToRoot).toHaveBeenCalledTimes(0);
    });

    it('should open a link with navigationType', () => {
      resetMocks();
      actions.legacyLink({
        url: '/cart',
        targetTab: 'main',
        navigationType:
        'cart-index',
      });

      expect(showTab).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledWith({
        src: 'sgapi:cart',
        previewSrc: 'sgapi:page_preview',
        targetTab: 'main',
        navigationBarParams: {
          type: 'cart-index',
          leftButtonCallback: '',
        },
      });
      expect(popTabToRoot).toHaveBeenCalledTimes(0);
    });

    it('should open a link in a different tab', () => {
      resetMocks();
      actions.legacyLink({
        url: '/cart',
        targetTab: 'cart',
      });

      expect(showTab).toHaveBeenCalledTimes(1);
      expect(showTab).toHaveBeenCalledWith({ targetTab: 'cart' });
      expect(openPage).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledWith({
        src: 'sgapi:cart',
        previewSrc: 'sgapi:page_preview',
        targetTab: 'cart',
        navigationBarParams: {
          type: 'default',
          leftButtonCallback: '',
        },
      });
      expect(popTabToRoot).toHaveBeenCalledTimes(0);
    });

    it('should open a link in a different tab and do popTabToRoot', () => {
      resetMocks();
      actions.legacyLink({
        url: '/cart',
        targetTab: 'cart',
        popTabToRoot: true,
        backCallback: 'SGAction.popTabToRoot()',
      });

      expect(showTab).toHaveBeenCalledTimes(1);
      expect(showTab).toHaveBeenCalledWith({ targetTab: 'cart' });
      expect(openPage).toHaveBeenCalledTimes(1);
      expect(openPage).toHaveBeenCalledWith({
        src: 'sgapi:cart',
        previewSrc: 'sgapi:page_preview',
        targetTab: 'cart',
        navigationBarParams: {
          type: 'default',
          leftButtonCallback: 'SGAction.popTabToRoot()',
        },
      });
      expect(popTabToRoot).toHaveBeenCalledTimes(1);
      expect(showTab).toHaveBeenCalledWith({ targetTab: 'cart' });
    });
  });
});
