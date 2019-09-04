import React from 'react';
import { shallow } from 'enzyme';
import { LiveshoppingWidget } from '.';

describe('<LiveshoppingWidget />', () => {
  /**
   * Mocks the liveshopping products pipeline request.
   */
  const fetchProductsMock = () => { };
  const settings = {};
  const products = ['1234', '1235'];

  it('should not render the widget without any data', () => {
    const wrapper = shallow(<LiveshoppingWidget
      settings={settings}
      fetchProducts={fetchProductsMock}
    />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render the widget with no slider for one product', () => {
    const wrapper = shallow(<LiveshoppingWidget
      settings={settings}
      fetchProducts={fetchProductsMock}
      products={[products[0]]}
    />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render the widget with a slider for multiple products', () => {
    const wrapper = shallow(<LiveshoppingWidget
      settings={settings}
      fetchProducts={fetchProductsMock}
      products={products}
    />);

    expect(wrapper).toMatchSnapshot();
  });
});
