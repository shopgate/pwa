import { useLayoutEffect, useMemo } from 'react';
import type { ComponentType, ReactNode } from 'react';
import { AppBarIOS as UntypedAppBar, Logo, SurroundPortals } from '@shopgate/engage/components';
import { makeStyles } from '@shopgate/engage/styles';
import {
  APP_BAR_ACTIONS_LEFT,
  APP_BAR_ACTIONS_RIGHT,
  APP_BAR_LOGO,
} from '@shopgate/engage/core/constants';
import type {
  AppBarButtonSlot,
  AppBarSettings,
} from '@shopgate/engage/settings/types/appSettings';
import ActionButton from '../ActionButton';
import { useOverlayScroll } from '../../hooks';
import {
  APP_BAR_BUTTON_SIZE,
  FLOATING_BUTTON_INSET,
  SEARCH_BAR_FLOATING_HEIGHT_VAR,
} from '../../constants';

const AppBar = UntypedAppBar as unknown as ComponentType<Record<string, unknown>>;

const SLOTS_LEFT: AppBarButtonSlot[] = ['left1', 'left2'];
const SLOTS_RIGHT: AppBarButtonSlot[] = ['right1', 'right2'];
const TITLE_INSET = 90;
const CIRCLE = '& .ui-ios__app-bar__icon::before';

const FOREIGN_LOGO = '&:has(> .ui-ios__app-bar__left:empty):has(> .ui-ios__app-bar__center > .engage__logo:not(.theme__app-bar__logo))';

const SUPPORTS_COLOR_MIX = '@supports (background: color-mix(in srgb, red 50%, transparent))';

/**
 * Builds the backdrop filter of a frosted surface.
 * @param blur The blur radius.
 * @returns The backdrop filter of a frosted surface.
 */
const glass = (blur: string) => `blur(${blur}) saturate(180%)`;

/**
 * Makes only the color translucent, so the backdrop filter of the surface keeps its full effect.
 * @param color The color.
 * @param opacity The opacity as percentage.
 * @returns The translucent color.
 */
const translucent = (color: string, opacity: string) => (
  `color-mix(in srgb, ${color} ${opacity}, transparent)`
);

const useStyles = makeStyles<{ inset: number; side: number }>()((theme, { inset, side }) => {
  const { appBar } = theme.components;
  const fade = theme.transitions.create(['opacity', 'transform'], { duration: 200 });
  const revealedGlass = {
    backdropFilter: glass(appBar.revealedBarBackdropBlur),
    WebkitBackdropFilter: glass(appBar.revealedBarBackdropBlur),
  };

  return {
    inner: {
      '--app-bar-title-inset': `${inset}px`,
      [FOREIGN_LOGO]: {
        gridTemplateColumns: '0 minmax(0, 1fr) auto',
        '& > .ui-ios__app-bar__center': {
          justifyContent: 'stretch',
        },
      },
    },
    floatingInner: {
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
    innerLogoCenter: {
      gridTemplateColumns: `minmax(${side}px, 1fr) minmax(0, auto) minmax(${side}px, 1fr)`,
    },
    logoCenter: {
      padding: theme.spacing(0, 1.25),
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
    logoSideFloating: {
      padding: theme.spacing(0, 0.5),
    },
    overlay: {
      position: 'relative',
      background: 'transparent',
      transition: theme.transitions.create('transform', { duration: 250 }),
      pointerEvents: 'none',
      '& > *, & .ui-ios__app-bar__inner > * > *': {
        pointerEvents: 'auto',
      },
      '& > .ui-ios__app-bar__inner': {
        pointerEvents: 'none',
      },
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        zIndex: -1,
        background: appBar.background,
        opacity: 0,
        ...revealedGlass,
        transition: theme.transitions.create('opacity', { duration: 200 }),
        pointerEvents: 'none',
      },
      [CIRCLE]: {
        content: '""',
        position: 'absolute',
        top: FLOATING_BUTTON_INSET,
        right: FLOATING_BUTTON_INSET,
        bottom: FLOATING_BUTTON_INSET,
        left: FLOATING_BUTTON_INSET,
        borderRadius: '50%',
        border: '1px solid rgba(128, 128, 128, 0.3)',
        boxShadow: appBar.floatingButtonBoxShadow,
        background: appBar.background,
        opacity: appBar.floatingButtonBackgroundOpacity,
        backdropFilter: glass(appBar.floatingButtonBackdropBlur),
        WebkitBackdropFilter: glass(appBar.floatingButtonBackdropBlur),
        transition: fade,
        zIndex: -1,
      },
      [SUPPORTS_COLOR_MIX]: {
        [CIRCLE]: {
          opacity: 1,
          borderColor: translucent(appBar.color, '10%'),
          background: translucent(appBar.background, appBar.floatingButtonBackgroundOpacity),
        },
      },
      '& .engage__logo, & .theme__search-bar': {
        transition: theme.transitions.create(['opacity', 'background'], { duration: 200 }),
      },
      '@media (prefers-reduced-motion: reduce)': {
        [`&, &::before, ${CIRCLE}, & .engage__logo, & .theme__search-bar`]: {
          transition: 'none',
        },
      },
    },
    revealed: {
      pointerEvents: 'auto',
      '&::before': {
        opacity: appBar.revealedBarBackgroundOpacity,
      },
      [CIRCLE]: {
        opacity: 0,
        transform: 'scale(0.92)',
      },
      [SUPPORTS_COLOR_MIX]: {
        '&::before': {
          opacity: 1,
          background: translucent(appBar.background, appBar.revealedBarBackgroundOpacity),
        },
        [CIRCLE]: {
          opacity: 0,
        },
      },
    },
    searchBarRevealed: {
      '& .theme__search-bar': {
        background: appBar.background,
        ...revealedGlass,
      },
      [SUPPORTS_COLOR_MIX]: {
        '& .theme__search-bar': {
          background: translucent(appBar.background, appBar.revealedBarBackgroundOpacity),
        },
      },
    },
    hidden: {
      transform: `translateY(calc(-100% - var(${SEARCH_BAR_FLOATING_HEIGHT_VAR}, 0px)))`,
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
 * @param overlay Whether the bar floats over the content.
 */
const useHeaderOverlay = (overlay: boolean) => {
  useLayoutEffect(() => {
    const header = document.getElementById('AppHeader');
    if (!header || !overlay) {
      return undefined;
    }

    header.dataset.overlay = '';
    return () => {
      delete header.dataset.overlay;
    };
  }, [overlay]);
};

interface Props {
  settings: AppBarSettings;
  floating: boolean;
  overlay: boolean;
  showActions: boolean;
  /** Whether the page shows the logo. */
  logo?: boolean;
  /** The page title. It is shown as headline in the content, not in the bar. */
  title?: string | null;
  left?: ReactNode;
  center?: ReactNode;
  right?: ReactNode;
  below?: ReactNode;
  backgroundColor?: string;
  textColor?: string;
  'aria-hidden'?: boolean | null;
  classes?: {
    inner?: string;
    outer?: string;
  };
}

/**
 * The header with the configured buttons, logo position and variant applied.
 * @param props The component props.
 * @param props.settings The header settings.
 * @param props.floating Whether the header floats on home and product page.
 * @param props.overlay Whether the header floats over the content.
 * @param props.showActions Whether the page shows the configured buttons.
 * @param props.logo Whether the page shows the logo.
 * @param props.left Elements of the page for the left side.
 * @param props.center An element of the page for the center.
 * @param props.right Elements of the page for the right side.
 * @param props.classes Classes of the page for the bar.
 * @returns The header.
 */
const ConfiguredBar = ({
  settings,
  floating,
  overlay,
  showActions,
  logo: isLogoPage = false,
  left = null,
  center,
  right = null,
  classes: parentClasses = {},
  ...props
}: Props) => {
  const { moved, scrollingDown } = useOverlayScroll(overlay);
  const {
    showLogo, logoPosition, buttons, floating: { scrollBehavior },
  } = settings;
  const logo = isLogoPage && showLogo;

  useHeaderOverlay(overlay);

  /**
   * @param slots The slots of one side.
   * @returns The configured buttons of the slots.
   */
  const renderSlots = (slots: AppBarButtonSlot[]) => slots
    .filter(slot => showActions && buttons[slot].action !== 'none')
    .map(slot => (
      <ActionButton key={slot} slot={slot} settings={buttons[slot]} overlay={overlay} />
    ));

  const leftSlots = renderSlots(SLOTS_LEFT);
  const rightSlots = renderSlots(SLOTS_RIGHT);

  const sideLogo = logo && logoPosition !== 'center';

  const leftCount = (left ? 1 : 0) + leftSlots.length + (logo && logoPosition === 'left' ? 1 : 0);
  const rightCount = (right ? 1 : 0) + rightSlots.length
    + (logo && logoPosition === 'right' ? 1 : 0);
  const inset = Math.max(TITLE_INSET, Math.max(leftCount, rightCount) * APP_BAR_BUTTON_SIZE + 2);
  const { classes, cx } = useStyles({
    inset,
    side: Math.max(leftCount, rightCount) * APP_BAR_BUTTON_SIZE,
  });

  const hidden = overlay && scrollBehavior === 'scrollAway' && scrollingDown;
  const revealed = overlay && scrollBehavior === 'revealBar' && moved;
  const logoHidden = overlay && scrollBehavior === 'floatingButtons' && moved;

  const portalProps = useMemo(() => ({
    floating,
    overlay,
  }), [floating, overlay]);

  const logoElement = logo ? (
    <SurroundPortals
      key="logo"
      portalName={APP_BAR_LOGO}
      portalProps={{
        position: logoPosition,
        floating,
        overlay,
      }}
    >
      <Logo
        className={cx(
          classes.logo,
          'theme__app-bar__logo',
          !sideLogo && classes.logoCenter,
          sideLogo && classes.logoSide,
          sideLogo && floating && classes.logoSideFloating,
          logoPosition === 'right' && classes.logoRight
        )}
      />
    </SurroundPortals>
  ) : null;

  let centerElement: ReactNode = null;

  if (logo && logoPosition === 'center') {
    centerElement = logoElement;
  } else if (!isLogoPage && center !== undefined) {
    centerElement = center;
  }

  return (
    <AppBar
      {...props}
      aria-hidden={hidden ? true : props['aria-hidden']}
      inert={hidden}
      data-variant={floating ? 'floating' : 'fixed'}
      data-logo-position={logo ? logoPosition : undefined}
      data-overlay={overlay ? true : undefined}
      data-revealed={revealed ? true : undefined}
      data-hidden={hidden ? true : undefined}
      data-logo-hidden={logoHidden ? true : undefined}
      classes={{
        outer: cx(
          overlay && classes.overlay,
          revealed && classes.searchBarRevealed,
          revealed && classes.revealed,
          logoHidden && classes.logoHidden,
          hidden && classes.hidden,
          parentClasses.outer
        ),
        inner: cx(
          classes.inner,
          floating && classes.floatingInner,
          logo && logoPosition === 'center' && classes.innerLogoCenter,
          logo && logoPosition === 'left' && classes.innerLogoLeft,
          logo && logoPosition === 'right' && classes.innerLogoRight,
          parentClasses.inner
        ),
      }}
      left={left}
      leftEnd={(
        <>
          <SurroundPortals portalName={APP_BAR_ACTIONS_LEFT} portalProps={portalProps}>
            {leftSlots}
          </SurroundPortals>
          {logoPosition === 'left' && logoElement}
        </>
        )}
      center={centerElement}
      rightStart={(
        <>
          {logoPosition === 'right' && logoElement}
          <SurroundPortals portalName={APP_BAR_ACTIONS_RIGHT} portalProps={portalProps}>
            {rightSlots}
          </SurroundPortals>
        </>
        )}
      right={right}
    />
  );
};

export default ConfiguredBar;
