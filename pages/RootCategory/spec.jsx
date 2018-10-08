import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import RootCategory from './index';
import reducers from '../reducers';

const store = createMockStore(reducers);
jest.mock('../../components/View/context.js');

describe('Pages: <RootCategory />', () => {
  it('should render', () => {
    const wrapper = shallow((
      <Provider store={store}>
        <RootCategory />
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
