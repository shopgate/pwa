import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import appConfig from '@shopgate/pwa-common/helpers/config';
import Info from './components/Info';
import DefaultCard from './components/DefaultCard';

const { user: { addresses: { splitDefaultsByTags } } } = appConfig;

/**
 * @param {UserAddress} address address
 * @param {Object} defaults is default
 * @param {function} setDefault set as default handler
 * @constructor
 */
const Address = ({ address, defaults, setDefault }) => (
  <Fragment>
    <Info address={address} />
    {
      splitDefaultsByTags.map(tag => (
        <DefaultCard
          tag={tag}
          isDefault={defaults[tag] === address.id}
          setAsDefault={() => setDefault(address.id, tag)}
          key={`${tag}_${address.id}`}
        />
      ))
    }
  </Fragment>
);

Address.propTypes = {
  address: PropTypes.shape().isRequired,
  defaults: PropTypes.shape().isRequired,
  setDefault: PropTypes.func.isRequired,
};

export default Address;
