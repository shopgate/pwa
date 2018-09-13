import React from 'react';
import { mount } from 'enzyme';
import Product from './index';

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
    const wrapper = mount(<Product />);
    expect(wrapper.find('Product').exists()).toBe(true);
  });
});
