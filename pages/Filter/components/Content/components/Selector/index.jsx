import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import { Accordion } from '@shopgate/pwa-ui-material';
import Item from '../Item';
import ValueButton from './components/ValueButton';
import Toggle from './components/Toggle';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Selector = ({ label, values, selected }) => (
  <Item>
    <Accordion renderLabel={props => <Toggle {...props} label={label} selected={selected} />}>
      <div className={styles.content}>
        {values.map(value => (
          <ValueButton key={value.id} id={value.id} label={value.label} />
        ))}
      </div>
    </Accordion>
  </Item>
);

Selector.propTypes = {
  label: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selected: PropTypes.node,
};

Selector.defaultProps = {
  selected: null,
};

export default pure(Selector);
