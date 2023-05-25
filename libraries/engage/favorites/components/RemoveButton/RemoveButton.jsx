import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { Ripple } from '@shopgate/engage/components';
import CrossIcon from '@shopgate/pwa-ui-shared/icons/CrossIcon';

const styles = {
  root: css({
    display: 'flex',
    borderRadius: '50%',
    color: 'var(--color-text-high-emphasis)',
    padding: 0,
    fontSize: 25,
    lineHeight: 1,
    outline: 0,
    height: 20,
    width: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
    <Ripple>
      <CrossIcon className={styles.icon} />
    </Ripple>
  </button>
);

RemoveButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default RemoveButton;
