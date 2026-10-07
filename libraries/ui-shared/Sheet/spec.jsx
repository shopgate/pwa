import { render, screen, fireEvent } from '@testing-library/react';
import UIEvents from '@shopgate/pwa-core/emitters/ui';
import Sheet, { SHEET_EVENTS } from './index';

window.requestAnimationFrame = () => {};

jest.mock('@shopgate/pwa-core/emitters/ui', () => ({
  emit: jest.fn(),
}));

jest.mock('@shopgate/engage/a11y/components');

describe('<Sheet />', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render closed without content', () => {
    const { container } = render(<Sheet />);

    expect(container.querySelector('section')).toHaveClass('ui-shared__sheet');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(container.querySelector('.common__backdrop')).not.toBeInTheDocument();
  });

  it('should render opened without content', () => {
    const { container } = render(<Sheet isOpen />);

    const dialog = screen.getByRole('dialog');

    expect(container.querySelector('section.ui-shared__sheet')).toContainElement(dialog);
    expect(dialog).toHaveStyle({ animationDuration: '300ms' });
    expect(dialog.className).toContain('drawerAnimIn');
    expect(dialog).toHaveTextContent('');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
    expect(container.querySelector('.ui-shared__progress-bar')).toBeInTheDocument();
    expect(container.querySelector('.common__backdrop')).toHaveStyle({ opacity: 0.2 });
  });

  it('should render with content and title', () => {
    render((
      <Sheet isOpen title="Test-Title">
        <div>Test</div>
      </Sheet>
    ));

    const dialog = screen.getByRole('dialog');

    expect(dialog).toContainElement(screen.getByRole('heading', { name: 'Test-Title' }));
    expect(dialog).toContainElement(screen.getByRole('button', { name: 'common.close' }));
    expect(dialog).toContainElement(screen.getByText('Test'));
    expect(screen.queryByRole('searchbox')).not.toBeInTheDocument();
  });

  it('should call onDidOpen callback when the Sheet was opened', () => {
    const onOpen = jest.fn();
    const onDidOpen = jest.fn();

    const { rerender } = render((
      <Sheet isOpen={false} onOpen={onOpen} onDidOpen={onDidOpen}>
        <div>Test</div>
      </Sheet>
    ));

    expect(onOpen).not.toHaveBeenCalled();
    expect(onDidOpen).not.toHaveBeenCalled();

    rerender((
      <Sheet isOpen onOpen={onOpen} onDidOpen={onDidOpen}>
        <div>Test</div>
      </Sheet>
    ));

    expect(onOpen).toHaveBeenCalled();
    fireEvent.animationEnd(screen.getByRole('dialog'));
    expect(onDidOpen).toHaveBeenCalled();
    expect(UIEvents.emit).toHaveBeenCalledWith(SHEET_EVENTS.OPEN);
  });

  it('should trigger onClose callback and close the Sheet', () => {
    const onCloseSpy = jest.fn();

    render((
      <Sheet isOpen title="Test-Title" onClose={onCloseSpy}>
        <div>Test</div>
      </Sheet>
    ));

    fireEvent.click(screen.getByRole('button', { name: 'common.close' }));

    expect(onCloseSpy).toHaveBeenCalled();
    expect(screen.getByRole('dialog').className).toContain('drawerAnimOut');
    expect(screen.getByRole('dialog').className).not.toContain('drawerAnimIn');

    fireEvent.animationEnd(screen.getByRole('dialog'));

    expect(UIEvents.emit).lastCalledWith(SHEET_EVENTS.CLOSE);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('should open', () => {
    const { rerender } = render((
      <Sheet isOpen={false} title="Test-Title">
        <div>Test</div>
      </Sheet>
    ));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender((
      <Sheet isOpen title="Test-Title">
        <div>Test</div>
      </Sheet>
    ));

    const dialog = screen.getByRole('dialog');

    expect(dialog.className).toContain('drawerAnimIn');
    expect(dialog).toContainElement(screen.getByRole('heading', { name: 'Test-Title' }));
    expect(dialog).toContainElement(screen.getByText('Test'));
  });
});
