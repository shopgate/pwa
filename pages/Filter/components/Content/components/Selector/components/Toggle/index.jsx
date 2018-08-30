import React from 'react';
import PropTypes from 'prop-types';
import pure from 'recompose/pure';
import classNames from 'classnames';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @return {JSX}
 */
const Toggle = ({ open, label, selected }) => (
  <div className={styles.toggle}>
    <span
      className={classNames({
        [styles.label]: true,
        [styles.open]: open,
        [styles.closed]: !open,
      })}
    >
      {label}
    </span>
    {selected && <span className={styles.selected}>{selected}</span>}
  </div>
);

Toggle.propTypes = {
  label: PropTypes.node.isRequired,
  open: PropTypes.bool,
  selected: PropTypes.node,
};

Toggle.defaultProps = {
  open: false,
  selected: null,
};

export default pure(Toggle);
