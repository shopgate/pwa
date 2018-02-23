/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import ContextMenu from './index';

jest.mock('react-portal', () => (
  ({ isOpened, children }) => (
    isOpened ? children : null
  )
));

global.requestAnimationFrame = fn => fn();

jest.useFakeTimers();

describe('<ContextMenu />', () => {
  let renderedElement;
  let renderedInstance;
  const mockItemAClick = jest.fn();
  const mockItemBClick = jest.fn();
  const numMenuItems = 2;

  /**
   * The view component
   */
  const renderComponent = () => {
    renderedElement = mount(
      <ContextMenu>
        <ContextMenu.Item onClick={mockItemAClick}>Item A</ContextMenu.Item>
        <ContextMenu.Item onClick={mockItemBClick}>Item B</ContextMenu.Item>
      </ContextMenu>
    );

    renderedInstance = renderedElement.instance();
  };

  beforeEach(() => {
    renderComponent();
  });

  describe('Given the component was mounted to the DOM', () => {
    it('should match snapshot', () => {
      expect(renderedElement).toMatchSnapshot();
    });

    it('should have active state set to false', () => {
      expect(renderedInstance.state.active).toBe(false);
    });

    it('should render the toggle button', () => {
      expect(renderedElement.find('button').length).toBe(1);
    });

    it('should not render any context menu items', () => {
      expect(renderedElement.find(ContextMenu.Item).length).toBe(0);
    });

    describe('Given toggle button gets clicked', () => {
      beforeEach(() => {
        renderedElement.find('button').simulate('click');
        renderedElement.update();
      });

      it('should have active state set to true', () => {
        expect(renderedInstance.state.active).toBe(true);
      });

      it('should render the actual context menu w/ items', () => {
        expect(renderedElement.find(ContextMenu.Item).length).toBe(numMenuItems);
      });

      describe('Given the first item gets clicked', () => {
        beforeEach(() => {
          renderedElement.find(ContextMenu.Item).first().children().find('[onClick]')
            .simulate('click');
          jest.runAllTimers();
        });

        it('should call the related click handler', () => {
          expect(mockItemAClick).toBeCalled();
        });

        it('should close the context menu', () => {
          renderedElement.update();
          expect(renderedElement.find(ContextMenu.Item).length).toBe(0);
        });
      });

      describe('Given the backdrop gets clicked', () => {
        beforeEach(() => {
          renderedElement.find(Backdrop).children().find('[onClick]').simulate('click');
        });

        it('should have active state reset to false', () => {
          expect(renderedInstance.state.active).toBe(false);
        });

        it('should close the context menu', () => {
          expect(renderedElement.find(ContextMenu.Item).length).toBe(0);
        });
      });
    });
  });
});
