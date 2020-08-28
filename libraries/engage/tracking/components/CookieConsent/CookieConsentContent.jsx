import React, { useState } from 'react';
import { css } from 'glamor';
import { themeConfig } from '@shopgate/pwa-common/helpers/config';
import { responsiveMediaQuery } from '@shopgate/engage/styles';
import Transition from 'react-transition-group/Transition';
import { useCookieConsent } from '../../hooks';
import CookieConsentMessage from './CookieConsentMessage';
import CookieConsentButtons from './CookieConsentButtons';
import CookieConsentCheckboxes from './CookieConsentCheckboxes';

const { variables, colors } = themeConfig;

const containerPadding = 12;

const styles = {
  container: css({
    fontSize: '.875rem',
    position: 'fixed',
    background: 'var(--color-background-accent)',
    borderTop: `1px solid ${colors.shade7}`,
    bottom: 0,
    zIndex: 10000,
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    padding: `${containerPadding}px ${containerPadding}px calc(var(--safe-area-inset-bottom) + ${containerPadding}px) ${variables.gap.big}px`,

    userSelect: 'none',
  }),
  content: css({
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto auto',
    gridTemplateAreas: `
      "message buttons"
      "checkboxes buttons"
    `,
    rowGap: 12,
    width: '100%',
    [responsiveMediaQuery('>=sm', { webOnly: true })]: {
      width: 'calc(var(--page-content-width) + 208px)',
    },
    [responsiveMediaQuery('<sm')]: {
      gridTemplateColumns: 'auto',
      gridTemplateRows: 'auto auto auto',
      gridTemplateAreas: `
      "message"
      "checkboxes"
      "buttons"
    `,
    },
  }),
  message: css({
    gridArea: 'message',
  }),
  buttons: css({
    gridArea: 'buttons',
    [responsiveMediaQuery('>=sm')]: {
      justifySelf: 'end',
    },
  }),
  checkboxes: css({
    gridArea: 'checkboxes',
  }),
};

const transitionDuration = 500;
const defaultTransitionStyle = {
  transition: `opacity ${transitionDuration}ms ease-in-out`,
  opacity: 1,
};
const transitionStyles = {
  entering: { opacity: 1 },
  entered: { opacity: 1 },
  exiting: { opacity: 0 },
  exited: { opacity: 0 },
};

/**
 * The CookieConsentContent component
 * @returns {JSX}
 */
const CookieConsentContent = () => {
  const { isVisible } = useCookieConsent();

  const [wasVisible] = useState(isVisible);

  if (!wasVisible) {
    return null;
  }

  return (
    <Transition in={isVisible} unmountOnExit timeout={transitionDuration}>
      {state => (
        <div
          className={styles.container}
          style={{
            ...defaultTransitionStyle,
            ...transitionStyles[state],
          }}
        >
          <div className={styles.content}>
            <div className={styles.message}>
              <CookieConsentMessage />
            </div>
            <div className={styles.buttons}>
              <CookieConsentButtons />
            </div>
            <div className={styles.checkboxes}>
              <CookieConsentCheckboxes />
            </div>
          </div>
        </div>
      )}
    </Transition>
  );
};

export default CookieConsentContent;
