import React from 'react';
import { render } from '@testing-library/react';
import { withWidgetStyles } from '../withWidgetStyles';
import { useWidgetStyles } from '../../hooks/useWidgetStyles';

jest.mock('../../hooks/useWidgetStyles', () => ({
  useWidgetStyles: jest.fn(),
}));

const mockWrappedComponent = jest.fn(() => null);

const widgetStyles = {
  some: 'style',
};

describe('engage > core > hocs > withWidgetStyles', () => {
  beforeEach(() => {
    useWidgetStyles.mockReturnValue(widgetStyles);
  });

  it('should inject widget styles into the wrapped component', () => {
    const ComposedComponent = withWidgetStyles(mockWrappedComponent);
    const { container } = render(<ComposedComponent />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      widgetStyles,
    });
  });
});
