import * as React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, responsiveMediaQuery } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { FulfillmentContext } from '../../locations.context';
import {
  STAGE_SELECT_STORE,
  STAGE_RESERVE_FORM,
  STAGE_RESPONSE_SUCCESS,
  STAGE_RESPONSE_ERROR,
  STAGE_FULFILLMENT_METHOD,
} from '../../constants';
import SheetDrawer from '../../../components/SheetDrawer';
import { StoreList } from '../StoreList';
import { ReserveForm } from '../ReserveForm';
import { ReservationSuccess, ReservationError } from '../ReservationResponses';
import { FulfillmentPath } from '../FulfillmentPath';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  sheet: {
    maxHeight: `calc(var(--vh-100, 100vh) - ${variables.navigator.height}px)`,
    [responsiveMediaQuery('>sm', { webOnly: true })]: {
      maxHeight: `calc(var(--vh-80, 80vh) - ${variables.navigator.height}px)`,
    },
  },
});

/**
 * Renders the content of the fulfillment sheet.
 * @param {Object} props The component props.
 * @param {boolean} props.allowClose Whether the sheet can be closed via a button
 * @return {JSX.Element}
 */
export const FulfillmentSheetContent = ({ allowClose = true }) => {
  const { classes } = useStyles();
  const {
    isStage, title, isOpen, handleClose, isLoading,
  } = React.useContext(FulfillmentContext);

  return (
    <SheetDrawer
      isOpen={isOpen}
      title={title}
      onDidClose={handleClose}
      allowClose={allowClose}
      isLoading={isLoading}
    >
      <div className={classes.sheet}>
        {isStage(STAGE_SELECT_STORE) && (
          <StoreList />
        )}
        {isStage(STAGE_RESERVE_FORM) && (
          <ReserveForm />
        )}
        {isStage(STAGE_RESPONSE_SUCCESS) && (
          <ReservationSuccess />
        )}
        {isStage(STAGE_RESPONSE_ERROR) && (
          <ReservationError />
        )}
        {isStage(STAGE_FULFILLMENT_METHOD) && (
          <FulfillmentPath />
        )}
      </div>
    </SheetDrawer>
  );
};

FulfillmentSheetContent.propTypes = {
  allowClose: PropTypes.bool,
};

FulfillmentSheetContent.defaultProps = {
  allowClose: true,
};

