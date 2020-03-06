// @flow
import * as React from 'react';
import { FulfillmentProvider, openSheet } from '../../providers';
import { FulfillmentSheetContent } from './FulfillmentSheetContent';

/**
 * Renders the fulfillment sheet.
 * @param {Object} props The component props.
 * @returns {JSX}
 */
export const FulfillmentSheet = (props: any) => (
  <FulfillmentProvider {...props}>
    <FulfillmentSheetContent />
  </FulfillmentProvider>
);

FulfillmentSheet.open = openSheet;
