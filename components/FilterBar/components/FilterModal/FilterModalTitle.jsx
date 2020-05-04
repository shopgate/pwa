import React from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core';
import { Ripple, CrossIcon } from '@shopgate/engage/components';

const styles = {
  root: css({
    display: 'flex',
    flexDirection: 'row',
    margin: 16,
    borderBottom: '1px solid rgba(0, 0, 0, 0.24)',
    alignItems: 'center',
    paddingTop: 5,
    paddingBottom: 16,
  }),
  title: css({
    flex: 1,
    fontSize: '1.25rem',
  }),
  closeButton: css({
    fontSize: 21,
    marginRight: 12,
    cursor: 'pointer',
  }).toString(),
  actionButton: css({
    cursor: 'pointer',
    marginLeft: 16,
    color: 'var(--colors-primary)',
    fontWeight: '600',
    padding: 8,
  }).toString(),
  actionButtonSecondary: css({
    cursor: 'pointer',
    marginLeft: 16,
    color: 'var(--colors-primary)',
    fontWeight: '500',
    padding: 8,
  }).toString(),
};

/**
 * Filter Modal Title
 * @param {Object} props Props.
 * @returns {JSX}
 */
const FilterModalTitle = ({ apply, reset, close }) => (
  <div className={styles.root}>
    <Ripple onClick={close} className={styles.closeButton}>
      <CrossIcon />
    </Ripple>
    <span className={styles.title}>
      {i18n.text('titles.filter')}
    </span>
    <Ripple fill className={styles.actionButtonSecondary} onClick={reset}>
      {i18n.text('filter.reset')}
    </Ripple>
    <Ripple fill className={styles.actionButton} onClick={apply}>
      {i18n.text('filter.apply')}
    </Ripple>
  </div>
);

FilterModalTitle.propTypes = {
  apply: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  reset: PropTypes.func.isRequired,
};

export default FilterModalTitle;
