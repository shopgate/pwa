import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SecurityIcon from '@shopgate/pwa-ui-shared/icons/SecurityIcon';
import connect from './connector';

/**
 * The DeleteAccount component
 */
class DeleteAccount extends Component {
  static contextTypes = {
    i18n: PropTypes.func,
  }

  static propTypes = {
    deleteAccount: PropTypes.func.isRequired,
    Item: PropTypes.node.isRequired,
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
    const { Item, isShown } = this.props;

    if (!isShown) {
      return null;
    }

    return (
      <Item
        key="deleteuser"
        label="user.delete_account"
        icon={SecurityIcon}
        onClick={this.handleDeleteAccount}
      />
    );
  }
}

export default connect(DeleteAccount);
