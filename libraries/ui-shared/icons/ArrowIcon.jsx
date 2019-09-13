import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@shopgate/pwa-common/components/Icon';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

/**
 * The arrow icon component.
 * @param {Object} props The icon component properties.
 * @param {boolean} props.shadow Whether to show a shadow under the arrow.
 * @returns {JSX}
 */
const ArrowIcon = ({ shadow, ...props }) => {
  const content = (shadow) ? themeConfig.icons.arrowShadowed : themeConfig.icons.arrow;
  return <Icon content={content} {...props} />;
};

ArrowIcon.propTypes = {
  shadow: PropTypes.bool,
};

ArrowIcon.defaultProps = {
  shadow: false,
};

export default ArrowIcon;
