import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Availability from '@shopgate/pwa-ui-shared/Availability';
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

    if (!availability) {
      return null;
    }

    return (
      <Availability className={styles} state={availability.state} text={availability.text} />
    );
  }
}

export default connect(VariantAvailability);
