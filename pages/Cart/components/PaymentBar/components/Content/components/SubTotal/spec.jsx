import React from 'react';
import { shallow } from 'enzyme';
import SubTotal from '.';

jest.mock('Pages/Cart/context', () => ({
  Consumer: jest.fn(({ children }) => children({
    currency: 'EUR',
  })),
}));
jest.mock('./connector', () => cmp => cmp);

describe('<SubTotal>', () => {
  it('should render line', () => {
    const wrapper = shallow(<SubTotal amount={10} />).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
