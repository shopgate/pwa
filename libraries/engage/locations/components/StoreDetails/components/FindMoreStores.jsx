import React from 'react';
import { css } from 'glamor';
import { i18n } from '@shopgate/engage/core/helpers';
import { MagnifierIcon, LocatorIcon, Link } from '@shopgate/engage/components';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import classNames from 'classnames';
import { STORE_FINDER_PATTERN } from '../../../constants';

const styles = {
  container: css({
    margin: '16px 0px',
  }),
  title: css({
    fontSize: '20px',
    fontWeight: '500',
    color: 'var(--color-primary)',
    marginBottom: '8px',
  }),
  inputCell: css({
    gridArea: 'input',
  }),
  inputContainer: css({
    position: 'relative',
    background: themeColors.light,
    border: `1px solid ${themeColors.shade7}`,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  }),
  inputIcon: css({
    padding: 0,
    margin: '0 8px',
    color: themeColors.shade9,
    fontSize: '1.23rem',
    flexShrink: 0,
    outline: 0,
  }),
  input: css({
    margin: '3px 0',
    width: '100%',
    lineHeight: '28px',
    outline: 'none',
    verticalAlign: 'middle',
    WebkitAppearance: 'none',
  }),
  inputOverlay: css({
    position: 'absolute',
    height: '100%',
    width: '100%',
  }),
};

/**
 * Find more stores component.
  * @returns {JSX}
  * */
const FindMoreStores = () => (
  <div
    className={styles.container}
  >
    <div className={styles.title}>
      {i18n.text('location.findMoreStores')}
    </div>
    <div className={styles.inputCell}>
      <div className={styles.inputContainer}>
        <span className={styles.inputIcon} aria-hidden>
          <MagnifierIcon />
        </span>
        <input
          name="postalCode"
          className={styles.input}
          disabled
          type="search"
          autoComplete="off"
          autoCorrect="off"
          placeholder=""
          aria-hidden
        />
        <div
          className={styles.inputIcon}
        >
          <LocatorIcon />
        </div>
        <Link
          href={STORE_FINDER_PATTERN}
          className={classNames(styles.inputOverlay)}
          role="button"
          aria-label={i18n.text('location.findMoreStores')}
        >
          <div />
        </Link>
      </div>
    </div>
  </div>
);

export default FindMoreStores;
