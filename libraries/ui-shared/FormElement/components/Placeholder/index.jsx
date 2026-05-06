import React from 'react';
import PropTypes from 'prop-types';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';

const easing = '450ms cubic-bezier(0.23, 1, 0.32, 1)';

const ellipsisLine = {
  overflow: 'hidden',
  width: '100%',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
};

const useStyles = makeStyles()({
  placeholder: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 24,
    color: 'var(--color-text-medium-emphasis)',
    willChange: 'transform',
    transition: `opacity ${easing}`,
    ...ellipsisLine,
  },
  placeholderInactive: {
    opacity: 0,
  },
  leftOffset: {
    left: 'var(--form-element-left-offset, 26px)',
    width: 'calc(100% - var(--form-element-left-offset, 26px))',
  },
});

/**
 * The form element placeholder component.
 * @param {string} placeholder The placeholder text.
 * @param {boolean} visible Sets the placeholder visibility.
 * @param {boolean} props['aria-hidden'] Accessibility attribute to mark the placeholder as hidden
 * @param {boolean} hasLeftElement Whether a left element is present
 * @return {JSX.Element}
 */
const Placeholder = ({
  placeholder,
  visible,
  'aria-hidden': ariaHidden,
  hasLeftElement,
}) => {
  const { classes, cx } = useStyles();

  return (
    <div
      className={cx(
        classes.placeholder,
        {
          [classes.placeholderInactive]: !visible,
          [classes.leftOffset]: hasLeftElement,
        },
        'placeholder'
      )}
      aria-hidden={ariaHidden}
    >
      <I18n.Text string={placeholder} />
    </div>
  );
};

Placeholder.propTypes = {
  'aria-hidden': PropTypes.bool,
  hasLeftElement: PropTypes.bool,
  placeholder: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  visible: PropTypes.bool,
};

Placeholder.defaultProps = {
  'aria-hidden': null,
  hasLeftElement: false,
  placeholder: '',
  visible: false,
};

export default Placeholder;
