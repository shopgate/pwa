import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import Card from '@shopgate/pwa-ui-shared/Card';
import { useRadioGroup } from '../RadioGroup';
import Radio from '../Radio';

const useStyles = makeStyles()(theme => ({
  card: {
    borderRadius: 4,
    padding: '8px 8px 8px 4px',
    display: 'flex',
    alignItems: 'center',
  },
  content: {
    padding: theme.spacing(1, 1, 1, 0),
    width: '100%',
  },
  contentDisabled: {
    opacity: 0.5,
    pointerEvents: 'none',
  },
  radio: {
    alignItems: 'center',
  },
}));

/**
 * The default card component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CardComponent = ({ children, className }) => {
  const { classes, cx } = useStyles();
  return (
    <Card className={cx(classes.card, className)}>
      {children}
    </Card>);
};

CardComponent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

CardComponent.defaultProps = {
  children: null,
  className: null,
};

/**
 * The RadioCard component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const RadioCard = ({
  children,
  name: nameProp,
  onChange,
  checked,
  disabled: disabledProp,
  value,
  attributes,
  classes: classNamesProp,
  renderCard: RenderCard,
}) => {
  const { classes, cx } = useStyles();
  const radioGroup = useRadioGroup();
  let name = nameProp;
  let disabled = disabledProp;

  if (radioGroup) {
    if (typeof radioGroup.name !== 'undefined') {
      ({ name } = radioGroup);
    }

    if (typeof radioGroup.disabled !== 'undefined') {
      ({ disabled } = radioGroup);
    }
  }

  return (
    <RenderCard className={classNamesProp.root}>
      <Radio
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        checked={checked}
        attributes={attributes}
        classes={{ root: classes.radio }}
      />
      <label
        htmlFor={`${name}_${value}`}
        className={cx(classes.content, {
          [classes.contentDisabled]: disabled,
          [classNamesProp.disabled]: disabled,
        })}
      >
        { children }
      </label>
    </RenderCard>
  );
};

RadioCard.propTypes = {
  attributes: PropTypes.shape(),
  checked: PropTypes.bool,
  children: PropTypes.node,
  classes: PropTypes.shape(),
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  renderCard: PropTypes.func,
  value: PropTypes.string,
};

RadioCard.defaultProps = {
  children: null,
  checked: null,
  classes: {},
  disabled: false,
  onChange: null,
  name: null,
  value: null,
  attributes: null,
  renderCard: CardComponent,
};

export default RadioCard;
