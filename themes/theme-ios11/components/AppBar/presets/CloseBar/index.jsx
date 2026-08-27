import React, { Fragment, useCallback } from 'react';
import PropTypes from 'prop-types';
import { i18n } from '@shopgate/engage/core/helpers';
import { Portal } from '@shopgate/pwa-common/components';
import {
  APP_BAR_CLOSE_BEFORE,
  APP_BAR_CLOSE,
  APP_BAR_CLOSE_AFTER,
} from '@shopgate/pwa-common/constants/Portals';
import { CrossIcon } from '@shopgate/pwa-ui-shared';
import { Button, I18n } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import DefaultBar from '../DefaultBar';
import connect from './connector';

const useStyles = makeStyles()({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    height: 44,
  },
  button: {
    padding: '0 !important',
    whiteSpace: 'nowrap',
    '&, & > div': {
      color: 'var(--sg-components-appBar-color)',
    },
  },
});

/**
 * @param {Object} props The component props.
 * @returns {JSX}
 */
function CloseBar({ goBack, asCancel, ...props }) {
  const { classes } = useStyles();

  const handleClick = useCallback(() => {
    goBack();
  }, [goBack]);

  const left = asCancel ? (
    <div className={classes.wrapper}>
      <Button flat type="regular" className={classes.button} onClick={handleClick}>
        <I18n.Text string="common.cancel" />
      </Button>
    </div>
  ) : (
    <DefaultBar.Icon aria-label={i18n.text('common.close')} icon={CrossIcon} onClick={handleClick} />
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

CloseBar.propTypes = {
  goBack: PropTypes.func.isRequired,
  asCancel: PropTypes.bool,
};

CloseBar.defaultProps = {
  asCancel: false,
};

export default connect(CloseBar);
