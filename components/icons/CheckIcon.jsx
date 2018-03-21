import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = '<path d="M1 11.248L8.84 19 23 5" stroke="#000" stroke-width="2" fill="none" fill-rule="evenodd"/>';

/**
 * The check icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const Check = props => <Icon content={content} {...props} />;

export default Check;
