import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import { APP_BAR_SIMPLE } from '@shopgate/pwa-common/constants/Portals';
import DefaultBar from '../DefaultBar';

/**
 * The SimpleBar component.
 */
class SimpleBar extends PureComponent {
  static propTypes = {
    title: PropTypes.string.isRequired,
  };

  /**
   * @returns {JSX}
   */
  render() {
    const { title } = this.props;

    return (
      <Portal name={APP_BAR_SIMPLE}>
        <DefaultBar title={title} right={null} />
      </Portal>
    );
  }
}

export default SimpleBar;
