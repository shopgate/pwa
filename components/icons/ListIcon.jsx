import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z"/>';

/**
 * The list icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const List = props => <Icon content={content} {...props} />;

export default List;
