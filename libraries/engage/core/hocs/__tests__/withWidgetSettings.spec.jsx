import React from 'react';
import { shallow } from 'enzyme';
import { withWidgetSettings } from '../withWidgetSettings';
import { useWidgetSettings } from '../../hooks/useWidgetSettings';

jest.mock('../../hooks/useWidgetSettings', () => ({
  useWidgetSettings: jest.fn(),
}));

/**
 * A mocked component.
 * @returns {JSX}
 */
const Component = withWidgetSettings(() => (<div />));

const widgetSettings = {
  some: 'setting',
};

describe('engage > core > hocs > withWidgetSettings', () => {
  beforeEach(() => {
    useWidgetSettings.mockReturnValue(widgetSettings);
  });

  it('should merge add the widget settings to a wrapped component', () => {
    const wrapper = shallow(<Component />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.prop('widgetSettings')).toEqual(widgetSettings);
  });
});
