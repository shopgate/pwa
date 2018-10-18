import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@shopgate/pwa-common/components/Icon';

/**
 * The filter icon component. SVG is grabbed from config
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ShareIcon = (props) => {
  const content = `<path d="${props.svg}"/>`;
  return (
    <div>
      <Icon content={content} {...props} />
    </div>
  );
};

ShareIcon.propTypes = {
  svg: PropTypes.string.isRequired,
};

export default ShareIcon;
