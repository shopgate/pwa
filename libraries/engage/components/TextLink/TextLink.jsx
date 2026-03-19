import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { makeStyles } from '@shopgate/engage/styles';
import { Link } from '@shopgate/engage/components';

const useStyles = makeStyles()({
  link: {
    color: 'var(--color-link, inherit)',
    ':visited': {
      color: 'var(--color-link-visited, var(--color-link, inherit))',
    },
    ':hover': {
      color: 'var(--color-link-active , var(--color-link, inherit))',
    },
  },
});

/**
 * The TextLink component
 * @param {Object} props The component props
 * @returns {JSX.Element}
 */
const TextLink = (props) => {
  const { classes } = useStyles();

  return <Link {...props} className={classNames(props.className, classes.link)} tag="a" role="link" tabIndex={0} />;
};

TextLink.propTypes = {
  className: PropTypes.string,
};

TextLink.defaultProps = {
  className: null,
};

export default TextLink;
