import React from 'react';
import PropTypes from 'prop-types';
import SheetDrawer from '../../../components/SheetDrawer';
import { i18n } from '../../../core/helpers/i18n';
import FulfillmentContext from '../context';
import connect from './Fulfillment.connector';
import { sheet } from './Fulfillment.style';

/**
 * Renders the store selector sheet.
 * @param {Object} settings settings
 * @param {string} title title
 * @param {ReactNode} children children
 * @param {boolean} loading loading
 * @returns {JSX}
 */
const Fulfillment = ({ settings, title, children }) => (
  <FulfillmentContext.Provider value={{ settings }}>
    <SheetDrawer isOpen title={i18n.text(title)}>
      <div className={sheet}>
        {children}
      </div>
    </SheetDrawer>
  </FulfillmentContext.Provider>
);

Fulfillment.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
  settings: PropTypes.shape(),
};

Fulfillment.defaultProps = {
  settings: null,
};

export default connect(Fulfillment);
