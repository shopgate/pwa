import React from 'react';
import { render } from '@testing-library/react';
import {
  push, pop, replace, reset, update,
} from '../../router/helpers';
import * as hooks from '../../hooks/useNavigation';
import { withNavigation } from '../withNavigation';

const navigationProps = {
  historyPush: push,
  historyPop: pop,
  historyReplace: replace,
  historyReset: reset,
  historyUpdate: update,
};

const mockWrappedComponent = jest.fn(props => (
  <pre data-testid="wrapped-props">{JSON.stringify(props)}</pre>
));

describe('engage > core > hocs > withNavigation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject the navigation properties into the component', () => {
    const ComposedComponent = withNavigation(mockWrappedComponent);
    const { container } = render(<ComposedComponent someProp />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      someProp: true,
      ...navigationProps,
    });
  });

  it('should inject a single property with the navigation into the component', () => {
    const ComposedComponent = withNavigation(mockWrappedComponent, { prop: 'navigation' });
    const { container } = render(<ComposedComponent someProp />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      someProp: true,
      navigation: {
        ...navigationProps,
      },
    });
  });

  it('should inject the functions provided by the useNavigation hook', () => {
    const navigation = {
      push: jest.fn(),
      pop: jest.fn(),
      replace: jest.fn(),
      reset: jest.fn(),
      update: jest.fn(),
    };
    const spy = jest.spyOn(hooks, 'useNavigation').mockReturnValue(navigation);
    const ComposedComponent = withNavigation(mockWrappedComponent);
    render(<ComposedComponent />);

    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      historyPush: navigation.push,
      historyPop: navigation.pop,
      historyReplace: navigation.replace,
      historyReset: navigation.reset,
      historyUpdate: navigation.update,
    });

    spy.mockRestore();
  });

  it('should let props of the parent component take precedence', () => {
    const customPush = jest.fn();
    const ComposedComponent = withNavigation(mockWrappedComponent);
    render(<ComposedComponent historyPush={customPush} />);

    expect(mockWrappedComponent.mock.calls[0][0].historyPush).toBe(customPush);
    expect(mockWrappedComponent.mock.calls[0][0].historyPop).toBe(pop);
  });

  it('should set a descriptive displayName', () => {
    /**
     * @returns {null}
     */
    const LegacyComponent = () => null;

    expect(withNavigation(LegacyComponent).displayName).toBe('WithNavigation(LegacyComponent)');
  });
});
