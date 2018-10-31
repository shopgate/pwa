import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

const content = '<path d="M18 16.1364C17.24 16.1364 16.56 16.4376 16.04 16.9095L8.91 12.7428C8.96 12.5119 9 12.281 9 12.04C9 11.7991 8.96 11.5682 8.91 11.3372L15.96 7.21072C16.5 7.71273 17.21 8.02397 18 8.02397C19.66 8.02397 21 6.67859 21 5.01193C21 3.34526 19.66 1.99988 18 1.99988C16.34 1.99988 15 3.34526 15 5.01193C15 5.25289 15.04 5.48381 15.09 5.71474L8.04 9.84124C7.5 9.33924 6.79 9.02799 6 9.02799C4.34 9.02799 3 10.3734 3 12.04C3 13.7067 4.34 15.0521 6 15.0521C6.79 15.0521 7.5 14.7408 8.04 14.2388L15.16 18.4155C15.11 18.6264 15.08 18.8473 15.08 19.0682C15.08 20.6846 16.39 21.9999 18 21.9999C19.61 21.9999 20.92 20.6846 20.92 19.0682C20.92 17.4517 19.61 16.1364 18 16.1364Z"/>';

/**
 * The Share icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ShareIcon = props => <Icon content={content} {...props} />;

export default ShareIcon;
