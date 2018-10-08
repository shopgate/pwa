import React from 'react';
import { shallow } from 'enzyme';
import { Navigator } from './index';

jest.dontMock('@shopgate/pwa-core');

describe('Navigator Component', () => {
  const wrapper = shallow((
    <Navigator fetchSuggestions={jest.fn} navigate={jest.fn} />
  ));

  it('should match snapshot', () => {
    expect(wrapper).toMatchSnapshot();
  });
});
