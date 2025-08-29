import React, {
  Fragment, useCallback, useState, useMemo,
} from 'react';
import PropTypes from 'prop-types';
import { FulfillmentSheet } from '../FulfillmentSheet';
import { STAGE_SELECT_STORE, MULTI_LINE_RESERVE } from '../../constants';
import GlobalLocationSwitcherDefault from './GlobalLocationSwitcherDefault';
import GlobalLocationSwitcherBar from './GlobalLocationSwitcherBar';
import connect from './GlobalLocationSwitcher.connector';

/**
 * @returns {JSX}
 */
const GlobalLocationSwitcher = ({
  isLocationBasedShopping,
  preferredLocation,
  renderBar,
  standalone,
  selectGlobalLocation,
  editable,
}) => {
  const [sheetOpen, setSheetOpen] = useState(false);

  const changeLocationHandler = useCallback(() => {
    setSheetOpen(true);
  }, []);

  const closeSheetHandler = useCallback((location) => {
    setSheetOpen(false);

    if (location && location.code !== preferredLocation?.code) {
      // Only dispatch selectGlobalLocation when location really changed, since this action
      // might clear product data from the resultsByHash product storage.
      selectGlobalLocation(location);
    }
  }, [preferredLocation, selectGlobalLocation]);

  const locationName = useMemo(() => preferredLocation?.name || null, [preferredLocation]);

  if (!isLocationBasedShopping || !preferredLocation) {
    return null;
  }

  return (
    <Fragment>
      { renderBar ? (
        <GlobalLocationSwitcherBar
          locationName={locationName}
          handleChange={changeLocationHandler}
          standalone={standalone}
        />
      ) : (
        <GlobalLocationSwitcherDefault
          locationName={locationName}
          handleChange={changeLocationHandler}
          standalone={standalone}
          editable={editable}
        />
      )
      }

      { sheetOpen && (
        <FulfillmentSheet
          stage={STAGE_SELECT_STORE}
          fulfillmentPath={MULTI_LINE_RESERVE}
          allowClose
          onClose={closeSheetHandler}
          isInitialized
          noProduct
          noInventory
          changeOnly
          open
        />
      )}

    </Fragment>
  );
};

GlobalLocationSwitcher.propTypes = {
  selectGlobalLocation: PropTypes.func.isRequired,
  editable: PropTypes.bool,
  isLocationBasedShopping: PropTypes.bool,
  preferredLocation: PropTypes.shape(),
  renderBar: PropTypes.bool,
  standalone: PropTypes.bool,
};
GlobalLocationSwitcher.defaultProps = {
  isLocationBasedShopping: false,
  preferredLocation: null,
  renderBar: false,
  editable: true,
  standalone: false,
};

export default connect(GlobalLocationSwitcher);
