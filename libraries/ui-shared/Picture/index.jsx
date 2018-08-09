import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

export const SourceSetType = PropTypes.shape({
  png: PropTypes.string.isRequired,
  webp: PropTypes.string,
  jpeg2000: PropTypes.string,
  jpeg: PropTypes.string,
});

const favorTypes = ['webp', 'jpeg2000'];

/**
 * Source set.
 * @param {Object} sources Sources.
 * @returns {JSX}
 */
const SourceSet = ({ sources }) => Object.keys(sources)
  // Push favorite formats on top
  .sort(((a, b) => favorTypes.includes(b)))
  .map(type => (
    <source key={type} srcSet={sources[type]} type={`image/${type}`} />
  ));

SourceSet.propTypes = {
  sources: PropTypes.shape(SourceSetType).isRequired,
};

/**
 * Picture component
 * @param {Object} props Props.
 * @param {SourceSetType} props.sources SourcesSet collection
 * @param {string} props.alt Alt attribute.
 * @param {bool} props.square Enforce square image.
 * @param {string} props.testId Test id (for e2e tests).
 * @param {string} props.imgClassName Img class name.
 * @returns {JSX}
 */
const Picture = ({
  sources,
  alt,
  square,
  testId,
  imgClassName,
}) => (
  <div className={styles.getWrapperStyle(square)}>
    <picture>
      <SourceSet sources={sources} />
      <img
        src={sources.jpeg}
        alt={alt}
        className={styles.getImageStyle(imgClassName, square)}
        data-test-id={testId}
      />
    </picture>
  </div>
);

Picture.propTypes = {
  sources: SourceSetType.isRequired,
  alt: PropTypes.string,
  imgClassName: PropTypes.string,
  square: PropTypes.bool,
  testId: PropTypes.string,
};

Picture.defaultProps = {
  alt: '',
  square: false,
  testId: null,
  imgClassName: '',
};

export default Picture;
