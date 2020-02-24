// @flow
import * as React from 'react';
import SheetDrawer from '../../../components/SheetDrawer';
import { i18n } from '../../../core/helpers/i18n';
import FulfillmentContext from '../context';
import connect from './Fulfillment.connector';
import { sheet } from './Fulfillment.style';
import { type OwnProps, type StateProps } from './Fulfillment.types';

type Props = OwnProps & StateProps;

/**
 * Renders the store selector sheet.
 * @param {Object} settings settings
 * @param {string} title title
 * @param {ReactNode} children children
 * @param {boolean} loading loading
 * @returns {JSX}
 */
const Fulfillment = ({ settings, title, children }: Props) => (
  <FulfillmentContext.Provider value={{ settings }}>
    <SheetDrawer isOpen title={i18n.text(title)}>
      <div className={sheet}>
        {children}
      </div>
    </SheetDrawer>
  </FulfillmentContext.Provider>
);

Fulfillment.defaultProps = {
  settings: null,
};

export default connect(Fulfillment);
