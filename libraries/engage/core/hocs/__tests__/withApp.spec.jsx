import React from 'react';
import { render, screen } from '@testing-library/react';
import { withApp } from '../withApp';

const mockApp = {
  some: 'prop',
};

const mockContext = jest.fn().mockReturnValue(mockApp);

jest.mock('../../contexts/AppContext', () => ({
  Consumer: ({ children }) => children(mockContext()),
}));

const mockWrappedComponent = jest.fn(props => (
  <pre data-testid="wrapped-props">{JSON.stringify(props)}</pre>
));

describe('engage > core > hocs > withApp', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject a property called "app" into the component', () => {
    const ComposedComponent = withApp(mockWrappedComponent);
    const { container } = render(<ComposedComponent someProp />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      someProp: true,
      app: {
        ...mockApp,
      },
    });
    expect(screen.getByTestId('wrapped-props'))
      .toHaveTextContent('{"app":{"some":"prop"},"someProp":true}');
  });
});
