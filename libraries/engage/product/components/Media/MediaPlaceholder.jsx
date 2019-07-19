import React from 'react';
import classnames from 'classnames';
import PlaceholderIcon from '@shopgate/pwa-ui-shared/icons/PlaceholderIcon';
import { defaultProps, propTypes } from './props';
import { placeholderContainer, placeholderContent, placeholderIcon } from './style';

/**
 * The media placeholder component.
 * @returns {JSX}
 */
const MediaPlaceholder = ({ className }) => (
  <div className={classnames(placeholderContainer, className)}>
    <div className={placeholderContent} data-test-id="placeHolder">
      <PlaceholderIcon className={placeholderIcon} />
    </div>
  </div>
);

MediaPlaceholder.propTypes = {
  className: propTypes.className,
};
MediaPlaceholder.defaultProps = {
  className: defaultProps.className,
};

export default MediaPlaceholder;
