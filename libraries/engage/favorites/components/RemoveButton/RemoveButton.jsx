import React from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { IconButton } from '@shopgate/engage/components/v2';
import TrashOutlineIcon from '@shopgate/pwa-ui-shared/icons/TrashOutlineIcon';

/**
 * The remove favorites button component.
 * @returns {JSX}
 */
const RemoveButton = ({ onClick }) => (
  <IconButton aria-label={i18n.text('favorites.remove')} onClick={onClick}>
    <TrashOutlineIcon />
  </IconButton>
);

RemoveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default RemoveButton;
