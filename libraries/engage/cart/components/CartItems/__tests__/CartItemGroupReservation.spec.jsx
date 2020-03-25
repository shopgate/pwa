import React from 'react';
import { shallow } from 'enzyme';
import CartItemGroupReservation from '../CartItemGroupReservation';

jest.mock('@shopgate/engage/components');
jest.mock('@shopgate/engage/core');
jest.mock('@shopgate/engage/locations');
jest.mock('@shopgate/pwa-ui-shared/CardList/components/Item', () => 'CardListItem');
jest.mock('../CartItem.connector', () => cmp => cmp);

describe('engage > cart > components > CartItemGroupReservation', () => {
  const location = {
    name: 'Location name',
  };

  it('should render null when no location is given', () => {
    const wrapper = shallow(<CartItemGroupReservation />);
    expect(wrapper).toBeEmptyRender();
  });

  it('should render only label', () => {
    const wrapper = shallow(<CartItemGroupReservation location={location} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('should render accordion', () => {
    const wrapper = shallow((
      <CartItemGroupReservation
        // eslint-disable-next-line extra-rules/no-single-line-objects
        location={{ ...location, address: { phoneNumber: '012456789' } }}
      />
    ));
    expect(wrapper).toMatchSnapshot();
    const renderLabel = wrapper.find('Accordion').prop('renderLabel');
    expect(renderLabel()).toMatchSnapshot();
  });
});
