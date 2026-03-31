import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeVariables } from '@shopgate/pwa-common/helpers/config';
import { Toggle } from '@shopgate/engage/components';
import connect from './connector';

const { gap } = themeVariables;

const useStyles = makeStyles()({
  root: {
    padding: gap.big,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    flex: 1,
  },
  checkbox: {
    marginLeft: 8,
  },
  text: {
    flexGrow: 0,
  },
  rightSpace: {
    flex: 1,
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
    flexGrow: 0,
    [responsiveMediaQuery('>xs', { webOnly: true })]: {
      flex: 0,
    },
  },
});

/**
 * Renders the cart reservation card label.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const Substitution = ({
  id, onChange, checked, className, label, disabled,
}) => {
  const { classes, cx } = useStyles();

  return (
    <div className={cx(classes.root, className)}>
      <label aria-hidden className={classes.text} htmlFor={id} id={`${id}-label`}>
        {label}
      </label>
      <div className={classes.rightSpace}>
        <Toggle
          className={classes.checkbox}
          checked={checked}
          id={id}
          onChange={onChange}
          disabled={disabled}
        />
      </div>
    </div>
  );
};

Substitution.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  checked: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

Substitution.defaultProps = {
  className: undefined,
  disabled: false,
  checked: false,
};

/**
 * Gate component for Substitution.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Wrapper = ({
  substitutionPreferencesEnabled, children,
}) => (
  substitutionPreferencesEnabled ? children : null
);

Wrapper.propTypes = {
  children: PropTypes.node.isRequired,
  substitutionPreferencesEnabled: PropTypes.bool.isRequired,
};

const ConnectedWrapper = connect(Wrapper);

export { ConnectedWrapper as SubstitutionWrapper };

export default Substitution;
