import React from 'react';
import PropTypes from 'prop-types';
import I18n from '@shopgate/pwa-common/components/I18n';
import { i18n, nl2br } from '@shopgate/engage/core';
import BasicDialog from '../BasicDialog';

/**
 * Renders a simple dialog with a title and a text message.
 * This is the default dialog if no type has been specified.
 * @param {Object} props The component properties.
 * @returns {JSX} The rendered component.
 */
const TextMessageDialog = ({
  actions, message, title, params, children,
}) => (
  <BasicDialog title={title} actions={actions}>
    <span dangerouslySetInnerHTML={{ __html: nl2br(i18n.text(message, params)) }} />
    {children}
  </BasicDialog>
);

TextMessageDialog.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  message: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  children: PropTypes.any,
  params: I18n.Text.propTypes.params,
  title: BasicDialog.propTypes.title,
};

TextMessageDialog.defaultProps = {
  title: BasicDialog.defaultProps.title,
  params: I18n.Text.defaultProps.params,
  children: null,
};

export default TextMessageDialog;
