import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import { PlaceholderParagraph } from '@shopgate/engage/components';
import ProductDescription from './index';

jest.mock('./connector', () => obj => obj);

describe('<ProductDescription />', () => {
  const mockStore = configureStore();
  const html = '<h1>foo</h1>';

  it('should not render if no data is available', () => {
    const store = mockStore({});
    const wrapper = mount(<ProductDescription store={store} html={null} />);
    const foundContent = wrapper.findWhere(n =>
      typeof n.prop('dangerouslySetInnerHTML') !== 'undefined');

    expect(wrapper).toMatchSnapshot();
    expect(foundContent.length).toEqual(0);
    expect(wrapper.find(PlaceholderParagraph).length).toEqual(1);
    expect(wrapper.find(PlaceholderParagraph).prop('ready')).toEqual(false);
  });

  it('should render description if data is available', () => {
    const store = mockStore({});
    const wrapper = mount(<ProductDescription store={store} html={html} />);
    const foundContent = wrapper.findWhere(n =>
      typeof n.prop('dangerouslySetInnerHTML') !== 'undefined');

    expect(wrapper).toMatchSnapshot();
    expect(foundContent.length).toEqual(1);
    expect(wrapper.find(PlaceholderParagraph).length).toEqual(1);
    expect(wrapper.find(PlaceholderParagraph).prop('ready')).toEqual(true);
  });
});
