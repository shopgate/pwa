import React from 'react';
import { render } from '@testing-library/react';
import { withWidgetSettings } from '../withWidgetSettings';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';

jest.mock('../../hooks/useWidgetSettings', () => ({
  useWidgetSettings: jest.fn(),
}));

const mockWrappedComponent = jest.fn(() => null);

const widgetSettings = {
  some: 'setting',
};

describe('engage > core > hocs > withWidgetSettings', () => {
  beforeEach(() => {
    useWidgetSettings.mockReturnValue(widgetSettings);
  });

  it('should inject widget settings into the wrapped component', () => {
    const ComposedComponent = withWidgetSettings(mockWrappedComponent);
    const { container } = render(<ComposedComponent />);

    expect(container.firstChild).toMatchSnapshot();
    expect(mockWrappedComponent).toHaveBeenCalledTimes(1);
    expect(mockWrappedComponent.mock.calls[0][0]).toEqual({
      widgetSettings,
    });
  });
});
