import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Availability from '@shopgate/pwa-ui-shared/Availability';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY_BEFORE,
  PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY,
  PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY_AFTER,
} from '@shopgate/pwa-common-commerce/product/constants/Portals';
import connect from './connector';
import styles from './style';

/**
 * The VariantAvailability component.
 */
class VariantAvailability extends PureComponent {
  static propTypes = {
    availability: PropTypes.shape(),
  };

  static defaultProps = {
    availability: null,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { availability } = this.props;
    const { state, text } = availability || {};
    if (!availability) {
      return null;
    }

    return (
      <Fragment>
        <Portal
          name={PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY_BEFORE}
          props={{
            text,
            state,
          }}
        />
        <Portal
          name={PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY}
          props={{
            text,
            state,
          }}
        >
          <Availability className={styles} state={state} text={text} />
        </Portal>
        <Portal
          name={PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY_AFTER}
          props={{
            text,
            state,
          }}
        />
      </Fragment>
    );
  }
}

export default connect(VariantAvailability);
