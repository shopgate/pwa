import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
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
    return <AppBar.Icon icon={ArrowIcon} onClick={goBack} />;
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { goBack, ...rest } = this.props;
    return (
      <DefaultBar left={this.left()} {...rest} />
    );
  }
}

export default connect(BackBar);
