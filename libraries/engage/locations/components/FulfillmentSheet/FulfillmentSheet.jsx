// @flow
import * as React from 'react';
import { FulfillmentProvider, openSheet } from '../../providers';
import { FulfillmentSheetContent } from './FulfillmentSheetContent';

/**
 * Renders the fulfillment sheet.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export const FulfillmentSheet = ({ allowClose = true, ...props }: any) => (
  <FulfillmentProvider {...props}>
    <FulfillmentSheetContent allowClose={allowClose} />
  </FulfillmentProvider>
);

FulfillmentSheet.open = openSheet;
