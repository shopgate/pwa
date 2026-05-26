import React from 'react';
import { render, screen } from '@shopgate/pwa-unit-test/rtlUtils';
import { withTheme } from '../withTheme';

const mockTheme = {
  ComponentOne: function ComponentOne() { return (<div />); },
  ComponentTwo: function ComponentTwo() { return (<div />); },
};

const mockContext = jest.fn().mockReturnValue(mockTheme);

jest.mock('@shopgate/pwa-common/context', () => ({
  ThemeContext: {
    Consumer: ({ children }) => children(mockContext()),
  },
}));

const mockWrappedComponent = jest.fn(props => (
  <pre data-testid="wrapped-props">{JSON.stringify(props)}</pre>
));

describe('engage > core > hocs > withTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should inject the context properties into the component', () => {
    const ComposedComponent = withTheme(mockWrappedComponent);
    const { container } = render(<ComposedComponent someProp />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      someProp: true,
      ...mockTheme,
    });
  });

  it('should inject a single property with the context into the component', () => {
    const ComposedComponent = withTheme(mockWrappedComponent, { prop: 'theme' });
    const { container } = render(<ComposedComponent someProp />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      someProp: true,
      theme: {
        ...mockTheme,
      },
    });
    expect(screen.getByTestId('wrapped-props')).toHaveTextContent('"theme"');
  });
});
