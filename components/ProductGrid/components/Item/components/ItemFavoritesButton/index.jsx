import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_ITEM_FAVORITES_BUTTON,
  PRODUCT_ITEM_FAVORITES_BUTTON_AFTER,
  PRODUCT_ITEM_FAVORITES_BUTTON_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import FavoritesButton from '@shopgate/pwa-ui-shared/FavoritesButton';
import connect from './connector';
import styles from './style';

/**
 * The item favorites button component.
 */
class ItemFavoritesButton extends PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    isFavorite: PropTypes.bool,
  };

  static defaultProps = {
    isFavorite: false,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { productId, isFavorite } = this.props;
    const props = { productId };

    return (
      <Fragment>
        <Portal name={PRODUCT_ITEM_FAVORITES_BUTTON_BEFORE} props={props} />
        <Portal name={PRODUCT_ITEM_FAVORITES_BUTTON} props={props}>
          <div className={styles} data-test-id="favorites" aria-hidden>
            <FavoritesButton
              active={isFavorite}
              productId={productId}
              noShadow
              removeWithRelatives
            />
          </div>
        </Portal>
        <Portal name={PRODUCT_ITEM_FAVORITES_BUTTON_AFTER} props={props} />
      </Fragment>
    );
  }
}

export default connect(ItemFavoritesButton);
