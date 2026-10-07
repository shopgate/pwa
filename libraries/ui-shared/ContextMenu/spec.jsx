import {
  render, screen, fireEvent, act, within,
} from '@testing-library/react';
import ContextMenu from './index';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/a11y/components');

global.requestAnimationFrame = fn => fn();

jest.useFakeTimers();

describe('<ContextMenu />', () => {
  const mockItemAClick = jest.fn();
  const mockItemBClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Opened menu', () => {
    it('should render the toggle and the menu with its items', () => {
      const { container } = render((
        <ContextMenu isOpened>
          <ContextMenu.Item
            onClick={mockItemAClick}
            className="menu-active-item"
          >
            Item A
          </ContextMenu.Item>
          <ContextMenu.Item
            onClick={mockItemBClick}
            className="menu-active-item"
          >
            Item B
          </ContextMenu.Item>
        </ContextMenu>
      ));

      const toggle = screen.getByRole('button', { name: 'navigation.open_menu' });
      const dialog = screen.getByRole('dialog');

      expect(container.querySelector('[data-test-id="contextMenu"]'))
        .toHaveClass('ui-shared__context-menu');
      expect(toggle).toBeEnabled();
      expect(toggle).toHaveAttribute('aria-haspopup', 'true');
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(toggle).toHaveAttribute('aria-controls', 'contextMenuDialog');
      expect(dialog).toHaveAttribute('aria-modal', 'true');
      expect(within(dialog).getByRole('button', { name: 'Item A' })).toHaveClass('menu-active-item');
      expect(within(dialog).getByRole('button', { name: 'Item B' })).toHaveClass('menu-active-item');
      expect(within(dialog).getByRole('button', { name: 'common.close' })).toBeInTheDocument();
      expect(container.querySelector('.common__backdrop')).toBeInTheDocument();
    });

    it('should render the menu without toggle', () => {
      render((
        <ContextMenu isOpened showToggle={false}>
          <ContextMenu.Item
            onClick={mockItemAClick}
            className="menu-active-item"
          >
            Item A
          </ContextMenu.Item>
        </ContextMenu>
      ));

      const dialog = screen.getByRole('dialog');

      expect(screen.queryByRole('button', { name: 'navigation.open_menu' })).not.toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Item A' })).toHaveClass('menu-active-item');
      expect(within(dialog).getByRole('button', { name: 'common.close' })).toBeInTheDocument();
    });
  });

  describe('Given the component was mounted to the DOM', () => {
    let container;

    /**
     * @returns {HTMLElement[]}
     */
    const queryItems = () => Array.from(container.querySelectorAll('[data-test-id="contextMenuButton"]'));

    beforeEach(() => {
      ({ container } = render((
        <ContextMenu>
          <ContextMenu.Item onClick={mockItemAClick}>Item A</ContextMenu.Item>
          <ContextMenu.Item onClick={mockItemBClick}>Item B</ContextMenu.Item>
        </ContextMenu>
      )));
    });

    it('should render a closed menu', () => {
      expect(container.querySelector('[data-test-id="contextMenu"]'))
        .toHaveClass('ui-shared__context-menu');
      expect(container.querySelector('[data-test-id="contextMenu"]').children).toHaveLength(1);
      expect(screen.getByRole('button', { name: 'navigation.open_menu' })).toBeEnabled();
    });

    it('should have active state set to false', () => {
      expect(screen.getByRole('button', { name: 'navigation.open_menu' }))
        .not.toHaveAttribute('aria-expanded');
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('should render the toggle button', () => {
      expect(screen.getAllByRole('button')).toHaveLength(1);
    });

    it('should not render any context menu items', () => {
      expect(queryItems()).toHaveLength(0);
    });

    describe('Given toggle button gets clicked', () => {
      beforeEach(() => {
        fireEvent.click(screen.getByRole('button', { name: 'navigation.open_menu' }));
      });

      it('should have active state set to true', () => {
        expect(screen.getByRole('button', { name: 'navigation.open_menu' }))
          .toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });

      it('should render the actual context menu w/ items', () => {
        expect(queryItems().map(item => item.textContent)).toEqual(['Item A', 'Item B']);
      });

      describe('Given the first item gets clicked', () => {
        beforeEach(() => {
          fireEvent.click(screen.getByRole('button', { name: 'Item A' }));
          act(() => {
            jest.runAllTimers();
          });
        });

        it('should call the related click handler', () => {
          expect(mockItemAClick).toHaveBeenCalledTimes(1);
        });

        it('should close the context menu', () => {
          expect(queryItems()).toHaveLength(0);
        });
      });

      describe('Given the backdrop gets clicked', () => {
        beforeEach(() => {
          fireEvent.click(container.querySelector('.common__backdrop'));
        });

        it('should have active state reset to false', () => {
          expect(screen.getByRole('button', { name: 'navigation.open_menu' }))
            .toHaveAttribute('aria-expanded', 'false');
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        });

        it('should close the context menu', () => {
          expect(queryItems()).toHaveLength(0);
        });
      });
    });
  });
});
