import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import classNames from 'classnames';
import Card from '@shopgate/pwa-ui-shared/Card';
import { useRadioGroup } from '../RadioGroup';
import Radio from '../Radio';

const { variables } = themeConfig;

const styles = {
  card: css({
    borderRadius: 4,
    padding: '8px 8px 8px 4px',
    display: 'flex',
    alignItems: 'center',
  }).toString(),
  content: css({
    padding: `${variables.gap.small}px ${variables.gap.small}px ${variables.gap.small}px 0`,
    width: '100%',
  }).toString(),
  contentDisabled: css({
    opacity: 0.5,
    pointerEvents: 'none',
  }).toString(),
  radio: css({
    alignItems: 'center',
  }).toString(),
};

/**
 * The default card component
 * @param {Object} props The component props
 * @returns {JSX}
 */
const CardComponent = ({ children, className }) => (
  <Card className={classNames(styles.card, className)}>
    {children}
  </Card>
);

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
  classes,
  renderCard: RenderCard,
}) => {
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
    <RenderCard className={classes.root}>
      <Radio
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        checked={checked}
        attributes={attributes}
        classes={{ root: styles.radio }}
      />
      <label
        htmlFor={`${name}_${value}`}
        className={classNames(styles.content, {
          [styles.contentDisabled]: disabled,
          [classes.disabled]: disabled,
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

export default hot(RadioCard);
