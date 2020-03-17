// @flow
import {
  AVAILABILITY_STATE_OK,
  AVAILABILITY_STATE_WARNING,
  AVAILABILITY_STATE_ALERT,
} from '@shopgate/pwa-common-commerce/product/constants';
import { type UserLocationFulfillmentMethod } from '../../../locations';
import { type ClassName } from '../../../types';

export type Availability = {
  text: string,
  state: typeof AVAILABILITY_STATE_OK
  | typeof AVAILABILITY_STATE_WARNING
  | typeof AVAILABILITY_STATE_ALERT,
}

export type OwnProps = {
  fulfillmentSelection?: UserLocationFulfillmentMethod,
  className?: ClassName,
}

export type StateProps = {
  availability?: Availability | null,
  fulfillmentMethods?: string[],
}
