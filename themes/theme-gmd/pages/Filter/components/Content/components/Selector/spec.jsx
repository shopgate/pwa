import React from 'react';
import { shallow } from 'enzyme';
import Selector from './index';

jest.mock('@shopgate/engage/core');
jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/filter', () => ({
  FilterItem: ({ children }) => children,
}));

const values = [
  {
    id: 'foo',
    label: 'fooLabel',
  },
  {
    id: 'bar',
    label: 'barLabel',
  },
];

describe('Filter: <Selector />', () => {
  it('should render with minimum props', () => {
    const wrapper = shallow(<Selector id="foo" label="bar" values={values} />);
    expect(wrapper).toMatchSnapshot();
  });
});
