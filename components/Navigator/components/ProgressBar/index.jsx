import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import { UIEvents } from '@shopgate/pwa-core';
import ProgressBar from '@shopgate/pwa-ui-shared/ProgressBar';
import Portal from '@shopgate/pwa-common/components/Portal';
import {
  NAV_BAR_PROGRESS_BAR,
  NAV_BAR_PROGRESS_BAR_BEFORE,
  NAV_BAR_PROGRESS_BAR_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { TOGGLE_PROGRESSBAR } from '../../constants';
import connect from './connector';

/**
 * The ProgressBarContainer component
 */
class ProgressBarContainer extends PureComponent {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);

    this.state = {
      visible: true,
    };

    UIEvents.on(TOGGLE_PROGRESSBAR, this.toggle);
  }

  /**
   * @param {boolean} visible The next state.
   */
  toggle = (visible) => {
    this.setState({ visible });
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { loading } = this.props;
    const { visible } = this.state;

    if (!visible) {
      return null;
    }

    return (
      <Fragment>
        <Portal name={NAV_BAR_PROGRESS_BAR_BEFORE} />
        <Portal name={NAV_BAR_PROGRESS_BAR} props={{ ProgressBar }}>
          <ProgressBar isVisible={loading && visible} />
        </Portal>
        <Portal name={NAV_BAR_PROGRESS_BAR_AFTER} />
      </Fragment>
    );
  }
}

export default connect(ProgressBarContainer);
