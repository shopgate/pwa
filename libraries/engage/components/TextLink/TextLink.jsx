import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { Link } from '@shopgate/engage/components';

const useStyles = makeStyles()(theme => ({
  link: {
    color: theme.components.link.color,
  },
}));

/**
 * The TextLink component
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const TextLink = (props) => {
  const { classes, cx } = useStyles();

  return <Link {...props} className={cx(classes.link, props.className)} tag="a" role="link" tabIndex={0} />;
};

TextLink.propTypes = {
  className: PropTypes.string,
};

TextLink.defaultProps = {
  className: null,
};

export default TextLink;
