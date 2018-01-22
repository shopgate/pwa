/**
 * Copyright (c) 2017-present, Shopgate, Inc. All rights reserved.
 *
 * This source code is licensed under the Apache 2.0 license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import BasicDialog from '../BasicDialog';

/**
 * Renders a simple dialog with a title and a text message.
 * This is the default dialog if no type has been specified.
 * @param {Object} props The component properties.
 * @returns {JSX} The rendered component.
 */
const TextMessageDialog = ({ actions, message, title }) => (
  <BasicDialog title={title} actions={actions}>
    <I18n.Text string={message} />
  </BasicDialog>
);

TextMessageDialog.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  message: PropTypes.string.isRequired,
  title: PropTypes.string,
};

TextMessageDialog.defaultProps = {
  title: null,
};

export default TextMessageDialog;
