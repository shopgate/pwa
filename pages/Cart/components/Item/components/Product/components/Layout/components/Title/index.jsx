import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, I18n, SurroundPortals, ContextMenu,
} from '@shopgate/engage/components';
import { CART_ITEM_NAME } from '@shopgate/engage/cart';
import {
  CartContextMenuItemChangeLocation,
  CartContextMenuItemChangeFulfillment,
} from '@shopgate/engage/locations';
import styles from './style';

const contextMenuClasses = {
  button: styles.menuToggleButton,
  container: styles.menuToggleContainer,
};

/**
 * The Cart Product Title component.
 * @param {Object} props The component properties.
 * @param {Object} context The component context.
 * @returns {JSX}
 */
const Title = ({ value, handleRemove, toggleEditMode }, context) => {
  const { invokeAction } = context;

  return (
    <Grid>
      <Grid.Item grow={1}>
        <SurroundPortals portalName={CART_ITEM_NAME} portalProps={context}>
          <div className={styles.title} data-test-id={value}>
            {value}
          </div>
        </SurroundPortals>
      </Grid.Item>
      <Grid.Item className={styles.menuContainer} shrink={0}>
        <ContextMenu classes={contextMenuClasses}>
          <ContextMenu.Item onClick={handleRemove}>
            <I18n.Text string="cart.remove" />
          </ContextMenu.Item>
          <ContextMenu.Item onClick={() => toggleEditMode(true)}>
            <I18n.Text string="cart.edit" />
          </ContextMenu.Item>
          <CartContextMenuItemChangeLocation
            cartItem={context.cartItem}
            onClick={() => invokeAction('changeLocation')}
          />
          <CartContextMenuItemChangeFulfillment
            cartItem={context.cartItem}
            onClick={() => invokeAction('changeFulfillment')}
          />
        </ContextMenu>
      </Grid.Item>
    </Grid>
  );
};

Title.propTypes = {
  value: PropTypes.string.isRequired,
  handleRemove: PropTypes.func,
  toggleEditMode: PropTypes.func,
};

Title.defaultProps = {
  handleRemove: () => { },
  toggleEditMode: () => { },
};

Title.contextTypes = {
  cartItem: PropTypes.shape(),
  invokeAction: PropTypes.func,
  cartItemId: PropTypes.string,
  type: PropTypes.string,
};

export default Title;
