// @ƒlow
import { type Location } from '../../locations.types';

export type OwnProps = {
  conditioner: {};
  productId: string;
}

export type StateProps = {
  fulfillmentPaths: string[];
  fulfillmentMethods?: string[] | null;
  disabled?: boolean;
  location?: Location | null;
}

export type DispatchProps = {
  storeFulfillmentMethods?: () => void;
}
