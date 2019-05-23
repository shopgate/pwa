import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { Availability } from '@shopgate/engage/components';
import { Portal } from '@shopgate/engage/components';
import {
  PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY_BEFORE,
  PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY,
  PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY_AFTER,
} from '@shopgate/engage/product';
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
    if (!this.props.availability) {
      return null;
    }

    const { availability } = this.props;
    const { state, text } = availability;

    return (
      <Fragment>
        <Portal name={PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY_BEFORE} props={availability} />
        <Portal name={PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY} props={availability}>
          <Availability className={styles} state={state} text={text} />
        </Portal>
        <Portal name={PRODUCT_VARIANT_SELECT_PICKER_AVAILABILITY_AFTER} props={availability} />
      </Fragment>
    );
  }
}

export default connect(VariantAvailability);
