import React from 'react';
import { mount } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import reducers from 'Pages/reducers';
import ProductsContent from './index';

const store = createMockStore(reducers);
jest.mock('../../../../components/View/context.js');

describe('<ProductsContent />', () => {
  it('should render', () => {
    const wrapper = mount((
      <Provider store={store}>
        <ProductsContent categoryId="1234" />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
