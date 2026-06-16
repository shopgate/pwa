import React from 'react';
import { i18n } from '@shopgate/engage/core/helpers';
import {
  MagnifierIcon,
  LocatorIcon,
  Link,
  Typography,
} from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { STORE_FINDER_PATTERN } from '../../../constants';

const useStyles = makeStyles()(theme => ({
  container: {
    margin: '16px 0px',
  },
  title: {
    marginBottom: '8px',
  },
  inputCell: {
    gridArea: 'input',
  },
  inputContainer: {
    position: 'relative',
    border: `1px solid ${theme.components.border.light}`,
    background: theme.components.input.background,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
  },
  inputIcon: {
    padding: 0,
    margin: '0 8px',
    color: theme.palette.grey.dark,
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
}));

/**
 * Find more stores component.
  * @returns {JSX}
  * */
const FindMoreStores = () => {
  const { classes } = useStyles();

  return (
    <div className={classes.container}>
      <Typography variant="h3" component="div" color="primary" className={classes.title} aria-hidden>
        {i18n.text('location.findMoreStores')}
      </Typography>
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
          <div className={classes.inputIcon}>
            <LocatorIcon />
          </div>
          <Link
            href={STORE_FINDER_PATTERN}
            className={classes.inputOverlay}
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
