import React from 'react';
import { mount } from 'enzyme';
import { withWidgetSettings } from '../withWidgetSettings';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';

jest.mock('../../hooks/useWidgetSettings', () => ({
  useWidgetSettings: jest.fn(),
}));

// eslint-disable-next-line require-jsdoc
const MockComponent = () => null;

const widgetSettings = {
  some: 'setting',
};

describe('engage > core > hocs > withWidgetSettings', () => {
  beforeEach(() => {
    useWidgetSettings.mockReturnValue(widgetSettings);
  });

  it('should merge add the widget settings to a wrapped component', () => {
    const ComposedComponent = withWidgetSettings(MockComponent);
    const wrapper = mount(<ComposedComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).prop('widgetSettings')).toEqual(widgetSettings);
  });
});
