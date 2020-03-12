// @flow
import { type ProductId } from '../../../product';

export type OwnProps = {
  selected: boolean,
  productId: ProductId,
}

export type StateProps = {
  isOrderable: boolean,
}
