import React from 'react';
import PropTypes from 'prop-types';
import Icon from '@shopgate/pwa-common/components/Icon';

/**
 * The filter icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const MaterialShareIcon = (props) => {
  const content = `<path d="${props.svg}"/>`;
  return (
    <div>
      <Icon content={content} {...props} />
    </div>
  );
};

MaterialShareIcon.propTypes = {
  svg: PropTypes.string.isRequired,
};

export default MaterialShareIcon;
