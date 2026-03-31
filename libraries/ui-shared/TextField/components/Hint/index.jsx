import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { makeStyles } from '@shopgate/engage/styles';

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

const ellipsisLine = {
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const useStyles = makeStyles()({
  hint: {
    position: 'absolute',
    pointerEvents: 'none',
    bottom: 12,
    color: themeConfig.colors.shade4,
    willChange: 'transform',
    transition: `opacity ${easing}`,
    ...ellipsisLine,
  },
  hintInactive: {
    opacity: 0,
  },
});

/**
 * The form element hint component.
 * @param {string} hintText The hint text.
 * @param {boolean} visible Sets the hint visibility.
 * @return {JSX}
 */
const Hint = ({ hintText, visible }) => {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.hint, { [classes.hintInactive]: !visible }, 'hint')}>
      <I18n.Text string={hintText} />
    </div>
  );
};

Hint.propTypes = {
  hintText: PropTypes.string,
  visible: PropTypes.bool,
};

Hint.defaultProps = {
  hintText: '',
  visible: false,
};

export default Hint;
