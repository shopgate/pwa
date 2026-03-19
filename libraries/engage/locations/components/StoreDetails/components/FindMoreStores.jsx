import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import { MagnifierIcon, LocatorIcon, Link } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeColors } from '@shopgate/pwa-common/helpers/config';
import classNames from 'classnames';
import { STORE_FINDER_PATTERN } from '../../../constants';

const useStyles = makeStyles()({
  container: {
    margin: '16px 0px',
  },
  title: {
    fontSize: '20px',
    fontWeight: '500',
    color: 'var(--color-primary)',
    marginBottom: '8px',
  },
  inputCell: {
    gridArea: 'input',
  },
  inputContainer: {
    position: 'relative',
    background: themeColors.light,
    border: `1px solid ${themeColors.shade7}`,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  inputIcon: {
    padding: 0,
    margin: '0 8px',
    color: themeColors.shade9,
    fontSize: '1.23rem',
    flexShrink: 0,
    outline: 0,
  },
  input: {
    margin: '3px 0',
    width: '100%',
    lineHeight: '28px',
    outline: 'none',
    verticalAlign: 'middle',
    WebkitAppearance: 'none',
  },
  inputOverlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
});

/**
 * Find more stores component.
  * @returns {JSX}
  * */
const FindMoreStores = () => {
  const { classes } = useStyles();

  return (
    <div
      className={classes.container}
    >
      <div className={classes.title} aria-hidden>
        {i18n.text('location.findMoreStores')}
      </div>
      <div className={classes.inputCell}>
        <div className={classes.inputContainer}>
          <span className={classes.inputIcon} aria-hidden>
            <MagnifierIcon />
          </span>
          <input
            name="postalCode"
            className={classes.input}
            disabled
            type="search"
            autoComplete="off"
            autoCorrect="off"
            placeholder=""
            aria-hidden
          />
          <div
            className={classes.inputIcon}
          >
            <LocatorIcon />
          </div>
          <Link
            href={STORE_FINDER_PATTERN}
            className={classNames(classes.inputOverlay)}
            role="button"
            aria-label={i18n.text('location.findMoreStores')}
          >
            <div />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FindMoreStores;
