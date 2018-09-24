import React from 'react';
import PropTypes from 'prop-types';
import ChipLayout from 'Components/ChipLayout';
import Chip from '@shopgate/pwa-ui-shared/Chip';

/**
 * The Filter List Item Chips component.
 * @param {Object} props The component props.
 * @return {JSX|null}
 */
const Chips = ({ values }) => {
  if (!values) {
    return null;
  }

  let valuesSanitized = values;
  if (typeof values === 'string') {
    valuesSanitized = [values];
  } else if (values && values.length === 0) {
    return null;
  }

  return (
    <ChipLayout maxRows={3} moreLabel="filter.view_all" invertMoreButton>
      {valuesSanitized.map(value => (
        <Chip invert removable={false} key={value}>
          {value}
        </Chip>
      ))}
    </ChipLayout>
  );
};

Chips.propTypes = {
  values: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
};

Chips.defaultProps = {
  values: null,
};

export default Chips;
