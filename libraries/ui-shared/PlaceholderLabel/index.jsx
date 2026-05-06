import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const useStyles = makeStyles()(() => ({
  label: {
    background: themeConfig.colors.dark,
    opacity: 0.1,
    width: '100%',
    height: 16,
    marginBottom: 12,
  },
}));

/**
 * Placeholder for one line texts.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const PlaceholderLabel = ({
  children, className, ready, style,
}) => {
  const { classes, cx } = useStyles();

  if (!ready) {
    return (
      <div style={style} className={cx(classes.label, className, 'ui-shared__placeholder-label')} />
    );
  }

  return children;
};

PlaceholderLabel.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  ready: PropTypes.bool,
  style: PropTypes.shape(),
};

PlaceholderLabel.defaultProps = {
  children: null,
  className: '',
  style: null,
  ready: false,
};

export default PlaceholderLabel;
