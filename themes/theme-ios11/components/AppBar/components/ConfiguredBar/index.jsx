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
const LOGO_POSITIONS = ['left', 'center', 'right'];
const TITLE_INSET = 90;

const SUPPORTS_COLOR_MIX = '@supports (background: color-mix(in srgb, red 50%, transparent))';

/**
 * @param {string} blur The blur radius.
 * @returns {string} The backdrop filter of a frosted surface.
 */
const glass = blur => `blur(${blur}) saturate(180%)`;

/**
 * Makes only the color translucent, so the backdrop filter of the surface keeps its full effect.
 * @param {string} color The color.
 * @param {string} opacity The opacity as percentage.
 * @returns {string} The translucent color.
 */
const translucent = (color, opacity) => `color-mix(in srgb, ${color} ${opacity}, transparent)`;

const useStyles = makeStyles()((theme, { inset }) => {
  const { appBar } = theme.components;
  const fade = theme.transitions.create(['opacity', 'transform'], { duration: 200 });

  return {
    inner: {
      '--app-bar-title-inset': `${inset}px`,
    },
    modernInner: {
      padding: theme.spacing(0, 1.5),
    },
    logo: {
      minWidth: 0,
      flex: '0 1 auto',
      '& img': {
        display: 'block',
        maxWidth: '100%',
        objectFit: 'contain',
        objectPosition: 'left center',
      },
    },
    logoRight: {
      '& img': {
        objectPosition: 'right center',
      },
    },
    innerLogoLeft: {
      gridTemplateColumns: 'minmax(min-content, 1fr) 0 auto',
    },
    innerLogoRight: {
      gridTemplateColumns: 'auto 0 minmax(min-content, 1fr)',
    },
    logoSide: {
      flexGrow: 0,
      padding: theme.spacing(0, 1.25),
      '& img': {
        margin: 0,
      },
    },
    logoSideModern: {
      padding: theme.spacing(0, 0.5),
    },
    overlay: {
      position: 'relative',
      color: appBar.floatingButtonColor,
      transition: theme.transitions.create('transform', { duration: 250 }),
      pointerEvents: 'none',
      '& [role="button"], & button, & a, & .engage__logo, & .theme__search-bar': {
        pointerEvents: 'auto',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        background: appBar.background,
        opacity: 0,
        backdropFilter: glass(appBar.revealedBarBackdropBlur),
        WebkitBackdropFilter: glass(appBar.revealedBarBackdropBlur),
        transition: theme.transitions.create('opacity', { duration: 200 }),
        pointerEvents: 'none',
      },
      '& [role="button"]::before': {
        content: '""',
        position: 'absolute',
        top: 4,
        right: 4,
        bottom: 4,
        left: 4,
        borderRadius: '50%',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        boxShadow: appBar.floatingButtonBoxShadow,
        background: appBar.floatingButtonBackground,
        opacity: appBar.floatingButtonBackgroundOpacity,
        backdropFilter: glass(appBar.floatingButtonBackdropBlur),
        WebkitBackdropFilter: glass(appBar.floatingButtonBackdropBlur),
        transition: fade,
        zIndex: -1,
      },
      [SUPPORTS_COLOR_MIX]: {
        '& [role="button"]::before': {
          opacity: 1,
          borderColor: translucent(appBar.floatingButtonColor, '10%'),
          background: translucent(
            appBar.floatingButtonBackground,
            appBar.floatingButtonBackgroundOpacity
          ),
        },
      },
      '& .engage__logo': {
        transition: theme.transitions.create('opacity', { duration: 200 }),
      },
      '@media (prefers-reduced-motion: reduce)': {
        '&, &::before, & [role="button"]::before, & .engage__logo': {
          transition: 'none',
        },
      },
    },
    revealed: {
      pointerEvents: 'auto',
      color: appBar.color,
      '&::before': {
        opacity: appBar.revealedBarBackgroundOpacity,
      },
      '& [role="button"]::before': {
        opacity: 0,
        transform: 'scale(0.92)',
      },
      [SUPPORTS_COLOR_MIX]: {
        '&::before': {
          opacity: 1,
          background: translucent(appBar.background, appBar.revealedBarBackgroundOpacity),
        },
        '& [role="button"]::before': {
          opacity: 0,
        },
      },
    },
    statusFill: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 2,
      height: theme.layout.safeArea.top,
      background: appBar.background,
      opacity: 0,
      transition: theme.transitions.create('opacity', { duration: 200 }),
      pointerEvents: 'none',
      '@media (prefers-reduced-motion: reduce)': {
        transition: 'none',
      },
    },
    statusFilled: {
      opacity: 1,
    },
    hidden: {
      transform: 'translateY(-100%)',
    },
    logoHidden: {
      '& .engage__logo': {
        opacity: 0,
        pointerEvents: 'none',
      },
    },
  };
});

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
  const position = LOGO_POSITIONS.includes(logoPosition) ? logoPosition : 'center';
  let centerElement = center !== undefined ? center : <AppBar.Title title={i18n.text(title || '')} />;

  if (isLogoPage) {
    centerElement = null;
  } else if (modern && center === undefined) {
    centerElement = null;
  }

  const leftCount = (left ? 1 : 0) + leftSlots.length + (logo && position === 'left' ? 1 : 0);
  const rightCount = (right ? 1 : 0) + rightSlots.length + (logo && position === 'right' ? 1 : 0);
  const inset = Math.max(TITLE_INSET, Math.max(leftCount, rightCount) * APP_BAR_BUTTON_SIZE + 2);
  const { classes, cx } = useStyles({ inset });
  const logoElement = logo
    ? (
      <Logo
        key="logo"
        className={cx(
          classes.logo,
          position !== 'center' && classes.logoSide,
          position !== 'center' && modern && classes.logoSideModern,
          position === 'right' && classes.logoRight
        )}
      />
    )
    : null;

  if (logo && position === 'center') {
    centerElement = logoElement;
  }

  const floatsOnScroll = scrollBehavior === 'floatingButtons' || scrollBehavior === 'scrollAway';
  const revealsBar = scrollBehavior === 'revealBar' || scrollBehavior === 'scrollAway';
  const revealed = overlay && revealsBar && scrolled;
  const hidden = overlay && scrollBehavior === 'scrollAway' && scrollingDown;
  const outer = cx(
    parentClasses.outer,
    overlay && classes.overlay,
    overlay && 'theme__app-bar--overlay',
    revealed && classes.revealed,
    revealed && 'theme__app-bar--revealed',
    overlay && scrollBehavior === 'floatingButtons' && scrolled && classes.logoHidden,
    hidden && classes.hidden,
    hidden && 'theme__app-bar--hidden'
  );

  const statusFilled = overlay && floatsOnScroll && scrolled;

  return (
    <>
      {overlay && (
        <div
          className={cx(
            classes.statusFill,
            statusFilled && classes.statusFilled,
            'theme__app-bar__status-fill'
          )}
          aria-hidden
        />
      )}
      <AppBar
        {...props}
        backgroundColor={overlay ? 'transparent' : props.backgroundColor}
        classes={{
          outer,
          inner: cx(
          classes.inner,
          modern && classes.modernInner,
          logo && position === 'left' && classes.innerLogoLeft,
          logo && position === 'right' && classes.innerLogoRight,
          parentClasses.inner
        ),
        }}
        left={(
          <>
            {left}
            {leftSlots}
            {logo && position === 'left' && logoElement}
          </>
      )}
        center={centerElement}
        right={(
          <>
            {logo && position === 'right' && logoElement}
            {rightSlots}
            {right}
          </>
      )}
      />
    </>
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
