import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import Content from './index';

jest.mock('Components/ProductFilters', () => () => null);
jest.mock('../ProductsContent', () => () => null);
jest.mock('../Empty', () => () => null);
jest.mock('../CategoryListContent', () => () => null);
jest.mock('../AppBar', () => () => null);

const store = createMockStore();

describe.skip('<Content />', () => {
  it('should render', () => {
    const wrapper = mount((
      <Provider store={store}>
        <Content categoryId="1234" />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
