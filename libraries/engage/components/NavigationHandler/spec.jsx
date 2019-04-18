import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import { createMockStore } from '@shopgate/pwa-common/store';
import NavigationHandler from './index';

describe('<NavigationHandler />', () => {
  const store = createMockStore();
  it('should render as expected', () => {
    const wrapper = shallow((
      <Provider store={store}>
        <NavigationHandler>
          <div>Some content</div>
        </NavigationHandler>
      </Provider>
    ));
    expect(wrapper).toMatchSnapshot();
  });
});
