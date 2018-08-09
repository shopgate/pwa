import React from 'react';
import PropTypes from 'prop-types';

export const SourceSetType = PropTypes.shape({
  png: PropTypes.string.isRequired,
  webp: PropTypes.string,
  jpeg2000: PropTypes.string,
});

const favorTypes = ['webp', 'jpeg2000'];

/**
 * Source set.
 * @param {Object} sources Sources.
 * @returns {JSX}
 */
const SourceSet = ({sources}) => Object.keys(sources)
  // Push favorite formats on top
  .sort(((a, b) => favorTypes.includes(b)))
  .map((type) => (
    <source key={type} srcSet={sources[type]} type={`image/${type}`} />
  ));

const Picture = ({ className, sources, alt }) => (
  <picture>
    <SourceSet sources={sources} />
    <img src={sources.jpeg} alt={alt} className={className} />
  </picture>
);

Picture.propTypes = {
  sources: SourceSetType.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
};

Picture.defaultProps = {
  alt: '',
  className: '',
};

export default Picture;
