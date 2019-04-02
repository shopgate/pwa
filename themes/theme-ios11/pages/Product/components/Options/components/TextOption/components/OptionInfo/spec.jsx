import React from 'react';
import { shallow } from 'enzyme';
import { OptionInfo } from './index';

jest.mock('../../../../../../context', () => ({
  ProductContext: {
    Consumer: jest.fn(({ children }) => children({
      currency: 'EUR',
    })),
  },
}));

describe('<OptionInfo />', () => {
  it('should not render when not required and no price', () => {
    const wrapper = shallow((
      <OptionInfo required={false} label="" price={0} />
    ));
    expect(wrapper).toBeEmptyRender();
  });
  it('should render required element', () => {
    const wrapper = shallow((
      <OptionInfo required label="" price={0} />
    )).dive();
    expect(wrapper).toMatchSnapshot();
  });
  it('should render price element', () => {
    const wrapper = shallow((
      <OptionInfo required={false} label="Label" price={10} />
    )).dive();
    expect(wrapper).toMatchSnapshot();
  });
});
