import React from 'react';
import { shallow } from 'enzyme';
import GrandTotal from '.';

jest.mock('Pages/Cart/context', () => ({
  Consumer: jest.fn(({ children }) => children({
    config: { hideTotal: false },
    currency: 'EUR',
    isLoading: false,
  })),
}));
jest.mock('./connector', () => cmp => cmp);

describe('<GrandTotal />', () => {
  it('should render without issues', () => {
    const wrapper = shallow(<GrandTotal amount={10} />).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
