import React from 'react';
import { mount, shallow } from 'enzyme';
import Backdrop from '@shopgate/pwa-common/components/Backdrop';
import ContextMenu from './index';

jest.mock('@shopgate/engage/components');

global.requestAnimationFrame = fn => fn();

jest.useFakeTimers();

describe('<ContextMenu />', () => {
  const mockItemAClick = jest.fn();
  const mockItemBClick = jest.fn();
  const numMenuItems = 2;

  describe('Snapshot test', () => {
    it('should match snapshot', () => {
      const wrapper = shallow((
        <ContextMenu isOpened>
          <ContextMenu.Item
            onClick={mockItemAClick}
            className="menu-active-item"
          >
            {'Item A'}
          </ContextMenu.Item>
          <ContextMenu.Item
            onClick={mockItemBClick}
            className="menu-active-item"
          >
            {'Item B'}
          </ContextMenu.Item>
        </ContextMenu>
      ));
      expect(wrapper).toMatchSnapshot();
    });

    it('should match snapshot without toggle', () => {
      const wrapper = shallow((
        <ContextMenu isOpened showToggle={false}>
          <ContextMenu.Item
            onClick={mockItemAClick}
            className="menu-active-item"
          >
            {'Item A'}
          </ContextMenu.Item>
        </ContextMenu>
      ));
      expect(wrapper).toMatchSnapshot();
    });
  });

  describe.skip('Given the component was mounted to the DOM', () => {
    let renderedElement;
    let renderedInstance;

    /**
     * The view component
     */
    const renderComponent = () => {
      renderedElement = mount((
        <ContextMenu>
          <ContextMenu.Item onClick={mockItemAClick}>Item A</ContextMenu.Item>
          <ContextMenu.Item onClick={mockItemBClick}>Item B</ContextMenu.Item>
        </ContextMenu>
      ));

      renderedInstance = renderedElement.instance();
    };

    beforeEach(renderComponent);

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
