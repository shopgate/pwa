import React from 'react';
import { mount } from 'enzyme';
import Navigation from '../index';

jest.mock('../../../../components', () => ({
  I18n: {
    Text: function Translate({ string }) {
      return string;
    },
  },
  Link: function Link({ children }) { return children; },
}));

const mockTranslate = jest.fn(key => key);

const mockRenderOptions = {
  context: {
    i18n: () => ({
      __: mockTranslate,
    }),
  },
};

const entries = [{
  title: 'Title One',
  link: '/some-link',
}, {
  title: 'Title Two',
  link: '/another-link',
}];

describe('<Navigation />', () => {
  it('should render with an aria label and entries', () => {
    const title = 'Navigation Title';
    const wrapper = mount((<Navigation title={title} entries={entries} />), mockRenderOptions);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('nav').prop('aria-label')).toEqual(title);
    expect(wrapper.find('ul').children()).toHaveLength(2);
  });

  it('should render empty when no entries are passed', () => {
    const wrapper = mount((<Navigation />), mockRenderOptions);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.isEmptyRender()).toBe(true);
  });
});
