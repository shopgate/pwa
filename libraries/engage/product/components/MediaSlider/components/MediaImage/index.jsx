import React from 'react';
import PropTypes from 'prop-types';
import { FeaturedImage } from '../../../FeaturedMedia';
import { full } from '../../style';

/**
 * The product media video slide component.
 * @returns {JSX}
 */
const MediaImage = ({ media, onClick }) => (
  <div
    onClick={onClick}
    onKeyDown={onClick}
    role="button"
    tabIndex="0"
    className={full}
  >
    <FeaturedImage url={media.url} altText={media.altText} hideImageShadow />
  </div>
);

MediaImage.propTypes = {
  media: PropTypes.shape({
    altText: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  onClick: PropTypes.func.isRequired,
};

export default MediaImage;
