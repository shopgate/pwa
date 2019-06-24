import PropTypes from 'prop-types';

export const propTypes = {
  type: PropTypes.oneOf(['image', 'video']),
  url: PropTypes.string,
  altText: PropTypes.string,
  className: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape,
  ]),
};

export const defaultProps = {
  type: 'image',
  url: null,
  altText: null,
  className: null,
};
