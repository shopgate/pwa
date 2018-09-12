import React from 'react';
import { mount } from 'enzyme';
import { UnwrappedProduct as Product } from './index';

/**
 * @returns {JSX}
 */
const Mock = () => <div />;
const mock = Mock;

jest.mock('@shopgate/react-hammerjs/src/Hammer', () => mock);
jest.mock('Components/View');
jest.mock('./context');

describe('<Product> page', () => {
  it('should render', () => {
    const wrapper = mount(<Product id={null} />);
    expect(wrapper.find('Product').exists()).toBe(true);
  });
});
