import PropTypes from 'prop-types';

export const propTypes = {
  type: PropTypes.oneOf(['image', 'video']),
  url: PropTypes.string,
  altText: PropTypes.string,
};

export const defaultProps = {
  type: 'image',
  url: null,
  altText: null,
};
