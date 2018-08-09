import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

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

/**
 * Picture component
 * @param {Object} props Props.
 * @param {SourceSetType} props.sources SourcesSet collection
 * @param {string} props.alt Alt attribute.
 * @param {bool} props.square Enforce square image.
 * @returns {JSX}
 */
const Picture = ({ sources, alt, square }) => {
  return (
    <div className={styles.getWrapperStyle(square)}>
      <picture>
        <SourceSet sources={sources} />
        <img src={sources.jpeg} alt={alt} className={styles.getImageStyle(square)} />
      </picture>
    </div>
  )
};

Picture.propTypes = {
  sources: SourceSetType.isRequired,
  alt: PropTypes.string,
  square: PropTypes.bool,
};

Picture.defaultProps = {
  alt: '',
  square: false,
};

export default Picture;
