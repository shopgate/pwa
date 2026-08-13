import { createRef } from 'react';
import {
  render, screen, fireEvent, act,
} from '@testing-library/react';
// Loaded at runtime by utils/unit-tests/envSetup.js; imported here for the matcher types.
import '@testing-library/jest-dom';
import ButtonBase from './ButtonBase';

const mockPush = jest.fn();
const mockReplace = jest.fn();
const mockHasWebBridge = jest.fn(() => true);

jest.mock('@shopgate/engage/core/hooks/useNavigation', () => ({
  useNavigation: () => ({
    push: mockPush,
    replace: mockReplace,
    pop: jest.fn(),
    reset: jest.fn(),
    update: jest.fn(),
  }),
}));

jest.mock('@shopgate/engage/core/helpers/bridge', () => ({
  hasWebBridge: () => mockHasWebBridge(),
}));

// ButtonBase resolves the reduced motion preference via matchMedia, which jsdom doesn't implement.
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }),
});

describe('<ButtonBase />', () => {
  it('should render the testId as a data-test-id attribute', () => {
    render(<ButtonBase testId="MyButton">Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveAttribute('data-test-id', 'MyButton');
  });

  it('should not render a data-test-id attribute when no testId is given', () => {
    render(<ButtonBase>Press</ButtonBase>);

    expect(screen.getByRole('button')).not.toHaveAttribute('data-test-id');
  });

  it('should let an explicit data-test-id win over the testId prop', () => {
    render(<ButtonBase testId="FromProp" data-test-id="FromAttribute">Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveAttribute('data-test-id', 'FromAttribute');
  });

  it('should default the button type to "button" to avoid implicit form submits', () => {
    render(<ButtonBase>Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should pass through a submit type', () => {
    render(<ButtonBase type="submit">Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should fall back to "button" for an unsupported type', () => {
    render(<ButtonBase type={'menu' as 'button'}>Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should submit a surrounding form when the type is submit', () => {
    const handleSubmit = jest.fn(event => event.preventDefault());

    render(
      <form onSubmit={handleSubmit}>
        <ButtonBase type="submit">Send</ButtonBase>
      </form>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  it('should not submit a surrounding form by default', () => {
    const handleSubmit = jest.fn(event => event.preventDefault());

    render(
      <form onSubmit={handleSubmit}>
        <ButtonBase>Send</ButtonBase>
      </form>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(handleSubmit).not.toHaveBeenCalled();
  });

  it('should not invoke onClick while disabled', () => {
    const handleClick = jest.fn();

    render(<ButtonBase disabled onClick={handleClick}>Press</ButtonBase>);

    fireEvent.click(screen.getByRole('button'));

    expect(screen.getByRole('button')).toBeDisabled();
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should forward the ref to the button element', () => {
    const ref = createRef<HTMLButtonElement>();

    render(<ButtonBase ref={ref}>Press</ButtonBase>);

    expect(ref.current).toBe(screen.getByRole('button'));
  });

  it('should keep a consumer className on the button', () => {
    render(<ButtonBase className="custom">Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveClass('custom');
  });

  it('should not spread the classes prop onto the DOM', () => {
    render(<ButtonBase classes={{ root: 'custom-root' }}>Press</ButtonBase>);

    expect(screen.getByRole('button')).not.toHaveAttribute('classes');
  });
});

describe('<ButtonBase /> rendered as another element', () => {
  /**
   * Queries the rendered root without relying on a role, since the role changes with the element.
   * @returns The rendered element.
   */
  const root = () => document.querySelector('[data-test-id="Subject"]') as HTMLElement;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
    mockHasWebBridge.mockReturnValue(true);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('component', () => {
    it('should render the given element', () => {
      render(<ButtonBase component="a" testId="Subject">Press</ButtonBase>);

      expect(root().tagName).toBe('A');
    });

    it('should not emit a type attribute on a non-button element', () => {
      render(<ButtonBase component="a" testId="Subject">Press</ButtonBase>);

      expect(root()).not.toHaveAttribute('type');
    });

    it('should not spread the component prop onto the DOM', () => {
      render(<ButtonBase component="a" testId="Subject">Press</ButtonBase>);

      expect(root()).not.toHaveAttribute('component');
    });

    it('should forward the ref to the rendered element', () => {
      const ref = createRef<HTMLAnchorElement>();

      render(<ButtonBase component="a" ref={ref} testId="Subject">Press</ButtonBase>);

      expect(ref.current).toBe(root());
    });
  });

  describe('href', () => {
    it('should render an anchor with an href on web builds', () => {
      render(<ButtonBase href="/checkout" testId="Subject">Checkout</ButtonBase>);

      expect(root().tagName).toBe('A');
      expect(root()).toHaveAttribute('href', '/checkout');
    });

    it('should stay a button inside the app, where a real anchor is unsafe', () => {
      mockHasWebBridge.mockReturnValue(false);

      render(<ButtonBase href="/checkout" testId="Subject">Checkout</ButtonBase>);

      expect(root().tagName).toBe('BUTTON');
      expect(root()).not.toHaveAttribute('href');
    });

    it('should navigate through the router instead of the browser', () => {
      render(<ButtonBase href="/checkout" testId="Subject">Checkout</ButtonBase>);

      const event = fireEvent.click(root());
      jest.runAllTimers();

      // `fireEvent` returns false when a handler called preventDefault.
      expect(event).toBe(false);
      expect(mockPush).toHaveBeenCalledWith({ pathname: '/checkout' });
    });

    it('should navigate from the app build as well', () => {
      mockHasWebBridge.mockReturnValue(false);

      render(<ButtonBase href="/checkout" testId="Subject">Checkout</ButtonBase>);
      fireEvent.click(root());
      jest.runAllTimers();

      expect(mockPush).toHaveBeenCalledWith({ pathname: '/checkout' });
    });

    it('should replace the route when linkOptions.replace is set', () => {
      render(
        <ButtonBase href="/checkout" linkOptions={{ replace: true }} testId="Subject">
          Checkout
        </ButtonBase>
      );
      fireEvent.click(root());
      jest.runAllTimers();

      expect(mockReplace).toHaveBeenCalledWith({ pathname: '/checkout' });
      expect(mockPush).not.toHaveBeenCalled();
    });

    it('should pass state and target through to the router', () => {
      render(
        <ButtonBase
          href="https://example.com"
          linkOptions={{
            state: { from: 'cart' },
            target: '_blank',
          }}
          testId="Subject"
        >
          Offsite
        </ButtonBase>
      );
      fireEvent.click(root());
      jest.runAllTimers();

      expect(mockPush).toHaveBeenCalledWith({
        pathname: 'https://example.com',
        state: {
          from: 'cart',
          target: '_blank',
        },
      });
    });

    it('should activate on Enter without navigating twice', () => {
      render(<ButtonBase href="/checkout" testId="Subject">Checkout</ButtonBase>);

      fireEvent.keyDown(root(), { key: 'Enter' });
      jest.runAllTimers();

      expect(mockPush).toHaveBeenCalledTimes(1);
    });

    it('should let a consumer onClick suppress the navigation', () => {
      const handleClick = jest.fn(event => event.preventDefault());

      render(
        <ButtonBase href="/checkout" onClick={handleClick} testId="Subject">Checkout</ButtonBase>
      );
      fireEvent.click(root());
      jest.runAllTimers();

      expect(handleClick).toHaveBeenCalledTimes(1);
      expect(mockPush).not.toHaveBeenCalled();
    });
  });

  describe('disabled on a non-button element', () => {
    it('should mark it with aria-disabled instead of the native attribute', () => {
      render(<ButtonBase href="/checkout" disabled testId="Subject">Checkout</ButtonBase>);

      expect(root()).toHaveAttribute('aria-disabled', 'true');
      expect(root()).not.toHaveAttribute('disabled');
    });

    it('should not navigate and not invoke onClick', () => {
      const handleClick = jest.fn();

      render(
        <ButtonBase href="/checkout" disabled onClick={handleClick} testId="Subject">
          Checkout
        </ButtonBase>
      );
      fireEvent.click(root());
      jest.runAllTimers();

      expect(handleClick).not.toHaveBeenCalled();
      expect(mockPush).not.toHaveBeenCalled();
    });
  });
});

describe('<ButtonBase /> ripples', () => {
  /**
   * The ripple container is the button's last child; each active ripple is one node inside it.
   * @param button The rendered button.
   * @returns The number of active ripples.
   */
  const rippleCount = (button: HTMLElement) => button.lastElementChild?.childElementCount ?? 0;

  it('should show a ripple on pointer down', () => {
    render(<ButtonBase>Press</ButtonBase>);
    const button = screen.getByRole('button');

    fireEvent.pointerDown(button, { pointerId: 1 });

    expect(rippleCount(button)).toBe(1);
  });

  it('should center the ripple when the event carries no coordinates', () => {
    render(<ButtonBase>Press</ButtonBase>);
    const button = screen.getByRole('button');

    fireEvent.pointerDown(button, { pointerId: 1 });

    const ripple = button.lastElementChild?.firstElementChild as HTMLElement;

    expect(ripple.style.width).not.toContain('NaN');
    expect(ripple.style.height).not.toContain('NaN');
    expect(ripple.style.top).not.toContain('NaN');
    expect(ripple.style.left).not.toContain('NaN');
  });

  it('should drop the ripple when the button disables itself mid press', () => {
    // `pointer-events: none` on a disabled button makes the browser drop the pointer capture, so
    // the pointer up never reaches it and nothing would otherwise end the ripple.
    jest.useFakeTimers();
    const { rerender } = render(<ButtonBase>Press</ButtonBase>);
    const button = screen.getByRole('button');

    fireEvent.pointerDown(button, { pointerId: 1 });
    expect(rippleCount(button)).toBe(1);

    rerender(<ButtonBase disabled>Press</ButtonBase>);
    // The ripple fades out through a transition, so it survives until the exit finishes.
    act(() => {
      jest.runAllTimers();
    });

    expect(rippleCount(button)).toBe(0);
    jest.useRealTimers();
  });

  it('should end the ripple when the pointer capture is lost', () => {
    jest.useFakeTimers();
    render(<ButtonBase>Press</ButtonBase>);
    const button = screen.getByRole('button');

    // Neither event carries an explicit pointerId: jsdom doesn't populate it on pointer capture
    // events, so both resolve to the same undefined key.
    fireEvent.pointerDown(button);
    fireEvent.lostPointerCapture(button);
    // First pass runs the minimum-visible delay, second the exit transition that it schedules.
    act(() => {
      jest.runAllTimers();
    });
    act(() => {
      jest.runAllTimers();
    });

    expect(rippleCount(button)).toBe(0);
    jest.useRealTimers();
  });
});

describe('<ButtonBase /> css hooks', () => {
  it('should carry a stable class that merchant css can target', () => {
    render(<ButtonBase>Press</ButtonBase>);

    expect(screen.getByRole('button')).toHaveClass('engage__button-base');
  });

  it('should drop that class when a wrapper provides its own', () => {
    render(<ButtonBase disableBaseClassName>Press</ButtonBase>);

    expect(screen.getByRole('button')).not.toHaveClass('engage__button-base');
  });

  it('should not carry the legacy classes, which belong to the styled Button', () => {
    render(<ButtonBase>Press</ButtonBase>);

    const button = screen.getByRole('button');

    expect(button).not.toHaveClass('common__button');
    expect(button).not.toHaveClass('ui-shared__button');
    expect(button).not.toHaveClass('ui-shared__ripple-button');
  });

  it('should place the consumer className after the stable ones', () => {
    // `cx` merges every emotion class into one and appends it, so a plain class is never the last
    // token. What matters is that the caller's class follows ours among the plain names.
    render(<ButtonBase className="custom">Press</ButtonBase>);

    const classList = screen.getByRole('button').className.trim().split(' ');

    expect(classList.indexOf('custom')).toBeGreaterThan(classList.indexOf('engage__button-base'));
  });
});
