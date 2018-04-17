import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M4 14h4v-4H4v4zm0 5h4v-4H4v4zM4 9h4V5H4v4zm5 5h12v-4H9v4zm0 5h12v-4H9v4zM9 5v4h12V5H9z"/><path d="M0 0h24v24H0z" fill="none"/>';

/**
 * The view list icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const ViewList = props => <Icon content={content} {...props} />;

export default ViewList;
