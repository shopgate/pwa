import React, { memo } from 'react';
import PropTypes from 'prop-types';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_MANUFACTURER,
  PRODUCT_MANUFACTURER_AFTER,
  PRODUCT_MANUFACTURER_BEFORE,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import PlaceholderLabel from '@shopgate/pwa-ui-shared/PlaceholderLabel';
import BaseManufacturer from '@shopgate/pwa-ui-shared/Manufacturer';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';

const useStyles = makeStyles()({
  infoContainer: {
    alignSelf: 'flex-end',
    fontWeight: 500,
    marginTop: -2,
  },
  placeholder: {
    height: 16,
    width: '70%',
    marginTop: 5,
    marginBottom: 2,
  },
});

/**
 * The Manufacturer component.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Manufacturer = ({ manufacturer }) => {
  const { classes } = useStyles();

  return (
    <>
      <Portal name={PRODUCT_MANUFACTURER_BEFORE} />
      <Portal name={PRODUCT_MANUFACTURER}>
        <div className={classes.infoContainer} data-test-id={`manufacturer: ${manufacturer}`}>
          <PlaceholderLabel className={classes.placeholder} ready={(manufacturer !== null)}>
            <BaseManufacturer text={(manufacturer || '')} />
          </PlaceholderLabel>
        </div>
      </Portal>
      <Portal name={PRODUCT_MANUFACTURER_AFTER} />
    </>
  );
};

Manufacturer.propTypes = {
  manufacturer: PropTypes.string,
};

Manufacturer.defaultProps = {
  manufacturer: '',
};

export default connect(memo(Manufacturer));
