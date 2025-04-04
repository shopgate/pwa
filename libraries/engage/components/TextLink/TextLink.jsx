import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Link } from '@shopgate/engage/components';
import { link } from './TextLink.style';

/**
 * The TextLink component
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const TextLink = props => (
  <Link {...props} className={classNames(props.className, link)} tag="a" role="link" tabIndex={0} />
);

TextLink.propTypes = {
  className: PropTypes.string,
};

TextLink.defaultProps = {
  className: null,
};

export default TextLink;
