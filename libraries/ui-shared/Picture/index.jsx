import React from 'react';
import PropTypes from 'prop-types';
import styles from './style';

export const SourceSetType = PropTypes.shape({
  png: PropTypes.string.isRequired,
  webp: PropTypes.string,
  jp2: PropTypes.string,
  jpeg: PropTypes.string,
});

const favorTypes = ['webp', 'jp2'];

/**
 * Source set.
 * @param {Object} sources Sources.
 * @param {function} onError onError callback.
 * @returns {JSX}
 */
const SourceSet = ({ sources, onError }) => Object.keys(sources)
  // Push favorite formats on top
  .sort(((a, b) => favorTypes.includes(b)))
  .map(type => (
    <source key={type} srcSet={sources[type]} type={`image/${type}`} onError={onError} />
  ));

SourceSet.propTypes = {
  sources: SourceSetType.isRequired,
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
  className,
  onError,
}) => (
  <div className={`${className} ${styles.getWrapperStyle(square)}`}>
    <picture>
      <SourceSet sources={sources} onError={(e) => console.warn(e.target)} />
      <img
        src={sources.jpeg}
        alt={alt}
        className={styles.getImageStyle(imgClassName, square)}
        data-test-id={testId}
        onError={onError}
      />
    </picture>
  </div>
);

Picture.propTypes = {
  sources: SourceSetType.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  imgClassName: PropTypes.string,
  onError: PropTypes.func,
  square: PropTypes.bool,
  testId: PropTypes.string,
};

Picture.defaultProps = {
  alt: '',
  className: '',
  imgClassName: '',
  onError: () => {},
  square: false,
  testId: null,
};

export default Picture;
