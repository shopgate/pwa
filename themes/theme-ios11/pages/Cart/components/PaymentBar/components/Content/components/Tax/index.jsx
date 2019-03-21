import React from 'react';
import PropTypes from 'prop-types';
import TotalRow from '../TotalRow';
import Label from './components/Label';
import Amount from './components/Amount';
import connect from './connector';

/**
 * The Tax component.
 * @returns {React.Node}
 */
const Tax = ({ taxData }) => {
  if (!taxData) {
    return null;
  }

  const { label, amount } = taxData;

  return (
    <TotalRow key={`${label}-${amount}`}>
      <Label label={label} />
      <Amount value={amount} />
    </TotalRow>
  );
};

Tax.propTypes = {
  taxData: PropTypes.shape({
    label: PropTypes.string,
    amount: PropTypes.number,
  }),
};

Tax.defaultProps = {
  taxData: null,
};

export default connect(Tax);
