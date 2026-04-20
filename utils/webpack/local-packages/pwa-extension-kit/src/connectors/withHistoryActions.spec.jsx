import React from 'react';
import { mount } from 'enzyme';
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
  const TestedComponent = props => <div>Other prop: {props.foo}</div>;
  const ConnectedComponent = withHistoryActions(TestedComponent);
  let component;
  let props;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component with specified props', () => {
    component = mount(<ConnectedComponent foo="bar" />);
    props = component.find('TestedComponent').props();

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
