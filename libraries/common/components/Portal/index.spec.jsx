import { render, screen } from '@testing-library/react';
import { logger } from '@shopgate/pwa-core/helpers';
import portalCollection from '../../helpers/portals/portalCollection';
import Portal from './index';

jest.mock('@shopgate/pwa-core/helpers', () => ({
  logger: {
    error: jest.fn(),
  },
}));

/**
 * A portal component that fails to render.
 */
const Broken = () => {
  throw new Error('Render failed');
};

describe('<Portal />', () => {
  let consoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
    portalCollection.registerPortals({
      '@acme/extension/ThrowsString': () => {
        throw 'Something failed'; // eslint-disable-line no-throw-literal
      },
      '@acme/extension/ThrowsNull': () => {
        throw null; // eslint-disable-line no-throw-literal
      },
      '@acme/extension/ThrowsObject': () => {
        throw { code: 'ECUSTOM', mail: 'jane@example.com' }; // eslint-disable-line no-throw-literal
      },
      '@acme/extension/Broken': Broken,
      '@acme/extension/Working': () => <span>Working</span>,
    });
    portalCollection.registerConfig({
      '@acme/extension/ThrowsString': { target: 'string.target' },
      '@acme/extension/ThrowsNull': { target: 'null.target' },
      '@acme/extension/ThrowsObject': { target: 'object.target' },
      '@acme/extension/Broken': { target: 'broken.target' },
      '@acme/extension/Working': { target: 'working.target' },
    });
  });

  afterEach(() => {
    consoleError.mockRestore();
  });

  it('should render the components of its target', () => {
    render(<Portal name="working.target" />);

    expect(screen.getByText('Working')).toBeTruthy();
    expect(logger.error).not.toHaveBeenCalled();
  });

  it('should log a crash of a component with its stack trace and component stack', () => {
    render(<Portal name="broken.target" />);

    expect(logger.error).toHaveBeenCalledTimes(1);
    const [error, ...rest] = logger.error.mock.calls[0];
    expect(rest).toEqual([]);
    expect(error.message).toBe('Render failed');
    expect(error.stack).toContain('Error: Render failed');
    expect(error.componentStack).toContain('Broken');
  });

  it.each([
    ['a string', 'string.target', 'Something failed'],
    ['null', 'null.target', expect.any(String)],
    ['an object', 'object.target', '{code: "ECUSTOM", keys: code, mail}'],
  ])('should contain a crash that throws %s and log it as an error', (name, target, message) => {
    const { container } = render(<Portal name={target} />);

    expect(container.innerHTML).toBe('');
    expect(logger.error).toHaveBeenCalledTimes(1);
    const [error] = logger.error.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toEqual(message);
    expect(typeof error.componentStack).toBe('string');
  });
});
