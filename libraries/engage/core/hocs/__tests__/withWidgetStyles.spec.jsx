import React from 'react';
import { mount } from 'enzyme';
import { withWidgetStyles } from '../withWidgetStyles';
import { useWidgetStyles } from '../../hooks/useWidgetStyles';

jest.mock('../../hooks/useWidgetStyles', () => ({
  useWidgetStyles: jest.fn(),
}));

// eslint-disable-next-line require-jsdoc
const MockComponent = () => null;

const widgetStyles = {
  some: 'style',
};

describe('engage > core > hocs > withWidgetStyles', () => {
  beforeEach(() => {
    useWidgetStyles.mockReturnValue(widgetStyles);
  });

  it('should merge add the widget settings to a wrapped component', () => {
    const ComposedComponent = withWidgetStyles(MockComponent);
    const wrapper = mount(<ComposedComponent />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find(MockComponent).prop('widgetStyles')).toEqual(widgetStyles);
  });
});
