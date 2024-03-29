import React from 'react';
import PropTypes from 'prop-types';
import {
  Grid, I18n, SurroundPortals, ContextMenu,
} from '@shopgate/engage/components';
import {
  CART_ITEM_CONTEXT_MENU,
  CART_ITEM_CONTEXT_MENU_ITEM_EDIT,
  CART_ITEM_CONTEXT_MENU_ITEM_REMOVE,
  CART_ITEM_NAME,
} from '@shopgate/engage/cart';
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
const Title = ({ value, handleRemove, toggleEditMode }, context) => (
  <Grid>
    <Grid.Item grow={1}>
      <SurroundPortals portalName={CART_ITEM_NAME} portalProps={context}>
        <div className={styles.title} data-test-id={value}>
          {value}
        </div>
      </SurroundPortals>
    </Grid.Item>
    <Grid.Item className={styles.menuContainer} shrink={0}>
      <SurroundPortals
        portalName={CART_ITEM_CONTEXT_MENU}
        portalProps={{ context, handleRemove, toggleEditMode }}
      >
        <ContextMenu classes={contextMenuClasses}>
          <SurroundPortals
            portalName={CART_ITEM_CONTEXT_MENU_ITEM_REMOVE}
            portalProps={{ context, handleRemove }}
          >
            <div data-test-id="cartItemContextMenuItemRemove">
              <ContextMenu.Item onClick={handleRemove}>
                <I18n.Text string="cart.remove" />
              </ContextMenu.Item>
            </div>
          </SurroundPortals>
          <SurroundPortals
            portalName={CART_ITEM_CONTEXT_MENU_ITEM_EDIT}
            portalProps={{ context, toggleEditMode }}
          >
            <div data-test-id="cartItemContextMenuItemEdit">
              <ContextMenu.Item onClick={() => toggleEditMode(true)}>
                <I18n.Text string="cart.edit" />
              </ContextMenu.Item>
            </div>
          </SurroundPortals>
        </ContextMenu>
      </SurroundPortals>
    </Grid.Item>
  </Grid>
);

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
  cartItemId: PropTypes.string,
  type: PropTypes.string,
};

export default Title;
