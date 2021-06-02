import React, { Fragment, memo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_MANUFACTURER,
  PRODUCT_MANUFACTURER_AFTER,
  PRODUCT_MANUFACTURER_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import BaseManufacturer from '@shopgate/pwa-ui-shared/Manufacturer';
import connect from './connector';
import styles from './style';

/**
 * The Manufacturer component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Manufacturer = ({ manufacturer }) => (
  <Fragment>
    <Portal name={PRODUCT_MANUFACTURER_BEFORE} />
    <Portal name={PRODUCT_MANUFACTURER}>
      <div className={styles.infoContainer} data-test-id={`manufacturer: ${manufacturer}`}>
        <PlaceholderLabel className={styles.placeholder} ready={(manufacturer !== null)}>
          <BaseManufacturer text={(manufacturer || '')} />
        </PlaceholderLabel>
      </div>
    </Portal>
    <Portal name={PRODUCT_MANUFACTURER_AFTER} />
  </Fragment>
);

Manufacturer.propTypes = {
  manufacturer: PropTypes.string,
};

Manufacturer.defaultProps = {
  manufacturer: '',
};

export default connect(memo(Manufacturer));
