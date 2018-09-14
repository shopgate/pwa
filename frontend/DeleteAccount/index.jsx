import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavDrawer } from '@shopgate/pwa-ui-material';
import SecurityIcon from '@shopgate/pwa-ui-shared/icons/SecurityIcon';
import connect from './connector';

/**
 * The DeleteAccount component
 */
class DeleteAccount extends Component {
  static propTypes = {
    deleteAccount: PropTypes.func.isRequired,
    isShown: PropTypes.bool,
  }

  static defaultProps = {
    isShown: false,
  }

  /**
   * Handler to request account removal
   */
  handleDeleteAccount = () => {
    this.props.deleteAccount();
  }

  /**
   * @return {JSX|null}
   */
  render() {
    const { isShown } = this.props;

    if (!isShown) {
      return null;
    }

    return (
      <NavDrawer.Item
        icon={SecurityIcon}
        label="user.delete_account"
        onClick={this.handleDeleteAccount}
      />
    );
  }
}

export default connect(DeleteAccount);
