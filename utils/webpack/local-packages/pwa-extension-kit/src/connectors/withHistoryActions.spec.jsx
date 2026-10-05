import { render, screen } from '@testing-library/react';
import withHistoryActions from './withHistoryActions';

const mockedAction = jest.fn();
jest.mock('react-redux', () => ({
  connect: () => Component => props => (
    <Component
      historyPush={(...args) => mockedAction('historyPush', ...args)}
      historyPop={(...args) => mockedAction('historyPop', ...args)}
      historyReplace={(...args) => mockedAction('historyReplace', ...args)}
      {...props}
    />
  ),
}));

describe('connectors/withHistoryActions', () => {
  // eslint-disable-next-line react/prop-types, require-jsdoc
  const TestedComponent = jest.fn(props => <div>Other prop: {props.foo}</div>);
  const ConnectedComponent = withHistoryActions(TestedComponent);

  const renderConnected = () => {
    render(<ConnectedComponent foo="bar" />);
    return TestedComponent.mock.calls[0][0];
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component with specified props', () => {
    const props = renderConnected();

    expect(screen.getByText('Other prop: bar')).toBeInTheDocument();
    expect(Object.keys(props).sort()).toEqual(['foo', 'historyPop', 'historyPush', 'historyReplace']);
    expect(typeof props.historyPop).toBe('function');
    expect(typeof props.historyPush).toBe('function');
    expect(typeof props.historyReplace).toBe('function');
    expect(props.foo).toBe('bar');

    expect(mockedAction).not.toHaveBeenCalled();
  });
  describe('Actions', () => {
    const actions = ['historyPush', 'historyPop', 'historyReplace'];
    actions.forEach((action) => {
      it(`should call ${action}`, () => {
        const pathname = 'PATHNAME';
        const props = renderConnected();
        if (action === 'historyPop') {
          props[action]();
          expect(mockedAction).toHaveBeenCalledWith(action);
          return;
        }
        props[action](pathname);
        expect(mockedAction).toHaveBeenCalledWith(action, {
          pathname,
        });
      });
      it(`should call ${action} with options`, () => {
        const pathname = 'PATHNAME';
        const options = {
          state: {},
        };
        const props = renderConnected();
        if (action === 'historyPop') {
          props[action]();
          expect(mockedAction).toHaveBeenCalledWith(action);
          return;
        }
        props[action](pathname, options);
        expect(mockedAction).toHaveBeenCalledWith(action, {
          pathname,
          ...options,
        });
      });
    });
  });
});
