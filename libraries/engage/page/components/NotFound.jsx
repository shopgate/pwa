import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { I18n, Typography } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { historyPop, historyResetTo } from '@shopgate/pwa-common/actions/router';
import { i18n, INDEX_PATH } from '../../core';

const useStyles = makeStyles()(theme => ({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    padding: theme.spacing(2),
    paddingTop: theme.spacing(8),
  },
  button: {
    width: '100%',
    maxWidth: 250,
  },
  buttonContainer: {
    flexGrow: '0',
    padding: theme.spacing(3, 2),
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    alignItems: 'center',
  },
}));

/**
 * The NotFoundPage component renders a "Page Not Found" view
 * with options to navigate back or to the home page.
 * @returns {JSX.Element}
 */
const NotFound = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const handleBack = useCallback(() => {
    dispatch(historyPop());
  }, [dispatch]);

  const handleHome = useCallback(() => {
    dispatch(historyResetTo(INDEX_PATH));
  }, [dispatch]);

  return (
    <div className={classes.wrapper}>
      <Typography variant="h2" component="div" fontWeight="regular">
        <I18n.Text string="page.not_found" />
      </Typography>
      <div className={classes.buttonContainer}>
        <RippleButton onClick={handleBack} className={classes.button} type="secondary">
          <I18n.Text string="common.back" />
        </RippleButton>
        <RippleButton onClick={handleHome} className={classes.button} type="secondary">
          <I18n.Text string="navigation.back" params={{ title: i18n.text('navigation.home') }} />
        </RippleButton>
      </div>
    </div>
  );
};

export default NotFound;
