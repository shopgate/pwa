import React from 'react';
import { shallow } from 'enzyme';
import PaymentBarGrandTotal from '../PaymentBarGrandTotal';

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useContext: () => ({
    config: { hideTotal: false },
    currency: 'EUR',
    isLoading: false,
  }),
}));

jest.mock('../PaymentBarGrandTotal.connector', () => cmp => cmp);

describe('<PaymentBarGrandTotal />', () => {
  it('should render without issues', () => {
    const wrapper = shallow(<PaymentBarGrandTotal amount={10} />).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
