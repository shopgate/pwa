import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import SecurityIcon from '@shopgate/pwa-ui-shared/icons/SecurityIcon';
import connect from './connector';

/**
 * Delete account button component
 */
class DeleteAccount extends Component {
  static propTypes = {
    deleteAccountRequest: PropTypes.func.isRequired,
    isShown: PropTypes.bool,
  }

  static defaultProps = {
    isShown: false,
  }

  /**
   * Handler to request account removal
   */
  handleDeleteAccount = () => {
    this.props.deleteAccountRequest();
  }

  /**
   * Render function
   * @return {*}
   */
  render() {
    // eslint-disable-next-line react/prop-types
    const { Item, isShown } = this.props;

    if (!isShown) {
      return null;
    }

    return (
      <Item key="deleteuser" onClick={this.handleDeleteAccount} title="user.delete_account" icon={SecurityIcon}>
        <I18n.Text string="user.delete_account" />
      </Item>
    );
  }
}

export default connect(DeleteAccount);
