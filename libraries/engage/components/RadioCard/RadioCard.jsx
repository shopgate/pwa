import { hot } from 'react-hot-loader/root';
import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import Card from '@shopgate/pwa-ui-shared/Card';
import { useRadioGroup } from '../RadioGroup';
import Radio from '../Radio';

const styles = {
  card: css({
    borderRadius: 4,
    padding: '8px 8px 8px 4px',
    display: 'flex',
  }).toString(),
  content: css({
    padding: '4px 8px 8px 8px',
    width: '100%',
  }).toString(),
  radio: css({
    alignItems: 'center',
  }).toString(),
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
  disabled,
  value,
  attributes,
}) => {
  const radioGroup = useRadioGroup();
  let name = nameProp;

  if (radioGroup) {
    if (typeof radioGroup.name !== 'undefined') {
      ({ name } = radioGroup);
    }
  }

  return (
    <Card className={styles.card}>
      <Radio
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        checked={checked}
        attributes={attributes}
        classes={{ root: styles.radio }}
      />
      <label htmlFor={`${name}_${value}`} className={styles.content}>
        { children }
      </label>
    </Card>
  );
};

RadioCard.propTypes = {
  attributes: PropTypes.shape(),
  checked: PropTypes.bool,
  children: PropTypes.node,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  onChange: PropTypes.func,
  value: PropTypes.string,
};

RadioCard.defaultProps = {
  children: null,
  checked: null,
  disabled: false,
  onChange: null,
  name: null,
  value: null,
  attributes: null,
};

export default hot(RadioCard);
