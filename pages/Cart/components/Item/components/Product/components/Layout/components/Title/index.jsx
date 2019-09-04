import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import I18n from '@shopgate/pwa-common/components/I18n';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common-commerce/cart/constants/Portals';
import ContextMenu from '@shopgate/pwa-ui-shared/ContextMenu';
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
      <Portal name={portals.CART_ITEM_NAME_BEFORE} props={context} />
      <Portal name={portals.CART_ITEM_NAME} props={context}>
        <div className={styles.title} data-test-id={value}>
          {value}
        </div>
      </Portal>
      <Portal name={portals.CART_ITEM_NAME_AFTER} props={context} />
    </Grid.Item>
    <Grid.Item className={styles.menuContainer} shrink={0}>
      <ContextMenu classes={contextMenuClasses}>
        <ContextMenu.Item onClick={handleRemove}>
          <I18n.Text string="cart.remove" />
        </ContextMenu.Item>
        <ContextMenu.Item onClick={() => toggleEditMode(true)}>
          <I18n.Text string="cart.edit" />
        </ContextMenu.Item>
      </ContextMenu>
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
