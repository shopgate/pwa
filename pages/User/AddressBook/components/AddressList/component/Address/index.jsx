import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Grid from '@shopgate/pwa-common/components/Grid';
import Link from '@shopgate/pwa-common/components/Router/components/Link';
import ArrowIcon from '@shopgate/pwa-ui-shared/icons/ArrowIcon';

/**
 * @param {Object} props props
 * @constructor
 */
const Address = ({ address }) => (
  <Fragment>
    <Link href="/user/addAddress">
      <Grid>
        <Grid.Item grow={1}>
          <div>{`${address.firstName} ${address.lastName}`}</div>
          <div>{address.street1}</div>
          <div>{`${address.zipCode} ${address.city}`}</div>
        </Grid.Item>
        <Grid.Item grow={0}>
          <ArrowIcon size={28} />
        </Grid.Item>
      </Grid>
    </Link>
  </Fragment>
);

Address.propTypes = {
  address: PropTypes.shape().isRequired,
};

export default Address;
