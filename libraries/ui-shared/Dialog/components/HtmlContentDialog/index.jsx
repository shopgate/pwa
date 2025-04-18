import React from 'react';
import PropTypes from 'prop-types';
import BasicDialog from '../BasicDialog';

/**
 * Renders a simple dialog with a title and html content as a message.
 * This is the default dialog if no type has been specified.
 * @param {Object} props The component properties.
 * @returns {JSX.Element} The rendered component.
 */
const HtmlContentDialog = ({
  actions, message, title,
}) => (
  <BasicDialog title={title} actions={actions}>
    {/* eslint-disable-next-line react/no-danger */}
    <div dangerouslySetInnerHTML={{ __html: message }} />
  </BasicDialog>
);

HtmlContentDialog.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  message: PropTypes.string.isRequired,
  title: BasicDialog.propTypes.title,
};

HtmlContentDialog.defaultProps = {
  title: BasicDialog.defaultProps.title,
};

export default HtmlContentDialog;
