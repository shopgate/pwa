import React from 'react';
import { shallow } from 'enzyme';
import {
  PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
  PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP,
  FULFILLMENT_PATH_MULTI_LINE_RESERVE,
} from '../../../constants';
import { FulfillmentSheet } from '../../FulfillmentSheet';
import { FulfillmentSelector } from '../FulfillmentSelector';

jest.mock('../../FulfillmentSheet', () => ({
  FulfillmentSheet: {
    open: jest.fn(),
  },
}));
jest.mock('../FulfillmentSelectorAddToCart', () => 'FulfillmentSelectorAddToCart');

const conditioner = {
  check: () => Promise.resolve(true),
  without: () => conditioner,
};

describe('<FulfillmentSelector />', () => {
  it('should not render if the fulfillmentMethods do not contain inStorePickup', () => {
    const wrapper = shallow((
      <FulfillmentSelector
        productId="abc-123"
        location={{
          name: 'Test Store',
        }}
        conditioner={conditioner}
        fulfillmentMethods={[]}
        fulfillmentPaths={[]}
        disabled={false}
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
        }}
        conditioner={conditioner}
        fulfillmentMethods={[
          PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
          PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP,
        ]}
        fulfillmentPaths={[]}
        disabled={false}
      />
    ));

    expect(wrapper).toMatchSnapshot();
    expect(wrapper.find('FulfillmentSelectorItem').length).toBe(2);
    expect(wrapper.find('[name="product.fulfillment_selector.direct_ship"]').length).toBe(1);
    expect(wrapper.find('[name="product.fulfillment_selector.pick_up_in_store"]').length).toBe(1);
  });

  it('should open the store selector sheet on selecting pick_up_in_store', async () => {
    const wrapper = shallow((
      <FulfillmentSelector
        productId="abc-123"
        location={{}}
        conditioner={conditioner}
        fulfillmentMethods={[
          PRODUCT_FULFILLMENT_METHOD_DIRECT_SHIP,
          PRODUCT_FULFILLMENT_METHOD_IN_STORE_PICKUP,
        ]}
        fulfillmentPaths={[FULFILLMENT_PATH_MULTI_LINE_RESERVE]}
        disabled={false}
      />
    ));

    wrapper
      .find('[name="product.fulfillment_selector"]')
      .simulate('change', 'product.fulfillment_selector.pick_up_in_store');

    await new Promise(resolve => setImmediate(resolve));

    expect(FulfillmentSheet.open).toHaveBeenCalledTimes(1);
  });
});
