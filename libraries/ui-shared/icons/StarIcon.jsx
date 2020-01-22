import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The star icon component
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Star = props => <Icon content={themeConfig.icons.star} {...props} />;

Star.propTypes = {
  className: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  viewBox: PropTypes.string,
};

Star.defaultProps = {
  className: '',
  color: null,
  viewBox: '0 0 24 24',
  size: 'inherit',
};

export default Star;
