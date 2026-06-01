import React from 'react';
import { render, screen } from '@testing-library/react';
import { withRoute } from '../withRoute';

const mockRoute = {
  id: '32d55',
  pathname: '/',
  pattern: '/',
  state: {},
};

const mockContext = jest.fn().mockReturnValue(mockRoute);

jest.mock('@shopgate/pwa-common/context', () => ({
  RouteContext: {
    Consumer: ({ children }) => children(mockContext()),
  },
}));

const mockWrappedComponent = jest.fn(props => (
  <pre data-testid="wrapped-props">{JSON.stringify(props)}</pre>
));

describe('engage > core > hocs > withRoute', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject the context properties into the component', () => {
    const ComposedComponent = withRoute(mockWrappedComponent);
    const { container } = render(<ComposedComponent someProp />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      someProp: true,
      ...mockRoute,
    });
    expect(screen.getByTestId('wrapped-props')).toHaveTextContent('"pathname":"/"');
  });

  it('should inject a single property with the context into the component', () => {
    const ComposedComponent = withRoute(mockWrappedComponent, { prop: 'route' });
    const { container } = render(<ComposedComponent someProp />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      someProp: true,
      route: {
        ...mockRoute,
      },
    });
    expect(screen.getByTestId('wrapped-props')).toHaveTextContent('"route"');
  });
});
