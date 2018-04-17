import React from 'react';
import Icon from '@shopgate/pwa-common/components/Icon';

// SVG Content
const content = `<g fill="#000" fill-rule="nonzero"><path d="M11.326 20.682a1.193 1.193 0 1 0
2.385-.004 1.193 1.193 0 0 0-2.385.004zm-4.4 0a1.193 1.193 0 1 0 1.192-1.192 1.193 1.193 0 0 0-1.198
1.192h.006zm-2.4-14.8a.906.906 0 0 0-.843-.587h-1.98a.903.903 0 1 0 0 1.806h1.355l2.772 7.217a.906.906
0 0 0 .843.588h6.266a.875.875 0 1 1 0 1.75H6.187a.903.903 0 1 0 0 1.806h6.758a2.677 2.677 0 0 0
1.87-4.596l2.221-4.005a.902.902 0 0 0-.654-1.33H5.537L4.526 5.882zM20.897
6.682H23.8V4.87h-2.903V2h-1.794v2.869h-2.897v1.813h2.897v2.88h1.794z"/></g>`;

/**
 * The add more icon component.
 * @param {Object} props The icon component properties.
 * @returns {JSX}
 */
const AddMore = props => <Icon content={content} {...props} />;

export default AddMore;
