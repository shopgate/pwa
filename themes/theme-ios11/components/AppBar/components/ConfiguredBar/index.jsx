import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { AppBar } from '@shopgate/pwa-ui-ios';
import { Logo } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import { i18n } from '@shopgate/engage/core/helpers';
import ActionButton from '../ActionButton';
import { useOverlayScroll } from '../../hooks';
import { APP_BAR_BUTTON_SIZE } from '../../constants';

const SLOTS_LEFT = ['left1', 'left2'];
const SLOTS_RIGHT = ['right1', 'right2'];
const TITLE_INSET = 90;

const useStyles = makeStyles()((theme, { inset }) => ({
  inner: {
    '--app-bar-title-inset': `${inset}px`,
  },
  overlayInner: {
    padding: theme.spacing(0, 1.5),
  },
  logoSide: {
    flexGrow: 0,
    padding: theme.spacing(0, 1),
    '& img': {
      margin: 0,
    },
  },
  overlay: {
    position: 'relative',
    transition: 'transform 250ms ease-in-out',
    pointerEvents: 'none',
    '& [role="button"], & button, & a, & .engage__logo': {
      pointerEvents: 'auto',
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      inset: 0,
      background: theme.components.appBar.background,
      opacity: 0,
      backdropFilter: `blur(${theme.components.appBar.overlayBarBlur})`,
      WebkitBackdropFilter: `blur(${theme.components.appBar.overlayBarBlur})`,
      transition: 'opacity 200ms ease-in-out',
      pointerEvents: 'none',
    },
  },
  overlayRevealed: {
    pointerEvents: 'auto',
    '&::before': {
      opacity: theme.components.appBar.overlayBarOpacity,
    },
  },
  overlayHidden: {
    transform: 'translateY(-100%)',
  },
  floating: {
    '& [role="button"]': {
      color: `${theme.components.appBar.floatingButtonColor} !important`,
    },
    '& [role="button"]::before': {
      content: '""',
      position: 'absolute',
      inset: 4,
      borderRadius: '50%',
      background: theme.components.appBar.floatingButtonBackground,
      opacity: theme.components.appBar.floatingButtonOpacity,
      backdropFilter: `blur(${theme.components.appBar.floatingButtonBlur})`,
      WebkitBackdropFilter: `blur(${theme.components.appBar.floatingButtonBlur})`,
      zIndex: -1,
    },
  },
  logoHidden: {
    '& .engage__logo': {
      opacity: 0,
      pointerEvents: 'none',
    },
  },
  logoFade: {
    '& .engage__logo': {
      transition: 'opacity 200ms ease-in-out',
    },
  },
}));

/**
 * Marks the header element while the bar floats over the content.
 * @param {boolean} overlay Whether the bar floats over the content.
 */
const useHeaderOverlay = (overlay) => {
  useLayoutEffect(() => {
    const header = document.getElementById('AppHeader');
    if (!header) {
      return undefined;
    }

    header.dataset.overlay = overlay ? 'true' : 'false';
    return () => {
      header.dataset.overlay = 'false';
    };
  }, [overlay]);
};

/**
 * The header with the configured buttons, logo position and modern style applied.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const ConfiguredBar = ({
  settings,
  modern,
  overlay,
  showActions,
  logo: isLogoPage,
  title,
  left,
  center,
  right,
  classes: parentClasses,
  ...props
}) => {
  const { scrolled, scrollingDown } = useOverlayScroll(overlay);
  const {
    showLogo, logoPosition, buttons, modern: { scrollBehavior },
  } = settings;
  const logo = isLogoPage && showLogo !== false;

  useHeaderOverlay(overlay);

  /**
   * @param {string[]} slots The slots of one side.
   * @returns {JSX.Element[]} The configured buttons of the slots.
   */
  const renderSlots = slots => slots
    .filter(slot => showActions && buttons[slot] && buttons[slot].action !== 'none')
    .map(slot => <ActionButton key={slot} settings={buttons[slot]} />);

  const leftSlots = renderSlots(SLOTS_LEFT);
  const rightSlots = renderSlots(SLOTS_RIGHT);
  let centerElement = center !== undefined ? center : <AppBar.Title title={i18n.text(title || '')} />;

  if (isLogoPage) {
    centerElement = null;
  } else if (modern && center === undefined) {
    centerElement = null;
  }

  const leftCount = (left ? 1 : 0) + leftSlots.length + (logo && logoPosition === 'left' ? 1 : 0);
  const rightCount = (right ? 1 : 0) + rightSlots.length + (logo && logoPosition === 'right' ? 1 : 0);
  const inset = Math.max(TITLE_INSET, Math.max(leftCount, rightCount) * APP_BAR_BUTTON_SIZE + 2);
  const { classes, cx } = useStyles({ inset });
  const logoElement = logo
    ? <Logo key="logo" className={logoPosition === 'center' ? '' : classes.logoSide} />
    : null;

  if (logo && logoPosition === 'center') {
    centerElement = logoElement;
  }

  const revealed = overlay && scrollBehavior === 'revealBar' && scrolled;
  const outer = cx(
    parentClasses.outer,
    overlay && classes.overlay,
    revealed && classes.overlayRevealed,
    overlay && !revealed && classes.floating,
    overlay && classes.logoFade,
    overlay && scrollBehavior === 'floatingButtons' && scrolled && classes.logoHidden,
    overlay && scrollBehavior === 'scrollAway' && scrollingDown && classes.overlayHidden
  );

  return (
    <AppBar
      {...props}
      backgroundColor={overlay ? 'transparent' : props.backgroundColor}
      classes={{
        outer,
        inner: cx(classes.inner, overlay && classes.overlayInner, parentClasses.inner),
      }}
      left={(
        <>
          {left}
          {leftSlots}
          {logo && logoPosition === 'left' && logoElement}
        </>
      )}
      center={centerElement}
      right={(
        <>
          {logo && logoPosition === 'right' && logoElement}
          {rightSlots}
          {right}
        </>
      )}
    />
  );
};

ConfiguredBar.propTypes = {
  modern: PropTypes.bool.isRequired,
  overlay: PropTypes.bool.isRequired,
  settings: PropTypes.shape().isRequired,
  showActions: PropTypes.bool.isRequired,
  backgroundColor: PropTypes.string,
  center: PropTypes.node,
  classes: PropTypes.shape({
    inner: PropTypes.string,
    outer: PropTypes.string,
  }),
  left: PropTypes.node,
  logo: PropTypes.bool,
  right: PropTypes.node,
  title: PropTypes.string,
};

ConfiguredBar.defaultProps = {
  backgroundColor: undefined,
  center: undefined,
  classes: {
    inner: '',
    outer: '',
  },
  left: null,
  logo: false,
  right: null,
  title: null,
};

export default ConfiguredBar;
