import React from 'react';
import { mount } from 'enzyme';
import configureStore from 'redux-mock-store';
import mockRenderOptions from '@shopgate/pwa-common/helpers/mocks/mockRenderOptions';
import Description from '../index';

jest.mock('../connector', () => obj => obj);

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/product', () => ({
  PRODUCT_DESCRIPTION: 'PRODUCT_DESCRIPTION',
}));

describe('<Description />', () => {
  const mockStore = configureStore();
  const html = '<h1>foo</h1>';

  it('should not render if no data is available', () => {
    const store = mockStore({});
    const wrapper = mount(<Description store={store} html={null} />, mockRenderOptions);
    const foundContent = wrapper.findWhere(n =>
      typeof n.prop('dangerouslySetInnerHTML') !== 'undefined');

    expect(wrapper).toMatchSnapshot();
    expect(foundContent.length).toEqual(0);
    expect(wrapper.find('PlaceholderParagraph').length).toEqual(1);
    expect(wrapper.find('PlaceholderParagraph').prop('ready')).toEqual(false);
  });

  it('should render description if data is available', () => {
    const store = mockStore({});
    const wrapper = mount(<Description store={store} html={html} />, mockRenderOptions);

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('PlaceholderParagraph').length).toEqual(1);
    expect(wrapper.find('PlaceholderParagraph').prop('ready')).toEqual(true);
  });
});
