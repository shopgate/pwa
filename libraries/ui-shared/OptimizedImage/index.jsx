import React from 'react';
import PropTypes from 'prop-types';
import Picture, { SourceSetType } from '../Picture';

/**
 * Optimized image. Renders a `Picture` with source set (if provided).
 *
 * @param {string} alt Alt attribute.
 * @param {string} className Img classname.
 * @param {string} src Main src (used for a fallback if no sources are given).
 * @param {SourceSetType} [sources=null] Source set
 * @param {string} testId Test id (for e2e tests).
 * @returns {JSX}
 */
const OptimizedImage = ({
  alt,
  className,
  src,
  sources,
  testId,
}) => {
  if (!sources) {
    return <img src={src} alt={alt} className={className} data-test-id={testId} />;
  }

  return (
    <Picture
      sources={sources}
      className={className}
      testId={testId}
      alt={alt}
    />
  );
};

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  sources: SourceSetType,
  testId: PropTypes.string,
};

OptimizedImage.defaultProps = {
  alt: '',
  className: '',
  sources: null,
  testId: null,
};

export default OptimizedImage;
