import { render, screen } from '@testing-library/react';
import ErrorBoundary from './index';

jest.mock('./connector', () => Component => Component);

/**
 * A component that fails to render.
 */
const Broken = () => {
  throw new Error('Render failed');
};

/**
 * Creates a component that throws the given value when it renders.
 * @param {*} value The value to throw.
 * @returns {Function}
 */
const createThrowing = value => () => {
  throw value;
};

describe('<ErrorBoundary />', () => {
  let consoleError;

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('should render its children when nothing fails', () => {
    const appError = jest.fn();

    render(<ErrorBoundary appError={appError}><span>Content</span></ErrorBoundary>);

    expect(screen.getByText('Content')).toBeTruthy();
    expect(appError).not.toHaveBeenCalled();
  });

  it('should render the fallback and report the error when a child fails', () => {
    const appError = jest.fn();

    render((
      <ErrorBoundary appError={appError} fallbackUi={<span>Fallback</span>}>
        <Broken />
      </ErrorBoundary>
    ));

    expect(screen.getByText('Fallback')).toBeTruthy();
    expect(appError).toHaveBeenCalledTimes(1);
  });

  it('should add the component stack and keep the stack trace of the error', () => {
    const appError = jest.fn();

    render(<ErrorBoundary appError={appError}><Broken /></ErrorBoundary>);

    const [error] = appError.mock.calls[0];
    expect(error.message).toBe('Render failed');
    expect(error.stack).toContain('Error: Render failed');
    expect(error.componentStack).toContain('Broken');
  });

  it.each([
    ['a string', 'Something failed', 'Something failed'],
    ['null', null, expect.any(String)],
    ['a frozen error', Object.freeze(new Error('Frozen')), 'Error: Frozen'],
    ['an object', { code: 'ECUSTOM', mail: 'jane@example.com' }, '{code: "ECUSTOM", keys: code, mail}'],
  ])('should report %s that was thrown as an error with the component stack', (name, value, message) => {
    const appError = jest.fn();
    const Throwing = createThrowing(value);

    render((
      <ErrorBoundary appError={appError} fallbackUi={<span>Fallback</span>}>
        <Throwing />
      </ErrorBoundary>
    ));

    const [error] = appError.mock.calls[0];
    expect(screen.getByText('Fallback')).toBeTruthy();
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toEqual(message);
    expect(typeof error.componentStack).toBe('string');
  });
});
