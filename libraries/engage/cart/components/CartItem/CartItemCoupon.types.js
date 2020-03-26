// @flow
import { type Coupon } from '../../cart.types';

export type OwnProps = {
  coupon: Coupon,
  id: string,
  messages: any[],
}

export type StateProps = {
  currency: string,
};

export type DispatchProps = {
  deleteCoupon: (couponCode: string) => Promise<any>,
}
