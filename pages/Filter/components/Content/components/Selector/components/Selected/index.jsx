import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import * as styles from './style';

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
const Selected = ({ selected, values }) => {
  if (!selected || !selected.length) {
    return null;
  }

  const items = values.reduce((prevValues, value) => {
    if (selected.includes(value.id)) {
      prevValues.push(value.label);
    }

    return prevValues;
  }, []);

  return (
    <div>
      {items.map((item, index) => (
        <Fragment key={item}>
          <span className={styles.item}>{item}</span>
          {(index < items.length - 1) ? ', ' : ''}
        </Fragment>
      ))}
    </div>
  );
};

Selected.propTypes = {
  values: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  selected: PropTypes.arrayOf(PropTypes.string),
};

Selected.defaultProps = {
  selected: null,
};

export default Selected;
