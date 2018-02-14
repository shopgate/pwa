/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { ITEM_PATH } from '@shopgate/pwa-common-commerce/product/constants';
import ParsedLink from '@shopgate/pwa-common/components/Router/helpers/parsed-link';
import { bin2hex } from '@shopgate/pwa-common/helpers/data';
import BasicDialog from '../BasicDialog';

/**
 * Reorders the actions for the modal so that the confirmation button will be rendered last.
 * Also attaches a navigation action to the confirmation action.
 * @param {Array} actions The confirm and dismiss actions.
 * @param {string} productId The product id passed through params.
 * @return {Array} Reordered and extended actions.
 */
const reorderActions = (actions, { productId }) => {
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
          const href = `${ITEM_PATH}/${bin2hex(productId)}`;
          new ParsedLink(href).open();
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
  actions, message, title, params,
}) => {
  const parsedActions = reorderActions(actions, params);

  return (
    <BasicDialog title={title} actions={parsedActions}>
      <I18n.Text string={message} />
    </BasicDialog>
  );
};

VariantSelectModal.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  message: PropTypes.string.isRequired,
  params: PropTypes.shape(),
  title: PropTypes.string,
};

VariantSelectModal.defaultProps = {
  params: {
    productId: null,
  },
  title: null,
};

export default VariantSelectModal;
