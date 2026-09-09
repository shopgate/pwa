import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@shopgate/engage/components';

/**
 * The TextLink component
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const TextLink = props => <Link {...props} className={props.className} tag="a" role="link" tabIndex={0} />;

TextLink.propTypes = {
  className: PropTypes.string,
};

TextLink.defaultProps = {
  className: null,
};

export default TextLink;
