import React from 'react';
import { shallow } from 'enzyme';
import {
  PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
  PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP,
} from '../../../constants';
import { FulfillmentSheet } from '../../FulfillmentSheet';
import { FulfillmentSelector } from '../FulfillmentSelector';

jest.mock('../../FulfillmentSheet', () => ({
  FulfillmentSheet: {
    open: jest.fn(),
  },
}));

describe('<FulfillmentSelector />', () => {
  it('should not render if the fulfillmentMethods do not contain inStorePickup', () => {
    const wrapper = shallow((
      <FulfillmentSelector
        productId="abc-123"
        location={{
          name: 'Test Store',
          visibleInventory: 15,
        }}
        fulfillmentMethods={[]}
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance()).toEqual(null);
  });

  it('should render the fulfillment selector with two radio elements', () => {
    const wrapper = shallow((
      <FulfillmentSelector
        productId="abc-123"
        location={{
          name: 'Test Store',
          visibleInventory: 15,
        }}
        fulfillmentMethods={[
          PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
          PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP,
        ]}
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('FulfillmentSelectorItem').length).toBe(2);
    expect(wrapper.find('[name="product.fulfillment_selector.direct_ship"]').length).toBe(1);
    expect(wrapper.find('[name="product.fulfillment_selector.pick_up_in_store"]').length).toBe(1);
  });

  it('should open the store selector sheet on selecting pick_up_in_store', () => {
    const wrapper = shallow((
      <FulfillmentSelector
        productId="abc-123"
        location={{
          name: 'Test Store',
          visibleInventory: 15,
        }}
        fulfillmentMethods={[
          PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
          PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP,
        ]}
      />
    ));

    wrapper
      .find('[name="product.fulfillment_selector"]')
      .simulate('change', 'product.fulfillment_selector.pick_up_in_store');

    expect(FulfillmentSheet.open).toHaveBeenCalledTimes(1);
  });
});
