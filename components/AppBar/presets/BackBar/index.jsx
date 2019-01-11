import React, { Fragment, PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_LEFT,
  APP_BAR_LEFT_BEFORE,
  APP_BAR_LEFT_AFTER,
  APP_BAR_BACK,
} from '@shopgate/pwa-common/constants/Portals';
import { AppBar } from '@shopgate/pwa-ui-material';
import { ArrowIcon } from '@shopgate/pwa-ui-shared';
import DefaultBar from '../DefaultBar';
import connect from './connector';

/**
 * The BackBar component.
 */
class BackBar extends PureComponent {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
  };

  /**
   * @returns {JSX}
   */
  left = () => {
    const { goBack } = this.props;
    return (
      <Fragment key="left">
        <Portal name={APP_BAR_LEFT_BEFORE} />
        <Portal name={APP_BAR_LEFT}>
          <AppBar.Icon icon={ArrowIcon} onClick={goBack} testId="backButton" />
        </Portal>
        <Portal name={APP_BAR_LEFT_AFTER} />
      </Fragment>
    );
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { goBack, ...rest } = this.props;
    return (
      <Portal name={APP_BAR_BACK}>
        <DefaultBar left={this.left()} {...rest} />
      </Portal>
    );
  }
}

export default connect(BackBar);
