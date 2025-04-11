import * as React from 'react';
import PropTypes from 'prop-types';
import { FulfillmentProvider, openSheet } from '../../providers';
import { FulfillmentSheetContent } from './FulfillmentSheetContent';

/**
 * Renders the fulfillment sheet.
 * @param {Object} props The component props.
 * @param {boolean} props.allowClose Whether the sheet can be closed via a button
 * @returns {JSX.Element}
 */
export const FulfillmentSheet = ({ allowClose = true, ...props }) => (
  <FulfillmentProvider {...props}>
    <FulfillmentSheetContent allowClose={allowClose} />
  </FulfillmentProvider>
);

FulfillmentSheet.propTypes = {
  allowClose: PropTypes.bool,
};

FulfillmentSheet.defaultProps = {
  allowClose: true,
};

FulfillmentSheet.open = openSheet;
