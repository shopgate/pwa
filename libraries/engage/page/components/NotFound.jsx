import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { historyPop, historyResetTo } from '@shopgate/pwa-common/actions/router';
import { i18n, INDEX_PATH } from '../../core';

const { variables } = themeConfig;

const useStyles = makeStyles()({
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    padding: variables.gap.big,
    paddingTop: variables.gap.xxbig,
  },
  text: {
    fontSize: '1.5rem',
  },
  button: {
    width: '100%',
    maxWidth: 250,
  },
  buttonContainer: {
    flexGrow: '0',
    padding: `${variables.emptyPage.buttonVerticalGap}px ${variables.gap.big}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: variables.gap.big,
    alignItems: 'center',
  },
});

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
      <I18n.Text className={classes.text} string="page.not_found" />
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
