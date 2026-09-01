import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { I18n, Typography } from '@shopgate/engage/components';
import { Button } from '@shopgate/engage/components/v2';
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
 */
const NotFound = () => {
  const { classes } = useStyles();
  const dispatch = useDispatch() as unknown as (action: unknown) => void;

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
        <Button onClick={handleBack} color="primary" fullWidth className={classes.button}>
          <I18n.Text string="common.back" />
        </Button>
        <Button onClick={handleHome} color="primary" fullWidth className={classes.button}>
          <I18n.Text string="navigation.back" params={{ title: i18n.text('navigation.home') }} />
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
