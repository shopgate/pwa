import React, { useCallback } from 'react';
import { css } from 'glamor';
import { useDispatch } from 'react-redux';
import RippleButton from '@shopgate/pwa-ui-shared/RippleButton';
import { I18n, View } from '@shopgate/engage/components';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import {
  historyPop, historyResetTo, INDEX_PATH, i18n,
} from '@shopgate/engage/core';

const { variables } = themeConfig;

const styles = {
  wrapper: css({
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    textAlign: 'center',
    padding: variables.gap.big,
    paddingTop: variables.gap.xxbig,
    minHeight: '60vh',
  }).toString(),
  text: css({
    fontSize: '1.5rem',
  }).toString(),
  button: css({
    width: '100%',
    maxWidth: 250,
  }).toString(),
  buttonContainer: css({
    flexGrow: '0',
    padding: `${variables.emptyPage.buttonVerticalGap}px ${variables.gap.big}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: variables.gap.big,
    alignItems: 'center',
  }).toString(),
};

/**
 * The NotFoundPage component renders a "Page Not Found" view
 * with options to navigate back or to the home page.
 *
 * @returns {JSX.Element} The rendered NotFoundPage component.
 */
const NotFoundPage = () => {
  const dispatch = useDispatch();

  const handleBack = useCallback(() => {
    dispatch(historyPop());
  }, [dispatch]);

  const handleHome = useCallback(() => {
    dispatch(historyResetTo(INDEX_PATH));
  }, [dispatch]);

  return (
    <View>
      <div className={styles.wrapper}>
        <I18n.Text className={styles.text} string="titles.page_not_found" />
        <div className={styles.buttonContainer}>
          <RippleButton onClick={handleBack} className={styles.button} type="secondary">
            <I18n.Text string="common.back" />
          </RippleButton>
          <RippleButton onClick={handleHome} className={styles.button} type="secondary">
            <I18n.Text string="navigation.back" params={{ title: i18n.text('navigation.home') }} />
          </RippleButton>
        </div>
      </div>
    </View>
  );
};

export default NotFoundPage;
