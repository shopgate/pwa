import React, { Component } from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import View from 'Components/View';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import AddressList from './components/AddressList';
import connect from './connector';
import styles from './style';

/**
 * The User AddressBook component.
 */
class AddressBook extends Component {
  static propTypes = {
    hasAddresses: PropTypes.bool.isRequired,
  }

  /**
   * Renders the component.
   * @return {JSX}
   */
  render() {
    const { hasAddresses } = this.props;
    return (
      <View>
        <section className={styles.container} data-test-id="UserAddressBookPage">

          <div className={styles.headline}>
            <I18n.Text string="user.addressbook.headline" />
          </div>

          {!hasAddresses &&
            <div className={styles.subline}>
              <I18n.Text string="user.addressbook.noAddresses" />
            </div>
          }

          {hasAddresses && <AddressList />}

          <div className={styles.buttonWrapper} data-test-id="AddAddressButton">
            <Link href="/user/addAddress">
              <RippleButton className={styles.button} type="secondary">
                <I18n.Text string="user.addressbook.button" />
              </RippleButton>
            </Link>
          </div>

        </section>
      </View>
    );
  }
}

export default connect(AddressBook);
