import React, { useContext } from 'react';
import { StoreContext } from './Store.context';
import { StoreOpeningHours } from '../StoreList/StoreOpeningHours';
import { Accordion, I18n } from '../../../components';
import { accordionHeader, accordionContent } from './StoreFinderLocationDetails.style';

/**
 * @returns {JSX}
 */
const StoreFinderLocationDetails = () => {
  const { operationHours } = useContext(StoreContext);

  if (!operationHours) {
    return null;
  }

  return (
    <Accordion
      className={accordionHeader}
      renderLabel={() => (
        <I18n.Text string="locations.details" />
      )}
    >
      <div className={accordionContent}>
        <StoreOpeningHours hours={operationHours} pure />
      </div>
    </Accordion>
  );
};

export default StoreFinderLocationDetails;
