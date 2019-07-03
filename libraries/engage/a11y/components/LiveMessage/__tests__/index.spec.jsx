import React from 'react';
import { shallow } from 'enzyme';
import LiveMessage from '../index';

jest.mock('../../../../components', () => ({
  I18n: {
    Text: function Translate({ string }) {
      return string;
    },
  },
}));

describe('<LiveMessage />', () => {
  const message = 'My Message';

  it('should render a polite simple message', () => {
    const ariaLive = 'polite';
    const wrapper = shallow(<LiveMessage message={message} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('div').prop('aria-live')).toBe(ariaLive);
    expect(wrapper.find('Translate').prop('string')).toBe(message);
    expect(wrapper.find('Translate').prop('params')).toEqual(null);
  });

  it('should render an assertive message with params ', () => {
    const ariaLive = 'assertive';
    const params = { my: 'param' };
    const wrapper = shallow(<LiveMessage message={message} params={params} aria-live={ariaLive} />);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('div').prop('aria-live')).toBe(ariaLive);
    expect(wrapper.find('Translate').prop('string')).toBe(message);
    expect(wrapper.find('Translate').prop('params')).toEqual(params);
  });
});

