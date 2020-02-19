import React from 'react';
import { shallow } from 'enzyme';
import PaymentBarSubTotal from '../PaymentBarSubTotal';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    currency: 'EUR',
  }),
}));
jest.mock('../PaymentBarSubTotal.connector', () => cmp => cmp);

describe('<PaymentBarSubTotal>', () => {
  it('should render line', () => {
    const wrapper = shallow(<PaymentBarSubTotal amount={10} />).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
