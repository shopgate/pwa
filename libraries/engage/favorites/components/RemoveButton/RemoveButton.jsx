import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { Ripple } from '@shopgate/engage/components';
import TrashOutlineIcon from '@shopgate/pwa-ui-shared/icons/TrashOutlineIcon';

const styles = {
  root: css({
    display: 'flex',
    borderRadius: '50%',
    color: 'var(--color-text-high-emphasis)',
    fontSize: '1.5rem',
    padding: '0 8px 8px 8px',
    lineHeight: 1,
    outline: 0,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -1,
  }).toString(),
  ripple: css({
    flexShrink: 0,
  }).toString(),
};

/**
 * The remove favorites button component.
 * @returns {JSX}
 */
const RemoveButton = ({ onClick }) => (
  <button
    className={styles.root}
    onClick={onClick}
    type="button"
    aria-label={i18n.text('favorites.remove')}
  >
    <Ripple className={styles.ripple}>
      <TrashOutlineIcon />
    </Ripple>
  </button>
);

RemoveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default RemoveButton;
