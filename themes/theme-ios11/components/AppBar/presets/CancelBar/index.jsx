import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { historyPop } from '@shopgate/pwa-common/actions/router';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_CLOSE_BEFORE,
  APP_BAR_CLOSE,
  APP_BAR_CLOSE_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { Button, I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import DefaultBar from '../DefaultBar';

const useStyles = makeStyles()({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    height: 44,
  },
  button: {
    padding: '0 !important',
    whiteSpace: 'nowrap',
  },
});

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function CancelBar(props) {
  const { classes } = useStyles();
  const dispatch = useDispatch();

  const handleClick = useCallback(() => {
    dispatch(historyPop());
  }, [dispatch]);

  const left = (
    <div className={classes.wrapper}>
      <Button flat type="regular" className={classes.button} onClick={handleClick}>
        <I18n.Text string="common.cancel" />
      </Button>
    </div>
  );

  return (
    <>
      <Portal name={APP_BAR_CLOSE_BEFORE} />
      <Portal name={APP_BAR_CLOSE}>
        <DefaultBar left={left} right={null} {...props} />
      </Portal>
      <Portal name={APP_BAR_CLOSE_AFTER} />
    </>
  );
}

export default CancelBar;
