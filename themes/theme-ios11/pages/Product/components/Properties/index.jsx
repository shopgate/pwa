import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_PROPERTIES,
  PRODUCT_PROPERTIES_AFTER,
  PRODUCT_PROPERTIES_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import styles from './style';
import PropertyRows from './components/PropertyRows';
import connect from './connector';

/**
 * The Product Properties component.
 */
class Properties extends PureComponent {
  static propTypes = {
    properties: PropTypes.arrayOf(PropTypes.shape()),
  };

  static defaultProps = {
    properties: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { properties } = this.props;

    return (
      <Fragment>
        <Portal name={PRODUCT_PROPERTIES_BEFORE} />
        <Portal name={PRODUCT_PROPERTIES}>
          {(properties && properties.length !== 0) && (
            <div className={styles.content}>
              <table className={styles.table}>
                <tbody>
                  <PropertyRows properties={properties} />
                </tbody>
              </table>
            </div>
          )}
        </Portal>
        <Portal name={PRODUCT_PROPERTIES_AFTER} />
      </Fragment>
    );
  }
}

export default connect(Properties);
