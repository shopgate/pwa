import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import connect from './SupplementalContent.connector';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  wrapper: {
    display: 'block',
    color: 'var(--color-text-low-emphasis)',
    fontSize: 12,
    lineHeight: 'unset',
    padding: `${variables.gap.big}px 0`,
    '> *:first-child': {
      marginTop: 0,
    },
    ' ol, ul': {
      margin: `${variables.gap.small}px 0`,
      paddingLeft: variables.gap.xbig,
    },
    ' ol': {
      listStyle: 'decimal',
    },
    ' ul': {
      listStyle: 'disc',
    },
    ' a': {
      textDecoration: 'underline',
      color: 'var(--color-primary)',
    },
  },
});

/**
 * The SupplementalContent component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const SupplementalContent = ({ text, className }) => {
  const { classes } = useStyles();
  if (!text) {
    return null;
  }

  /* eslint-disable react/no-danger */
  return (
    <div
      className={classNames(classes.wrapper, className)}
      dangerouslySetInnerHTML={{ __html: text }}
    />
  );
  /* eslint-enable react/no-danger */
};

SupplementalContent.propTypes = {
  className: PropTypes.string,
  text: PropTypes.string,
};

SupplementalContent.defaultProps = {
  text: null,
  className: null,
};

export default connect(SupplementalContent);
