import { render, screen, fireEvent } from '@testing-library/react';
import Drawer from './index';

describe('<Drawer />', () => {
  const onOpen = jest.fn();
  const onClose = jest.fn();
  const onDidOpen = jest.fn();
  const onDidClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render', () => {
    const { container } = render(<Drawer />);

    expect(container).toBeEmptyDOMElement();
  });

  it('should execute callback when drawer is opened', () => {
    const { rerender } = render(<Drawer onOpen={onOpen} />);
    rerender(<Drawer onOpen={onOpen} isOpen />);

    expect(onOpen).toBeCalled();
  });

  it('should execute callback when drawer is closed', () => {
    const { rerender } = render(<Drawer isOpen onClose={onClose} />);
    rerender(<Drawer isOpen={false} onClose={onClose} />);

    expect(onClose).toBeCalled();
  });

  it('should add custom classes', () => {
    render(<Drawer className="custom-class-name" isOpen />);

    const dialog = screen.getByRole('dialog');

    expect(dialog).toHaveClass('custom-class-name', 'common__drawer');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('tabindex', '-1');
    expect(dialog).toBeEmptyDOMElement();
  });

  it('should execute callback when drawer open animation did end', () => {
    const props = {
      className: 'custom-class-name',
      onOpen,
      onDidOpen,
    };
    const { container, rerender } = render(<Drawer {...props} isOpen={false} />);
    expect(container).toBeEmptyDOMElement();
    rerender(<Drawer {...props} isOpen />);

    expect(onOpen).toBeCalled();
    expect(onDidOpen).not.toBeCalled();
    fireEvent.animationEnd(screen.getByRole('dialog'));
    expect(onDidOpen).toBeCalled();
  });

  it('should execute callback when drawer close animation did end', () => {
    const props = {
      className: 'custom-class-name',
      onClose,
      onDidClose,
    };
    const { rerender } = render(<Drawer {...props} isOpen />);
    expect(screen.getByRole('dialog')).toHaveClass('custom-class-name', 'common__drawer');
    rerender(<Drawer {...props} isOpen={false} />);

    expect(onClose).toBeCalled();
    expect(onDidClose).not.toBeCalled();
    fireEvent.animationEnd(screen.getByRole('dialog'));
    expect(onDidClose).toBeCalled();
  });
});
