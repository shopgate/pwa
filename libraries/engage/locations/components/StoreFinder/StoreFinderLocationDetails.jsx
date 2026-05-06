import React, { useContext } from 'react';
import { every, isEmpty } from 'lodash';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import { StoreContext } from './Store.context';
import { StoreOpeningHours } from '../StoreList/StoreOpeningHours';
import { Accordion, I18n } from '../../../components';

const useStyles = makeStyles()({
  accordionHeader: {
    borderTop: `1px solid ${themeColors.shade7}`,
    cursor: 'pointer',
    ' svg': {
      display: 'inline',
    },
  },
  accordionContent: {
    fontSize: '0.875rem',
    ' > div': {
      padding: 0,
    },
  },
});

/**
 * @returns {JSX}
 */
const StoreFinderLocationDetails = () => {
  const { classes } = useStyles();
  const { operationHours } = useContext(StoreContext);

  if (!operationHours || every(operationHours, isEmpty)) {
    return null;
  }

  return (
    <Accordion
      className={classes.accordionHeader}
      renderLabel={() => (
        <I18n.Text string="locations.details" />
      )}
    >
      <div className={classes.accordionContent}>
        <StoreOpeningHours hours={operationHours} pure />
      </div>
    </Accordion>
  );
};

export default StoreFinderLocationDetails;
