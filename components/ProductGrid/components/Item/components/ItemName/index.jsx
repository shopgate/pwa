import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_ITEM_NAME,
  PRODUCT_ITEM_NAME_AFTER,
  PRODUCT_ITEM_NAME_BEFORE,
} from '@shopgate/pwa-common-commerce/category/constants/Portals';
import Ellipsis from '@shopgate/pwa-common/components/Ellipsis';
import styles from './style';

/**
 * The item name component.
 */
class ItemName extends PureComponent {
  static propTypes = {
    productId: PropTypes.string.isRequired,
    display: PropTypes.shape(),
    name: PropTypes.string,
  };

  static defaultProps = {
    display: null,
    name: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { display, productId, name } = this.props;

    if (display && !display.name) {
      return null;
    }

    const props = { productId };

    return (
      <Fragment>
        <Portal name={PRODUCT_ITEM_NAME_BEFORE} props={props} />
        <Portal name={PRODUCT_ITEM_NAME} props={props}>
          <div className={styles.title} data-test-id={`Productname: ${name}`} aria-label={`${name}.`}>
            <Ellipsis>{name}</Ellipsis>
          </div>
        </Portal>
        <Portal name={PRODUCT_ITEM_NAME_AFTER} props={props} />
      </Fragment>
    );
  }
}

export default ItemName;
