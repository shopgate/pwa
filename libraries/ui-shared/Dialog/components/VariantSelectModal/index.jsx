import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import BasicDialog from '../BasicDialog';
import connect from './connector';

/**
 * Reorders the actions for the modal so that the confirmation button will be rendered last.
 * Also attaches a navigation action to the confirmation action.
 * @param {Array} actions The confirm and dismiss actions.
 * @param {string} productId The product id passed through params.
 * @param {string} navigate The navigate action.
 * @return {Array} Reordered and extended actions.
 */
const reorderActions = (actions, { productId }, navigate) => {
  let confirmAction;
  const orderedActions = actions;

  orderedActions.forEach((act, index) => {
    if (act.action.name !== 'onConfirm') {
      return;
    }

    confirmAction = {
      ...act,
      action: () => {
        // Execute default action
        act.action();
        // Navigate to product details page
        if (productId) {
          navigate(`${ITEM_PATH}/${bin2hex(productId)}`);
        }
      },
    };

    orderedActions.splice(index, 1);
  });

  // Push the confirm action last so that we have the button rendered at the bottom right of modal.
  if (confirmAction) {
    orderedActions.push(confirmAction);
  }

  return orderedActions;
};

/**
 * Renders a simple dialog with a title and a text message.
 * @param {Array} actions The modal button actions.
 * @param {string} message The modal message.
 * @param {string} title The modal title.
 * @param {Object} params The modal params.
 * @return {JSX} The rendered component.
 * @constructor
 */
const VariantSelectModal = ({
  actions, message, navigate, title, params,
}) => {
  const parsedActions = reorderActions(actions, params, navigate);

  return (
    <BasicDialog title={title} actions={parsedActions}>
      <I18n.Text string={message} />
    </BasicDialog>
  );
};

VariantSelectModal.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  message: PropTypes.string.isRequired,
  navigate: PropTypes.func.isRequired,
  params: PropTypes.shape(),
  title: BasicDialog.propTypes.title,
};

VariantSelectModal.defaultProps = {
  params: {
    productId: null,
  },
  title: BasicDialog.defaultProps.title,
};

export default connect(VariantSelectModal);

export { VariantSelectModal as UnwrappedVariantSelectModal };
