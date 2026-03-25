import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import color from 'color';
import { getCSSCustomProp, makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';

const { colors } = themeConfig;
const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

const useStyles = makeStyles()({
  underlineWrapper: {
    position: 'relative',
    width: '100%',
    borderBottom: `1px solid ${colors.shade12}`,
    marginTop: 2,
    marginBottom: 7,
  },
  underline: {
    position: 'relative',
    width: '100%',
    top: 1,
    borderBottomWidth: 2,
    borderBottomStyle: 'solid',
    willChange: 'transform',
    transition: `transform ${easing}`,
  },
});

/**
 * Returns the underline inline style.
 * @param {boolean} focused Is focused set or not.
 * @param {boolean} hasError Has error set or not.
 * @return {Object} style
 */
const getUnderlineStyle = (focused, hasError) => {
  const primaryColor = getCSSCustomProp('--color-primary') || colors.primary;
  let focusColor = '--color-primary';

  if (color(primaryColor).luminosity() >= 0.8) {
    focusColor = '--color-secondary';
  }

  return {
    borderBottomColor: hasError ? 'var(--color-state-alert)' : `var(${focusColor}, ${colors.focus})`,
    ...(!focused && !hasError) && { transform: 'scale3d(0,1,1)' },
  };
};

/**
 * Renders the underline element.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Underline = (props) => {
  const { classes } = useStyles();

  return (
    <div className={classNames(classes.underlineWrapper, 'underline')} aria-hidden>
      <div
        className={classes.underline}
        style={getUnderlineStyle(props.isFocused, props.hasErrorMessage)}
      />
    </div>
  );
};

Underline.propTypes = {
  hasErrorMessage: PropTypes.bool,
  isFocused: PropTypes.bool,
};

Underline.defaultProps = {
  isFocused: false,
  hasErrorMessage: false,
};

export default Underline;
