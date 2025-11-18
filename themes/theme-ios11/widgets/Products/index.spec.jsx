import React from 'react';
import { shallow } from 'enzyme';
import ProductsWidgets from './index';

jest.mock('./ProductsIdsWidget', () => 'ProductsIdsWidget');
jest.mock('./ProductsWidget', () => 'ProductsWidget');
jest.mock('react-redux', () => ({
  connect: jest.fn(() => component => component),
}));

describe('<ProductWidgets />', () => {
  const settings = {
    headline: '',
    layout: 'grid',
    productLimit: 6,
    queryParams: 'Blue',
    queryType: 2,
  };

  it('should render the products widget', () => {
    const wrapper = shallow(<ProductsWidgets settings={settings} />);

    expect(wrapper).toMatchSnapshot();
  });

  it('should render the products ids widget', () => {
    const wrapper = shallow(<ProductsWidgets settings={{
      ...settings,
      queryType: 4,
      queryParams: [1, 2, 4],
    }}
    />);
    expect(wrapper).toMatchSnapshot();
  });
});
