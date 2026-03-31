import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const { colors } = themeConfig;

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

const ellipsisLine = {
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const useStyles = makeStyles()(theme => ({
  label: {
    position: 'absolute',
    left: 0,
    top: 24,
    lineHeight: '19px',
    pointerEvents: 'none',
    userSelect: 'none',
    color: 'var(--color-text-medium-emphasis)',
    transformOrigin: 'left top 0px',
    willChange: 'transform, color',
    transition: `transform ${easing}, color ${easing}`,
    ...ellipsisLine,
  },
  labelFloating: {
    transform: 'translate3d(0, -22px, 0) scale3d(0.75, 0.75, 0.75)',
  },
  labelRegular: {
    color: colors.shade4,
  },
  labelFocus: {
    color: colors.focus,
  },
  labelError: {
    color: theme.palette.error.main,
  },
}));

/**
 * Renders the label element.
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Label = (props) => {
  const { classes, cx } = useStyles();

  return (
    // eslint-disable-next-line jsx-a11y/label-has-associated-control
    <label
      htmlFor={props.name}
      aria-hidden
      className={cx(
        classes.label,
        {
          [classes.labelFloating]: props.isFloating,
          [classes.labelRegular]: !props.isFocused,
          [classes.labelFocus]: !props.hasErrorMessage && props.isFocused,
          [classes.labelError]: props.hasErrorMessage && props.isFocused,
        },
        'label',
        {
          floating: props.isFloating,
        }
      )}
    >
      <I18n.Text string={props.label} />
    </label>
  );
};

Label.propTypes = {
  hasErrorMessage: PropTypes.bool,
  isFloating: PropTypes.bool,
  isFocused: PropTypes.bool,
  label: PropTypes.string,
  name: PropTypes.string,
};

Label.defaultProps = {
  name: '',
  label: '',
  isFocused: false,
  isFloating: false,
  hasErrorMessage: false,
};

export default Label;
