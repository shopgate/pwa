import React from 'react';
import { shallow } from 'enzyme';
import Tax from '.';

jest.mock('Pages/Cart/context', () => ({
  Consumer: jest.fn(({ children }) => children({
    currency: 'EUR',
    config: {
      hideTax: false,
      tax: {
        text: null,
        hint: null,
      },
    },
  })),
}));
jest.mock('./connector', () => cmp => cmp);

describe('<Tax />', () => {
  it('should render and match snapshot', () => {
    // eslint-disable-next-line extra-rules/no-single-line-objects
    const wrapper = shallow(<Tax taxData={{ label: 'Tax', amount: 10 }} />).dive();
    expect(wrapper).toMatchSnapshot();
  });
  it('should not render and match snapshot', () => {
    const wrapper = shallow(<Tax taxData={null} />);
    expect(wrapper).toBeEmptyRender();
  });
});
