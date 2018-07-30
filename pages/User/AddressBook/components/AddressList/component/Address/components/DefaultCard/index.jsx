import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import TickIcon from '@shopgate/pwa-ui-shared/icons/TickIcon';
import I18n from '@shopgate/pwa-common/components/I18n';
import Portal from '@shopgate/pwa-common/components/Portal';
import * as portals from '@shopgate/pwa-common/user/constants/Portals';
import style from './style';

/**
 * Render a card to show if address is default
 * @param {string} tag for default address
 * @param {bool} isDefault is default
 * @param {function} setAsDefault set as default handler
 * @constructor
 */
const DefaultCard = ({ tag, isDefault, setAsDefault }) => (
  <Fragment>
    <Portal name={portals.USER_ADDRESSES_ADDRESS_DEFAULT_BEFORE} />
    <Portal name={portals.USER_ADDRESSES_ADDRESS_DEFAULT}>
      {isDefault &&
        <Grid className={style.defaultAddress}>
          <Grid.Item grow={1}>
            <I18n.Text string={`user.addresses.defaults.${tag}`} />
          </Grid.Item>
          <Grid.Item grow={0}>
            <TickIcon size={24} />
          </Grid.Item>
        </Grid>
      }
      {!isDefault &&
        <div
          className={style.setDefaultAddress}
          onClick={setAsDefault}
          aria-hidden
        >
          <I18n.Text string={`user.addresses.setAsDefault.${tag}`} />
        </div>
      }
    </Portal>
    <Portal name={portals.USER_ADDRESSES_ADDRESS_DEFAULT_AFTER} />
  </Fragment>
);

DefaultCard.propTypes = {
  isDefault: PropTypes.bool.isRequired,
  setAsDefault: PropTypes.func.isRequired,
  tag: PropTypes.string.isRequired,
};

export default DefaultCard;
