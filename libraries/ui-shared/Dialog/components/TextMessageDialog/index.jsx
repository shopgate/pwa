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
const TextMessageDialog = ({
  actions, message, title, params,
}) => (
  <BasicDialog title={title} actions={actions}>
    <I18n.Text string={message} params={params} />
  </BasicDialog>
);

TextMessageDialog.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  message: PropTypes.string.isRequired,
  params: I18n.Text.propTypes.params,
  title: BasicDialog.propTypes.title,
};

TextMessageDialog.defaultProps = {
  title: BasicDialog.defaultProps.title,
  params: I18n.Text.defaultProps.params,
};

export default TextMessageDialog;
