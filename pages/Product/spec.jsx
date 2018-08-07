import React from 'react';
import { mount } from 'enzyme';
import { MockedView } from 'Components/View/mock';

/**
 * @returns {JSX}
 */
const Mock = () => <div />;
const mock = Mock;
const mockedView = MockedView;

jest.mock('@shopgate/react-hammerjs/src/Hammer', () => mock);
jest.mock('Components/View', () => mockedView);
jest.mock('./context');

describe('<Product> page', () => {
  it('should render', () => {
    // eslint-disable-next-line global-require
    const { UnwrappedProduct } = require('./index');
    const wrapper = mount(<UnwrappedProduct id={null} />);
    expect(wrapper.find('Product').exists()).toBe(true);
  });
});
