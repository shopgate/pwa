// @flow
import * as React from 'react';
import PT from 'prop-types';
import { Grid, SurroundPortals } from '@shopgate/engage/components';
import { CART_ITEM_NAME } from '@shopgate/pwa-common-commerce/cart';
import { CartItemProductContextMenu } from './CartItemProductContextMenu';
import { type Item } from '../../cart.types';
import {
  title,
} from './CartItemProductTitle.style';

type Props = {
  value: string,
  handleRemove?: () => void,
  toggleEditMode?: (editMode: boolean) => void,
}

type ContextProps = {
  cartItem?: Item,
  invokeAction: (action: string, method?: string) => void,
  cartItemId?: string,
  type?: string,
  editable?: boolean
}

/**
 * The Cart Product Title component.
 * @param {Object} props The component properties.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
export const CartItemProductTitle = ({
  value,
  handleRemove,
  toggleEditMode,
}: Props, context: ContextProps) => (
  <Grid>
    <Grid.Item grow={1}>
      <SurroundPortals portalName={CART_ITEM_NAME} portalProps={context}>
        <div className={title} data-test-id={value} dangerouslySetInnerHTML={{ __html: value }} />
      </SurroundPortals>
    </Grid.Item>
    {context.editable && (
      <CartItemProductContextMenu handleRemove={handleRemove} toggleEditMode={toggleEditMode} />
    )}
  </Grid>
);

CartItemProductTitle.defaultProps = {
  handleRemove: () => { },
  toggleEditMode: () => { },
};

CartItemProductTitle.contextTypes = {
  cartItem: PT.shape(),
  invokeAction: PT.func,
  cartItemId: PT.string,
  type: PT.string,
  editable: PT.bool,
};
