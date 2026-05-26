import React from 'react';
import { render } from '@shopgate/pwa-unit-test/rtlUtils';
import {
  push, pop, replace, reset, update,
} from '../../router/helpers';
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
});
