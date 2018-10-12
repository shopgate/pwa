import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { AppBar } from '@shopgate/pwa-ui-material';
import { CrossIcon } from '@shopgate/pwa-ui-shared';
import DefaultBar from '../DefaultBar';
import connect from './connector';

/**
 * The CloseBar component.
 */
class CloseBar extends PureComponent {
  static propTypes = {
    goBack: PropTypes.func.isRequired,
  };

  /**
   * @returns {JSX}
   */
  get left() {
    const { goBack } = this.props;
    return <AppBar.Icon icon={CrossIcon} onClick={goBack} />;
  }

  /**
   * @returns {JSX}
   */
  render() {
    const { goBack, ...rest } = this.props;
    return (
      <DefaultBar left={this.left} right={null} {...rest} />
    );
  }
}

export default connect(CloseBar);
