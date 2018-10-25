import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

/**
 * The Share icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ShareIcon = (props) => {
  const content = '<path fill-rule="evenodd" clip-rule="evenodd" d="M9.26855 4.65566L9.64551 5.05801C9.7373 5.15371 9.88379 5.15566 9.97363 5.06289L13 1.99892V17.0043H14.001V1.87051L17.2529 5.12246C17.3418 5.21377 17.4873 5.21182 17.5781 5.11709L17.9922 4.72158C18.084 4.62685 18.0859 4.47549 17.9961 4.38369L14.2305 0.617089C14.2236 0.565819 14.2002 0.515526 14.1621 0.475487L13.7852 0.0731434C13.6924 -0.0225598 13.5459 -0.0245129 13.457 0.0682606L9.2627 4.31435C9.17285 4.40713 9.17578 4.56045 9.26855 4.65566ZM5 25.5043V8.5043H11V7.5043H4V26.5043H23V7.5043H16V8.5043H22V25.5043H5Z"/>';
  return (
    <div>
      <Icon viewBox="0 0 26 26" content={content} {...props} />
    </div>
  );
};

export default ShareIcon;
