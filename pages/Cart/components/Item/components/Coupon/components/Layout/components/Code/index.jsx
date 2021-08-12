import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { Ellipsis } from '@shopgate/engage/components';
import { css } from 'glamor';

/**
 * on iOS theme the maximum with the
 * ellipsis wrapper can have is almost 179px
 * @type {{ellipsis: string}}
 */
const styles = {
  ellipsis: css({
    width: '175px',
    whiteSpace: 'nowrap',
    display: 'inline-block !important',
  }).toString(),
};

/**
* The Coupon Code component.
* @param {Object} props The component props.
* @returns {JSX}
*/
const Code = ({ value }) => (
  <Ellipsis className={styles.ellipsis}>
    <I18n.Text string="cart.coupon_code" />
    {': '}
    {value}
  </Ellipsis>
);

Code.propTypes = {
  value: PropTypes.string.isRequired,
};

export default Code;
